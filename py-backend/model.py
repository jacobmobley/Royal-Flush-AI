from sklearn.ensemble import RandomForestRegressor
import pickle

with open('poker_ai_model.pkl', 'rb') as model_file:
    model : RandomForestRegressor = pickle.load(model_file)

    