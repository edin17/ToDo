from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_marshmallow import Marshmallow

app = Flask(__name__)

db = SQLAlchemy()
migrate = Migrate(app, db)
app.secret_key = "kodwqdš023id0239odwedo"
app.config["SECRET_KEY"] = "asmdopew8r8239hfiohfhewihf82hirjfi"
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///project.db"
db.init_app(app)
ma = Marshmallow(app)


