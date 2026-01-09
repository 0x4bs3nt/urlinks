from apps.profile_app.models.link import Link
from apps.profile_app.serializers.link import LinkSerializer
from rest_framework import viewsets
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated


class LinkViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing link instances.
    """

    serializer_class = LinkSerializer
    parser_classes = [FormParser, MultiPartParser]
    permission_classes = [IsAuthenticated]
    http_method_names = ["get", "post", "patch", "delete"]

    def get_queryset(self):
        return Link.objects.filter(page__user=self.request.user)

    def perform_create(self, serializer):
        page = serializer.validated_data.get("page")
        if page.user != self.request.user:
            raise PermissionDenied("You can only add links to your own page.")

        serializer.save()

    def perform_update(self, serializer):
        if serializer.instance.page.user != self.request.user:
            raise PermissionDenied("You can only edit your own links.")
        new_page = serializer.validated_data.get("page")

        if new_page and new_page.user != self.request.user:
            raise ValidationError({"page": "You can only move links to your own page."})

        serializer.save()

    def perform_destroy(self, instance):
        if instance.page.user != self.request.user:
            raise PermissionDenied("You can only delete your own links.")

        instance.delete()
