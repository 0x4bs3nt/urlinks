FROM python:3.13.3-slim-bookworm

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

RUN apt-get update && apt-get install -y curl nginx && rm -rf /var/lib/apt/lists/*

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

COPY backend/pyproject.toml .
RUN uv pip install --system -r pyproject.toml

COPY backend/ .

# Copy nginx configuration
COPY docker/production/backend/nginx.conf /etc/nginx/sites-available/default

# Create directories for static/media files
RUN mkdir -p /app/static /app/media

# Copy startup script
COPY docker/production/backend/start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 80

CMD ["/start.sh"]
