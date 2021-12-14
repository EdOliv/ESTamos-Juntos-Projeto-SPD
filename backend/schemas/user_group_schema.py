from models.database import ma
from models.user_group import UserGroup

from marshmallow import fields


class UserGroupSchema(ma.SQLAlchemySchema):
  class Meta:
    model = UserGroup
    load_instance = True

  user_id = ma.auto_field(dump_only=True)
  group_id = ma.auto_field(dump_only=True)
  join_date = ma.auto_field(dump_only=True)
  is_admin = ma.auto_field(required=True)
  group = ma.auto_field(required=True)
  user = fields.Nested('UserSchema')
