#!/bin/bash
set -e

echo "Starting urlinks backend..."

echo "Waiting for PostgreSQL..."
until python << END
import sys
import psycopg2
import os

try:
    conn = psycopg2.connect(
        dbname=os.environ['POSTGRES_DB'],
        user=os.environ['POSTGRES_USER'],
        password=os.environ['POSTGRES_PASSWORD'],
        host=os.environ['POSTGRES_HOST'],
        port=os.environ.get('POSTGRES_PORT', '5432')
    )
    conn.close()
    sys.exit(0)
except psycopg2.OperationalError:
    sys.exit(1)
END
do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 1
done

echo "PostgreSQL is up - continuing..."

# Load environment variables from .env file
echo -e "${YELLOW}Loading environment variables...${NC}"
if [ -f .env ]; then
    set -a
    source .env
    set +a
    echo "  ✓ Loaded .env"
else
    echo -e "${RED}  ✗ Warning: .env file not found${NC}"
fi

WORKERS=${GUNICORN_WORKERS:-4}

echo "Starting Gunicorn with ${WORKERS} workers..."
gunicorn --bind 127.0.0.1:8000 \
    --workers ${WORKERS} \
    --timeout 120 \
    --log-level debug \
    --access-logfile - \
    --error-logfile - \
    project.wsgi:application &

echo "Starting nginx..."
nginx -g "daemon off;"
