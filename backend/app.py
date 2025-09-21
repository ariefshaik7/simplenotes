import os
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_bcrypt import Bcrypt
import jwt
from datetime import datetime, timedelta, timezone # Correct import
from functools import wraps

# --- Initialization ---
app = Flask(__name__)
CORS(app)
bcrypt = Bcrypt(app)

# --- Configuration ---
app.config['SECRET_KEY'] = 'a-very-secure-secret-key-that-you-must-change' # !! CHANGE THIS !!
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:password@localhost/simplenotes' # !! UPDATE THIS !!
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# --- Database Models ---
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    notes = db.relationship('Note', backref='user', lazy=True, cascade="all, delete-orphan")

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

class Note(db.Model):
    __tablename__ = 'notes'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False, default='Untitled Note')
    content = db.Column(db.Text, nullable=False, default='')
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict_summary(self):
        return {'id': self.id, 'title': self.title, 'updated_at': self.updated_at.isoformat()}
        
    def to_dict_full(self):
        return {'id': self.id, 'title': self.title, 'content': self.content, 'updated_at': self.updated_at.isoformat()}

# --- Auth Decorator ---
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('x-access-token')
        if not token: return jsonify({'message': 'Token is missing!'}), 401
        try:
            # CORRECT ALGORITHM: HS256
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = User.query.get(data['user_id'])
        except Exception as e:
            return jsonify({'message': 'Token is invalid!', 'error': str(e)}), 401
        return f(current_user, *args, **kwargs)
    return decorated

# --- Auth Routes ---
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'message': 'Username already exists'}), 409
    new_user = User(username=data['username'])
    new_user.set_password(data['password'])
    db.session.add(new_user)
    welcome_note = Note(title="Welcome to simplenotes!", content='{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"This is your first note. Click Edit to start writing!","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}', user=new_user)
    db.session.add(welcome_note)
    db.session.commit()
    return jsonify({'message': 'New user created!'}), 201

@app.route('/api/login', methods=['POST'])
def login():
    auth = request.get_json()
    user = User.query.filter_by(username=auth['username']).first()
    if not user or not user.check_password(auth['password']):
        return jsonify({'message': 'Invalid credentials'}), 401
    
    token = jwt.encode({
        'user_id': user.id,
        # CORRECT DATETIME USAGE
        'exp': datetime.now(timezone.utc) + timedelta(hours=24) 
    }, app.config['SECRET_KEY'], 
    # CORRECT ALGORITHM: HS256
    algorithm="HS256")
    
    return jsonify({'token': token})

# --- Note Routes ---
@app.route('/api/notes', methods=['GET'])
@token_required
def get_notes(current_user):
    notes = Note.query.filter_by(user_id=current_user.id).order_by(Note.updated_at.desc()).all()
    return jsonify([note.to_dict_summary() for note in notes])

@app.route('/api/notes', methods=['POST'])
@token_required
def create_note(current_user):
    new_note = Note(user_id=current_user.id, content='{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}')
    db.session.add(new_note)
    db.session.commit()
    note_full = Note.query.get(new_note.id) # Re-fetch to get all defaults
    return jsonify(note_full.to_dict_full()), 201
    
@app.route('/api/notes/<int:note_id>', methods=['GET'])
@token_required
def get_note_detail(current_user, note_id):
    note = Note.query.filter_by(id=note_id, user_id=current_user.id).first_or_404()
    return jsonify(note.to_dict_full())

@app.route('/api/notes/<int:note_id>', methods=['PUT'])
@token_required
def update_note(current_user, note_id):
    note = Note.query.filter_by(id=note_id, user_id=current_user.id).first_or_404()
    data = request.get_json()
    note.title = data.get('title', note.title)
    note.content = data.get('content', note.content)
    db.session.commit()
    return jsonify(note.to_dict_summary())

@app.route('/api/notes/<int:note_id>', methods=['DELETE'])
@token_required
def delete_note(current_user, note_id):
    note = Note.query.filter_by(id=note_id, user_id=current_user.id).first_or_404()
    db.session.delete(note)
    db.session.commit()
    return jsonify({'message': 'Note deleted successfully'})

# --- Main Execution ---
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5001)