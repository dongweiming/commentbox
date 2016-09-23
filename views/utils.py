from flask import json
from werkzeug.wrappers import Response



class ApiResult(object):
    def __init__(self, value, status=200):
        self.value = value
        self.status = status
    def to_response(self):
        return Response(json.dumps(self.value),
                        status=self.status,
                        mimetype='application/json')



def success(res=None, status_code=200):
    res = res or {}

    dct = {
        'r': 1
    }

    if res and isinstance(res, dict):
        dct.update(res)

    return ApiResult(dct, status_code)


def failure(message, status_code):
    dct = {
        'r': 0,
        'status': status_code,
        'message': message
    }
    return dct


def updated(res=None):
    return success(res=res, status_code=204)


def bad_request(message, res=None):
    return failure(message, 400)
