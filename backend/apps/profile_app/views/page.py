from apps.profile_app.models.page import Page
from apps.profile_app.serializers.page import PageSerializer
from django.db import models
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response


class PageViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing page instances.
    """

    serializer_class = PageSerializer
    parser_classes = [FormParser, MultiPartParser]
    permission_classes = [IsAuthenticatedOrReadOnly]
    http_method_names = ["get", "post", "patch", "delete"]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Page.objects.filter(
                models.Q(is_published=True) | models.Q(user=self.request.user)
            ).prefetch_related("links")
        else:
            return Page.objects.filter(is_published=True).prefetch_related("links")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        if serializer.instance.user != self.request.user:
            raise PermissionDenied("You can only edit your own page.")

        serializer.save()

    def perform_destroy(self, instance):
        if instance.user != self.request.user:
            raise PermissionDenied("You can only delete your own page.")

        instance.delete()

    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated])
    def personal_page(self, request):
        """
        Returns the authenticated user's page. Returns 400 if the user doesn't have a page yet.
        """
        page = Page.objects.filter(user=request.user).prefetch_related("links").first()

        if not page:
            return Response(
                {"error": "You don't have a page yet."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = self.get_serializer(page)

        return Response(serializer.data)

    @action(detail=False, methods=["post"], permission_classes=[IsAuthenticated])
    def toggle_publish(self, request):
        """
        Toggle the published status of the authenticated user's page.
        No need to provide any data in the request body.
        """
        page = Page.objects.filter(user=request.user).first()

        if not page:
            return Response(
                {"error": "You don't have a page yet."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        page.is_published = not page.is_published
        page.save(update_fields=["is_published"])

        return Response({"is_published": page.is_published})
