from datetime import timedelta
from uuid import UUID

from apps.core.models import UserSession
from django.utils import timezone
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.authentication import JWTAuthentication


class SessionBoundJWTAuthentication(JWTAuthentication):
    session_error = "Session is no longer active."

    def authenticate(self, request):
        result = super().authenticate(request)
        if result is None:
            return None

        user, validated_token = result
        session_id = validated_token.get("sid")

        if not session_id:
            raise AuthenticationFailed(self.session_error)

        try:
            parsed_session_id = UUID(str(session_id))
        except ValueError as exc:
            raise AuthenticationFailed(self.session_error) from exc

        session = UserSession.objects.filter(id=parsed_session_id, user=user).first()
        now = timezone.now()

        if not session or session.revoked_at or session.expires_at < now:
            raise AuthenticationFailed(self.session_error)

        if session.last_seen_at <= now - timedelta(minutes=5):
            UserSession.objects.filter(pk=session.pk).update(last_seen_at=now)
            session.last_seen_at = now

        request.user_session = session

        return user, validated_token
