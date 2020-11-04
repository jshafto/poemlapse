import re
from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import validates
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()


class User(db.Model, UserMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email
        }

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        if not password:
            raise AssertionError('Password not provided')
        if len(password) < 8:
            raise AssertionError(
                'Password length must be greater than 8 characters')
        self.hashed_password = generate_password_hash(password)

    @classmethod
    def authenticate(cls, email, password):
        user = cls.query.filter(User.email == email).scalar()
        if user:
            return check_password_hash(user.hashed_password, password), user
        else:
            return None, None

    @validates('username')
    def validate_username(self, key, username):
        if not username:
            raise AssertionError('No username provided')
        if User.query.filter(User.username == username).first():
            raise AssertionError('Username is already in use')
        if len(username) < 2 or len(username) > 20:
            raise AssertionError(
                'Username must be between 2 and 25 characters')
        return username

    @validates('email')
    def validate_email(self, key, email):
        if not email:
            raise AssertionError('No email provided')
        if not re.match("[^@]+@[^@]+\.[^@]+", email):
            raise AssertionError('Provided email is not an email address')
        return email
