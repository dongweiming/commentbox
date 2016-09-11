import os

DB_HOST = '127.0.01'
DB_PORT = 27017
DATABASE_NAME = 'music'
PROXIES = []

HERE = os.path.abspath(os.path.dirname(__file__))
DB = os.path.join(HERE, 'data/fake_useragent.json')

try:
    from local_settings import *  # noqa
except ImportError:
    pass
