import random
from datetime import datetime, timedelta
from faker import Faker
from pymongo import MongoClient
from bson import ObjectId

fake = Faker()

client = MongoClient("mongodb+srv://zadkiel:GAuHRbVvbVXW3TUQ@cluster0.hy50q.mongodb.net/?retryWrites=true&w=majority")
db = client["chatDb"]

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

users = []
for _ in range(10):
    users.append({
        "_id": generate_oid(),
        "username": fake.user_name(),
        "email": fake.email(),
        "roleId": random.choice(roles)["_id"],
        "orgId": random.choice(organizations)["_id"],
        "createdAt": datetime.utcnow()
    })

rooms = [
    {"_id": generate_oid(), "name": "General Chat"},
    {"_id": generate_oid(), "name": "Tech Talk"},
    {"_id": generate_oid(), "name": "Random"},
    {"_id": generate_oid(), "name": "Project Collaboration"},
    {"_id": generate_oid(), "name": "Support"}
]

messages = []
message_count = 0

for user in users:
    for _ in range(100):
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

print(f"🚀 Data successfully inserted into MongoDB Atlas (chatDb)!")
