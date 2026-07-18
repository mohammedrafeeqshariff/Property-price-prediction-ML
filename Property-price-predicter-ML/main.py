import streamlit as st
import pandas as pd
import joblib
import os

model_path = os.path.join("output", "model.pkl")

@st.cache_resource
def load_model():
    if os.path.exists(model_path):
        return joblib.load(model_path)
    return None

def main():
    st.title("Property Price Predictor 🏠")
    st.write("Enter property features to predict the price.")

    model = load_model()

    if model is None:
        st.warning("Model not found. Please train the model first by running `python -m src.model`.")
        return

    st.sidebar.header("Property Features")
    rooms = st.sidebar.slider("Rooms", 1, 10, 3)
    bedroom2 = st.sidebar.slider("Bedrooms", 1, 10, 3)
    bathroom = st.sidebar.slider("Bathrooms", 1, 5, 2)
    landsize = st.sidebar.number_input("Landsize (sqm)", min_value=0, max_value=10000, value=500, step=10)

    if st.button("Predict Price"):
        input_data = pd.DataFrame({
            'Rooms': [rooms],
            'Bedroom2': [bedroom2],
            'Bathroom': [bathroom],
            'Landsize': [landsize]
        })
        
        prediction = model.predict(input_data)[0]
        st.success(f"Predicted Property Price: ${prediction:,.2f}")

if __name__ == "__main__":
    main()
