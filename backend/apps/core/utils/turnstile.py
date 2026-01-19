import os

import requests
from django.conf import settings


def verify_turnstile_token(token: str, remote_ip: str | None = None) -> bool:
    """
    Verify a Cloudflare Turnstile token.

    Returns True if verification succeeds or if in DEBUG mode.
    """
    if settings.DEBUG:
        return True

    secret_key = os.getenv("CF_TURNSTILE_SECRET_KEY")
    if not secret_key:
        return True

    try:
        response = requests.post(
            "https://challenges.cloudflare.com/turnstile/v0/siteverify",
            data={
                "secret": secret_key,
                "response": token,
                **({"remoteip": remote_ip} if remote_ip else {}),
            },
            timeout=10,
        )
        result = response.json()
        return result.get("success", False)
    except requests.RequestException:
        return False
