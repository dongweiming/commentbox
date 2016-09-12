import os

MONGODB_DB = 'music'
MONGODB_HOST = 'localhost'
MONGODB_PORT = 27017
PROXIES = []

HERE = os.path.abspath(os.path.dirname(__file__))
DATA_DB = os.path.join(HERE, 'data/fake_useragent.json')

DEBUG = False

try:
    from local_settings import *  # noqa
except ImportError:
    pass
