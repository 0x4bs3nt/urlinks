#!/bin/bash
set -e

echo "Starting urlinks backend (development)..."

WORKERS=${GUNICORN_WORKERS:-4}

echo "Starting Gunicorn with ${WORKERS} workers (development mode with --reload)..."
exec gunicorn --bind 0.0.0.0:8000 \
	--workers ${WORKERS} \
	--timeout 120 \
	--reload \
	--log-level debug \
	--access-logfile - \
	--error-logfile - \
	project.wsgi:application
