#!/bin/bash
set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}=== Deploying urlinks Application ===${NC}"

# Load environment variables from .env file
echo -e "${YELLOW}Loading environment variables...${NC}"
if [ -f .env ]; then
	export $(cat .env | grep -v '^#' | xargs)
	echo "  ✓ Loaded .env"
else
	echo -e "${RED}  ✗ Warning: .env file not found${NC}"
fi

# Show configuration
echo -e "${YELLOW}Configuration:${NC}"
echo "  Backend Port: ${BACKEND_PORT:-9000}"
echo "  Frontend Port: ${FRONTEND_PORT:-4000}"
echo ""

# Check if swarm is initialized
if ! sudo docker info | grep -q "Swarm: active"; then
	echo -e "${YELLOW}Initializing Docker Swarm...${NC}"
	sudo docker swarm init
fi

# Create volumes if they don't exist
echo -e "${YELLOW}Checking Docker volumes...${NC}"
for volume in urlinks_postgres_data urlinks_backend_static urlinks_backend_media; do
	if ! sudo docker volume inspect $volume >/dev/null 2>&1; then
		echo "  Creating volume: $volume"
		sudo docker volume create $volume
	else
		echo "  ✓ Volume exists: $volume"
	fi
done
echo ""

# Build images (force rebuild to pick up changes)
echo -e "${YELLOW}Building images (this may take a moment)...${NC}"
sudo docker compose build --no-cache

# Force docker to use new images by updating with --force
echo -e "${YELLOW}Deploying stack with updated images...${NC}"
sudo -E BACKEND_PORT=${BACKEND_PORT:-9000} \
	FRONTEND_PORT=${FRONTEND_PORT:-4000} \
	POSTGRES_DB=${POSTGRES_DB} \
	POSTGRES_USER=${POSTGRES_USER} \
	POSTGRES_PASSWORD=${POSTGRES_PASSWORD} \
	SECRET_KEY=${DJANGO_SECRET_KEY} \
	DEBUG=${DJANGO_DEBUG} \
	ALLOWED_HOSTS=${DJANGO_ALLOWED_HOSTS} \
	VITE_BE_URL=${VITE_BE_URL} \
	GUNICORN_WORKERS=${GUNICORN_WORKERS} \
	docker stack deploy -c docker-compose.yml urlinks

# Force service update to pull new image
echo -e "${YELLOW}Forcing service update...${NC}"
sudo docker service update --force --image urlinks-backend:latest urlinks_backend
sudo docker service update --force --image urlinks-frontend:latest urlinks_frontend

# Wait for services to stabilize
echo -e "${YELLOW}Waiting for services to stabilize...${NC}"
sleep 10

# Show initial status
echo -e "${GREEN}=== Initial Service Status ===${NC}"
sudo docker stack services urlinks

echo ""
echo -e "${GREEN}Deployment complete!${NC}"
echo "Backend: http://localhost:${BACKEND_PORT:-9000}"
echo "Frontend: http://localhost:${FRONTEND_PORT:-4000}"
echo ""
echo "Monitor with: sudo watch -n 2 'docker service ls'"
echo "View logs: sudo docker service logs -f urlinks_backend"
echo ""

echo -e "${YELLOW}Monitoring deployment (Ctrl+C to exit)...${NC}"
sudo watch -n 2 'docker service ls && echo && docker service ps urlinks_backend urlinks_frontend'
