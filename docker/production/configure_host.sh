#!/bin/bash
set -e

# Check if running with sudo - REQUIRED for this script
if [ "$EUID" -ne 0 ]; then
	echo "Error: This script must be run with elevated privileges."
	echo "Please run: sudo ./configure_host.sh"
	exit 1
fi

if [ ! -f ".env" ]; then
	echo "Error: config.env not found!"
	exit 1
fi

source .env

echo "Generating nginx configuration files..."
echo "Frontend: ${FRONTEND_DOMAIN} -> localhost:${FRONTEND_PORT}"
echo "Backend: ${BACKEND_DOMAIN} -> localhost:${BACKEND_PORT}"
echo ""

FRONTEND_CONF="/etc/nginx/sites-available/${FRONTEND_DOMAIN}.conf"
BACKEND_CONF="/etc/nginx/sites-available/${BACKEND_DOMAIN}.conf"

# Generate frontend nginx config
cat >"$FRONTEND_CONF" <<EOF
# Frontend configuration for ${FRONTEND_DOMAIN}

server {
    listen 80;
    server_name ${FRONTEND_DOMAIN};

    location / {
        proxy_pass http://127.0.0.1:${FRONTEND_PORT};
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Generate backend nginx config
cat >"$BACKEND_CONF" <<EOF
# Backend API configuration for ${BACKEND_DOMAIN}

server {
    listen 80;
    server_name ${BACKEND_DOMAIN};

    location / {
        proxy_pass http://127.0.0.1:${BACKEND_PORT};
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;

        # API timeouts
        proxy_connect_timeout 120s;
        proxy_send_timeout 120s;
        proxy_read_timeout 120s;

        # Allow larger request bodies
        client_max_body_size 50M;
    }
}
EOF

echo "✓ Configuration files created"
echo ""

# Enable frontend site
if [ ! -L "/etc/nginx/sites-enabled/${FRONTEND_DOMAIN}.conf" ]; then
	ln -s "/etc/nginx/sites-available/${FRONTEND_DOMAIN}.conf" "/etc/nginx/sites-enabled/${FRONTEND_DOMAIN}.conf"
	echo "✓ Enabled ${FRONTEND_DOMAIN}"
else
	echo "  ${FRONTEND_DOMAIN} already enabled"
fi

# Enable backend site
if [ ! -L "/etc/nginx/sites-enabled/${BACKEND_DOMAIN}.conf" ]; then
	ln -s "/etc/nginx/sites-available/${BACKEND_DOMAIN}.conf" "/etc/nginx/sites-enabled/${BACKEND_DOMAIN}.conf"
	echo "✓ Enabled ${BACKEND_DOMAIN}"
else
	echo "  ${BACKEND_DOMAIN} already enabled"
fi

echo ""
echo "Testing nginx configuration..."
if nginx -t 2>&1; then
	echo ""
	echo "✓ Nginx configuration is valid!"
	echo ""
	echo "Next steps:"
	echo "  1. Reload nginx: sudo systemctl reload nginx"
	echo "  2. Set up SSL"
	echo ""
	echo "Reload now and set up SSL:"
	read -p "Reload nginx now? (y/n) " -n 1 -r
	echo
	if [[ $REPLY =~ ^[Yy]$ ]]; then
		systemctl reload nginx
		echo "✓ Nginx reloaded successfully"
		echo ""
		echo "Set up SSL certificates now? This requires DNS to be properly configured."
		read -p "Set up SSL with Let's Encrypt? (y/n) " -n 1 -r
		echo
		if [[ $REPLY =~ ^[Yy]$ ]]; then
			# Check if certbot is installed
			if ! command -v certbot &>/dev/null; then
				echo "Installing certbot..."
				apt update
				apt install -y certbot python3-certbot-nginx
			fi

			echo ""
			echo "Getting certificate for ${FRONTEND_DOMAIN}..."
			certbot --nginx -d ${FRONTEND_DOMAIN}

			echo ""
			echo "Getting certificate for ${BACKEND_DOMAIN}..."
			certbot --nginx -d ${BACKEND_DOMAIN}

			echo ""
			echo "✓ SSL certificates installed successfully!"
		fi
	fi
else
	echo ""
	echo "✗ Nginx configuration has errors. Please fix them before reloading."
	exit 1
fi
