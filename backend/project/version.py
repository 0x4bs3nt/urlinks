import os
from functools import lru_cache
from pathlib import Path


@lru_cache(maxsize=1)
def get_version() -> str:
    """
    Read the application version.
    Priority: APP_VERSION env var > VERSION file > fallback
    """
    env_version = os.getenv("APP_VERSION")
    if env_version:
        return env_version.strip()

    version_file = Path(__file__).resolve().parent.parent.parent / "VERSION"

    try:
        return version_file.read_text().strip()
    except FileNotFoundError:
        return "0.0.0-unknown"
