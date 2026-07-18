import os
import joblib
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from src.preprocessing import load_data, preprocess_data

NUMERIC_FEATURES = [
    'Bedrooms', 'Bathrooms', 'Total Rooms', 'Land Size', 'Built-up Area',
    'Property Age', 'Number of Floors', 'Parking Spaces', 'Latitude',
    'Longitude', 'Distance to City Center', 'Garage', 'Swimming Pool',
    'Garden', 'Air Conditioning', 'Gated Community'
]

CATEGORICAL_FEATURES = [
    'Property Type', 'Furnishing Status', 'City', 'Locality'
]

def build_pipeline():
    numeric_transformer = Pipeline([
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())
    ])
    categorical_transformer = Pipeline([
        ('imputer', SimpleImputer(strategy='most_frequent')),
        ('onehot', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
    ])
    preprocessor = ColumnTransformer([
        ('num', numeric_transformer, NUMERIC_FEATURES),
        ('cat', categorical_transformer, CATEGORICAL_FEATURES)
    ])
    return Pipeline([
        ('preprocessor', preprocessor),
        ('regressor', RandomForestRegressor(n_estimators=150, random_state=1, n_jobs=-1))
    ])

def train_model():
    data_path = os.path.join("data", "melb_data.csv")
    df = load_data(data_path)
    df = preprocess_data(df)

    y = df['Price']
    X = df.drop(columns=['Price'])

    train_X, val_X, train_y, val_y = train_test_split(X, y, random_state=1)

    model = build_pipeline()
    print("Training model...")
    model.fit(train_X, train_y)

    mae = mean_absolute_error(val_y, model.predict(val_X))
    print(f"Validation MAE: ${mae:,.2f}")

    os.makedirs("output", exist_ok=True)
    model_path = os.path.join("output", "model.pkl")
    joblib.dump(model, model_path)
    print(f"Model saved to {model_path}")

if __name__ == "__main__":
    train_model()
