from dotenv import load_dotenv
import os
from pymongo import MongoClient
load_dotenv()
mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri)
db = client["chatDb"]
db.messages.delete_many({})
db.organizations.delete_many({})
db.roles.delete_many({})
db.rooms.delete_many({})
db.users.delete_many({})
print("All documents deleted from messages, organizations, roles, rooms, and users collections.")
