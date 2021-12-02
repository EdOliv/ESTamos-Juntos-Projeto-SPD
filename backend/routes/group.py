from flask import Blueprint, jsonify, request
from flask_jwt_extended import (
    jwt_required, get_jwt_identity
)
from marshmallow import ValidationError
from models.group import Group
from models.user import User
from schemas.group_schema import GroupSchema

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


@group.route(f'{ROUTE_PREFIX}/user/<user_id>', methods=['GET'])
@jwt_required()
def find_by_user_id(user_id: int):
  user = User.find_by_id(user_id)
  groups = Group.find_by_user(user)
  groups = group_schema.dump(groups)
  return jsonify(groups=groups), 200


@group.route(f'{ROUTE_PREFIX}/<id>/join_group', methods=['POST'])
@jwt_required()
def join_group(id: int):
  user = User.find_by_id(get_jwt_identity())
  group = Group.find_by_id(id)
  group.group_users.add(user)
  group = group_schema.dump(group, many=False)
  return jsonify(group=group), 200


@group.route(f'{ROUTE_PREFIX}/<id>/remove_from_group', methods=['POST'])
@jwt_required()
def remove_from_group(id: int):
  user = User.find_by_id(get_jwt_identity())
  group = Group.find_by_id(id)
  group.group_users.remove(user)
  group = group_schema.dump(group, many=False)
  return jsonify(group=group), 200


@group.route(f'{ROUTE_PREFIX}/', methods=['POST'])
@jwt_required()
def create():
  try:
    group_data = request.get_json()
    new_group = group_schema.load(
        group_data, many=False)  # type: Group
    Group.create(new_group)
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
