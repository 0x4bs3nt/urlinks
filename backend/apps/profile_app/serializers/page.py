from apps.profile_app.models.page import Page
from apps.profile_app.serializers.link import LinkSerializer
from rest_framework import serializers


class PageSerializer(serializers.ModelSerializer):
    links = LinkSerializer(many=True, read_only=True)

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
            "links",
        ]
