from apps.core.serializers.health import HealthCheckSerializer
from django.db import connection
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView


class HealthCheckView(APIView):
    """
    Verify backend service is running
    """

    serializer_class = HealthCheckSerializer

    def get(self, request, *args, **kwargs):
        """
        Returns 200 if healthy
        """

        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1;")

                return Response({"status": "healthy"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"status": "unhealthy", "error": str(e)},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
