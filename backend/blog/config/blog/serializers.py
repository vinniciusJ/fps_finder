from rest_framework import serializers
from .models import Post, PostFile

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        fields = ('id', 'title', 'body', 'banner', 'banner_url', 'created_at', 'published')
        model = Post
    

class PostFileSerializer(serializers.ModelSerializer):
    class Meta:
        fields = ('id', 'post', 'file', 'url', 'desc', 'code')
        model = PostFile
