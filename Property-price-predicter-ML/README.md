# Property Price Predicter ML

This project is a Machine Learning application that predicts the price of a property based on its features. It uses a Random Forest Regressor trained on a robust dataset and provides a simple, interactive web interface using Streamlit.

## Features
- **Data Preprocessing**: Handles missing values and select features seamlessly.
- **Random Forest Model**: Predicts prices with a balance of speed and accuracy.
- **Interactive UI**: Simple Streamlit interface for non-technical users.

## Setup

1. **Activate Virtual Environment** (Optional but recommended):
   ```bash
   # Windows
   .\venv\Scripts\activate
   ```

2. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Train the Model**:
   *Before running the web app, you must train the model so it can generate the `.pkl` artifact.*
   ```bash
   python -m src.model
   ```

4. **Run the Application**:
   ```bash
   streamlit run main.py
   ```
