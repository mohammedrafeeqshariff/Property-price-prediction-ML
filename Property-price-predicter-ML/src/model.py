import os
import joblib
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error
from src.preprocessing import load_data, preprocess_and_split

def train_model():
    data_path = os.path.join("data", "melb_data.csv")
    df = load_data(data_path)
    X, y = preprocess_and_split(df)
    
    train_X, val_X, train_y, val_y = train_test_split(X, y, random_state=1)
    
    model = RandomForestRegressor(random_state=1)
    print("Training model...")
    model.fit(train_X, train_y)
    
    val_predict = model.predict(val_X)
    mae = mean_absolute_error(val_predict, val_y)
    print(f"Validation MAE: {mae}")
    
    # Save the model
    os.makedirs("output", exist_ok=True)
    model_path = os.path.join("output", "model.pkl")
    joblib.dump(model, model_path)
    print(f"Model saved to {model_path}")

if __name__ == "__main__":
    train_model()
