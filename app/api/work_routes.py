from flask import Blueprint, jsonify, request
from app.models import db, User, Work
from flask_login import current_user, login_required
work_routes = Blueprint('works', __name__)


@work_routes.route('')
def get_works():
    response = Work.query.all()
    return {work.id: work.to_dict() for work in response}


@work_routes.route('/<work_id>')
def get_work(work_id):
    work_id = int(work_id)

    work = Work.query.get(work_id)

    if not work:
        return {'msg': 'Poem not found'}, 404

    return work.to_dict(), 200


@work_routes.route('/<work_id>', methods=['DELETE'])
@login_required
def unpublish_work(work_id):
    work = int(work_id)
    user_id = current_user.id

    work = Work.query.get(work_id)

    if not work or not user_id == work.user_id:
        return {'msg': 'Work not found'}, 404

    db.session.delete(work)
    db.session.commit()
    return {'msg': f'Undid publication of work with id of {work_id}.'}, 200
