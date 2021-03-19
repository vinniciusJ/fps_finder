from .models import Post, PostFile
from rest_framework import generics
from .serializers import PostSerializer, PostFileSerializer


class PostList(generics.ListCreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    


class PostDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    

class FileList(generics.ListCreateAPIView):
    queryset = PostFile.objects.all()
    serializer_class = PostFileSerializer
    