from apps.profile_app.models.page import Page
from apps.profile_app.serializers.page import PageSerializer
from django.db import models
from rest_framework import viewsets
from rest_framework.exceptions import PermissionDenied
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticatedOrReadOnly


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
