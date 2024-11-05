from pymongo import *


client = MongoClient('localhost', 27017)
db = client.mydatabase
def createDataBaseIfNotExists(dbname):
    if dbname in client.list_database_names():
        print("Database already exists")
    else:
        db = client[dbname]
        print("Database created successfully")
        return db
