from flask import Blueprint, jsonify, request
from flask_jwt_extended import (
    jwt_required, get_jwt_identity
)
from marshmallow import ValidationError
from models.user import User
from schemas.user_schema import UserSchema

from extensions.image_server import cloudinary
import base64

user = Blueprint('user', __name__)
ROUTE_PREFIX = "/user"

user_schema = UserSchema(many=False)


@user.route(f'{ROUTE_PREFIX}/account', methods=['GET'])
@jwt_required()
def get_user_account_data():
  user_id = get_jwt_identity()

  user = User.find_by_id(user_id)
  user = user_schema.dump(user)
  return jsonify(user_data=user), 200


@user.route(f'{ROUTE_PREFIX}/update', methods=['PUT'])
@jwt_required()
def update():
  try:
    user_data = request.get_json()
    old_user = User.find_by_id(get_jwt_identity())

    schema = UserSchema()
    new_user = schema.load(
        user_data, many=False)  # type: User

    duplicate_user = User.find_by_email(new_user.email)

    if duplicate_user and duplicate_user.id != old_user.id:
      message = f"Email {new_user.email} already registered"
      return jsonify(message=message), 400

    if not User.update(old_user,
                       name=new_user.name,
                       email=new_user.email,
                       phone=new_user.phone
                       ):

      return jsonify(message="An error occurred while updating user"), 400

    image = user_data['image']
    if image:
      with open('temp_image.png', "wb") as file:
        file.write(base64.decodebytes(user_data['image'].encode()))

      images_response = cloudinary.uploader.upload("temp_image.png",
                                                   folder="estamos_juntos/groups/",
                                                   public_id=user_data.id,
                                                   overwrite=True,
                                                   resource_type="image")
      image_url = images_response['url']
      User.update(old_user, profile_picture_url=image_url)
    user = schema.dump(new_user, many=False)
    return jsonify(user=user), 200
  except ValidationError as e:
    print(e)
    key = list(e.messages.keys())[0]
    message = f"'{key}': {e.messages[key][0]}"
    return jsonify(message=message), 400
  except Exception as e:
    print(e)
    return jsonify(message="An error occurred"), 400


@user.route(f'{ROUTE_PREFIX}/update_credentials', methods=['PUT'])
@jwt_required()
def update_credentials():
  try:
    user_data = request.get_json()
    user_id = get_jwt_identity()
    user = User.find_by_id(user_id)

    duplicate_username = User.find_by_username(user_data['username'])
    if duplicate_username and duplicate_username.id != user.id:
      message = f"Username {user_data['username']} already registered"
      return jsonify(message=message), 400

    if (user.check_password(user_data['password'])):
      if not user.update(user=user,
                         username=user_data['username'],
                         password=user_data['newPassword']):
        message = "Old password is incorrect"
        return jsonify(message=message), 400
      return jsonify(message="Success"), 200
    else:
      return jsonify(message="the old password is not valid"), 400

  except ValidationError as e:
    print("e: ", e)
    key = list(e.messages.keys())[0]
    message = f"'{key}': {e.messages[key][0]}"
    return jsonify(message=message), 400
  except Exception:
    return jsonify(message="An error occurred while updating your data"), 400

  user_id = get_jwt_identity()
  user = User.find_by_id(user_id)
  integrations = AuthenticationProvider.find_by_user(user)

  schema = AuthenticationProviderSchema(many=True, exclude=["provider_key"])
  integrations = schema.dump(integrations)
  return jsonify(integrations=integrations), 200
  request_data = request.get_json()
  id_token = request_data["token"]
  provider_name = request_data["provider_name"]

  account_info = get_oauth_token_data(id_token, provider_name)
  if not account_info:
    return jsonify(message="Invalid token", found=False), 400

  provider_type = AuthenticationProviderType.find_by_provider_name(
      provider_name)
  external_account = AuthenticationProvider.find_by_provider_key_and_type(
      account_info["sub"], provider_type)

  if not external_account:
    return jsonify(message="User not found", found=False), 200

  return jsonify(message="User exists", found=True), 200
