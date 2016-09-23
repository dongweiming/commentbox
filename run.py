import itertools

from concurrent.futures import ProcessPoolExecutor

from spider.parser import (
    parser_artist_list, parser_artist, unprocess_artist_list)

CAT_IDS = [1001, 1002, 1003, 2001, 2002, 2003, 4001, 4002, 4003,
           6001, 6002, 6003, 7001, 7002, 7003]
INITIAL_IDS = [0, -1] + range(65, 91)


with ProcessPoolExecutor(max_workers=2) as executor:
    for artist_id in unprocess_artist_list():
        executor.submit(parser_artist, artist_id)

    for product in itertools.product(CAT_IDS, INITIAL_IDS):
        for artist_id in parser_artist_list(*product):
            executor.submit(parser_artist, artist_id)
