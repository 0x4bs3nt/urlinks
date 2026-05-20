import uuid

from django.conf import settings
from django.db import models


class UserSession(models.Model):
    class RevokedReason(models.TextChoices):
        LOGOUT = "logout", "Logout"
        USER_REVOKED = "user_revoked", "User Revoked"
        REVOKE_OTHERS = "revoke_others", "Revoke Others"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="sessions",
    )
    current_refresh_jti = models.CharField(max_length=255, unique=True, db_index=True)
    user_agent = models.TextField(blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    last_seen_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    revoked_at = models.DateTimeField(null=True, blank=True)
    revoked_reason = models.CharField(
        max_length=32,
        blank=True,
        choices=RevokedReason.choices,
    )

    class Meta:
        indexes = [
            models.Index(
                fields=["user", "revoked_at", "expires_at"],
                name="core_usersess_active_idx",
            ),
            models.Index(
                fields=["user", "last_seen_at"],
                name="core_usersess_seen_idx",
            ),
        ]

    def __str__(self):
        return f"{self.user_id}:{self.id}"
