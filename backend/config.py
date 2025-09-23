import os

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-key-change-in-prod")
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URI")
    SQLALCHEMY_TRACK_MODIFICATIONS = False