from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import MinMaxScaler
import pickle
import joblib
import os

with open(os.path.abspath('poker_ai_model.pkl'), 'rb') as model_file:
    model : RandomForestRegressor = pickle.load(model_file)

with open('serializer.pkl', 'rb') as scaler_file:
    scaler : MinMaxScaler = pickle.load(scaler_file)