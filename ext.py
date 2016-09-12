# coding=utf-8
from flask_mongoengine import MongoEngine
from flask_mako import MakoTemplates, render_template  # noqa

db = MongoEngine()
mako = MakoTemplates()

