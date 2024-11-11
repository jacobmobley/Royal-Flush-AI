from flask import Flask, request, jsonify
from flask_cors import CORS
from cards import getPng
from eval import evaluate_hand
import eval7
import json
import random
from flask_socketio import SocketIO, emit
from model import model, scaler


app = Flask(__name__)
CORS(app)

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

# POKER FUNCS

game_state = {
    "players": [],
    "communityCards": [],
    "pot": 0,
    "bigBlind": 50,
    "smallBlind": 25,
    "currentTurn": "pre-flop",
    "currentPlayerIndex": 0,
    "dealerIndex": 0,
}

# Add a player to the game
@app.route('/join', methods=['POST'])
def join_game():
    player_name = request.json.get('name')
    player = {
        "id": len(game_state["players"]) + 1,
        "name": player_name,
        "chips": 1000,
        "hand": [],
        "bet": 0,
        "status": "active"
    }
    game_state["players"].append(player)
    return jsonify(game_state)

# Retrieve the current game state
@app.route('/game-state', methods=['GET'])
def get_game_state():
    return jsonify(game_state)

# Process player actions (check, call, raise, fold)
@app.route('/player-action', methods=['POST'])
def player_action():
    action = request.json.get('action')
    amount = request.json.get('amount', 0)
    player_index = game_state["currentPlayerIndex"]
    player = game_state["players"][player_index]

    # Process actions
    if action == 'check':
        handle_check(player)
    elif action == 'call':
        handle_call(player)
    elif action == 'raise':
        handle_raise(player, amount)
    elif action == 'fold':
        handle_fold(player)

    # Advance to the next player or stage
    advance_turn()
    return jsonify(game_state)

def handle_check(player):
    # No chips change hands for a check
    pass

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

def advance_turn():
    # Move to the next active player
    game_state["currentPlayerIndex"] = (game_state["currentPlayerIndex"] + 1) % len(game_state["players"])
    if all(p["status"] == "folded" or p["bet"] == max(p["bet"] for p in game_state["players"]) for p in game_state["players"]):
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
        #reset_game() Placeholder

deck = [f"{rank} of {suit}" for rank in range(2, 15) for suit in ["hearts", "diamonds", "clubs", "spades"]]

def deal_community_cards(count):
    random.shuffle(deck)
    for _ in range(count):
        game_state["communityCards"].append(deck.pop())

def determine_winner():
    # Placeholder: Implement hand evaluation logic
    game_state["winner"] = "Player 1"  # Example

if __name__ == '__main__':
    app.run(debug=True)