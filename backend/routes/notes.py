from flask import Blueprint, request, jsonify
from extensions import db
from models import Note
from utils.auth import token_required

bp = Blueprint("notes", __name__)

@bp.route("/notes", methods=["GET"])
@token_required
def get_notes(current_user):
    notes = Note.query.filter_by(user_id=current_user.id).order_by(Note.updated_at.desc()).all()
    return jsonify([note.to_dict_summary() for note in notes])

@bp.route("/notes", methods=["POST"])
@token_required
def create_note(current_user):
    new_note = Note(
        user_id=current_user.id,
        content='{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
    )
    db.session.add(new_note)
    db.session.commit()
    return jsonify(new_note.to_dict_full()), 201

@bp.route("/notes/<int:note_id>", methods=["GET"])
@token_required
def get_note_detail(current_user, note_id):
    note = Note.query.filter_by(id=note_id, user_id=current_user.id).first_or_404()
    return jsonify(note.to_dict_full())

@bp.route("/notes/<int:note_id>", methods=["PUT"])
@token_required
def update_note(current_user, note_id):
    note = Note.query.filter_by(id=note_id, user_id=current_user.id).first_or_404()
    data = request.get_json()
    note.title = data.get("title", note.title)
    note.content = data.get("content", note.content)
    db.session.commit()
    return jsonify(note.to_dict_summary())

@bp.route("/notes/<int:note_id>", methods=["DELETE"])
@token_required
def delete_note(current_user, note_id):
    note = Note.query.filter_by(id=note_id, user_id=current_user.id).first_or_404()
    db.session.delete(note)
    db.session.commit()
    return jsonify({"message": "Note deleted successfully"})
