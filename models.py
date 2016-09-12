from datetime import datetime

from mongoengine import (Document, StringField, DateTimeField, ReferenceField,
                         IntField, ListField, DoesNotExist, connect)
from config import DB_HOST, DB_PORT, DATABASE_NAME

ARTIST_URL = 'http://music.163.com/#/artist?id={}'
SONG_URL = 'http://music.163.com/#/song?id={}'
USER_URL = 'http://music.163.com/#/user/home?id={}'


def lazy_connect():
    connect(DATABASE_NAME, host=DB_HOST, port=DB_PORT)


class BaseModel(Document):
    id = IntField(primary_key=True)
    create_at = DateTimeField(default=datetime.now)
    update_at = DateTimeField()

    meta = {'allow_inheritance': True,
            'abstract': True
    }

    @classmethod
    def get_or_create(cls, **kwargs):
        try:
            return cls.objects.get(id=kwargs['id'])
        except DoesNotExist:
            kwargs.update({'update_at': datetime.now()})
            model = cls(**kwargs)
            model.save()
            return model


class Artist(BaseModel):
    name = StringField()
    picture = StringField()
    songs = ListField(ReferenceField('Song'))

    @property
    def url(self):
        return ARTIST_URL.format(self.id)


class Song(BaseModel):
    name = StringField()
    comment_count = IntField()
    comments = ListField(ReferenceField('Comment'))
    artist = ReferenceField('Artist')

    @property
    def url(self):
        return SONG_URL.format(self.id)

    @property
    def artist_url(self):
        return self.artist.url


class Comment(BaseModel):
    content = StringField()
    like_count = IntField()
    user = ReferenceField('User')
    song = ReferenceField('Song')

    @property
    def user_url(self):
        return self.user.url

    @property
    def song_url(self):
        return self.song.url

    @property
    def user_url(self):
        return self.song.artist_url


class User(BaseModel):
    name = StringField()
    picture = StringField()

    @property
    def url(self):
        return USER_URL.format(self.id)


class Process(BaseModel):
    STATUS = PENDING, SUCCEEDED, FAILED = range(3)
    status = IntField(choices=STATUS, default=PENDING)

    @property
    def is_success(self):
        return self.status == self.SUCCEEDED

    def make_succeed(self):
        return self.update(status=self.SUCCEEDED)

    def make_fail(self):
        return self.update(status=self.FAILED)
