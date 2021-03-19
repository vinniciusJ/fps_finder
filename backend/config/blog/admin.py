from django.contrib import admin
from .models import Post, PostFile

# Register your models here.

class PostFileAdmin(admin.StackedInline):
    model = PostFile

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    inlines = [PostFileAdmin]
    
    class Meta:
        model = Post

@admin.register(PostFile)
class PostFileAdmin(admin.ModelAdmin):
    pass
