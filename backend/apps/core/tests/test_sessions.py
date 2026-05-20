from unittest.mock import patch

from apps.core.models import CustomUser, UserSession
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient, APITestCase
from rest_framework_simplejwt.tokens import RefreshToken


class SessionManagementTests(APITestCase):
    password = "test-password-123"

    def create_user(self, username, email):
        return CustomUser.objects.create_user(
            username=username,
            email=email,
            password=self.password,
            is_active=True,
        )

    def login_user(self, username, password=None):
        client = APIClient()
        with patch("apps.core.views.user.verify_turnstile_token", return_value=True):
            response = client.post(
                reverse("token-obtain"),
                {
                    "username": username,
                    "password": password or self.password,
                    "cf-turnstile-response": "turnstile-token",
                },
                format="multipart",
                HTTP_USER_AGENT="Session Test Browser",
                HTTP_X_FORWARDED_FOR="198.51.100.10",
            )

        return client, response

    def authorize(self, token):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

    def test_login_creates_session_and_returns_session_id(self):
        user = self.create_user("alice", "alice@example.com")

        _, response = self.login_user(user.username)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("session_id", response.data)

        session = UserSession.objects.get(id=response.data["session_id"], user=user)
        refresh = RefreshToken(response.data["refresh"])

        self.assertEqual(str(refresh["sid"]), str(session.id))
        self.assertEqual(session.current_refresh_jti, refresh["jti"])
        self.assertEqual(session.user_agent, "Session Test Browser")
        self.assertEqual(session.ip_address, "198.51.100.10")

    def test_session_bound_auth_rejects_legacy_access_tokens_without_sid(self):
        user = self.create_user("legacy", "legacy@example.com")

        legacy_access = str(RefreshToken.for_user(user).access_token)
        self.authorize(legacy_access)

        response = self.client.get(reverse("session-list"))

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_refresh_rotates_current_session_and_rejects_replay(self):
        user = self.create_user("refresh", "refresh@example.com")

        _, login_response = self.login_user(user.username)
        old_refresh = login_response.data["refresh"]
        session = UserSession.objects.get(id=login_response.data["session_id"])

        refresh_response = self.client.post(
            reverse("token-refresh"),
            {"refresh": old_refresh},
            format="multipart",
            HTTP_USER_AGENT="Rotated Browser",
            HTTP_X_FORWARDED_FOR="203.0.113.11",
        )

        self.assertEqual(refresh_response.status_code, status.HTTP_200_OK)
        self.assertIn("refresh", refresh_response.data)

        session.refresh_from_db()
        new_refresh = RefreshToken(refresh_response.data["refresh"])

        self.assertNotEqual(new_refresh["jti"], RefreshToken(old_refresh)["jti"])
        self.assertEqual(session.current_refresh_jti, new_refresh["jti"])
        self.assertEqual(session.user_agent, "Rotated Browser")
        self.assertEqual(session.ip_address, "203.0.113.11")

        replay_response = self.client.post(
            reverse("token-refresh"),
            {"refresh": old_refresh},
            format="multipart",
        )

        self.assertEqual(replay_response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_session_revoke_endpoint_enforces_ownership(self):
        owner = self.create_user("owner", "owner@example.com")
        intruder = self.create_user("intruder", "intruder@example.com")

        _, owner_login = self.login_user(owner.username)
        _, intruder_login = self.login_user(intruder.username)

        self.authorize(owner_login.data["access"])
        response = self.client.post(
            reverse("session-revoke", kwargs={"session_id": intruder_login.data["session_id"]})
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_logout_revokes_current_session_and_blocks_existing_access_token(self):
        user = self.create_user("logout", "logout@example.com")

        _, login_response = self.login_user(user.username)
        session = UserSession.objects.get(id=login_response.data["session_id"])

        self.authorize(login_response.data["access"])
        logout_response = self.client.post(reverse("logout"))

        self.assertEqual(logout_response.status_code, status.HTTP_200_OK)

        session.refresh_from_db()
        self.assertIsNotNone(session.revoked_at)
        self.assertEqual(session.revoked_reason, UserSession.RevokedReason.LOGOUT)

        blocked_response = self.client.get(reverse("session-list"))

        self.assertEqual(blocked_response.status_code, status.HTTP_401_UNAUTHORIZED)
