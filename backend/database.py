from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "eventplanner")

client = AsyncIOMotorClient(MONGO_URI)
db = client[DATABASE_NAME]

# db.users will be our collection for storing users
