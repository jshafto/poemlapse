from flask import Blueprint, jsonify, request
from app.models import db, User, Draft, Work
from flask_login import current_user, login_required
user_routes = Blueprint('users', __name__)


@user_routes.route('/')
@login_required
def index():
    response = User.query.all()
    return {"users": [user.to_dict() for user in response]}


@user_routes.route('/me/works')
@login_required
def get__own_works():
    response = Work.query.filter_by(user_id=current_user.id).all()
    return {work.id: work.work_info() for work in response}
