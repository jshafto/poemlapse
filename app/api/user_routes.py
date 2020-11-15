from flask import Blueprint, jsonify, request
from app.models import db, User, Draft, Work
from flask_login import current_user, login_required
user_routes = Blueprint('users', __name__)


@user_routes.route('/me/works')
@login_required
def get_own_works():
    response = Work.query.filter_by(user_id=current_user.id).all()
    return {work.id: work.work_info() for work in response}


@user_routes.route('/<user_id>')
def get_user_profile(user_id):
    user = User.query.get(user_id)
    if not user:
        return {'msg': 'User not found'}, 404
    return user.to_profile(), 200


@user_routes.route('/me', methods=['PUT'])
@login_required
def update_user():
    user_id = current_user.id

    user = User.query.get(user_id)

    bio = request.json.get('bio', None)
    first_name = request.json.get('first_name', None)
    last_name = request.json.get('last_name', None)

    try:
        if bio:
            user.bio = bio
        if first_name:
            user.first_name = first_name
        if last_name:
            user.last_name = last_name
        db.session.commit()
    except AssertionError as exception_message:
        return jsonify(msg=str(exception_message)), 400

    return user.to_profile(), 200
