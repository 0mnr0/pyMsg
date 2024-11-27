from itertools import islice
import time
from threading import Thread
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address


from flask import *
from flask_cors import CORS
from dbs import *
from queue import *


event_queue = Queue()
app = Flask(__name__, template_folder="web", static_folder='web/static',)
CORS(app)

PeoplesOnline = []
dictOfMessages = {}
deleted_messages = []

limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["200 per minute"]  # Ограничение по умолчанию: 10 запросов в минуту
)

@app.route('/uploads/<filename>', methods=['GET'])
def returnFile(filename):
    file_path = os.path.join('uploads', filename)
    if os.path.exists(file_path):
        return send_from_directory('uploads', filename)
    else:
        return "Файл не найден", 404

@limiter.limit("20 per minute")
@app.route('/')
def index():
    if request.remote_addr == "192.168.102.111":
        pass
    return render_template('index.html')


@limiter.limit("5 per minute")
@app.route('/reg', methods=['GET'])
def reg():
    #return index.html
    return render_template('registration.html')

@limiter.limit("120 per minute")
@app.route('/userList', methods=['GET'])
def userList():
    users = listUsers()
    finalUsers={}
    i = 0
    for user in users:
        finalUsers[i] = user["user_id"]
        i+=1
    return finalUsers


@limiter.limit("400 per minute")
@app.route('/isRegistered', methods=['POST'])
def isUserExists():
    data = request.get_json()
    user_id = data['name']
    return {'isRegistered': isRegistered(user_id), 'name': user_id}


@app.route("/userRegister", methods=["POST"])
@limiter.limit("5 per minute")
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


@limiter.limit("15 per minute")
@app.route("/userLogin", methods=["POST"])
def userLogin():
    data = request.get_json()
    userName = data['name']
    userPassword = data.get('pass')
    if not verifyUser(userName, userPassword):
        return {"status": "Unauthorized"}, 401
    return {"status": "OK"}

@app.route('/send', methods=['POST'])
@limiter.limit("200 per minute")
def send():
    if request.remote_addr == "192.168.102.111": pass
    if 'file' in request.files:
        file = request.files['file']
        file.save(f'uploads\\{file.filename}')
        data = request.form.get('json')
        print(request.form)
        data = json.loads(data)
        user_id = data['user_id']
        message = str(data['message'])
        userPass = data.get('pass')
        if not verifyUser(user_id, userPass):
            return {"status": "Unauthorized"}, 401

        retDat = send_message(user_id, message, datetime.now().strftime("%H:%M:%S"), 'uploads\\'+file.filename, data.get('isAi'))
        retDat['_id'] = None
        return retDat

    else:
        data = request.get_json()
        user_id = data['user_id']
        print(f"request.remote_addr ({user_id}):", request.remote_addr)
        message = data['message']
        userPass = data.get('pass')
        if not verifyUser(user_id, userPass):
            return {"status": "Unauthorized"}, 401

        retDat = send_message(user_id, message, datetime.now().strftime("%H:%M:%S"), None, data.get('isAi'))
        retDat['_id'] = None
        return retDat


def refreshMsgs():
    global dictOfMessages
    while True:
        messages_dict = get_all(db, "messages")
        dictOfMessages = json.dumps(messages_dict)
        time.sleep(0.1)


msgRefresh = Thread(target=refreshMsgs)
msgRefresh.daemon = True
msgRefresh.start()



@limiter.limit("400 per minute")
@app.route('/removeMessage', methods=['POST'])
def removeMessage():
    data = request.get_json()
    id = data['msgId']
    removemessage(id)
    return {'status': "OK"}

@limiter.limit("120 per minute")
@app.route('/getMessages', methods=['GET'])
def getMessages():
    return dictOfMessages


app.run(port=8970, host="0.0.0.0", debug=True)
#app.run(port=898, host="0.0.0.0", debug=True)