from config import *
import sqlalchemy as sa
from datetime import datetime

class User(db.Model):
    id = sa.Column(sa.Integer, primary_key=True, autoincrement=True)
    username = sa.Column(sa.String(30), unique=True, nullable=False )
    password = sa.Column(sa.String(150), nullable=False)
    tasks = db.relationship("Task", backref="user", lazy=True)

class Task(db.Model):
    id = sa.Column(sa.Integer, primary_key=True, autoincrement=True)
    description = sa.Column(sa.Text, nullable=False)
    date = sa.Column(sa.DateTime, default=datetime.utcnow())
    important = sa.Column(sa.Boolean, default=False)
    user_id = sa.Column(sa.Integer, sa.ForeignKey("user.id"), nullable=False)


class TaskSchema(ma.Schema):
    class Meta:
        fields = ("id","description","date","important")