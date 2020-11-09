import re
from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import validates
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.sql import func

db = SQLAlchemy()


class User(db.Model, UserMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)
    bio = db.Column(db.String(1000))

    drafts = db.relationship('Draft', back_populates='user')

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email
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
        if not re.match(r'[^@]+@[^@]+\.[^@]+', email):
            raise AssertionError('Provided email is not an email address')
        if User.query.filter(User.email == email).first():
            raise AssertionError('Email is already in use')
        return email


class Draft(db.Model):
    __tablename__ = 'drafts'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(150), nullable=False)
    changes = db.Column(db.Text)
    beginning = db.Column(db.String(280))
    date_created = db.Column(db.DateTime(timezone=True), nullable=False,
                             server_default=func.now())
    date_updated = db.Column(db.DateTime(timezone=True), nullable=False,
                             server_default=func.now(), onupdate=func.now())

    user = db.relationship('User', back_populates='drafts')

    def to_dict(self):
        if self.changes:
            return {
                'id': self.id,
                'user_id': self.user_id,
                'title': self.title,
                'changes': self.changes,
                'beginning': self.beginning,
                'date_created': self.date_created,
                'date_updated': self.date_updated,
            }
        else:
            return {
                'id': self.id,
                'user_id': self.user_id,
                'title': self.title,
                'date_created': self.date_created,
                'date_updated': self.date_updated,
            }

    def draft_info(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'title': self.title,
            'beginning': self.beginning,
            'date_created': self.date_created,
            'date_updated': self.date_updated,
        }

    @validates('title')
    def validate_title(self, key, title):
        if not title:
            raise AssertionError('No title provided')
        if len(title) > 150:
            raise AssertionError('Title cannot be longer than 150 characters')
        # if (Draft.query.filter_by(user_id=self.user_id,
        #                           title=title).first()):
        #     raise AssertionError('You already have a poem with that title')
        return title
