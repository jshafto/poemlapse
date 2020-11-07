from flask import Blueprint, jsonify, request
from app.models import db, User, Draft
from flask_login import current_user, login_required
draft_routes = Blueprint('drafts', __name__)


@draft_routes.route('')
@login_required
def get_drafts():
    response = Draft.query.filter_by(user_id=current_user.id).all()
    return {draft.id: draft.draft_info() for draft in response}


@draft_routes.route('', methods=['POST'])
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


@draft_routes.route('/<draft_id>', methods=['PUT'])
@login_required
def update_draft(draft_id):
    draft_id = int(draft_id)
    user_id = current_user.id

    draft = Draft.query.get(draft_id)

    if not draft or not user_id == draft.user_id:
        return {'msg': 'Draft not found'}, 404
    title = request.json.get('title', None)
    changes = request.json.get('changes', None)
    beginning = request.json.get('beginning', None)

    try:
        if title and not draft.title == title:
            draft.title = title
        if changes:
            draft.changes = changes
        if beginning:
            draft.beginning = beginning
        db.session.commit()
    except AssertionError as exception_message:
        return jsonify(msg=str(exception_message)), 400

    return draft.to_dict(), 200


@draft_routes.route('/<draft_id>')
@login_required
def get_draft(draft_id):
    draft_id = int(draft_id)
    user_id = current_user.id

    draft = Draft.query.get(draft_id)

    if not draft or not user_id == draft.user_id:
        return {'msg': 'Draft not found'}, 404

    return draft.to_dict(), 200
