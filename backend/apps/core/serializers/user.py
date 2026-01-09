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

        return data


class CustomRefreshSerializer(TokenRefreshSerializer):
    @classmethod
    def get_token(cls, user):
        token = RefreshToken.for_user(user)

        return token
