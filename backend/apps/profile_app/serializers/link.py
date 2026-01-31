from apps.profile_app.models.link import Link
from rest_framework import serializers


class LinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Link
        fields = [
            "id",
            "page",
            "title",
            "url",
            "description",
            "icon",
            "category",
            "order",
            "is_active",
        ]
