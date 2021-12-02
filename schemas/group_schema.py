from marshmallow import fields, EXCLUDE
from models.database import ma
from models.group import Group


class GroupSchema(ma.SQLAlchemySchema):
  class Meta:
    model = Group
    load_instance = True
    unknown = EXCLUDE

  id = ma.auto_field(dump_only=True)
  name = ma.auto_field(required=True)
  picture_url = ma.auto_field(required=False)
  description = ma.auto_field(required=False)
  start_lat = ma.auto_field(requsired=False)
  start_lng = ma.auto_field(required=False)
  start_name = ma.auto_field(required=True)
  destination_lat = ma.auto_field(required=False)
  destination_lng = ma.auto_field(required=False)
  destination_name = ma.auto_field(required=False)
  meeting_time = ma.auto_field(required=False)
  is_visible = ma.auto_field(required=False)
  is_open = ma.auto_field(required=False)
  group_type = ma.auto_field(required=True)
  created_by_id = ma.auto_field(dump_only=True)
  created_by = fields.Nested('UserSchema')
  created_on = ma.auto_field(readonly=True)
