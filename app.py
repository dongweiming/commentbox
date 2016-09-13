# coding=utf-8
from flask import Flask

import config
import views
from ext import db, mako


def create_app():
    app = Flask(__name__, template_folder='templates',
                static_folder='static')
    app.config.from_object(config)
    mako.init_app(app)
    db.init_app(app)
    app.register_blueprint(views.bp)
    return app


if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=8000, debug=app.debug)
