# Production Deployment Guide

Complete step-by-step guide for deploying urlinks to production.

## Prerequisites

- Server with Ubuntu/Debian Linux
- Docker and Docker Compose installed
- Root/sudo access
- Domains pointing to your server's IP

## WARNING

Some Docker installations may require `sudo` to run Docker commands. It is
recommended to always use `sudo` when executing Docker commands, whether it
is needed or not, to avoid permission issues.

Furthermore, some Docker installations use `docker-compose` command while others
use `docker compose`. Adjust commands accordingly.

## Step-by-Step Deployment

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd urlinks/docker/production
```

### 2. Configure All Settings in Single File

Copy `config.env` to `.env` and edit all values:

```bash
cp config.env .env
vim .env  # or use your preferred editor
```

**All configuration is in one file** (`.env`). Update these sections:

#### Deployment Settings

```env
FRONTEND_DOMAIN=yourdomain.com
BACKEND_DOMAIN=api.yourdomain.com
FRONTEND_PORT=4000
BACKEND_PORT=9000
GUNICORN_WORKERS=4
```

#### Backend Settings

```env
SECRET_KEY=your-very-long-random-secret-key-here
DEBUG=False
ALLOWED_HOSTS=api.yourdomain.com,localhost
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
CSRF_TRUSTED_ORIGINS=https://api.yourdomain.com,localhost
FRONTEND_URL=https://yourdomain.com
```

#### Database Settings

```env
POSTGRES_DB=urlinks_prod
POSTGRES_USER=urlinks_user
POSTGRES_PASSWORD=your-secure-database-password
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
```

#### Email Settings (SMTP)

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-specific-password
```

#### Frontend Settings

```env
VITE_BE_URL=https://api.yourdomain.com
```

### 3. Start Docker Swarm

```bash
sudo docker swarm init
```

### 4. Start Service Stack Deployment

Run the automated deployment script:

```bash
sudo ./deploy.sh
```

### 5. Configure Nginx and SSL on Host

Run the automated script:

```bash
sudo ./configure_host.sh
```

Follow the prompts:

- It will create nginx configurations
- Enable the sites
- Test the configuration
- Ask if you want to reload nginx (say 'y')
- Ask if you want to set up SSL (say 'y' if DNS is configured)

### 6. Verify Deployment

```bash
# Check Docker services
sudo docker service ls
```

Make sure all services are running with desired replicas:

- `urlinks_backend` 2/2 replicas
- `urlinks_frontend` 2/2 replicas
- `urlinks_postgres` 1/1 replicas

```bash
# Check Docker containers
sudo docker ps

# Check nginx
sudo systemctl status nginx
```

### 7. After Deployment

Make sure to run any necessary commands inside only one container replica,
for example, to run Django migrations:

```bash
# Choose one running backend container ID
sudo docker exec -it [CONTAINER_ID] python manage.py migrate
```

### 8. Monitor Celery Tasks

Check Celery worker status:

```bash
# View celery-worker logs
sudo docker service logs -f orthodox_celery-worker

# View celery-beat logs (scheduled tasks)
sudo docker service logs -f orthodox_celery-beat

# Inspect Celery workers
sudo docker exec -it [CELERY_WORKER_CONTAINER_ID] celery -A project inspect active
```

## Maintenance

### Update Application

```bash
git pull
cd docker/production
sudo ./deploy.sh
```

## Quick Reference

### Important Files

- `config.env` - Template with all configuration options (copy to `.env`)
- `.env` - **Single configuration file** with all environment variables (not in git)
- `docker-compose.yml` - Container definitions
- `deploy.sh` - Automated deployment script
- `configure_host.sh` - Nginx and SSL configuration script
