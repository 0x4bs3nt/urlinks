from apps.core.models import UserSession
from rest_framework import serializers


class SessionSerializer(serializers.ModelSerializer):
    is_current = serializers.SerializerMethodField()

    class Meta:
        model = UserSession
        fields = [
            "id",
            "is_current",
            "user_agent",
            "ip_address",
            "created_at",
            "last_seen_at",
            "expires_at",
        ]

    def get_is_current(self, obj):
        current_session_id = self.context.get("current_session_id")
        return str(obj.id) == str(current_session_id)
