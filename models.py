from datetime import datetime

from mongoengine.queryset import DoesNotExist
from ext import db

ARTIST_URL = 'http://music.163.com/#/artist?id={}'
SONG_URL = 'http://music.163.com/#/song?id={}'
USER_URL = 'http://music.163.com/#/user/home?id={}'


class BaseModel(db.Document):
    id = db.IntField(primary_key=True)
    create_at = db.DateTimeField(default=datetime.now)
    update_at = db.DateTimeField()

    meta = {'allow_inheritance': True,
            'abstract': True,
            'strict': False
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

    @classmethod
    def aggregate_to_cls(cls, size):
        ids = list(cls.objects.aggregate(
            {'$sample': {'size': size}},
            {'$group': {'_id': 0, 'ids': {'$push': '$_id'}}}
        ))[0]['ids']
        return Comment.objects(id__in=ids)


class Artist(BaseModel):
    name = db.StringField()
    picture = db.StringField()
    songs = db.ListField(db.ReferenceField('Song'))

    @property
    def url(self):
        return ARTIST_URL.format(self.id)


class Song(BaseModel):
    name = db.StringField()
    comment_count = db.IntField()
    comments = db.ListField(db.ReferenceField('Comment'))
    artist = db.ReferenceField('Artist')

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

    @property
    def user_url(self):
        return self.user.url

    @property
    def user_url(self):
        return self.song.artist_url

    @classmethod
    def get_random(cls, size=10):
        comments = cls.aggregate_to_cls(size)
        return comments

    def to_dict(self):
        song_obj = self.song
        user_obj = self.user
        song = {
            'url': song_obj.url,
            'name': song_obj.name,
            'pictureUrl': song_obj.artist.picture
        }

        user = {
            'pictureUrl': user_obj.picture,
            'name': user_obj.name
        }
        return {
            'song': song,
            'user': user,
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
