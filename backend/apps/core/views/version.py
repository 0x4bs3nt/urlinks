from apps.core.serializers.version import VersionSerializer
from project.version import get_version
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView


class VersionView(APIView):
    """
    Return the current application version
    """

    serializer_class = VersionSerializer

    def get(self, request, *args, **kwargs):
        """
        Returns the application version and name
        """
        return Response(
            {
                "version": get_version(),
                "name": "urlinks",
            },
            status=status.HTTP_200_OK,
        )
