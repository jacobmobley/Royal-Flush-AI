from flask import Flask, request, jsonify
from flask_cors import CORS
from cards import getPng
from eval import evaluate_hand

app = Flask(__name__)
CORS(app)

@app.route('/api/start_game', methods=['POST'])
def start_game():
    return jsonify({'message': 'Game started'})

if __name__ == '__main__':
    app.run(debug=True)