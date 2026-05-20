import uuid
from uuid import UUID

from apps.core.models import UserSession
from apps.core.models.user import CustomUser
from apps.core.utils.request import get_client_ip, get_user_agent
from apps.core.utils.session import get_token_expiry
from django.contrib.auth import authenticate
from django.utils import timezone
from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer,
    TokenRefreshSerializer,
)
from rest_framework_simplejwt.settings import api_settings
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.tokens import RefreshToken


class CustomTokenPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        authenticate_kwargs = {
            self.username_field: attrs[self.username_field],
            "password": attrs["password"],
        }
        request = self.context.get("request")
        if request is not None:
            authenticate_kwargs["request"] = request

        self.user = authenticate(**authenticate_kwargs)

        if not api_settings.USER_AUTHENTICATION_RULE(self.user):
            raise AuthenticationFailed("No active account found with the given credentials")

        session = UserSession.objects.create(
            user=self.user,
            current_refresh_jti=f"pending-{uuid.uuid4()}",
            user_agent=get_user_agent(request),
            ip_address=get_client_ip(request) or None,
            expires_at=timezone.now(),
        )

        refresh = RefreshToken.for_user(self.user)
        refresh["sid"] = str(session.id)
        access = refresh.access_token
        access["sid"] = str(session.id)

        session.current_refresh_jti = refresh["jti"]
        session.expires_at = get_token_expiry(refresh)
        session.save(update_fields=["current_refresh_jti", "expires_at"])

        data = {
            "id": self.user.id,
            "username": self.user.username,
            "email": self.user.email,
            "session_id": str(session.id),
            "refresh": str(refresh),
            "access": str(access),
        }

        return data


class CustomRefreshSerializer(TokenRefreshSerializer):
    session_error = "Session is no longer active."

    def validate(self, attrs):
        try:
            old_refresh = RefreshToken(attrs["refresh"])
        except TokenError as exc:
            raise InvalidToken(str(exc))

        session_id = old_refresh.get("sid")
        if not session_id:
            raise AuthenticationFailed(self.session_error)

        try:
            parsed_session_id = UUID(str(session_id))
        except ValueError as exc:
            raise AuthenticationFailed(self.session_error) from exc

        token_user_id = old_refresh.get(api_settings.USER_ID_CLAIM)
        session = UserSession.objects.filter(id=parsed_session_id).first()

        if (
            not session
            or session.revoked_at
            or session.expires_at < timezone.now()
            or str(session.user_id) != str(token_user_id)
            or session.current_refresh_jti != old_refresh["jti"]
        ):
            raise AuthenticationFailed(self.session_error)

        data = super().validate(attrs)

        new_refresh = RefreshToken(data["refresh"])
        new_refresh["sid"] = str(session.id)
        new_access = AccessToken(data["access"])
        new_access["sid"] = str(session.id)

        session.current_refresh_jti = new_refresh["jti"]
        session.expires_at = get_token_expiry(new_refresh)
        session.last_seen_at = timezone.now()
        session.ip_address = get_client_ip(self.context["request"]) or None
        user_agent = get_user_agent(self.context["request"])
        if user_agent:
            session.user_agent = user_agent
        session.save(
            update_fields=[
                "current_refresh_jti",
                "expires_at",
                "last_seen_at",
                "ip_address",
                "user_agent",
            ]
        )

        return {
            "access": str(new_access),
            "refresh": str(new_refresh),
        }


class RegisterSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = [
            "username",
            "email",
            "password",
            "confirm_password",
        ]

    def validate(self, attrs):
        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError({"error": "Passwords do not match."})

        return attrs

    def create(self, validated_data):
        validated_data.pop("confirm_password")

        user = CustomUser.objects.create_user(**validated_data, is_active=True)

        return user
