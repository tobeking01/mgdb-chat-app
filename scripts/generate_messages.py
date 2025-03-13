import json
import random
from datetime import datetime, timedelta
from faker import Faker
from bson import ObjectId

fake = Faker()

users = [
    {"_id": str(ObjectId()), "username": "JohnDoe", "roleId": str(ObjectId()), "orgId": str(ObjectId())},
    {"_id": str(ObjectId()), "username": "AliceSmith", "roleId": str(ObjectId()), "orgId": str(ObjectId())},
    {"_id": str(ObjectId()), "username": "BobJohnson", "roleId": str(ObjectId()), "orgId": str(ObjectId())},
    {"_id": str(ObjectId()), "username": "CharlieDavis", "roleId": str(ObjectId()), "orgId": str(ObjectId())},
    {"_id": str(ObjectId()), "username": "DavidWilson", "roleId": str(ObjectId()), "orgId": str(ObjectId())},
    {"_id": str(ObjectId()), "username": "EmmaBrown", "roleId": str(ObjectId()), "orgId": str(ObjectId())},
    {"_id": str(ObjectId()), "username": "FrankMiller", "roleId": str(ObjectId()), "orgId": str(ObjectId())},
    {"_id": str(ObjectId()), "username": "GraceTaylor", "roleId": str(ObjectId()), "orgId": str(ObjectId())},
    {"_id": str(ObjectId()), "username": "HenryMoore", "roleId": str(ObjectId()), "orgId": str(ObjectId())},
    {"_id": str(ObjectId()), "username": "IvyAnderson", "roleId": str(ObjectId()), "orgId": str(ObjectId())},
    {"_id": str(ObjectId()), "username": "JackWhite", "roleId": str(ObjectId()), "orgId": str(ObjectId())}
]

rooms = [
    {"_id": str(ObjectId()), "name": "General Chat"},
    {"_id": str(ObjectId()), "name": "Tech Talk"},
    {"_id": str(ObjectId()), "name": "Random"},
    {"_id": str(ObjectId()), "name": "Project Collaboration"},
    {"_id": str(ObjectId()), "name": "Support"}
]

messages = []
message_count = 0

for user in users:
    for i in range(100):
        room = random.choice(rooms)
        message = {
            "_id": str(ObjectId()),
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
            "timestamp": datetime.utcnow().isoformat() + "Z"
        }
        messages.append(message)
        message_count += 1

with open("messages.json", "w") as f:
    json.dump(messages, f, indent=4)

print(f"Inserted {message_count} messages into messages.json")
