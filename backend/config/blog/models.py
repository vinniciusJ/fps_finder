from django.db import models

# Create your models here.

class Post(models.Model):
    title = models.CharField(max_length=50)
    body = models.TextField()
    
    banner = models.FileField(blank=True, upload_to="banners/")
    banner_url = models.URLField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    published = models.BooleanField(default=False)
    
    def __str__(self) -> str:
        return self.title


class PostFile(models.Model):
    post = models.ForeignKey(Post, default=None, on_delete=models.CASCADE)
    
    file = models.FileField(upload_to="files/", blank=True)
    url = models.URLField(blank=True)
    
    desc = models.TextField(blank=True)
    
    code = models.CharField(max_length=50)
    
    def __str__(self) -> str:
        return self.post.title