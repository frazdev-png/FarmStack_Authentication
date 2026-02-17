from passlib.context import CryptContext

# Use argon2 instead of bcrypt to avoid version compatibility issues
pwd_context = CryptContext(schemes=["argon2", "bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    # Bcrypt has a 72-byte limit, so truncate passwords to be safe
    if len(password.encode('utf-8')) > 72:
        password = password[:72]
    return pwd_context.hash(password)

def verify_password(password: str, hashed_password: str) -> bool:
    # Truncate password for verification consistency
    if len(password.encode('utf-8')) > 72:
        password = password[:72]
    return pwd_context.verify(password, hashed_password)
