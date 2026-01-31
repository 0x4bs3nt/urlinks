from apps.core.models import CustomUser
from apps.profile_app.models.template import Template
from django.db import models


def profile_picture_path(instance, filename):
    return f"folder_{instance.user_id}/profile_pictures/{filename}"


def banner_picture_path(instance, filename):
    return f"folder_{instance.user_id}/banners/{filename}"


class Page(models.Model):
    user = models.OneToOneField(
        CustomUser, on_delete=models.CASCADE, related_name="page"
    )
    display_name = models.SlugField(max_length=30)
    bio = models.CharField(max_length=200, blank=True, null=True)
    profile_picture = models.ImageField(
        upload_to=profile_picture_path, blank=True, null=True
    )
    banner_picture = models.ImageField(
        upload_to=banner_picture_path, blank=True, null=True
    )
    template = models.ForeignKey(
        Template,
        on_delete=models.SET_NULL,
        related_name="pages",
        blank=True,
        null=True,
    )
    is_published = models.BooleanField(default=False)

    def __str__(self):
        return self.display_name

    # Delete associated images on R2 when the Page is deleted
    def delete(self, *args, **kwargs):
        if self.profile_picture:
            self.profile_picture.delete(save=False)

        if self.banner_picture:
            self.banner_picture.delete(save=False)

        return super().delete(*args, **kwargs)
