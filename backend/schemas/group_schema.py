from models.database import ma
from models.group import Group


class GroupSchema(ma.SQLAlchemySchema):
  class Meta:
    model = Group
    load_instance = True

  id = ma.auto_field(dump_only=True)
  name = ma.auto_field(required=True)
  picture_url = ma.auto_field(required=False)
  description = ma.auto_field(required=False)
  start_lat = ma.auto_field(required=True)
  start_lng = ma.auto_field(required=True)
  start_name = ma.auto_field(required=True)
  destination_lat = ma.auto_field(required=True)
  destination_lng = ma.auto_field(required=True)
  is_visible = ma.auto_field(required=True)
  is_open = ma.auto_field(required=False)
  group_type = ma.auto_field(required=True)
  created_by_id = ma.auto_field(readonly=True)
  created_by = ma.auto_field(readonly=True)
  created_on = ma.auto_field(readonly=True)
