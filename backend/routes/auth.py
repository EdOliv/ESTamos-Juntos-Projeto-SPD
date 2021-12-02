from flask import Blueprint, jsonify, request, render_template
from flask_jwt_extended import (
    create_access_token, create_refresh_token,
    jwt_required, get_jwt_identity, get_jwt
)
from flask_mail import Message
from marshmallow import ValidationError, EXCLUDE
from models.database import rollback_transaction
from models.user import User
from schemas.user_schema import UserSchema

import os
import datetime

from extensions.mail import mail

auth = Blueprint('auth', __name__)
ROUTE_PREFIX = "/auth"

user_schema = UserSchema()


@auth.route(f'{ROUTE_PREFIX}/login', methods=['POST'])
def login():
  request_data = request.get_json()
  user_data = request_data["user"]

  user = User.find_by_username(user_data["login"])
  if not user:
    response = {
        "message": "Incorrect login or password"
    }

    return jsonify(response), 400

  is_password_correct = user.check_password(user_data["password"])

  if not is_password_correct:
    response = {
        "message": "Incorrect login or password"
    }

    return jsonify(response), 400

  user = user_schema.dump(user)

  identity = {'login': user["username"],
              'name': user["name"],
              'id': user["id"]}
  access_token = create_access_token(identity=identity)
  response = {
      'access_token': access_token,
      'refresh_token': create_refresh_token(
          identity=identity, additional_claims={
              'user': user["username"],
              'name': user["name"]
          }
      )
  }
  return jsonify(response), 200


@auth.route(f'{ROUTE_PREFIX}/sign_up', methods=['POST'])
def sign_up():
  try:
    request_data = request.get_json()

    user_data = request_data["user"]
    user = user_schema.load(user_data, unknown=EXCLUDE)  # type: "User"

    duplicate_user = User.find_by_email(user.email)
    if duplicate_user:
      message = f"Email {user.email} already registered"
      return jsonify(message=message), 400

    duplicate_user = User.find_by_username(user.username)
    if duplicate_user:
      message = f"Username {user.username} already registered"
      return jsonify(message=message), 400

    res = User.create(user)

    if not res:
      return jsonify({"message": "An error occurred while signing up"}), 400

    user = user_schema.dump(user)

    identity = {'username': user["username"],
                'name': user["name"],
                'id': user["id"]}
    access_token = create_access_token(identity=identity)
    response = {
        'access_token': access_token,
        'refresh_token': create_refresh_token(
            identity=identity,
            additional_claims={
                'username': user["username"],
                'name': user["name"]
            }
        )
    }
    return jsonify(response), 200
  except ValidationError as e:
    key = list(e.messages.keys())[0]
    message = f"'{key}': {e.messages[key][0]}"
    return jsonify(message=message), 400
  except Exception as e:
    rollback_transaction()
    print(e)
    return jsonify(message="An error occurred while signing up"), 400


@auth.route(f'{ROUTE_PREFIX}/send_password_reset_email', methods=['POST'])
def send_password_reset_email():
  try:
    address = os.environ['CLIENT_ADDRESS']
    password_reset_path = os.environ['CLIENT_PASSWORD_RESET_PATH']
    client_address = f"{address}/{password_reset_path}"
    request_data = request.get_json()
    email = request_data["email"]

    user = User.find_by_email(email)
    if not user:
      return jsonify({"message": "There was an error sending the email"}), 400

    user = user_schema.dump(user)

    identity = {'username': user["username"],
                'name': user["name"], 'id': user["id"]}
    expires_in = datetime.timedelta(minutes=10)
    token = create_access_token(
        identity=identity,
        expires_delta=expires_in,
        additional_claims={"type": "password"}
    )

    link = f'{client_address}?token={token}'

    msg = Message("ESTamos Juntos - Reset Password",
                  recipients=[email])
    msg.html = render_template("reset_password.txt", email=email, link=link)
    msg.html = render_template("reset_password.html", email=email, link=link)
    mail.send(msg)

    return jsonify({"message": "Check your inbox!"}), 200
  except Exception as e:
    print(e)
    return jsonify({"message": "There was an error sending the email"}), 400


@auth.route(f'{ROUTE_PREFIX}/reset_password', methods=['POST'])
@jwt_required()
def reset_password():
  try:
    claims = get_jwt()
    request_data = request.get_json()
    password = request_data['password']

    user_schema = UserSchema()
    user_schema.load({"password": password}, partial=True)

    if not password or not claims["type"] == "password":
      return jsonify(message="Invalid request"), 400

    user_id = get_jwt_identity()
    user = User.find_by_id(user_id)

    success = User.update(user, password=password)
    if not success:
      return jsonify(message="Error while updating password"), 400
    return jsonify(message="Password reset successfully!"), 200
  except ValidationError as e:
    key = list(e.messages.keys())[0]
    message = f"'{key}': {e.messages[key][0]}"
    return jsonify(message=message), 400
  except Exception:
    return jsonify(message="Invalid request"), 400
