from fastapi import FastAPI
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()
app = FastAPI()

# Lazy MongoDB connection
_client = None
_db = None
_contents_collections = None
_users_collections = None

def get_db():
    global _client, _db, _contents_collections, _users_collections
    if _client is None:
        try:
            _client = MongoClient(os.getenv("DATABASE_URI"), serverSelectionTimeoutMS=5000)
            _db = _client["fast-api-ASAP"]
            _contents_collections = _db["contents"]
            _users_collections = _db["users"]
        except Exception as e:
            print(f"Warning: Could not connect to MongoDB: {e}")
    return _db

# Keep these for backwards compatibility
client = None
db = None
contents_collections = None
users_collections = None

# Try to connect on module load, but don't fail if unavailable
try:
    client = MongoClient(os.getenv("DATABASE_URI"), serverSelectionTimeoutMS=5000)
    db = client["fast-api-ASAP"]
    contents_collections = db["contents"]
    users_collections = db["users"]
    print("✓ Connected to MongoDB")
except Exception as e:
    print(f"⚠ MongoDB connection will be attempted when needed: {e}")

@app.get("/")
def root():
    return {"Connected to": "Mongo DB!"}