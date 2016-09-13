# coding=utf-8
from flask.blueprints import Blueprint

from ext import render_template

bp = Blueprint('index', __name__)


@bp.route('/')
def home():
    return render_template('index.html')
