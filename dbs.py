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
    deletingMsg = db.messages.find_one({"id": id})
    #add deleted tag to it
    deletingMsg["deleted"] = True
    deletingMsg["message"] = None
    deletingMsg["timestamp"] = None
    deletingMsg["fulltimestamp"] = None
    deletingMsg["user_id"] = None
    db.messages.replace_one({"id": id}, deletingMsg)


def remove_collection(db, collection_name, confirm=False):
    if confirm:
        db[collection_name].drop()

def send_message(user_id, message, timestamp, file=None):
    #get length of messages
    id = appendID(db)
    filename = None
    if file is not None:
        filename = file.split('\\')[-1]
    data = { "user_id": user_id, "message": message, "timestamp": timestamp, 'fulltimestamp': datetime.now().strftime("%Y-%m-%d %H:%M:%S"), "id": id, "attachment": file, "filename": filename}
    insert_document(db, collection_name="messages", data=data)
    return data

def isRegistered(user_id):
    data = get_all(db, "users")
    for doc in data:
        if doc["user_id"] == user_id:
            return True
    return False

def verifyUser(user_id, password):
    data = get_all(db, "users")
    for doc in data:
        if doc["user_id"] == user_id and doc["password"] == password:
            return True
    return False

#RegisteringUser
def regUser(userName, userPassword):
    data = {"user_id": userName, "password": userPassword}
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