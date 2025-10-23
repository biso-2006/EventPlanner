from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from database import db
from utils.hash_password import hash_password, verify_password
from utils.jwt_handler import create_access_token, get_current_user
from schemas.user_schema import UserCreate, UserResponse
from datetime import datetime
from fastapi import APIRouter, HTTPException
from utils.jwt_handler import create_access_token

auth_router = APIRouter(prefix="/auth", tags=["Auth"])

@auth_router.post("/signup")
async def signup(user: UserCreate):
    # Check if user already exists
    existing = await db.users.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create new user
    hashed_pw = hash_password(user.password)
    user_dict = {
        "email": user.email,
        "password": hashed_pw,
        "created_at": datetime.utcnow(),
        "is_active": True
    }
    result = await db.users.insert_one(user_dict)
    return {"message": "User registered successfully", "id": str(result.inserted_id)}


@auth_router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await db.users.find_one({"email": form_data.username})
    if not user or not verify_password(form_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": form_data.username})
    return {"access_token": token, "token_type": "bearer"}