from datetime import time
from flask import *
from flask_cors import CORS
from dbs import *

app = Flask(__name__, template_folder="web", static_folder='web/static',)
CORS(app)


@app.route('/', methods=['GET'])
def main():
    #return index.html
    return render_template('index.html')

@app.route('/reg', methods=['GET'])
def reg():
    #return index.html
    return render_template('registration.html')



@app.route('/isRegistered', methods=['POST'])
def isUserExists():
    data = request.get_json()
    user_id = data['userName']
    return isRegistered(user_id)

@app.route('/send', methods=['POST'])
def send():
    data = request.get_json()
    user_id = data['user_id']
    message = data['message']
    #timestamp in format YY:MM:SS
    timestamp = time.strftime("%H:%M:%S")

    send_message(user_id, message, timestamp,)
    return {"status": "OK"}

@app.route('/getMessages', methods=['GET'])
def getMessages():
    return get_all(db, "messages")

@app.route('/ping', methods=['GET', 'POST'])
def ping():
    return "OK", 200

app.run(debug=True, port=8970)
