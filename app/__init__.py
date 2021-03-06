import os
from flask import Flask, render_template, request, session
from flask_cors import CORS
from flask_migrate import Migrate
from flask_wtf.csrf import CSRFProtect, generate_csrf
from flask_login import LoginManager


from app.models import db, User
from app.api.user_routes import user_routes
from app.api.session_routes import session_routes
from app.api.draft_routes import draft_routes
from app.api.work_routes import work_routes

from app.config import Config

app = Flask(__name__)
app.config.from_object(Config)
app.register_blueprint(user_routes, url_prefix='/api/users')
app.register_blueprint(session_routes, url_prefix='/api/session')
app.register_blueprint(draft_routes, url_prefix='/api/drafts')
app.register_blueprint(work_routes, url_prefix='/api/works')
db.init_app(app)
migrate = Migrate(app, db, compare_type=True)
login_manager = LoginManager(app)


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)


# Application Security
CORS(app)
# CSRFProtect(app)


@app.after_request
def inject_csrf_token(response):
    response.set_cookie(
        'csrf_token',
        generate_csrf(),
        secure=True if os.environ.get('FLASK_ENV') else False,
        samesite='Strict' if os.environ.get('FLASK_ENV') else None,
        httponly=True)
    return response


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def react_root(path):
    if path in ('favicon.ico', 'poemlapse_splash_page.png'):
        return app.send_static_file(path)
    return app.send_static_file('index.html')
