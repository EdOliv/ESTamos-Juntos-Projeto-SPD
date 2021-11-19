from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

db = SQLAlchemy()
ma = Marshmallow()


def commit_transaction():
  db.session.commit()


def rollback_transaction():
  db.session.rollback()
