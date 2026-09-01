"""Agent Tooling Suite for Melbourne Real Estate Advisor.

Provides:
1. predict_property_price_tool: ML Random Forest valuation engine.
2. search_property_knowledge_tool: ChromaDB RAG retriever over 'melbourne_property_kb'.
3. calculate_mortgage_tool: Mortgage, stamp duty, and affordability calculator.
"""

import os
import joblib
import pandas as pd
from typing import Optional, List, Any
from langchain_core.tools import tool
from src.rag.retriever import search_property_knowledge

MODEL_PATH = os.path.join("output", "model.pkl")
_MODEL_CACHE = None


def get_trained_model():
    """Load or lazily train the ML Random Forest model."""
    global _MODEL_CACHE
    if _MODEL_CACHE is not None:
        return _MODEL_CACHE

    if os.path.exists(MODEL_PATH):
        _MODEL_CACHE = joblib.load(MODEL_PATH)
        return _MODEL_CACHE

    # Train model if missing
    print("Model artifact not found. Training model on data/melb_data.csv...")
    from src.model import train_model
    train_model()
    _MODEL_CACHE = joblib.load(MODEL_PATH)
    return _MODEL_CACHE


@tool
def predict_property_price_tool(
    locality: str = "Richmond",
    bedrooms: int = 3,
    bathrooms: int = 2,
    total_rooms: int = 5,
    land_size: float = 450.0,
    built_area: float = 140.0,
    property_age: int = 15,
    property_type: str = "h",
    dist_city: float = 5.0,
    parking: int = 1,
    floors: int = 1,
    garage: int = 1,
    pool: int = 0,
    garden: int = 1,
    ac: int = 1,
    gated: int = 0,
    furnishing: str = "Unfurnished",
    city: str = "Melbourne",
    latitude: float = -37.80,
    longitude: float = 144.99,
) -> str:
    """Predicts the estimated Melbourne property price using a trained Random Forest ML pipeline.

    Args:
        locality: Suburb name (e.g. 'Richmond', 'Abbotsford', 'Reservoir', 'South Yarra').
        bedrooms: Number of bedrooms (e.g. 1 to 10).
        bathrooms: Number of bathrooms (e.g. 1 to 5).
        total_rooms: Total room count including living areas.
        land_size: Land area in square meters (sqm).
        built_area: Built-up indoor area in sqm.
        property_age: Age of the property in years.
        property_type: 'h' for House, 'u' for Unit/Apartment, 't' for Townhouse.
        dist_city: Distance to Melbourne CBD in kilometers.
        parking: Number of car parking spaces.
        floors: Number of floors/stories.
        garage: 1 if has garage, 0 otherwise.
        pool: 1 if has swimming pool, 0 otherwise.
        garden: 1 if has garden, 0 otherwise.
        ac: 1 if air conditioned, 0 otherwise.
        gated: 1 if gated community, 0 otherwise.
        furnishing: 'Unfurnished', 'Semi-Furnished', or 'Furnished'.
        city: City name (defaults to 'Melbourne').
        latitude: Geographic latitude coordinate.
        longitude: Geographic longitude coordinate.
    """
    try:
        model = get_trained_model()
        input_data = pd.DataFrame([{
            'Bedrooms': int(bedrooms),
            'Bathrooms': int(bathrooms),
            'Total Rooms': int(total_rooms),
            'Land Size': float(land_size),
            'Built-up Area': float(built_area),
            'Property Age': int(property_age),
            'Property Type': str(property_type).lower(),
            'Number of Floors': int(floors),
            'Parking Spaces': int(parking),
            'Furnishing Status': str(furnishing),
            'City': str(city),
            'Locality': str(locality).title(),
            'Latitude': float(latitude),
            'Longitude': float(longitude),
            'Distance to City Center': float(dist_city),
            'Garage': int(garage),
            'Swimming Pool': int(pool),
            'Garden': int(garden),
            'Air Conditioning': int(ac),
            'Gated Community': int(gated),
        }])

        pred = model.predict(input_data)[0]
        type_str = {"h": "House", "u": "Unit", "t": "Townhouse"}.get(str(property_type).lower(), "Property")
        return (
            f"ML Model Prediction Result:\n"
            f"- Suburb: {locality.title()} (~{dist_city:.1f} km from CBD)\n"
            f"- Property Type: {type_str} ({bedrooms} Bed, {bathrooms} Bath, {land_size} sqm land)\n"
            f"- Estimated Market Valuation: ${pred:,.0f} AUD\n"
            f"- Model: Scikit-learn Random Forest Regressor (MAE ±$157,537)"
        )
    except Exception as e:
        return f"Error executing ML price prediction: {str(e)}"


@tool
def search_property_knowledge_tool(query: str) -> str:
    """Searches the Melbourne Property Market vector knowledge base ('melbourne_property_kb') for suburb trends, median prices, and historical statistics.

    Args:
        query: Search query (e.g. 'Abbotsford median price and distance to CBD', 'Reservoir unit prices').
    """
    try:
        results = search_property_knowledge(query, k=3)
        if not results.get("context"):
            return "No relevant Melbourne property market records found for the given query."
        return f"Retrieved Knowledge from 'melbourne_property_kb':\n\n{results['context']}"
    except Exception as e:
        return f"Error searching vector knowledge base: {str(e)}"


@tool
def calculate_mortgage_tool(
    property_price: float,
    deposit_percent: float = 20.0,
    annual_interest_rate: float = 6.0,
    loan_term_years: int = 30,
) -> str:
    """Calculates monthly mortgage repayments, required deposit, loan amount, and estimated Victorian stamp duty.

    Args:
        property_price: Total property purchase price in AUD.
        deposit_percent: Percentage deposit/equity (default 20.0%).
        annual_interest_rate: Annual loan interest rate in percentage (e.g. 6.0 for 6%).
        loan_term_years: Loan duration in years (default 30).
    """
    try:
        price = float(property_price)
        dep_pct = float(deposit_percent) / 100.0
        deposit_amount = price * dep_pct
        loan_amount = price - deposit_amount

        monthly_rate = (float(annual_interest_rate) / 100.0) / 12.0
        total_months = int(loan_term_years) * 12

        if monthly_rate > 0:
            monthly_payment = (
                loan_amount
                * (monthly_rate * (1 + monthly_rate) ** total_months)
                / ((1 + monthly_rate) ** total_months - 1)
            )
        else:
            monthly_payment = loan_amount / total_months

        total_repaid = monthly_payment * total_months
        total_interest = total_repaid - loan_amount

        # Estimated Victorian Stamp Duty approximation (~5.5% bracket for standard owner-occupier)
        est_stamp_duty = price * 0.055

        return (
            f"Financial & Mortgage Assessment for ${price:,.0f} AUD:\n"
            f"- Deposit Required ({deposit_percent}%): ${deposit_amount:,.0f} AUD\n"
            f"- Loan Principal Amount: ${loan_amount:,.0f} AUD\n"
            f"- Interest Rate: {annual_interest_rate}% p.a. over {loan_term_years} years\n"
            f"- Estimated Monthly Repayment: ${monthly_payment:,.2f} AUD / month\n"
            f"- Total Interest over Loan Term: ${total_interest:,.0f} AUD\n"
            f"- Total Repayment Amount: ${total_repaid:,.0f} AUD\n"
            f"- Estimated VIC Stamp Duty: ~${est_stamp_duty:,.0f} AUD"
        )
    except Exception as e:
        return f"Error calculating mortgage: {str(e)}"


def get_agent_tools() -> List[Any]:
    """Return all tools registered for the LangChain agent."""
    return [
        predict_property_price_tool,
        search_property_knowledge_tool,
        calculate_mortgage_tool,
    ]
