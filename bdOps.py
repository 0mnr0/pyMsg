from pymongo import *
import os

UPLOAD_FOLDER = 'uploads'

# Убедимся, что папка существует
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)


client = MongoClient('mongodb://localhost:27017')
db = client.pyMsg

def createIndexIfNotExists(dbname):
    if dbname in client.list_database_names():
        pass
    else:
        global db
        db = client[dbname]
        return db



