from datetime import datetime

from bdOps import *
from pymongo import *



def get_all(db, collection_name):
    collection = db[collection_name]
    return list(collection.find())

def insert_document(db, collection_name, data):
    createIndexIfNotExists("messages")
    collection = db[collection_name]
    result = collection.insert_one(data)
    return result.inserted_id  # Возвращает ID добавленного документа


def remove_collection(db, collection_name, confirm=False):
    if confirm:
        db[collection_name].drop()

def send_message(user_id, message, timestamp=datetime.now()):
    data = {"user_id": user_id, "message": message, timestamp: timestamp}
    insert_document(db, collection_name="messages", data=data)



remove_collection(db, "messages", confirm=True)
print(get_all(db, "messages"))