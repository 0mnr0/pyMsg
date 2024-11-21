import time
from threading import Thread

from flask import *
from flask_cors import CORS
from dbs import *
from queue import *


event_queue = Queue()
app = Flask(__name__, template_folder="web", static_folder='web/static',)
CORS(app)

PeoplesOnline = []
dictOfMessages = {}


@app.route('/')
def index():
    if request.remote_addr == "192.168.102.111":
        pass
    return render_template('index.html')


@app.route('/reg', methods=['GET'])
def reg():
    #return index.html
    return render_template('registration.html')

@app.route('/userList', methods=['GET'])
def userList():
    users = listUsers()
    finalUsers={}
    i = 0
    for user in users:
        finalUsers[i] = user["user_id"]
        i+=1
    return finalUsers

@app.route('/isRegistered', methods=['POST'])
def isUserExists():
    data = request.get_json()
    user_id = data['name']
    return {'isRegistered': isRegistered(user_id), 'name': user_id}

@app.route("/userRegister", methods=["POST"])
def userRegister():
    data = request.get_json()
    userName = data['name']
    if isRegistered(userName):
        return {"status": "User already exists"}, 400

    id = appendID(db)
    data = {"user_id": -1, "message": f"Пользователь {userName} зарегистрировался в чате !", "timestamp": datetime.now().strftime("%H:%M:%S"),
            'fulltimestamp': datetime.now().strftime("%Y-%m-%d %H:%M:%S"), "id": id, "ChatUsersList": userName}
    insert_document(db, collection_name="messages", data=data)
    regUser(userName)
    return {"status": "OK"}

@app.route('/send', methods=['POST'])
def send():
    if request.remote_addr == "192.168.102.111":
        pass
    data = request.get_json()
    user_id = data['user_id']
    print(f"request.remote_addr ({user_id}):", request.remote_addr)
    message = data['message']
    print(f"request.remote_addr msg: {message} ({user_id}):")

    retDat = send_message(user_id, message, datetime.now().strftime("%H:%M:%S"))
    retDat['_id'] = None

    return retDat



def refreshMsgs():
    global dictOfMessages
    Messages = get_all(db, "messages")
    finalDict = {}
    i = 0
    for message in Messages:
        finalDict[str(i)] = message
        finalDict[str(i)]['_id'] = "null"
        i = i+1
    finalDict["id"] = appendID(db, True)
    dictOfMessages = json.dumps(finalDict)
    time.sleep(1)
    refreshMsgs()
msgRefresh = Thread(target=refreshMsgs)
msgRefresh.start()



@app.route('/removeMessage', methods=['POST'])
def removeMessage():
    data = request.get_json()
    id = data['msgId']
    removemessage(id)
    return {'status': "OK"}

@app.route('/getMessages', methods=['GET'])
def getMessages():
    return dictOfMessages


app.run(port=8970, host="0.0.0.0", debug=True)
#app.run(port=898, host="0.0.0.0", debug=True)