from flask import Blueprint, jsonify, request
from flask_jwt_extended import (
    jwt_required, get_jwt_identity
)
from marshmallow import ValidationError

from models.database import commit_transaction
from models.group import Group
from models.user import User
from models.user_group import UserGroup

from schemas.group_schema import GroupSchema
from schemas.user_group_schema import UserGroupSchema

from extensions.image_server import cloudinary
import base64

group = Blueprint('group', __name__)
ROUTE_PREFIX = "/group"

group_schema = GroupSchema(many=True)


@group.route(f'{ROUTE_PREFIX}/', methods=['GET'])
@jwt_required()
def index():
  name = request.args.get('name', '')
  groups = Group.find_by_name(name)
  groups = group_schema.dump(groups)
  return jsonify(groups=groups), 200


@group.route(f'{ROUTE_PREFIX}/<id>', methods=['GET'])
@jwt_required()
def find_by_id(id: int):
  group = Group.find_by_id(id)
  group = group_schema.dump(group, many=False)
  return jsonify(group=group), 200


@group.route(f'{ROUTE_PREFIX}/<id>/users', methods=['GET'])
@jwt_required()
def find_group_users(id: int):
  group = Group.find_by_id(id)

  schema = UserGroupSchema(many=True)
  users_group = schema.dump(group.joined_users)
  return jsonify(users_group=users_group), 200


@group.route(f'{ROUTE_PREFIX}/my_groups', methods=['GET'])
@jwt_required()
def find_by_logged_user_id():
  user = User.find_by_id(get_jwt_identity())
  groups = Group.find_by_user(user)
  groups = group_schema.dump(groups)
  return jsonify(groups=groups), 200


@group.route(f'{ROUTE_PREFIX}/<id>/join_group', methods=['POST'])
@jwt_required()
def join_group(id: int):
  user = User.find_by_id(get_jwt_identity())
  group = Group.find_by_id(id)

  user_group = UserGroup()
  user_group.group = group
  user_group.user = user

  user.joined_groups.append(user_group)
  commit_transaction()

  group = group_schema.dump(group, many=False)
  return jsonify(group=group), 200


@group.route(f'{ROUTE_PREFIX}/<id>/remove_from_group/<user_id>', methods=['POST'])
@jwt_required()
def remove_from_group(id: int, user_id: int):
  user = User.find_by_id(user_id)
  group = Group.find_by_id(id)

  for user_group in group.joined_users:
    if user_group.user == user:
      if user_group.is_admin:
        return jsonify(message="Admin cannot be removed from group"), 400
      UserGroup.delete(user_group)
      commit_transaction()

      group = group_schema.dump(group, many=False)
      return jsonify(group=group), 200

  group = group_schema.dump(group, many=False)
  return jsonify(group=group), 200


@group.route(f'{ROUTE_PREFIX}/', methods=['POST'])
@jwt_required()
def create():
  try:
    group_data = request.get_json()
    new_group = group_schema.load(
        group_data, many=False)  # type: Group

    user = User.find_by_id(get_jwt_identity())
    new_group.created_by = user

    user_group = UserGroup()
    user_group.group = new_group
    user_group.user = user
    user_group.is_admin = True

    res = Group.create(new_group)

    if not res:
      return jsonify({"message": "An error occurred while creating group"}), 400

    image = group_data['image']
    if image:
      with open('temp_image.png', "wb") as file:
        file.write(base64.decodebytes(group_data['image'].encode()))

      images_response = cloudinary.uploader.upload("temp_image.png",
                                                   folder="estamos_juntos/groups/",
                                                   public_id=new_group.id,
                                                   overwrite=True,
                                                   resource_type="image")
      image_url = images_response['url']
      Group.update(new_group, image_url=image_url)

    new_group = group_schema.dump(new_group, many=False)
    return jsonify(group=new_group), 200
  except Exception as e:
    print(e)
    return jsonify(message="An error occurred"), 400


@group.route(f'{ROUTE_PREFIX}/update', methods=['PUT'])
@jwt_required()
def update():
  try:
    group_data = request.get_json()

    schema = GroupSchema()
    new_group = schema.load(
        group_data, many=False)  # type: Group
    new_group.id = group_data['id']

    old_group = Group.find_by_id(new_group.id)

    if not Group.update(old_group,
                        name=new_group.name,
                        picture_url=new_group.picture_url,
                        description=new_group.description,
                        start_lat=new_group.start_lat,
                        start_lng=new_group.start_lng,
                        start_name=new_group.start_name,
                        destination_lat=new_group.destination_lat,
                        destination_lng=new_group.destination_lng,
                        destination_name=new_group.destination_name,
                        is_visible=new_group.is_visible,
                        is_open=new_group.is_open,
                        group_type=new_group.group_type
                        ):

      return jsonify(message="An error occurred while updating group"), 400

    image = group_data['image']
    if image:
      with open('temp_image.png', "wb") as file:
        file.write(base64.decodebytes(group_data['image'].encode()))

      images_response = cloudinary.uploader.upload("temp_image.png",
                                                   folder="estamos_juntos/groups/",
                                                   public_id=new_group.id,
                                                   overwrite=True,
                                                   resource_type="image")
      image_url = images_response['url']
      Group.update(new_group, image_url=image_url)

    group = schema.dump(old_group, many=False)
    return jsonify(group=group), 200
  except ValidationError as e:
    print(e)
    key = list(e.messages.keys())[0]
    message = f"'{key}': {e.messages[key][0]}"
    return jsonify(message=message), 400
  except Exception as e:
    print(e)
    return jsonify(message="An error occurred"), 400


@group.route(f'{ROUTE_PREFIX}/<id>', methods=['DELETE'])
@jwt_required()
def delete(id: int):
  try:
    group = Group.find_by_id(id)
    if not Group.delete(group):
      return jsonify(
          message="An error occurred while deleting the group"
      ), 400
    return jsonify(group=id), 200
  except Exception as e:
    print(e)
    return jsonify(message="An error occurred while deleting the group"), 400
