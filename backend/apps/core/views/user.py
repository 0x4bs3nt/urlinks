from apps.core.models.user import CustomUser
from apps.core.serializers.user import (
    CustomRefreshSerializer,
    CustomTokenPairSerializer,
)
from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


class CustomTokenPairView(TokenObtainPairView):
    serializer_class = CustomTokenPairSerializer
    parser_classes = [FormParser, MultiPartParser]

    def post(self, request, *args, **kwargs):
        username = request.data["username"]
        password = request.data["password"]

        user = CustomUser.objects.filter(username=username).first()

        serializer = self.get_serializer(
            data=request.data, context={"request": request}
        )

        if not user or not user.check_password(password):
            return Response(
                {"error": "Invalid credentials"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer.is_valid(raise_exception=True)

        return Response(serializer.validated_data, status=status.HTTP_200_OK)


class CustomRefreshView(TokenRefreshView):
    serializer_class = CustomRefreshSerializer
    parser_classes = [FormParser, MultiPartParser]
