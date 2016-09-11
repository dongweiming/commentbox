from datetime import datetime

from mongoengine import (Document, StringField, DateTimeField, ReferenceField,
                         IntField, ListField, DoesNotExist, connect)
from config import DB_HOST, DB_PORT, DATABASE_NAME


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


class Song(BaseModel):
    name = StringField()
    comment_count = IntField()
    comments = ListField(ReferenceField('Comment'))
    artist = ReferenceField('Artist')


class Comment(BaseModel):
    content = StringField()
    like_count = IntField()
    user = ReferenceField('User')
    song = ReferenceField('Song')


class User(BaseModel):
    name = StringField()
    picture = StringField()


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
