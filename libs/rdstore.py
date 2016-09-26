# coding=utf-8
import redis
from config import REDIS_HOST, REDIS_PORT, REDIS_DB

cache = redis.StrictRedis(host=REDIS_HOST, port=REDIS_PORT, db=REDIS_DB)
