"""Data ingestion script for Melbourne Property Market RAG Knowledge Base.

Transforms 'data/melb_data.csv' into structured knowledge documents and indexes them
into a persistent ChromaDB vector store named 'melbourne_property_kb'.
"""

import os
import pandas as pd
from typing import List
from langchain_core.documents import Document
from src.llm.providers import get_embeddings

VECTOR_STORE_DIR = os.path.join("output", "vectorstore")
COLLECTION_NAME = "melbourne_property_kb"
DATA_PATH = os.path.join("data", "melb_data.csv")


def generate_suburb_documents(df: pd.DataFrame) -> List[Document]:
    """Generate rich natural language knowledge documents per suburb and market-wide benchmarks."""
    documents = []

    # Clean subset
    valid_df = df.dropna(subset=['Price', 'Suburb']).copy()
    valid_df['Landsize'] = pd.to_numeric(valid_df.get('Landsize', 0), errors='coerce').fillna(0)
    valid_df['Distance'] = pd.to_numeric(valid_df.get('Distance', 0), errors='coerce').fillna(0)

    # 1. Suburb Level Profiles
    suburbs = valid_df['Suburb'].unique()
    print(f"Generating knowledge profiles for {len(suburbs)} Melbourne suburbs...")

    for suburb in suburbs:
        sub_df = valid_df[valid_df['Suburb'] == suburb]
        total_sales = len(sub_df)
        if total_sales < 2:
            continue

        median_price = sub_df['Price'].median()
        mean_price = sub_df['Price'].mean()
        min_price = sub_df['Price'].min()
        max_price = sub_df['Price'].max()
        dist_cbd = sub_df['Distance'].median()
        region = sub_df['Regionname'].iloc[0] if 'Regionname' in sub_df.columns and pd.notna(sub_df['Regionname'].iloc[0]) else "Greater Melbourne"
        postcode = int(sub_df['Postcode'].iloc[0]) if 'Postcode' in sub_df.columns and pd.notna(sub_df['Postcode'].iloc[0]) else "N/A"

        # Property type breakdown
        type_summaries = []
        for ptype, label in [('h', 'Houses'), ('u', 'Units/Apartments'), ('t', 'Townhouses')]:
            t_df = sub_df[sub_df['Type'] == ptype]
            if len(t_df) > 0:
                t_med = t_df['Price'].median()
                t_rooms = t_df['Rooms'].median()
                type_summaries.append(f"- {label}: {len(t_df)} sales recorded, median price ${t_med:,.0f} (typical {int(t_rooms)} rooms).")

        types_text = "\n".join(type_summaries) if type_summaries else "Various residential dwellings."

        content = f"""Suburb Profile: {suburb} (Postcode: {postcode})
Region: {region}
Distance to Melbourne CBD: approximately {dist_cbd:.1f} km.
Overall Market Snapshot:
- Total Sales in Dataset: {total_sales} transactions
- Median Property Price: ${median_price:,.0f} AUD
- Average Property Price: ${mean_price:,.0f} AUD
- Typical Price Range: ${min_price:,.0f} to ${max_price:,.0f} AUD
- Median Land Size: {sub_df['Landsize'].median():.0f} sqm

Property Type Breakdown:
{types_text}

Market Insights:
{suburb} is located in Melbourne's {region}, roughly {dist_cbd:.1f}km from the central business district. Buyers considering {suburb} should expect median house prices around ${median_price:,.0f}. Proximity to the CBD and local amenities strongly influence value retention and capital appreciation.
"""
        metadata = {
            "source": "melbourne_housing_dataset",
            "suburb": suburb,
            "region": region,
            "distance_to_cbd": float(dist_cbd),
            "median_price": float(median_price),
            "doc_type": "suburb_profile",
        }
        documents.append(Document(page_content=content.strip(), metadata=metadata))

    # 2. General Market Benchmark Documents
    overall_median = valid_df['Price'].median()
    overall_mean = valid_df['Price'].mean()
    h_median = valid_df[valid_df['Type'] == 'h']['Price'].median()
    u_median = valid_df[valid_df['Type'] == 'u']['Price'].median()
    t_median = valid_df[valid_df['Type'] == 't']['Price'].median()

    market_overview = f"""Melbourne Real Estate Macro Market Overview:
Historical Benchmark Metrics (Melbourne Housing Snapshot):
- Metropolitan Median Price across all dwelling types: ${overall_median:,.0f} AUD
- Metropolitan Mean Price: ${overall_mean:,.0f} AUD
- Standalone Houses ('h') Median: ${h_median:,.0f} AUD
- Units and Apartments ('u') Median: ${u_median:,.0f} AUD
- Townhouses ('t') Median: ${t_median:,.0f} AUD

Key Valuation Drivers across Melbourne:
1. Distance to CBD: Every kilometer closer to the CBD typically adds a substantial land and location premium. Inner-ring suburbs (<10km) command high premiums.
2. Property Type: Standalone houses command the highest median price due to land ownership, followed by townhouses and units.
3. Bedroom & Bathroom Count: 3-4 bedroom houses represent the most common family configurations with steady resale liquidity.
4. Land Size: Land size above 400 sqm in middle and inner rings represents significant capital appreciation potential.
"""
    documents.append(Document(
        page_content=market_overview.strip(),
        metadata={"source": "market_macro", "doc_type": "macro_overview", "suburb": "ALL"}
    ))

    return documents


def ingest_melbourne_data(
    data_path: str = DATA_PATH,
    persist_directory: str = VECTOR_STORE_DIR,
    collection_name: str = COLLECTION_NAME,
):
    """Ingests Melbourne property data into ChromaDB vector store."""
    if not os.path.exists(data_path):
        raise FileNotFoundError(f"Data file not found at: {data_path}")

    print(f"Reading {data_path}...")
    df = pd.read_csv(data_path)
    docs = generate_suburb_documents(df)
    print(f"Generated {len(docs)} documents for vectorization.")

    embeddings = get_embeddings(provider="huggingface")

    from langchain_community.vectorstores import Chroma

    os.makedirs(persist_directory, exist_ok=True)
    print(f"Indexing documents into Chroma collection '{collection_name}' at {persist_directory}...")

    vectorstore = Chroma.from_documents(
        documents=docs,
        embedding=embeddings,
        collection_name=collection_name,
        persist_directory=persist_directory,
    )
    print(f"Successfully indexed {len(docs)} documents into '{collection_name}'.")
    return vectorstore


if __name__ == "__main__":
    ingest_melbourne_data()
