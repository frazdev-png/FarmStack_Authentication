from datetime import datetime

def user_model(user: dict) -> dict:
    return {
        "email": user["email"],
        "password": user["password"],
        "created_at": datetime.utcnow()
    }
