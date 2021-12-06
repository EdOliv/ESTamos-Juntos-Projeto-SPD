from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

from routes.auth import auth
from routes.refresh import refresh
from routes.user import user
from routes.group import group

from extensions.jwt import jwt
from extensions.mail import mail
from models.database import db, ma
import os
import json
import datetime

load_dotenv()

app = Flask(__name__)

# Get current path
path = os.getcwd()
# file Upload
UPLOAD_FOLDER = os.path.join(path, 'uploads')

# Make directory if uploads is not exists
if not os.path.isdir(UPLOAD_FOLDER):
  os.mkdir(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024 * 2048
# JWT Config
app.config["JWT_SECRET_KEY"] = os.environ["JWT_SECRET_KEY"]
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = datetime.timedelta(minutes=60)
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = datetime.timedelta(days=60)
# Database Config
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ["SQLALCHEMY_DATABASE_URI"]

# Mail Config
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USE_SSL'] = True
app.config['MAIL_DEFAULT_SENDER'] = os.environ["MAIL_DEFAULT_SENDER"]
app.config['MAIL_USERNAME'] = os.environ["MAIL_USERNAME"]
app.config['MAIL_PASSWORD'] = os.environ["MAIL_PASSWORD"]
app.config['MAIL_USE_TLS'] = False

CORS(app, resources={
    r"/*": {"origins": ["*"]}
})
jwt.init_app(app)
db.init_app(app)
ma.init_app(app)
mail.init_app(app)

with app.app_context():
  # db.drop_all()
  db.create_all()

app.register_blueprint(auth)
app.register_blueprint(refresh)
app.register_blueprint(user)
app.register_blueprint(group)


# Invoked callback to set response code in all responses
@app.after_request
def after_request(response):
  if (response.get_json()):
    new_response = json.loads(response.get_data())
    print(new_response)
    new_response['status'] = response.status_code
    if response.status_code == 200:
      new_response['message'] = "Success"
    response.set_data(json.dumps(new_response))
  return response


@app.route('/')
def hello_world():
  return jsonify(msg="Hello World!"), 200
