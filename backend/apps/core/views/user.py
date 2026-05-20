from apps.core.models.user import CustomUser
from apps.core.serializers.user import (
    CustomRefreshSerializer,
    CustomTokenPairSerializer,
    RegisterSerializer,
)
from apps.core.utils.request import get_client_ip
from apps.core.utils.turnstile import verify_turnstile_token
from rest_framework import generics, status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


class CustomTokenPairView(TokenObtainPairView):
    serializer_class = CustomTokenPairSerializer
    parser_classes = [FormParser, MultiPartParser]

    def post(self, request, *args, **kwargs):
        turnstile_token = request.data.get("cf-turnstile-response")
        if not turnstile_token:
            return Response(
                {"error": "Captcha token is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        client_ip = get_client_ip(request)

        if not verify_turnstile_token(turnstile_token, client_ip):
            return Response(
                {"error": "Captcha verification failed"},
                status=status.HTTP_400_BAD_REQUEST,
            )

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


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    parser_classes = [FormParser, MultiPartParser]

    def post(self, request, *args, **kwargs):
        turnstile_token = request.data.get("cf-turnstile-response")
        if not turnstile_token:
            return Response(
                {"error": "Captcha token is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        client_ip = get_client_ip(request)

        if not verify_turnstile_token(turnstile_token, client_ip):
            return Response(
                {"error": "Captcha verification failed"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if CustomUser.objects.filter(username=request.data.get("username")).exists():
            return Response(
                {"error": "Username already in use"}, status=status.HTTP_400_BAD_REQUEST
            )

        if CustomUser.objects.filter(email=request.data.get("email")).exists():
            return Response(
                {"error": "Email already in use"}, status=status.HTTP_400_BAD_REQUEST
            )

        serializer = self.get_serializer(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)

        user = serializer.save()

        if user:
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(
            {"error": "Something went while creating your account."},
            status=status.HTTP_400_BAD_REQUEST,
        )
