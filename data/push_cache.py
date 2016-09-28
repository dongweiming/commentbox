#coding=utf-8
import sys
sys.path.insert(0, '.')

from app import create_app

create_app()

from models import Song, Artist, SEARCH_KEY, SUGGEST_KEY, search, suggest

SEARCH_KEY = 'commentbox:search:{type}:{id}'
SUGGEST_KEY = 'commentbox:suggest:{text}'

songs = [song.name for song in Song.objects.all()]
artists = [artist.name for artist in Artist.objects.all()]

text_set = set()

for name in songs + artists:
    for w in [name[:i] for i in range(1, len(name) + 1)]:
        text_set.add(w)

# suggest预热
for text in text_set:
    print 'cache suggest', text
    suggest(text)

# search预热
for song in Song.objects.all():
    print 'cache search song', song.id
    search(song.id, 'song')

for artist in Artist.objects.all():
    print 'cache search artist', artist.id
    search(artist.id, 'artist')
                                            
