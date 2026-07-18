import pandas as pd
import numpy as np

def load_data(file_path):
    print(f"Loading data from {file_path}")
    return pd.read_csv(file_path)

def preprocess_data(df):
    df = df.dropna(subset=['Price']).copy()

    # Derived features from available columns
    current_year = 2026
    df['Property Age'] = np.where(df['YearBuilt'].notna(), current_year - df['YearBuilt'], 20)
    df['Number of Floors'] = np.where(df['Type'] == 'u', 1, 2)
    df['Furnishing Status'] = 'Unfurnished'
    df['Garage'] = np.where(df['Car'] > 0, 1, 0)
    df['Swimming Pool'] = 0
    df['Garden'] = np.where(
        df['Landsize'].fillna(0) > df['BuildingArea'].fillna(0), 1, 0
    )
    df['Air Conditioning'] = 1
    df['Gated Community'] = 0
    df['City'] = 'Melbourne'

    df = df.rename(columns={
        'Bedroom2': 'Bedrooms',
        'Bathroom': 'Bathrooms',
        'Rooms': 'Total Rooms',
        'Landsize': 'Land Size',
        'BuildingArea': 'Built-up Area',
        'Type': 'Property Type',
        'Car': 'Parking Spaces',
        'Suburb': 'Locality',
        'Lattitude': 'Latitude',
        'Longtitude': 'Longitude',
        'Distance': 'Distance to City Center',
    })

    features = [
        'Bedrooms', 'Bathrooms', 'Total Rooms', 'Land Size', 'Built-up Area',
        'Property Age', 'Property Type', 'Number of Floors', 'Parking Spaces',
        'Furnishing Status', 'City', 'Locality', 'Latitude', 'Longitude',
        'Distance to City Center', 'Garage', 'Swimming Pool', 'Garden',
        'Air Conditioning', 'Gated Community', 'Price'
    ]

    for f in features:
        if f not in df.columns:
            df[f] = 0

    return df[features]