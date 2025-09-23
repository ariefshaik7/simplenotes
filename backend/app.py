from flask import Flask
from config import Config
from extensions import db, bcrypt, cors, metrics
from routes import auth, notes

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    bcrypt.init_app(app)
    cors.init_app(app)
    metrics.init_app(app)

    # Register blueprints
    app.register_blueprint(auth.bp, url_prefix="/api")
    app.register_blueprint(notes.bp, url_prefix="/api")

    with app.app_context():
        db.create_all()

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=5001, debug=True)
