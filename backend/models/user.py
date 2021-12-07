from models.database import db
from sqlalchemy.ext.hybrid import hybrid_property
import bcrypt


class User(db.Model):
  # Creating columns
  id = db.Column(db.Integer, primary_key=True, autoincrement=True)
  name = db.Column(db.String(100), nullable=False)
  email = db.Column(db.String(100), unique=True, nullable=False)

  username = db.Column(db.String(100), unique=True,
                       primary_key=True, nullable=False)
  _password = db.Column("password", db.String(120),
                        unique=False, nullable=False)

  phone = db.Column(db.String(100), nullable=True)
  profile_picture_url = db.Column(db.String(100), nullable=True)

  joined_groups = db.relationship(
      "UserGroup", cascade="all,delete", back_populates="user")

  def __init__(self,
               id=None,
               name=None,
               email=None,
               username=None,
               password=None,
               phone=None,
               profile_picture_url=None):
    self.id = id
    self.name = name
    self.email = email
    self.username = username
    self.password = password
    self.phone = phone
    self.profile_picture_url = profile_picture_url

  def __repr__(self):
    return f'User {self.name}'

  @hybrid_property
  def password(self):
    return self._password.encode('utf-8')

  # Encrypt password
  @password.setter
  def password(self, plain_text: str):
    plain_text = plain_text.encode("utf-8")
    pw_hash = bcrypt.hashpw(plain_text, bcrypt.gensalt())
    pw_hash = pw_hash.decode("utf-8", "ignore")
    self._password = pw_hash

  # CRUD methods
  @staticmethod
  def find_by_id(id: int) -> "User":
    return User.query.filter(User.id == id).first()

  @staticmethod
  def find_by_email(email: str) -> "User":
    return User.query.filter(User.email == email).first()

  @staticmethod
  def find_by_username(username: str) -> "User":
    return User.query.filter(User.username == username).first()

  # CRUD methods
  @staticmethod
  def create(user: "User", commit: bool = True) -> "User":
    try:
      db.session.add(user)
      if commit:
        db.session.commit()
      return user
    except Exception as e:
      print(e)
      return False

  @staticmethod
  def delete(user: "User", commit: bool = True) -> bool:
    try:
      db.session.delete(user)
      if commit:
        db.session.commit()
      return True
    except Exception as e:
      print(e)
      return False

  @staticmethod
  def update(user: "User", name: str, email: str,
             username: str, password: str,
             profile_picture_url: str, phone: str,
             commit: bool = True) -> "User":
    try:
      user.name = name or user.name
      user.email = email or user.email
      user.username = username or user.username
      user.password = password or user.password
      user.phone = phone or user.phone
      user.profile_picture_url = profile_picture_url or user.profile_picture_url

      if commit:
        db.session.commit()
      return user
    except Exception as e:
      print(e)
      return False

  # Compare passwords
  def check_password(self, password: str) -> bool:
    password = password.encode('utf-8')
    return bcrypt.checkpw(password, self.password)
