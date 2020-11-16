from flask import Blueprint, jsonify, request
from app.models import db, User, Work
from flask_login import current_user, login_required
work_routes = Blueprint('works', __name__)


@work_routes.route('')
def get_works():
    response = Work.query.all()
    if current_user.is_authenticated:
        user = User.query.get(current_user.id)
        return {work.id: work.with_is_saved(user) for work in response}, 200
    return {work.id: work.to_dict() for work in response}, 200


@work_routes.route('/<work_id>')
def get_work(work_id):
    work_id = int(work_id)

    work = Work.query.get(work_id)

    if not work:
        return {'msg': 'Poem not found'}, 404

    if current_user.is_authenticated:
        user = User.query.get(current_user.id)
        return work.with_is_saved(user), 200

    return work.to_dict(), 200


@work_routes.route('/<work_id>', methods=['DELETE'])
@login_required
def unpublish_work(work_id):
    work_id = int(work_id)
    user_id = current_user.id

    work = Work.query.get(work_id)

    if not work or not user_id == work.user_id:
        return {'msg': 'Work not found'}, 404

    draft_id = work.draft_id

    db.session.delete(work)
    db.session.commit()
    # return {'msg': f'Undid publication of work with id of {work_id}.'}, 200
    return {"id": draft_id}, 200


@work_routes.route('/<work_id>/saved', methods=['POST'])
@login_required
def save_work(work_id):
    work_id = int(work_id)
    user_id = current_user.id

    work = Work.query.get(work_id)

    if not work:
        return {'msg': 'Work not found'}, 404

    user = User.query.get(user_id)

    work.users_saved.append(user)

    db.session.commit()
    return {"id": work_id}, 200


@work_routes.route('/<work_id>/saved', methods=['DELETE'])
@login_required
def unsave_work(work_id):
    work_id = int(work_id)
    user_id = current_user.id

    work = Work.query.get(work_id)

    if not work:
        return {'msg': 'Work not found'}, 404

    user = User.query.get(user_id)

    work.users_saved.remove(user)

    db.session.commit()
    return {"id": work_id}, 200
