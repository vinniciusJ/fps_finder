from django.urls import path
from .views import PostList, PostDetail, FileList

urlpatterns = [
    path('<int:pk>/', PostDetail.as_view()),
    path('', PostList.as_view()),
    path('files/',  FileList.as_view())
]