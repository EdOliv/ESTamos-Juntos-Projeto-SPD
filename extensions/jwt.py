from flask import jsonify
from flask_jwt_extended import JWTManager


jwt = JWTManager()


# Using the expired_token_loader decorator, we will now call
# this function whenever an expired but otherwise valid access
# token attempts to access an endpoint
@jwt.expired_token_loader
def my_expired_token_callback(expired_token, jwt_payload):
  return jsonify({
      'status': 401,
      'message': 'Session Expired'
  }), 401


# Create a function that will be called whenever create_access_token
# is used. It will take whatever object is passed into the
# create_access_token method, and lets us define what custom claims
# should be added to the access token.
@jwt.additional_claims_loader
def add_claims_to_access_token(user):
  return {'username': user["username"],
          'name': user["name"],
          'id': user["id"]}


# Create a function that will be called whenever create_access_token
# is used. It will take whatever object is passed into the
# create_access_token method, and lets us define what the identity
# of the access token should be.
@jwt.user_identity_loader
def user_identity_lookup(user):
  return user["id"]


# Invoked callback chamado when an invalid token
# is provided to a protected route
@jwt.invalid_token_loader
def invalid_token_message(error):
  return jsonify(message=error), 422
