from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME")

if not MONGO_URI or not DB_NAME:
    raise ValueError("MONGO_URI and DB_NAME must be set in .env file")

try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    # Verify connection
    client.admin.command('ping')
    db = client[DB_NAME]
    print("✅ Connected to MongoDB successfully")
except ConnectionFailure as e:
    print(f"❌ Failed to connect to MongoDB: {e}")
    raise
except Exception as e:
    print(f"❌ Error setting up database: {e}")
    raise
