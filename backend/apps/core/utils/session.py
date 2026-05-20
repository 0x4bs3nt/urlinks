from datetime import datetime, timezone as dt_timezone

from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken


def get_token_expiry(token):
    return datetime.fromtimestamp(token["exp"], tz=dt_timezone.utc)


def blacklist_refresh_jti(refresh_jti):
    if not refresh_jti:
        return

    token = OutstandingToken.objects.filter(jti=refresh_jti).first()
    if token:
        BlacklistedToken.objects.get_or_create(token=token)
