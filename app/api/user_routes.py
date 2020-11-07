from flask import Blueprint, jsonify, request
from app.models import db, User, Draft
from flask_login import current_user, login_required
user_routes = Blueprint('users', __name__)


@user_routes.route('/')
@login_required
def index():
    response = User.query.all()
    return {"users": [user.to_dict() for user in response]}


@user_routes.route('/me/drafts')
@login_required
def get_drafts():
    response = Draft.query.filter_by(user_id=current_user.id).all()
    return {draft.id: draft.draft_info() for draft in response}

    # return jsonify({draft.id: draft.to_dict() for draft in response})
    # return jsonify(response[0])


@user_routes.route('/me/drafts', methods=['POST'])
@login_required
def new_draft():
    user_id = current_user.id
    title = request.json.get('title', None)

    try:
        draft = Draft(user_id=user_id, title=title)
        db.session.add(draft)
        db.session.commit()
    except AssertionError as exception_message:
        return jsonify(msg=str(exception_message)), 400

    return draft.to_dict()
