# coding=utf-8
import ast
from datetime import datetime

from mongoengine.queryset import DoesNotExist

from ext import db
from libs.rdstore import cache

ARTIST_URL = 'http://music.163.com/#/artist?id={}'
SONG_URL = 'http://music.163.com/#/song?id={}'
USER_URL = 'http://music.163.com/#/user/home?id={}'
SAMPLE_SIZE = 200
TOTAL_SIZE = 2000

RANDOM_KEY = 'commentbox:random:{session_id}'
STAR_KEY = 'commentbox:star'
OBJ_KEY = 'commentbox:object:{coll_name}:{id}'
SEARCH_KEY = 'commentbox:search:{type}:{id}'
SUGGEST_KEY = 'commentbox:suggest:{text}'
TIMEOUT = 60 * 60


class BaseModel(db.Document):
    id = db.IntField(primary_key=True)
    create_at = db.DateTimeField(default=datetime.now)
    update_at = db.DateTimeField()

    meta = {'allow_inheritance': True,
            'abstract': True,
            'strict': False
    }

    @classmethod
    def get(cls, id):
        coll_name = cls._meta['collection']
        key = OBJ_KEY.format(coll_name=coll_name, id=id)
        rs = cache.get(key)
        if rs:
            return cls.from_json(rs)
        rs = cls.objects.get(id=id)
        cache.set(key, rs.to_json())
        return rs

    @classmethod
    def get_multi(cls, ids):
        return [cls.get(i) for i in ids if i]

    @classmethod
    def get_or_create(cls, **kwargs):
        try:
            return cls.objects.get(id=kwargs['id'])
        except DoesNotExist:
            kwargs.update({'update_at': datetime.now()})
            model = cls(**kwargs)
            model.save()
            return model

    @classmethod
    def get_sample_ids(cls, size):
        samples = list(cls.objects.aggregate(
            {'$sample': {'size': size}}))
        return [s['_id'] for s in samples]

    @classmethod
    def ids_to_cls(cls, ids):
        return cls.objects(id__in=ids)


class Artist(BaseModel):
    name = db.StringField()
    picture = db.StringField()
    songs = db.ListField(db.ReferenceField('Song'))
    meta = {
        # 'indexes': ['name', '$name']  # 不支持text search?
        'indexes': ['name']
     }

    @property
    def url(self):
        return ARTIST_URL.format(self.id)


class Song(BaseModel):
    name = db.StringField()
    comment_count = db.IntField()
    comments = db.ListField(db.ReferenceField('Comment'))
    artist = db.ReferenceField('Artist')
    meta = {
        'indexes': ['name']
    }

    @property
    def url(self):
        return SONG_URL.format(self.id)

    @property
    def artist_url(self):
        return self.artist.url


class Comment(BaseModel):
    content = db.StringField()
    like_count = db.IntField()
    user = db.ReferenceField('User')
    song = db.ReferenceField('Song')
    meta = {
        'indexes': [
            '-like_count'
        ]
    }

    @property
    def user_url(self):
        return self.user.url

    @property
    def user_url(self):
        return self.song.artist_url

    @classmethod
    def cache_by_key(cls, key, ids):
        cache.delete(key)
        cache.rpush(key, *ids)
        cache.expire(key, TIMEOUT)

    @classmethod
    def get_random_by_session_id(cls, session_id, start=0, limit=20):
        key = RANDOM_KEY.format(session_id=session_id)
        if not start % SAMPLE_SIZE:
            ids = cls.get_sample_ids(SAMPLE_SIZE)
            cls.cache_by_key(key, ids)

        else:
            ids = cache.lrange(key, start, start + limit)
            if not ids:
                ids = cls.get_sample_ids(SAMPLE_SIZE)
                cls.cache_by_key(key, ids)

        comments = cls.ids_to_cls(ids)
        return comments

    @classmethod
    def order_by_star(cls, start=0, limit=20):
        ids = cache.lrange(STAR_KEY, start, start + limit)
        if not ids:
            ids = [c.id for c in cls.objects.order_by('-like_count')[:TOTAL_SIZE]]  # noqa
            cache.rpush(STAR_KEY, *ids)
            ids = ids[start : start + limit]

        return cls.ids_to_cls(ids)

    def to_dict(self):
        song_obj = self.song
        user_obj = self.user
        artist_obj = song_obj.artist
        song = {
            'id': song_obj.id,
            'url': song_obj.url,
            'name': song_obj.name
        }

        artist = {
            'id': artist_obj.id,
            'avatar': artist_obj.picture,
            'name': artist_obj.name,
            'url': artist_obj.url
        }

        user = {
            'avatar': user_obj.picture,
            'name': user_obj.name,
            'url': user_obj.url
        }
        return {
            'song': song,
            'user': user,
            'artist': artist,
            'content': self.content
        }


class User(BaseModel):
    name = db.StringField()
    picture = db.StringField()

    @property
    def url(self):
        return USER_URL.format(self.id)


class Process(BaseModel):
    STATUS = PENDING, SUCCEEDED, FAILED = range(3)
    status = db.IntField(choices=STATUS, default=PENDING)

    @property
    def is_success(self):
        return self.status == self.SUCCEEDED

    def make_succeed(self):
        return self.update(status=self.SUCCEEDED)

    def make_fail(self):
        return self.update(status=self.FAILED)


def search(subject_id, type):
    key = SEARCH_KEY.format(id=subject_id, type=type)

    if not subject_id:
        return []
    comment_ids = cache.lrange(key, 0, -1)
    if comment_ids:
        return Comment.get_multi(comment_ids)
    songs = []
    if type == 'artist':
        artist = Artist.get(id=subject_id)
        songs.extend(Song.objects(artist=artist))
    else:
        songs.extend(Song.get(id=subject_id))

    comments = sum([list(Comment.objects(song=song)) for song in songs], [])

    comment_ids = [comment.id for comment in comments]
    if comment_ids:
        cache.rpush(key, *comment_ids)
    return comments


def suggest(text):
    if isinstance(text, unicode):
        text = text.encode('utf-8')
    key = SUGGEST_KEY.format(text=text)
    rs = cache.get(key)
    if rs:
        return ast.literal_eval(rs)
    items = []
    if not isinstance(text, unicode):
        text = text.decode('utf-8')
    artists = Artist.objects(name__contains=text)
    items.extend([{'id': artist.id, 'name': artist.name,
                   'avatar': artist.picture,
                   'type': 'artist'}
                  for artist in artists])
    songs = Song.objects(name__contains=text)
    items.extend([{'id': song.id, 'name': song.name, 'type': 'song'}
                  for song in songs])
    cache.set(key, items)
    return items
