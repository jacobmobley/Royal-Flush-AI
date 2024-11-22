from flask import Flask, request, jsonify
from flask_cors import CORS
from cards import getPng
from eval import evaluate_hand
import eval7
import json
import random
from flask_socketio import SocketIO, emit
from model import model, scaler
import os

import argparse

app = Flask(__name__)
CORS(app)

LOG_FOLDER = "./lobbies"



@app.route('/api/make_pred', methods=['POST'])
def make_pred():
    req_data = json.loads(request.data)

    hand = req_data['Current hand']
    if (req_data['Flop'] != None):
        hand += req_data['Flop']
    
    score = evaluate_hand([eval7.Card(card) for card in hand])

    tscore = scaler.transform(score)

    prediction = model.predict(tscore)

    if not req_data['Current raise']:
        match(prediction):
            case 0:
                action = 'fold'
            case 1:
                action = 'check'
            case 2: 
                action = 'raise'
    else:
        match(prediction):
            case 0:
                action = 'fold'
            case 1:
                action = 'call'
            case 2: 
                action = 'raise'
    
    return jsonify({'action': round(action)})

def ai_make_decision(ai_player, community_cards, current_raise):
    """
    Make a decision for the AI player based on the current hand and community cards.

    Args:
        ai_player (dict): The AI player's information including hand and chips.
        community_cards (list): The current community cards in the game.
        current_raise (int): The current raise amount in the game.

    Returns:
        dict: A dictionary with the action and amount for the AI player.
    """
    try:
        # Convert cards to eval7 format
        ai_hand = [convert_to_eval7_format(card) for card in ai_player["hand"]]
        eval_community_cards = [convert_to_eval7_format(card) for card in community_cards]

        print(f"AI Hand: {ai_hand}, Community Cards: {eval_community_cards}")

        # Evaluate hand and community cards
        eval_hand = [eval7.Card(card) for card in ai_hand + eval_community_cards]
        print("eval_hand")
        hand_score = eval7.evaluate(eval_hand)
        print("hand_score")
        print(hand_score)

        # Scale and predict action
        scaled_score = scaler.transform(hand_score)  # Reshape as required by the model
        print("scaled_score")
        print(scaled_score)
        prediction = model.predict([[scaled_score]])  # Assume single prediction for this AI

        # Determine action based on prediction
        if current_raise == 0:
            if prediction == 0:
                return {"action": "Fold", "amount": 0}
            elif prediction == 1:
                return {"action": "Check", "amount": 0}
            elif prediction == 2:
                raise_amount = min(ai_player["chips"], 50)  # Example raise logic
                return {"action": "Raise", "amount": raise_amount}
        else:
            if prediction == 0:
                return {"action": "Fold", "amount": 0}
            elif prediction == 1:
                call_amount = min(ai_player["chips"], current_raise)
                return {"action": "Call", "amount": call_amount}
            elif prediction == 2:
                raise_amount = min(ai_player["chips"], current_raise + 50)
                return {"action": "Raise", "amount": raise_amount}

    except ValueError as e:
        print(f"Error during AI decision: {e}")
        return {"action": "Fold", "amount": 0}  # Default to folding on error

    return {"action": "Check", "amount": 0}  # Default fallback

# Game state structure
game_state = {
    "players": [],
    "communityCards": [],
    "pot": 0,
    "bigBlind": 50,
    "smallBlind": 25,
    "currentTurn": "waiting-for-players",  # New stage for waiting
    "currentPlayerIndex": 0,
    "dealerIndex": 0,
    "readyPlayers": 0  # Track how many players are ready
}

buy_in = 0

# Add a player to the game
@app.route('/join', methods=['POST'])
def join_game():
    username = request.json.get('username')  # Use "username" as the key

    if len(game_state["players"]) >= 6:
        return jsonify({"error": "Server is full!"}), 403
    
    if any(player['username'] == username for player in game_state["players"]):
        return jsonify({"error": "Player already joined!"}), 400
    
    print(game_state["players"])

    player = {
        "username": username,
        "chips": buy_in,
        "hand": [],
        "bet": 0,
        "status": "active",
        "ready": False  # Players start as not ready
    }
    game_state["players"].append(player)
    return jsonify(game_state)

@app.route('/ready', methods=['POST'])
def player_ready():
    username = request.json.get('username')

    # Find the player in the game
    for player in game_state["players"]:
        if player["username"] == username:
            if player.get("ready", False):
                return jsonify({"error": "Player already marked ready!"}), 400

            player["ready"] = True
            game_state["readyPlayers"] += 1
            print(1)
            break
    else:
        
        return jsonify({"error": "Player not found!"}), 404
    print(2)
    # Check if all players are ready
    if game_state["readyPlayers"] == len(game_state["players"]):
        print(3)
        transition_to_pre_flop()

    print(4)

    return jsonify({"message": "Player marked ready!"}), 200

def add_ai_players():
    while len(game_state["players"]) < 6:
        ai_player = {
            "username": f"AI_Player_{len(game_state['players']) + 1}",
            "chips": buy_in,
            "hand": [],
            "bet": 0,
            "status": "active",
            "ready": True  # AI players are always ready
        }
        game_state["players"].append(ai_player)

def transition_to_pre_flop():
    # Fill remaining slots with AI players
    add_ai_players()

    # Shuffle the deck
    global deck
    deck = [{"value": str(rank), "suit": suit} for rank in range(2, 15) for suit in ["hearts", "diamonds", "clubs", "spades"]]
    random.shuffle(deck)

    # Randomly pick a dealer index
    # game_state["dealerIndex"] = random.randint(0, len(game_state["players"]) - 1)
    game_state["dealerIndex"] = 5

    # Set the starting player to be the next index (dealerIndex + 1)
    game_state["currentPlayerIndex"] = (game_state["dealerIndex"] + 1) % len(game_state["players"])

    # Transition to the pre-flop stage
    game_state["currentTurn"] = "pre-flop"

    # Deal cards to all players
    for player in game_state["players"]:
        player["hand"] = [deck.pop(), deck.pop()]

    print(f"Dealer is player at index {game_state['dealerIndex']}")
    print(f"Starting player is at index {game_state['currentPlayerIndex']}")

# Retrieve the current game state
@app.route('/game-state', methods=['GET'])
def get_game_state():
    print("Current game state:", game_state)
    return jsonify(game_state), 200

# Process player actions (check, call, raise, fold)
@app.route('/player-action', methods=['POST'])
def player_action():
    action = request.json.get('action')
    amount = request.json.get('amount', 0)
    username = request.json.get('username')  # Use "username" instead of "playerId"
    current_player = game_state["players"][game_state["currentPlayerIndex"]]
    # Validate username matches the current player's username
    if current_player["username"] != username:
        return jsonify({"error": "Not your turn!"}), 403

    # Process actions
    if action == 'Check':
        handle_check(current_player)
    elif action == 'Call':
        handle_call(current_player)
    elif action == 'Raise':
        handle_raise(current_player, amount)
    elif action == 'Fold':
        handle_fold(current_player)

    advance_turn()
    return jsonify(game_state)

def handle_check(player):
    pass  # No chips change hands for a check

def handle_call(player):
    max_bet = max(p["bet"] for p in game_state["players"])
    call_amount = max_bet - player["bet"]
    if player["chips"] >= call_amount:
        player["chips"] -= call_amount
        player["bet"] += call_amount
        game_state["pot"] += call_amount

def handle_raise(player, amount):
    max_bet = max(p["bet"] for p in game_state["players"])
    raise_amount = max_bet + amount
    if player["chips"] >= raise_amount:
        player["chips"] -= raise_amount
        player["bet"] += raise_amount
        game_state["pot"] += raise_amount

def handle_fold(player):
    player["status"] = "folded"

def ai_action(player):
    """
    Perform the AI action based on its current hand, community cards, and game state.

    Args:
        player (dict): The AI player's information.
    """
    print(f"AI Player {player['username']} is taking an action.")

    # Get the current raise amount
    max_bet = max(p["bet"] for p in game_state["players"])
    current_raise = max_bet - player["bet"]
    print("current_raise:" + str(current_raise))

    # Make a decision
    decision = ai_make_decision(player, game_state["communityCards"], current_raise)
    print("AIdecision")
    print(decision)
    # Perform the action
    if decision["action"] == "Fold":
        handle_fold(player)
    elif decision["action"] == "Check":
        handle_check(player)
    elif decision["action"] == "Call":
        handle_call(player)
    elif decision["action"] == "Raise":
        handle_raise(player, decision["amount"])

    # Advance the turn after the AI action
    advance_turn()


def advance_turn():
    """
    Advance to the next player's turn.
    If the player is an AI, trigger ai_action().
    """
    num_players = len(game_state["players"])
    
    while True:
        # Move to the next active player
        game_state["currentPlayerIndex"] = (game_state["currentPlayerIndex"] + 1) % num_players
        current_player = game_state["players"][game_state["currentPlayerIndex"]]

        # If the current player is active, break the loop
        if current_player["status"] == "active":
            break

    print(f"Current turn: Player at index {game_state['currentPlayerIndex']} ({current_player['username']})")

    # Check if the current player is AI
    if "AI_Player" in current_player["username"]:
        ai_action(current_player)  # Call AI action
    else:
        # Check if all bets are equal or if only one player remains active
        active_players = [p for p in game_state["players"] if p["status"] == "active"]
        max_bet = max(p["bet"] for p in game_state["players"])
        if all(p["bet"] == max_bet for p in active_players):
            advance_stage()


def advance_stage():
    if game_state["currentTurn"] == "pre-flop":
        game_state["currentTurn"] = "flop"
        deal_community_cards(3)
    elif game_state["currentTurn"] == "flop":
        game_state["currentTurn"] = "turn"
        deal_community_cards(1)
    elif game_state["currentTurn"] == "turn":
        game_state["currentTurn"] = "river"
        deal_community_cards(1)
    elif game_state["currentTurn"] == "river":
        determine_winner()

deck = [{"value": str(rank), "suit": suit} for rank in range(2, 15) for suit in ["hearts", "diamonds", "clubs", "spades"]]

def deal_community_cards(count):
    random.shuffle(deck)
    for _ in range(count):
        card = deck.pop()
        game_state["communityCards"].append(card)

def determine_winner():
    # Placeholder: Implement hand evaluation logic
    game_state["winner"] = game_state["players"][0]["username"]  # Example winner

def convert_to_eval7_format(card):
    """
    Convert a poker server card to eval7 card format.
    
    Args:
        card (dict): A card represented in poker server format, 
                     e.g., {"value": "14", "suit": "hearts"}.
                     
    Returns:
        str: The card in eval7 format, e.g., "Ah" (Ace of hearts).
    """
    # Mapping of suit names to eval7 abbreviations
    suit_map = {
        "hearts": "h",
        "diamonds": "d",
        "clubs": "c",
        "spades": "s"
    }
    
    # Mapping card values to their eval7 equivalents
    value_map = {
        "10": "T",  # Ten
        "11": "J",  # Jack
        "12": "Q",  # Queen
        "13": "K",  # King
        "14": "A"   # Ace
    }
    
    # Convert value and suit
    value = value_map.get(card["value"], card["value"])  # Use mapped value or original
    suit = suit_map.get(card["suit"])
    
    if not suit:
        raise ValueError(f"Invalid suit: {card['suit']}")
    if value not in "23456789TJQKA":
        raise ValueError(f"Invalid value: {card['value']}")
    
    return f"{value}{suit}"

@app.route('/')
def index():
    return "Poker server is running!"

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument("port", type=int, help="Port number to bind the server")
    parser.add_argument("buy_in", type=int, help="Buy-in amount for this server")
    args = parser.parse_args()

    # Set the global buy-in value
    buy_in = args.buy_in

    # Create the log file
    if not os.path.exists(LOG_FOLDER):
        os.makedirs(LOG_FOLDER)

    log_file = os.path.join(LOG_FOLDER, f"lobby_{args.port}_{args.buy_in}.log")
    with open(log_file, "w") as f:
        f.write(f"Lobby running on port {args.port} with buy-in ${buy_in}")

    print(f"Starting server on port {args.port} with buy-in ${buy_in}, logged to {log_file}")

    try:
        app.run(host='0.0.0.0', port=args.port)
    finally:
        # Clean up the log file on shutdown
        if os.path.exists(log_file):
            os.remove(log_file)
            print(f"Removed log file: {log_file}")