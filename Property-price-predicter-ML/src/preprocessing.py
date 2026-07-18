import pandas as pd

def load_data(file_path):
    print(f"Loading data from {file_path}")
    return pd.read_csv(file_path)

def preprocess_and_split(df):
    # Based on notebook analysis
    df = df.dropna(axis=0)
    features = ['Rooms', 'Bedroom2', 'Bathroom', 'Landsize']
    X = df[features]
    y = df['Price']
    return X, y