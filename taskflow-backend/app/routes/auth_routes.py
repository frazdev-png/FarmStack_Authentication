from fastapi import APIRouter, HTTPException, status
from app.database import db
from app.schemas.user_schema import UserCreate, UserLogin
from app.core.security import hash_password, verify_password
from app.models.user_model import user_model
from app.core.jwt import create_access_token

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/signup")
def signup(user: UserCreate):
    """Register a new user."""
    users_collection = db["users"]

    # Check if email already exists
    if users_collection.find_one({"email": user.email}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Create new user
    user_dict = {
        "email": user.email,
        "password": hash_password(user.password)
    }

    try:
        users_collection.insert_one(user_model(user_dict))
        return {
            "message": "User registered successfully ✅",
            "email": user.email
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error creating user account"
        )


@router.post("/login")
def login(user: UserLogin):
    """Login user and return access token."""
    users_collection = db["users"]

    # Find user by email
    db_user = users_collection.find_one({"email": user.email})
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Verify password
    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Create access token
    token = create_access_token({"sub": db_user["email"]})

    return {
        "access_token": token,
        "token_type": "bearer",
        "email": db_user["email"]
    }
