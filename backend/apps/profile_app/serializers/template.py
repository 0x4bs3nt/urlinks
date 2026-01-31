from apps.profile_app.models.template import Template
from rest_framework import serializers


class TemplateSerializer(serializers.ModelSerializer):
    is_system_template = serializers.ReadOnlyField()

    class Meta:
        model = Template
        fields = [
            "id",
            "user",
            "name",
            "background_color",
            "text_color",
            "button_color",
            "button_text_color",
            "font_family",
            "border_radius",
            "is_system_template",
        ]
        read_only_fields = ["user", "created_at", "updated_at"]
