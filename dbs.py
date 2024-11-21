from datetime import datetime
from bdOps import *


def get_all(db, collection_name):
    collection = db[collection_name]
    return list(collection.find())

def insert_document(db, collection_name, data):
    createIndexIfNotExists("messages")
    collection = db[collection_name]
    result = collection.insert_one(data)
    return result.inserted_id  # Возвращает ID добавленного документа

def listUsers():
    data = get_all(db, "users")
    return data


def removemessage(id):
    db.messages.delete_one({"id": id})

def remove_collection(db, collection_name, confirm=False):
    if confirm:
        db[collection_name].drop()

def send_message(user_id, message, timestamp):
    #get length of messages
    id = appendID(db)
    data = { "user_id": user_id, "message": message, "timestamp": timestamp, 'fulltimestamp': datetime.now().strftime("%Y-%m-%d %H:%M:%S"), "id": id }
    insert_document(db, collection_name="messages", data=data)
    return data

def isRegistered(user_id):
    data = get_all(db, "users")
    for doc in data:
        if doc["user_id"] == user_id:
            return True
    return False

#RegisteringUser
def regUser(userName):
    data = {"user_id": userName}
    insert_document(db, collection_name="users", data=data)


#get all messages
def get_all(db, collection_name):
    collection = db[collection_name]
    return list(collection.find())


def appendID(db, ContinueAfterCreation=False):
    createIndexIfNotExists("ids")
    # Get first value from ids collection
    data = get_all(db, "ids")
    if len(data) == 0:
        data = {"id": 0}
        insert_document(db, collection_name="ids", data=data)
    else:
        data = data[0]
    currentId = data["id"]
    if ContinueAfterCreation:
        return currentId

    data["id"] = currentId + 1
    collection = db["ids"]
    collection.update_one({}, {"$set": data})
    return currentId

appendID(db, True)