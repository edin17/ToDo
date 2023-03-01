from config import app,db
from flask import request,flash,json
from werkzeug.security import generate_password_hash, check_password_hash
from models import *
import jwt
from datetime import datetime, timedelta
from functools import wraps



def token_required(func):
    @wraps(func)
    def decorated(*args, **kwargs):
        token = request.headers.get("token")
        if not token:
            return {"auth":False,"message":"Token not exists"}
        try:
            decoded=jwt.decode(token, app.config["SECRET_KEY"],algorithms=["HS256"])
        except:
            return {"auth":False, "message":"Invalid token"}
        return func(decoded)
    return decorated

#AUTH VIEW


@app.post("/register")
def register():
    form_data = request.get_json()
    password_hash = generate_password_hash(form_data["password"], method="sha256")
    new_user = User(username=form_data["username"], password=password_hash)
    try:
        db.session.add(new_user)
        db.session.commit()
    except:
        return {"error" : True,"error_desc" : "Database error"}

    return {"error":False,"redirect_path":"/login"}

@app.post("/login")
def login():
    user_data = request.get_json()
    db_user = User.query.filter_by(username = user_data["username"]).scalar()
    if db_user != None:
        if check_password_hash(db_user.password, user_data["password"]):
            token = jwt.encode({
                "user":db_user.id,
                "expiration":json.dumps(datetime.utcnow() + timedelta(seconds=120))
            },app.config["SECRET_KEY"])
            return {"loged_in":True,"token":token}
        else:
            return{
                "error":"Username or password is not valid",
                "loged_in":False
            }
    else:
        return{
            "error":"Username or password is not valid",
            "loged_in":False
        }

#TASKS VIEW

@app.get("/")
def proba():
    tasks=Task.query.all()
    print(tasks)
    return "haha"

@app.post("/tasks/add")
@token_required
def add(decoded):
    task_data = request.get_json()
    try:
        new_task = Task(
            description=task_data["description"],
            important=task_data["important"],
            user_id=decoded["user"]
        )
        db.session.add(new_task)
        db.session.commit()
    except:
        return "Server error (DB)"
    return {
        "imported":True
    }

@app.get("/tasks")
@token_required
def get_tasks(decoded):
    id=decoded["user"]
    tasks = Task.query.filter_by(user_id=id).all()
    task_schema = TaskSchema(many=True)
    output = task_schema.dump(tasks)
    return {"tasks":output}

@app.get("/tasks/delete/<int:task_id>")
@token_required
def delete_task(decoded):
    task_id = int(request.url.split("/")[5])
    task = Task.query.filter_by(id=task_id).scalar()
    if task != None:
        if task.user.id == decoded["user"]:
            db.session.delete(task)
            db.session.commit()
            return {"deleted":True}
        else:
            return {"deleted":False, "error":"You are not authorized to delete this task"}
    else:
        return {"deleted":False,"error":"This item is already deleted"}

@app.post("/tasks/update/<int:task_id>")
@token_required
def update_task(decoded):
    task_id = int(request.url.split("/")[5])
    print(task_id)
    updated_task = request.get_json()
    print(updated_task)
    task = Task.query.filter_by(id=task_id).scalar()
    if task != None:
        if task.user.id == decoded["user"]:
            task.description = updated_task["description"]
            task.important = updated_task["important"]
            db.session.commit()
        else:
            return {"updated":False,"error":"You are not authorized to update this task"}
        return {"updated":True,}
    else:
        return {
            "updated":False,
            "error":"That task not exists"
        }

with app.app_context():
    db.create_all()