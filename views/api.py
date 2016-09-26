# coding=utf-8
from flask import Flask, json, request, current_app
from werkzeug.wrappers import Response

from models import Comment, SAMPLE_SIZE
from views.utils import ApiResult
from views.exceptions import ApiException


class ApiFlask(Flask):
    def make_response(self, rv):
        if isinstance(rv, dict):
            if 'r' not in rv:
                rv['r'] = 1
            rv = ApiResult(rv)
        if isinstance(rv, ApiResult):
            return rv.to_response()
        return Flask.make_response(self, rv)


json_api = ApiFlask(__name__)
PER_PAGE = 20


@json_api.errorhandler(ApiException)
def api_error_handler(error):
    return error.to_result()


@json_api.errorhandler(403)
@json_api.errorhandler(404)
@json_api.errorhandler(500)
def error_handler(error):
    if hasattr(error, 'name'):
        msg = error.name
        code = error.code
    else:
        msg = error.message
        code = 500
    return ApiResult({'message': msg}, status=code)


@json_api.route('/comments')
def home():
    sort = request.args.get('sort', 'star')
    start = request.args.get('start', 0, type=int)
    limit = request.args.get('limit', PER_PAGE, type=int)

    if sort == 'star':
        comments = Comment.order_by_star(start, limit)
    elif sort == 'random':
        session_id = request.cookies.get(current_app.session_cookie_name)
        comments = Comment.get_random_by_session_id(session_id, start, limit)
    else:
        comments= []
    return {
        'comments': [comment.to_dict() for comment in comments],
        'has_more': start + limit < SAMPLE_SIZE
    }
