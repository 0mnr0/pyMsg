from datetime import datetime
from bdOps import *


def get_all(db, collection_name):
    # Получить все элементы в коллекции
    collection = db[collection_name]
    return list(collection.find()) # Тип данных: list (c dict внутри)

def insert_document(db, collection_name, data):
    createIndexIfNotExists("messages") # Создать раздел "messages" если его нет
    collection = db[collection_name] # Получить коллекцию
    result = collection.insert_one(data) # Добавить документ
    # Возвращает ID добавленного документа
    return result.inserted_id

def listUsers():
    data = get_all(db, "users")
    return data # Тип данных: list


def removemessage(id):
    filter_query = {'id': id}
    update_query = {'$set': {'deleted': True, 'message': None, 'timestamp': None, 'fulltimestamp': None, 'user_id': None}}
    db.messages.update_many(filter_query, update_query)


def remove_collection(db, collection_name, confirm=False):
    if confirm:
        db[collection_name].drop()

def send_message(user_id, message, timestamp, file=None, isAi=False):
    #get length of messages
    if isAi is None:
        isAi = False
    id = appendID(db)
    filename = None
    if file is not None:
        filename = file.split('\\')[-1]
    data = { "user_id": user_id, "message": message, "timestamp": timestamp, 'fulltimestamp': datetime.now().strftime("%Y-%m-%d %H:%M:%S"), "id": id, "attachment": file, "filename": filename, "isAi": isAi}
    insert_document(db, collection_name="messages", data=data)

    return data # Тип данных: dict

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
def get_all(db, collection_name, numbersOfMessages=500):
    collection = db[collection_name]
    messages = list(collection.find({}, {"_id": 0})
        .sort("_id", -1)
        .limit(numbersOfMessages)
    ) # Тип данных: list (с dict внутри, ограниченный numbersOfMessages)


    messages.reverse() # В привычной человеку последовательности

    # Пример данных: [{ "user_id": "dsvl", "message": "text in message", "timestamp": "12:34:56", 'fulltimestamp': "2024-11-27 12:34:56"), "id": 1, "attachment": None, "filename": None, "isAi": False}, {...}, ...]
    return messages # Тип данных: list (с dict внутри)


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
    return currentId # Тип данных: int

appendID(db, True)