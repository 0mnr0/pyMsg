from pymongo import *

client = MongoClient('mongodb://localhost:27017')
db = client.mydatabase['pyMsg']

def createIndexIfNotExists(dbname):
    if dbname in client.list_database_names():
        print("Database already exists")
    else:
        global db
        db = client[dbname]
        print("Database created successfully")
        return db


def createBasicAerarchy():
    createIndexIfNotExists('users')
    createIndexIfNotExists('chats')


