from itertools import islice
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


@app.route('/uploads/<filename>', methods=['GET'])
def returnFile(filename):
    file_path = os.path.join('uploads', filename)
    if os.path.exists(file_path):
        return send_from_directory('uploads', filename)
    else:
        return "Файл не найден", 404

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
    userPassword = data.get('pass')
    if (type(userPassword) != str) or len(userPassword) < 4:
        abort(400, "Password must be at least 4 characters long")

    if isRegistered(userName):
        return {"status": "User already exists"}, 400

    id = appendID(db)
    data = {"user_id": -1, "message": f"Пользователь {userName} зарегистрировался в чате !", "timestamp": datetime.now().strftime("%H:%M:%S"),
            'fulltimestamp': datetime.now().strftime("%Y-%m-%d %H:%M:%S"), "id": id, "ChatUsersList": userName}
    insert_document(db, collection_name="messages", data=data)
    regUser(userName, userPassword)
    return {"status": "OK"}

@app.route("/userLogin", methods=["POST"])
def userLogin():
    data = request.get_json()
    userName = data['name']
    userPassword = data.get('pass')
    if not verifyUser(userName, userPassword):
        return {"status": "Unauthorized"}, 401
    return {"status": "OK"}

@app.route('/send', methods=['POST'])
def send():
    if request.remote_addr == "192.168.102.111": pass
    if 'file' in request.files:
        file = request.files['file']
        file.save(f'uploads\\{file.filename}')
        data = request.form.get('json')
        print(request.form)
        data = json.loads(data)
        user_id = data['user_id']
        message = data['message']
        userPass = data.get('pass')
        if not verifyUser(user_id, userPass):
            return {"status": "Unauthorized"}, 401

        retDat = send_message(user_id, message, datetime.now().strftime("%H:%M:%S"), 'uploads\\'+file.filename)
        retDat['_id'] = None

        time.sleep(0.5)
        return retDat

    else:
        data = request.get_json()
        user_id = data['user_id']
        print(f"request.remote_addr ({user_id}):", request.remote_addr)
        message = data['message']
        userPass = data.get('pass')
        if not verifyUser(user_id, userPass):
            return {"status": "Unauthorized"}, 401

        retDat = send_message(user_id, message, datetime.now().strftime("%H:%M:%S"))
        retDat['_id'] = None
        time.sleep(0.5)
        return retDat



def refreshMsgs():
    global dictOfMessages
    while True:
        messages = get_all(db, "messages")
        messages_dict = {str(i): {**{k: v for k, v in msg.items() if k != "_id"}} for i, msg in enumerate(messages)}


        messages_dict["id"] = appendID(db, True)
        #get last 100 messages
        messages_dict = dict(islice(messages_dict.items(), len(messages_dict) - 500, None))
        messages_dict.pop('id', None)
        dictOfMessages = json.dumps(messages_dict)
        time.sleep(0.1)


msgRefresh = Thread(target=refreshMsgs)
msgRefresh.daemon = True
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