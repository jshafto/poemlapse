from flask import Blueprint, jsonify, request
from app.models import db, User, Draft
from flask_login import current_user, login_required
draft_routes = Blueprint('drafts', __name__)


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

    try:
        if title and not draft.title == title:
            draft.title = title
        if changes:
            draft.changes = changes
        db.session.commit()
    except AssertionError as exception_message:
        return jsonify(msg=str(exception_message)), 400

    return draft.to_dict(), 200
