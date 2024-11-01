from flask import Flask, request, jsonify
from flask_cors import CORS
from cards import getPng
from eval import evaluate_hand
import eval7
import json
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

if __name__ == '__main__':
    app.run(debug=True)