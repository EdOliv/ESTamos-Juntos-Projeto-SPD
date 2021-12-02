from models.database import ma
from models.user import User
from marshmallow import fields, validates, ValidationError, validate
import re


class UserSchema(ma.SQLAlchemySchema):
  class Meta:
    model = User
    load_instance = True

  id = ma.auto_field(dump_only=True)
  name = ma.auto_field(required=True)
  email = fields.Email(required=True)
  username = ma.auto_field(required=True)
  _password = ma.auto_field(required=True,
                            load_only=True,
                            validate=validate.Length(min=8),
                            data_key="password",
                            attribute="password")
  phone = ma.auto_field(required=False)
  profile_picture_url = ma.auto_field(required=False)

  @validates("_password")
  def validate_password(self, value):
    error = [
        'Password must have: '
        'At least 1 uppercase letter',
        'At least 1 lowercase letter',
        'At least 1 number',
        'At least 1 special symbol',
    ]
    error = '\n'.join(error)

    rules = [
        # must have at least one uppercase
        lambda s: any(x.isupper() for x in s),
        # must have at least one lowercase
        lambda s: any(x.islower() for x in s),
        # must have at least one digit
        lambda s: any(x.isdigit()
                      for x in s),
        # must have at least 1 special symbol
        lambda s: re.search(r'\W', s) is not None,
        # must be at least 8 characters
        lambda s: len(s) >= 8
    ]

    if not all(rule(value) for rule in rules):
      raise ValidationError(error)
