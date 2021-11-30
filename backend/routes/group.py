from flask import Blueprint, jsonify, request
from flask_jwt_extended import (
    jwt_required, get_jwt_identity
)
from marshmallow import ValidationError
from models.group import Group
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
    old_group = Group.find_by_id(get_jwt_identity())

    schema = GroupSchema()
    new_group = schema.load(
        group_data, many=False)  # type: Group

    if not Group.update(old_group,
                        name=new_group.name,
                        email=new_group.email,
                        phone=new_group.phone
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
