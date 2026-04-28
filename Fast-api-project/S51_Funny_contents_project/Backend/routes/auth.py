from fastapi import APIRouter, HTTPException, Body
from schemas import users
from DB import users_collections
from passlib.context import CryptContext
from jose import jwt
import os
 
router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
JWT_SECRET = os.getenv("SECRET_ACCESS_TOKEN")

# Signup
@router.post("/signup")
def signup(user: users):
    existing_user = users_collections.find_one({"username": user.username})
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    hashed_password = pwd_context.hash(user.password)
    user_dict = user.dict()
    user_dict["password"] = hashed_password
    users_collections.insert_one(user_dict)
    return {"message": "User created successfully"}

# Login
@router.post("/login")
def login(username: str = Body(...), password: str = Body(...)):
    user = users_collections.find_one({"username": username})
    if not user or not pwd_context.verify(password, user["password"]):
        raise HTTPException(status_code=400, detail="Invalid username or password")
    token_payload = {"id": str(user["_id"]), "username": user["username"]}
    token = jwt.encode(token_payload, JWT_SECRET, algorithm="HS256")
    return {"authToken": token, "username": username, "_id": str(user["_id"])}