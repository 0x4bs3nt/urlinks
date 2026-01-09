from apps.core.models import CustomUser
from django.db import models


class Page(models.Model):
    user = models.OneToOneField(
        CustomUser, on_delete=models.CASCADE, related_name="page"
    )
    display_name = models.SlugField(max_length=30)
    bio = models.CharField(max_length=200, blank=True, null=True)
    profile_picture = models.ImageField(
        upload_to="pages/profile_pictures/", blank=True, null=True
    )
    banner_picture = models.ImageField(
        upload_to="pages/banners/", blank=True, null=True
    )
    is_published = models.BooleanField(default=False)

    def __str__(self):
        return self.display_name
