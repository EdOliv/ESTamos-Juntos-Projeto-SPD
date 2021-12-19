from flask import Blueprint, jsonify, request
from flask_jwt_extended import (
    jwt_required, get_jwt_identity
)
from twilio.jwt.access_token import AccessToken
from twilio.jwt.access_token.grants import ChatGrant

import os

chat = Blueprint('chat', __name__)
ROUTE_PREFIX = "/chat"


@chat.route(f'{ROUTE_PREFIX}/token/<identity>', methods=['GET'])
def generate_chat_token(identity):
  token = AccessToken(
      os.environ['TWILIO_ACCOUNT_SID'],
      os.environ['TWILIO_API_KEY'],
      os.environ['TWILIO_API_SECRET'],
  )

  token.identity = identity
  token.add_grant(
      ChatGrant(
          service_sid=os.environ['TWILIO_CHAT_SERVICE_SID'],
      ),
  )

  return jsonify(identity=token.identity, token=token.to_jwt()), 200
