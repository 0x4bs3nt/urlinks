from apps.profile_app.models.link import Link
from apps.profile_app.serializers.link import LinkSerializer
from rest_framework import viewsets
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
