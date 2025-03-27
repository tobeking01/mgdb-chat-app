from pymongo import MongoClient

# Connect to your MongoDB Atlas cluster
client = MongoClient("mongodb+srv://zadkiel:GAuHRbVvbVXW3TUQ@cluster0.hy50q.mongodb.net/?retryWrites=true&w=majority")
db = client["chatDb"]

# Delete all documents from the collections
db.messages.delete_many({})
db.organizations.delete_many({})
db.roles.delete_many({})
db.rooms.delete_many({})
db.users.delete_many({})

print("All documents have been deleted from messages, organizations, roles, rooms, and users collections.")
