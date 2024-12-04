from flask import Flask, request, jsonify
from flask_cors import CORS
from cards import getPng
from eval import evaluate_hand
from time import sleep
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
        scaled_score = scaler.transform([[hand_score]])  # Reshape as required by the model
        print("scaled_score")
        print(scaled_score)
        prediction = model.predict(scaled_score)  # Assume single prediction for this AI
        print(prediction)
        print(current_raise)

        prediction[0] += 0.4

        if (prediction[0] > 2):
            prediction[0] = 2

        prediction = round(prediction[0])


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
    "readyPlayers": 0,  # Track how many players are ready
    "winner": [],
    "emotes":[]
}

ai_difficulty = "medium"  # Default difficulty level
buy_in = 0

@app.route('/send-emote', methods=['POST'])
def send_emote():
    """
    Handle emote actions sent by players.
    Adds an emote to the game state with player and emote details.

    Expected JSON payload:
    {
        "username": "player_name",
        "emote": "thumbs_up"
    }

    Returns:
        dict: The updated emote list.
    """
    try:
        data = request.json
        username = data.get("username")
        emote = data.get("emote")

        if not username or not emote:
            return jsonify({"error": "Missing username or emote"}), 400
        print(3)
        # Check if the player exists
        player_exists = any(player["username"] == username for player in game_state["players"])
        if not player_exists:
            return jsonify({"error": "Player not found"}), 404
        # Add the emote to the game state
        game_state["emotes"].append({
            "username": username,
            "emote": emote,
        })

        # Optionally limit the number of emotes stored
        if len(game_state["emotes"]) > 5:
            game_state["emotes"].pop(0)

        print(f"Emote added: {username} sent {emote}")
        return jsonify({"message": "Emote added", "emotes": game_state["emotes"]}), 200
    except Exception as e:
        print(f"Error in send-emote: {e}")
        return jsonify({"error": "Internal server error"}), 500

# Add a player to the game
@app.route('/join', methods=['POST'])
def join_game():
    username = request.json.get('username')  # Use "username" as the key

    if len(game_state["players"]) >= 6:
        return jsonify({"error": "Server is full!"}), 403
    
    if any(player['username'] == username for player in game_state["players"]):
        return jsonify(game_state)
    
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
    """
    Add AI players to fill the remaining slots in the game.
    Appends difficulty level (easy, medium, hard) to AI usernames.
    """
    while len(game_state["players"]) < 6:
        ai_player = {
            "username": f"{ai_difficulty.capitalize()}_AI_Player_{len(game_state['players']) + 1}",
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
    game_state["dealerIndex"] = random.randint(0, len(game_state["players"]) - 1)

    # Set the starting player to be the next index (dealerIndex + 1)
    game_state["currentPlayerIndex"] = (game_state["dealerIndex"] + 2) % len(game_state["players"])

    # Transition to the pre-flop stage
    game_state["currentTurn"] = "pre-flop"

    # Deal cards to all players
    for player in game_state["players"]:
        player["hand"] = [deck.pop(), deck.pop()]

    print(f"Dealer is player at index {game_state['dealerIndex']}")
    print(f"Starting player is at index {game_state['currentPlayerIndex']}")

    # Deduct small blind and big blind
    handle_blinds()
    advance_turn()


def handle_blinds():
    """
    Deduct small blind and big blind from the appropriate players.
    """
    num_players = len(game_state["players"])
    small_blind_index = (game_state["dealerIndex"] + 1) % num_players
    big_blind_index = (game_state["dealerIndex"] + 2) % num_players

    # Deduct small blind
    small_blind_player = game_state["players"][small_blind_index]
    small_blind_amount = min(small_blind_player["chips"], game_state["smallBlind"])
    small_blind_player["chips"] -= small_blind_amount
    small_blind_player["bet"] += small_blind_amount
    game_state["pot"] += small_blind_amount
    print(f"Small blind posted by {small_blind_player['username']}: ${small_blind_amount}")

    # Deduct big blind
    big_blind_player = game_state["players"][big_blind_index]
    big_blind_amount = min(big_blind_player["chips"], game_state["bigBlind"])
    big_blind_player["chips"] -= big_blind_amount
    big_blind_player["bet"] += big_blind_amount
    game_state["pot"] += big_blind_amount
    print(f"Big blind posted by {big_blind_player['username']}: ${big_blind_amount}")


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
    print("max_bet")
    print(max_bet)
    call_amount = max_bet
    call_amount = min(call_amount, player["chips"])
    print(player, player["chips"], call_amount)
    if player["chips"] >= call_amount:
        player["chips"] -= call_amount
        player["bet"] = call_amount
        game_state["pot"] += call_amount

def handle_raise(player, amount):
    """
    Handle the raise action for a player.

    Args:
        player (dict): The player making the raise.
        amount (int): The amount to raise.
    """
    max_bet = max(p["bet"] for p in game_state["players"])
    current_raise = max_bet

    # Calculate the full raise amount
    raise_amount = current_raise + amount

    # Cap the raise to the player's remaining chips
    raise_amount = min(raise_amount, player["chips"])

    # Deduct chips and update bet
    if player["chips"] >= raise_amount:
        player["chips"] -= raise_amount
        player["bet"] = raise_amount
        game_state["pot"] += raise_amount

    print(f"Player {player['username']} raised to {player['bet']} (pot is now {game_state['pot']}).")

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
    current_raise = max_bet
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
    If no human players are left, reset the game.
    If all active players have 0 chips, go to determine winner.
    """
    num_players = len(game_state["players"])

    while True:
        # Check if all active players are out of chips
        active_players = [p for p in game_state["players"] if p["status"] == "active"]
        if all(p["chips"] == 0 for p in active_players):
            print("All active players are out of chips. Determining winner.")
            determine_winner()
            return

        # Move to the next active player
        game_state["currentPlayerIndex"] = (game_state["currentPlayerIndex"] + 1) % num_players
        current_player = game_state["players"][game_state["currentPlayerIndex"]]

        # If the current player is active, break the loop
        if current_player["status"] == "active":
            break

    print(f"Current turn: Player at index {game_state['currentPlayerIndex']} ({current_player['username']})")

    # Check if any human players remain
    active_human_players = [
        p for p in game_state["players"] 
        if p["status"] == "active" and "AI_Player" not in p["username"]
    ]
    if not active_human_players:
        print("No human players remain. Resetting the game.")
        reset_game()
        return  # Exit early to prevent further actions

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
        game_state["currentTurn"] = "determine winner"
        determine_winner()

deck = [{"value": str(rank), "suit": suit} for rank in range(2, 15) for suit in ["hearts", "diamonds", "clubs", "spades"]]

def deal_community_cards(count):
    random.shuffle(deck)
    for _ in range(count):
        card = deck.pop()
        game_state["communityCards"].append(card)

def determine_winner():
    """
    Determine the winner of the current round using eval7.
    Compares each active player's best hand (hole cards + community cards).
    """
    if not game_state["communityCards"]:
        print("No community cards to evaluate.")
        reset_game()
        return

    active_players = [p for p in game_state["players"] if p["status"] == "active"]
    if len(active_players) <= 1:
        winner = active_players[0] if active_players else None
        if winner:
            print(f"Only one active player remains: {winner['username']}. They win the pot.")
            game_state["winner"] = [winner["username"]]
            winner["chips"] += game_state["pot"]
            game_state["pot"] = 0
        return

    community_cards = [eval7.Card(convert_to_eval7_format(card)) for card in game_state["communityCards"]]
    print(f"Community Cards: {game_state['communityCards']}")
    
    best_score = -1
    winners = []

    for player in active_players:
        hole_cards = [eval7.Card(convert_to_eval7_format(card)) for card in player["hand"]]
        all_cards = community_cards + hole_cards

        # Evaluate the hand
        hand_score = eval7.evaluate(all_cards)

        print(f"Player {player['username']} has score: {hand_score}")

        # Determine if this player has the best hand
        if hand_score > best_score:
            best_score = hand_score
            winners = [player]
        elif hand_score == best_score:
            winners.append(player)

    # Distribute the pot among the winners
    if len(winners) == 1:
        winner = winners[0]
        print(f"The winner is {winner['username']}.")
        game_state["winner"] = [winner["username"]]
        winner["chips"] += game_state["pot"]
        print(eval7.handtype(best_score))
    else:
        print(f"Tie between players: {[player['username'] for player in winners]}")
        game_state["winner"] = [player["username"] for player in winners]
        split_pot = game_state["pot"] // len(winners)
        for player in winners:
            player["chips"] += split_pot

    game_state["currentTurn"] = "collect winnings"

    sleep(15)

    reset_game()

def reset_game():
    """
    Resets the game to its initial state.
    Removes all players, resets the pot, and restores default values.
    """
    global game_state, deck
    
    # Reset game state
    game_state = {
        "players": [],
        "communityCards": [],
        "pot": 0,
        "bigBlind": 50,
        "smallBlind": 25,
        "currentTurn": "waiting-for-players",
        "currentPlayerIndex": 0,
        "dealerIndex": 0,
        "readyPlayers": 0,
        "winner": [],
        "emotes":[]
    }
    
    # Reinitialize the deck
    deck = [{"value": str(rank), "suit": suit} for rank in range(2, 15) for suit in ["hearts", "diamonds", "clubs", "spades"]]
    random.shuffle(deck)

    print("Game has been reset to its initial state.")

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
    parser.add_argument("ai_difficulty", type=str, choices=["easy", "medium", "hard"],
                        help="AI difficulty level (easy, medium, hard)")
    args = parser.parse_args()

    # Set the global buy-in value and AI difficulty
    buy_in = args.buy_in
    ai_difficulty = args.ai_difficulty.lower()

    # Create the log file
    if not os.path.exists(LOG_FOLDER):
        os.makedirs(LOG_FOLDER)

    # Include difficulty in the log file name
    log_file = os.path.join(LOG_FOLDER, f"lobby_{args.port}_{args.buy_in}_{ai_difficulty}.log")
    with open(log_file, "w") as f:
        f.write(f"Lobby running on port {args.port} with buy-in ${buy_in} and AI difficulty {ai_difficulty}")

    print(f"Starting server on port {args.port} with buy-in ${buy_in}, AI difficulty {ai_difficulty}, logged to {log_file}")

    try:
        app.run(host='0.0.0.0', port=args.port)
    finally:
        # Clean up the log file on shutdown
        if os.path.exists(log_file):
            os.remove(log_file)
            print(f"Removed log file: {log_file}")