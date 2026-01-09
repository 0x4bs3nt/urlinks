from apps.core.models.user import CustomUser
from rest_framework import serializers
from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer,
    TokenRefreshSerializer,
)
from rest_framework_simplejwt.tokens import RefreshToken


class CustomTokenPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        data["id"] = self.user.id
        data["username"] = self.user.username
        data["email"] = self.user.email

        return data


class CustomRefreshSerializer(TokenRefreshSerializer):
    @classmethod
    def get_token(cls, user):
        token = RefreshToken.for_user(user)

        return token


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
