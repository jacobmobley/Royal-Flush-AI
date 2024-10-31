from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import MinMaxScaler
import pickle
import joblib
with open('py-backend/poker_ai_model.pkl', 'rb') as model_file:
    model : RandomForestRegressor = pickle.load(model_file)

with open('py-backend/serializer.save', 'rb') as scaler_file:
    scaler : MinMaxScaler = joblib.load(scaler_file)
    