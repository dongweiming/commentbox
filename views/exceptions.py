# coding=utf-8
from views.utils import ApiResult


class ApiException(Exception):
    def __init__(self, message, status=400):
        self.message = message
        self.status = status
    def to_result(self):
        return ApiResult({'message': self.message, 'r': 1},
                         status=self.status)

