from dotenv import load_dotenv
import os
from pymongo import MongoClient
from faker import Faker
from bson import ObjectId
from datetime import datetime, timedelta
import random
load_dotenv()
mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri)
db = client["chatDb"]
fake = Faker()
def generate_oid():
    return ObjectId() 
organizations = []
for _ in range(5):
    organizations.append({
        "_id": generate_oid(),
        "name": fake.company(),
        "address": fake.address(),
        "createdAt": datetime.utcnow()
    })
roles_data = [
    {"roleName": "Admin", "permissions": ["Create", "Read", "Update", "Delete"]},
    {"roleName": "Editor", "permissions": ["Create", "Read", "Update"]},
    {"roleName": "Viewer", "permissions": ["Read"]},
    {"roleName": "Moderator", "permissions": ["Read", "Update", "Delete"]},
    {"roleName": "SuperAdmin", "permissions": ["Create", "Read", "Update", "Delete", "Manage Users"]}
]
roles = []
for role in roles_data:
    roles.append({
        "_id": generate_oid(),
        "roleName": role["roleName"],
        "permissions": role["permissions"],
        "createdAt": datetime.utcnow()
    })
def get_role_id(role_name):
    return next(role["_id"] for role in roles if role["roleName"] == role_name)
users = []
role_distribution = {
    "SuperAdmin": 2,
    "Admin": 2,
    "Editor": 2,
    "Moderator": 2,
    "Viewer": 12
}
for role_name, count in role_distribution.items():
    for _ in range(count):
        users.append({
            "_id": generate_oid(),
            "username": fake.user_name(),
            "email": fake.email(),
            "roleId": get_role_id(role_name),
            "orgId": random.choice(organizations)["_id"],
            "createdAt": datetime.utcnow()
        })
rooms = [
    {
        "_id": generate_oid(), 
        "name": "General Chat", 
        "description": "A space for general discussions and casual conversations.",
        "createdAt": datetime.utcnow()
    },
    {
        "_id": generate_oid(), 
        "name": "Tech Talk", 
        "description": "Discuss the latest in technology, programming, and innovation.",
        "createdAt": datetime.utcnow()
    },
    {
        "_id": generate_oid(), 
        "name": "Random", 
        "description": "A fun place for off-topic conversations and randomness.",
        "createdAt": datetime.utcnow()
    },
    {
        "_id": generate_oid(), 
        "name": "Project Collaboration", 
        "description": "Work together on projects, share ideas, and brainstorm solutions.",
        "createdAt": datetime.utcnow()
    },
    {
        "_id": generate_oid(), 
        "name": "Support", 
        "description": "Ask for help, troubleshoot issues, and assist others with problems.",
        "createdAt": datetime.utcnow()
    }
]
messages = []
message_count = 0
for user in users:
    for _ in range(random.randint(100, 200)):
        room = random.choice(rooms)
        messages.append({
            "_id": generate_oid(),
            "user": {
                "id": user["_id"],
                "username": user["username"]
            },
            "roleId": user["roleId"],
            "orgId": user["orgId"],
            "room": {
                "id": room["_id"],
                "name": room["name"]
            },
            "text": fake.sentence(),
            "timestamp": datetime.utcnow()
        })
        message_count += 1
db.organizations.insert_many(organizations)
db.roles.insert_many(roles)
db.users.insert_many(users)
db.rooms.insert_many(rooms)
db.messages.insert_many(messages)
print(f"Data successfully inserted into MongoDB Atlas (chatDb)!")
