import random

import requests
from lxml import etree
from fake_useragent import UserAgent

from spider.encrypt import gen_data
from config import PROXIES


TIMEOUT = 5


def choice_proxy():
    if PROXIES:
        return random.choice(PROXIES + [''])
    return ''


def get_user_agent():
    ua = UserAgent()
    return ua.random


def fetch(url, retry=0):
    s = requests.Session()
    proxies = {
        'http': choice_proxy()
    }
    s.headers.update({'user-agent': get_user_agent(),
                      'referer': 'http://music.163.com/'})
    try:
        return s.get(url, timeout=TIMEOUT, proxies=proxies)
    except requests.exceptions.ConnectionError:
        if retry < 3:
            return fetch(url, retry=retry + 1)
        raise


def post(url):
    headers = {
        'Cookie': 'appver=1.5.0.75771;',
        'Referer': 'http://music.163.com/'
    }

    return requests.post(url, headers=headers, data=gen_data())


def get_tree(url):
    r = fetch(url)
    return etree.HTML(r.text)
