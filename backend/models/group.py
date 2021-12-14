from typing import List
from models.database import db
from models.user import User
from sqlalchemy import or_
from sqlalchemy.ext.hybrid import hybrid_property
import datetime


class Group(db.Model):
  # Creating columns
  id = db.Column(db.Integer, primary_key=True, autoincrement=True)
  name = db.Column(db.String(128), unique=False, nullable=False)

  picture_url = db.Column(db.String(128), nullable=True)
  description = db.Column(db.String(256), nullable=True)

  start_lat = db.Column(db.Float(), nullable=True)
  start_lng = db.Column(db.Float(), nullable=True)
  start_name = db.Column(db.String(128), nullable=False)

  destination_lat = db.Column(db.Float(), nullable=True)
  destination_lng = db.Column(db.Float(), nullable=True)
  destination_name = db.Column(db.String(128), nullable=False)

  is_visible = db.Column(db.Boolean, default=True)
  is_open = db.Column(db.Boolean, default=True)

  group_type = db.Column(db.String(64), nullable=True)

  meeting_time = db.Column(db.Time(timezone=True), nullable=False,
                           default=datetime.time())

  created_by_id = db.Column(db.Integer, db.ForeignKey(User.id), nullable=False)
  created_by = db.relationship(
      "User", backref=db.backref("owned_groups", uselist=True), foreign_keys=[created_by_id])
  created_on = db.Column(db.DateTime(timezone=True),
                         unique=False,
                         nullable=False,
                         default=datetime.datetime.utcnow)

  joined_users = db.relationship(
      "UserGroup", cascade="all,delete", back_populates="group")

  def __repr__(self):
    return f'Group {self.name}'

  @hybrid_property
  def users_count(self):
    return len(self.joined_users)

  # CRUD methods
  @staticmethod
  def find_by_id(id: int) -> "Group":
    return Group.query.filter(Group.id == id).first()

  @staticmethod
  def find_by_name(name: str) -> List["Group"]:
    name = f'%{name}%'
    return Group.query.filter(
        Group.name.like(name)
    ).all()

  @staticmethod
  def find_by_user(user: User) -> List["Group"]:
    return Group.query.filter(or_(Group.joined_users.any(user=user), Group.created_by == user)).all()

  # CRUD methods
  @staticmethod
  def create(group: "Group", commit: bool = True) -> "Group":
    try:
      db.session.add(group)
      if commit:
        db.session.commit()
      return group
    except Exception as e:
      print(e)
      return False

  @staticmethod
  def delete(group: "Group", commit: bool = True) -> bool:
    try:
      db.session.delete(group)
      if commit:
        db.session.commit()
      return True
    except Exception as e:
      print(e)
      return False

  @staticmethod
  def update(group: "Group", name: str,
             picture_url: str = None, description: str = None,
             start_lat: float = None, start_lng: float = None, start_name: str = None,
             destination_lat: float = None, destination_lng: float = None, destination_name: str = None,
             is_visible: bool = None, is_open: bool = None,
             group_type: str = None,
             commit: bool = True) -> "Group":
    try:
      group.name = name or group.name
      group.picture_url = picture_url or group.picture_url
      group.description = description or group.description
      group.start_lat = start_lat or group.start_lat
      group.start_lng = start_lng or group.start_lng
      group.start_name = start_name or group.start_name
      group.destination_lat = destination_lat or group.destination_lat
      group.destination_lng = destination_lng or group.destination_lng
      group.destination_name = destination_name or group.destination_name
      group.is_visible = is_visible or group.is_visible
      group.is_open = is_open or group.is_open
      group.group_type = group_type or group.group_type

      if commit:
        db.session.commit()
      return group
    except Exception as e:
      print(e)
      return False
