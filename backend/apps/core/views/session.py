from django.db.models import Case, IntegerField, Value, When
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.core.models import UserSession
from apps.core.serializers import SessionSerializer
from apps.core.utils.session import blacklist_refresh_jti


def revoke_session(session, reason):
    if not session.revoked_at:
        session.revoked_at = timezone.now()
        session.revoked_reason = reason
        session.save(update_fields=["revoked_at", "revoked_reason"])

    blacklist_refresh_jti(session.current_refresh_jti)


class SessionListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        current_session = getattr(request, "user_session", None)
        current_session_id = current_session.id if current_session else None

        sessions = (
            UserSession.objects.filter(
                user=request.user,
                revoked_at__isnull=True,
                expires_at__gte=timezone.now(),
            )
            .annotate(
                current_rank=Case(
                    When(id=current_session_id, then=Value(0)),
                    default=Value(1),
                    output_field=IntegerField(),
                )
            )
            .order_by("current_rank", "-last_seen_at")
        )

        serializer = SessionSerializer(
            sessions,
            many=True,
            context={"current_session_id": current_session_id},
        )
        return Response(serializer.data, status=status.HTTP_200_OK)


class SessionRevokeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, session_id):
        current_session = getattr(request, "user_session", None)
        if current_session and current_session.id == session_id:
            return Response(
                {"error": "Use the logout endpoint to revoke the current session."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        session = get_object_or_404(UserSession, id=session_id, user=request.user)
        revoke_session(session, UserSession.RevokedReason.USER_REVOKED)

        return Response({"detail": "Session revoked."}, status=status.HTTP_200_OK)


class SessionRevokeOthersView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        current_session = getattr(request, "user_session", None)
        sessions = UserSession.objects.filter(
            user=request.user,
            revoked_at__isnull=True,
            expires_at__gte=timezone.now(),
        )

        if current_session:
            sessions = sessions.exclude(id=current_session.id)

        revoked_count = 0
        for session in sessions:
            revoke_session(session, UserSession.RevokedReason.REVOKE_OTHERS)
            revoked_count += 1

        return Response(
            {"detail": "Other sessions revoked.", "revoked_count": revoked_count},
            status=status.HTTP_200_OK,
        )


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        session = getattr(request, "user_session", None)
        if session:
            revoke_session(session, UserSession.RevokedReason.LOGOUT)

        return Response({"detail": "Logged out."}, status=status.HTTP_200_OK)
