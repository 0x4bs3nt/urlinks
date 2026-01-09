from apps.profile_app.models.page import Page
from rest_framework import serializers


class PageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Page
        fields = [
            "id",
            "user",
            "display_name",
            "bio",
            "profile_picture",
            "banner_picture",
            "is_published",
        ]
