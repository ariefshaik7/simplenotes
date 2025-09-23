from flask import Blueprint, request, jsonify
from extensions import db
from models import User, Note
import jwt
from datetime import datetime, timedelta, timezone
from flask import current_app

bp = Blueprint("auth", __name__)

@bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    if User.query.filter_by(username=data["username"]).first():
        return jsonify({"message": "Username already exists"}), 409

    new_user = User(username=data["username"])
    new_user.set_password(data["password"])
    db.session.add(new_user)

    welcome_note = Note(
        title="Welcome to simplenotes!",
        content='{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"This is your first note. Click Edit to start writing!","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}',
        user=new_user,
    )
    db.session.add(welcome_note)
    db.session.commit()

    return jsonify({"message": "New user created!"}), 201

@bp.route("/login", methods=["POST"])
def login():
    auth = request.get_json()
    user = User.query.filter_by(username=auth["username"]).first()
    if not user or not user.check_password(auth["password"]):
        return jsonify({"message": "Invalid credentials"}), 401

    token = jwt.encode(
        {"user_id": user.id, "exp": datetime.now(timezone.utc) + timedelta(hours=24)},
        current_app.config["SECRET_KEY"],
        algorithm="HS256",
    )
    return jsonify({"token": token})
