# Property Price Predictor ML 🏠

An interactive Machine Learning web application that predicts Melbourne property prices based on 20+ property features including location, amenities, and structural attributes.

Built with **Random Forest Regression** + **Streamlit** UI.

---

## Features

| Category | Inputs |
|---|---|
| Basic Property | Bedrooms, Bathrooms, Total Rooms, Land Size, Built-up Area, Property Age, Property Type, Floors, Parking, Furnishing |
| Location | City, Locality (Suburb), Latitude, Longitude, Distance to City Center |
| Amenities | Garage, Swimming Pool, Garden, Air Conditioning, Gated Community |

**Model accuracy**: Validation MAE of **$157,537** on Melbourne housing data (~63% improvement over baseline 4-feature model).

---

## Project Structure

```
Property-price-predicter-ML/
├── data/                   # Dataset (melb_data.csv — not tracked)
├── notebooks/              # Exploratory Jupyter notebooks
│   ├── readData.ipynb
│   ├── cleanData.ipynb
│   └── eda.ipynb
├── output/                 # Trained model artifact (generated on train)
├── src/
│   ├── __init__.py
│   ├── preprocessing.py    # Data loading & feature engineering
│   └── model.py            # Model training pipeline
├── main.py                 # Streamlit web app
├── requirements.txt
└── README.md
```

---

## Setup & Run

### 1. Install dependencies
```bash
pip install -r requirements.txt
```

### 2. Add dataset
Place `melb_data.csv` in the `data/` folder.  
Dataset: [Melbourne Housing Snapshot — Kaggle](https://www.kaggle.com/datasets/dansbecker/melbourne-housing-snapshot)

### 3. Train the model
```bash
python -m src.model
```
This generates `output/model.pkl`.

### 4. Run the app
```bash
streamlit run main.py
```
App opens at **http://localhost:8501**

---

## Tech Stack

- **Python 3.x**
- **scikit-learn** — RandomForestRegressor, Pipeline, ColumnTransformer
- **Streamlit** — Interactive web UI
- **pandas / numpy** — Data wrangling
- **joblib** — Model serialization

---

## Dataset

Melbourne Housing dataset (2016–2017) with ~13,000 property sales records.  
Source: [Kaggle — Melbourne Housing Snapshot](https://www.kaggle.com/datasets/dansbecker/melbourne-housing-snapshot)
