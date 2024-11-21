from pymongo import *

client = MongoClient('mongodb://localhost:27017')
db = client.pyMsg

def createIndexIfNotExists(dbname):
    if dbname in client.list_database_names():
        pass
    else:
        global db
        db = client[dbname]
        return db



