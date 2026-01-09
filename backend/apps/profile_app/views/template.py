from apps.profile_app.models.template import Template
from apps.profile_app.serializers.template import TemplateSerializer
from django.db import models
from rest_framework import viewsets
from rest_framework.exceptions import PermissionDenied
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated


class TemplateViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing template instances.
    """

    serializer_class = TemplateSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [FormParser, MultiPartParser]
    http_method_names = ["get", "post", "patch", "delete"]

    def get_queryset(self):
        return Template.objects.filter(
            models.Q(user=self.request.user) | models.Q(user__isnull=True)
        )

    def perform_create(self, serializer):
        # Users can only create templates for themselves
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        # Can't edit system templates
        if serializer.instance.user is None:
            raise PermissionDenied("You cannot edit system templates.")

        # Can only edit your own templates
        if serializer.instance.user != self.request.user:
            raise PermissionDenied("You can only edit your own templates.")

        serializer.save()

    def perform_destroy(self, instance):
        # Can't delete system templates
        if instance.user is None:
            raise PermissionDenied("You cannot delete system templates.")

        # Can only delete your own templates
        if instance.user != self.request.user:
            raise PermissionDenied("You can only delete your own templates.")

        instance.delete()
