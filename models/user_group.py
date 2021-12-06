from models.database import db
import datetime


class UserGroup(db.Model):
  __tablename__ = 'user_group'
  user_id = db.Column(db.Integer, db.ForeignKey(
      'user.id'), primary_key=True, nullable=False)
  group_id = db.Column(db.Integer, db.ForeignKey(
      'group.id'), primary_key=True, nullable=False)

  join_date = db.Column(db.DateTime(timezone=True),
                        unique=False,
                        nullable=False,
                        default=datetime.datetime.utcnow)
  is_admin = db.Column(db.Boolean, default=False)

  user = db.relationship(
      'User', back_populates="joined_groups")
  group = db.relationship(
      'Group', back_populates="joined_users")

  @staticmethod
  def create(user_group: "UserGroup", commit: bool = True):
    try:
      db.session.add(user_group)
      if commit:
        db.session.commit()
      return user_group
    except Exception as e:
      print(e)
      return False

  @staticmethod
  def delete(group_user: "UserGroup", commit: bool = True):
    try:
      db.session.delete(group_user)
      if commit:
        db.session.commit()
      return True
    except Exception as e:
      print(e)
      return False

  # criar função de pesquisa usando user id e group id
  @staticmethod
  def find_by_id(user_id: int, group_id: int):
    return UserGroup.query.filter(
        UserGroup.user_id == user_id,
        UserGroup.group_id == group_id).first()
