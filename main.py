import streamlit as st
import pandas as pd
import joblib
import os

st.set_page_config(page_title="Property Price Predictor", page_icon="🏠", layout="wide")

model_path = os.path.join("output", "model.pkl")

@st.cache_resource
def load_model():
    if os.path.exists(model_path):
        return joblib.load(model_path)
    return None

def main():
    st.title("🏠 Property Price Predictor")
    st.markdown("Fill in the property details below and click **Predict Price** to get an estimate.")

    model = load_model()
    if model is None:
        st.error("Model not found. Run `python -m src.model` to train it first.")
        return

    col1, col2, col3 = st.columns(3)

    with col1:
        st.subheader("Basic Property")
        bedrooms     = st.number_input("Bedrooms", 1, 15, 3)
        bathrooms    = st.number_input("Bathrooms", 1, 10, 2)
        total_rooms  = st.number_input("Total Rooms", 1, 20, 5)
        land_size    = st.number_input("Land Size (sqm)", 0.0, 20000.0, 500.0, step=10.0)
        built_area   = st.number_input("Built-up Area (sqm)", 0.0, 5000.0, 150.0, step=10.0)
        prop_age     = st.number_input("Property Age (years)", 0, 200, 15)
        prop_type    = st.selectbox("Property Type", ["h", "u", "t"],
                                    format_func=lambda x: {"h":"House","u":"Unit","t":"Townhouse"}[x])
        floors       = st.slider("Number of Floors", 1, 5, 1)
        parking      = st.number_input("Parking Spaces", 0, 20, 1)
        furnishing   = st.selectbox("Furnishing Status", ["Unfurnished", "Semi-Furnished", "Furnished"])

    with col2:
        st.subheader("Location")
        city         = st.text_input("City", "Melbourne")
        locality     = st.text_input("Locality (Suburb)", "Abbotsford")
        latitude     = st.number_input("Latitude", -90.0, 90.0, -37.80, format="%.4f")
        longitude    = st.number_input("Longitude", -180.0, 180.0, 144.99, format="%.4f")
        dist_city    = st.number_input("Distance to City Center (km)", 0.0, 150.0, 5.0, step=0.5)

    with col3:
        st.subheader("Amenities")
        garage       = st.checkbox("Garage")
        pool         = st.checkbox("Swimming Pool")
        garden       = st.checkbox("Garden")
        ac           = st.checkbox("Air Conditioning", value=True)
        gated        = st.checkbox("Gated Community")

    st.markdown("---")
    if st.button("🔍 Predict Price", use_container_width=True):
        input_df = pd.DataFrame([{
            'Bedrooms': bedrooms,
            'Bathrooms': bathrooms,
            'Total Rooms': total_rooms,
            'Land Size': land_size,
            'Built-up Area': built_area,
            'Property Age': prop_age,
            'Property Type': prop_type,
            'Number of Floors': floors,
            'Parking Spaces': parking,
            'Furnishing Status': furnishing,
            'City': city,
            'Locality': locality,
            'Latitude': latitude,
            'Longitude': longitude,
            'Distance to City Center': dist_city,
            'Garage': int(garage),
            'Swimming Pool': int(pool),
            'Garden': int(garden),
            'Air Conditioning': int(ac),
            'Gated Community': int(gated),
        }])

        try:
            prediction = model.predict(input_df)[0]
            st.success(f"### Estimated Property Price: ${prediction:,.0f}")
            st.caption("Prediction based on historical Melbourne property data (2016-2017).")
        except Exception as e:
            st.error(f"Prediction error: {e}")

if __name__ == "__main__":
    main()
