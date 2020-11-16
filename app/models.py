import re
from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import validates
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.sql import func

db = SQLAlchemy()


saves = db.Table('saves',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('work_id', db.Integer, db.ForeignKey('works.id'), primary_key=True)
)

class User(db.Model, UserMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)
    bio = db.Column(db.String(1000))
    first_name = db.Column(db.String(100))
    last_name = db.Column(db.String(100))

    drafts = db.relationship('Draft', back_populates='user')
    works = db.relationship('Work', back_populates='user')
    saved = db.relationship('Work', secondary=saves, lazy='subquery')

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'bio': self.bio,
            'firstName': self.first_name,
            'lastName': self.last_name,
            'displayName': self.display_name,
        }

    def to_profile(self):
        work_collection = { work.id: work.work_info() for work in self.works }
        saved_collection = { work.id: work.work_info() for work in self.saved }
        return {
            'id': self.id,
            'username': self.username,
            'bio': self.bio,
            'firstName': self.first_name,
            'lastName': self.last_name,
            'displayName': self.display_name,
            'works': work_collection,
            'saved': saved_collection,
        }

    @property
    def first(self):
        return self.first_name
    @property
    def last(self):
        return self.last_name
    @property
    def display_name(self):
        if self.first_name and self.last_name:
            return f'{self.first_name} {self.last_name}'
        if not self.first_name and not self.last_name:
            return self.username
        if not self.first_name:
            return self.last_name
        if not self.last_name:
            return self.first_name

    @property
    def author_id(self):
        return self.id


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
    work = db.relationship('Work', back_populates='draft')

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
                'published': bool(self.work),
            }
        else:
            return {
                'id': self.id,
                'user_id': self.user_id,
                'title': self.title,
                'date_created': self.date_created,
                'date_updated': self.date_updated,
                'published': bool(self.work),
            }

    def draft_info(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'title': self.title,
            'beginning': self.beginning,
            'date_created': self.date_created,
            'date_updated': self.date_updated,
            'published': bool(self.work),
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


class Work(db.Model):
    __tablename__ = "works"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    draft_id = db.Column(
        db.Integer, db.ForeignKey('drafts.id'), nullable=False)
    title = db.Column(db.String(150), nullable=False)
    changes = db.Column(db.Text)
    beginning = db.Column(db.String(280))
    date_created = db.Column(db.DateTime(timezone=True), nullable=False,
                             server_default=func.now())
    date_updated = db.Column(db.DateTime(timezone=True), nullable=False,
                             server_default=func.now(), onupdate=func.now())
    date_published = db.Column(db.DateTime(timezone=True), nullable=False,
                               server_default=func.now())

    draft = db.relationship('Draft', back_populates='work')
    user = db.relationship('User', back_populates='works')
    users_saved = db.relationship('User', secondary=saves, lazy='subquery')

    def saved_by_user(self, user_id):
        return self.users_saved


    def work_info(self):
        return {
            'id': self.id,
            'userId': self.user_id,
            'draftId': self.draft_id,
            'title': self.title,
            'beginning': self.beginning,
            'dateCreated': self.date_created,
            'dateUpdated': self.date_updated,
            'datePublished': self.date_published,
            'displayName': self.user.display_name,
            'firstName': self.user.first,
            'lastName': self.user.last,
        }

    def to_dict(self):
        return {
            'id': self.id,
            'userId': self.user_id,
            'draftId': self.draft_id,
            'title': self.title,
            'changes': self.changes,
            'beginning': self.beginning,
            'dateCreated': self.date_created,
            'dateUpdated': self.date_updated,
            'datePublished': self.date_published,
            'displayName': self.user.display_name,
            'firstName': self.user.first,
            'lastName': self.user.last,
        }
    def with_is_saved(self,user):
        saved = True if user in self.users_saved else False
        return {
            'id': self.id,
            'userId': self.user_id,
            'draftId': self.draft_id,
            'title': self.title,
            'changes': self.changes,
            'beginning': self.beginning,
            'dateCreated': self.date_created,
            'dateUpdated': self.date_updated,
            'datePublished': self.date_published,
            'displayName': self.user.display_name,
            'firstName': self.user.first,
            'lastName': self.user.last,
            'saved': saved,
        }
