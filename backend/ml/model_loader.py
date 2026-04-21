import joblib
import os

model = None

def load_model():
    global model

    if model is None:
        base_dir = os.path.dirname(os.path.dirname(__file__))
        model_path = os.path.join(base_dir, "ml_model", "rf_model.pkl")

        model = joblib.load(model_path)

    return model