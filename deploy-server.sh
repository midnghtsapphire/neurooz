#!/bin/bash
# Deploy Neurooz to DigitalOcean droplet
# This script builds the app, installs nginx if needed,
# and configures it to serve the SPA with proper OAuth redirect handling.
# Must be run as root (or with sudo).

set -e

# Ensure running as root
if [ "$(id -u)" -ne 0 ]; then
  echo "Error: this script must be run as root (use sudo)." >&2
  exit 1
fi

APP_DIR="/home/ubuntu/neurooz"
DIST_DIR="$APP_DIR/dist"
NGINX_CONF="/etc/nginx/sites-available/neurooz"
NGINX_ENABLED="/etc/nginx/sites-enabled/neurooz"
NGINX_DEFAULT="/etc/nginx/sites-enabled/default"

echo "=== Neurooz Deployment ==="

# Install nginx if not present
if ! command -v nginx &> /dev/null; then
  echo "Installing nginx..."
  apt-get update -qq && apt-get install -y nginx
fi

# Build the app (if node_modules present)
if [ -f "$APP_DIR/package.json" ] && [ -d "$APP_DIR/node_modules" ]; then
  echo "Building app..."
  cd "$APP_DIR"
  npm run build
fi

# Copy nginx config
echo "Configuring nginx..."
cp "$APP_DIR/nginx.conf" "$NGINX_CONF"

# Enable site
ln -sf "$NGINX_CONF" "$NGINX_ENABLED"

# Remove default site if it exists
[ -L "$NGINX_DEFAULT" ] && rm -f "$NGINX_DEFAULT"

# Test and reload nginx
nginx -t && systemctl reload nginx

echo "=== Deployment complete ==="
echo "App is being served by nginx from $DIST_DIR"
echo ""
echo "IMPORTANT: Enable HTTPS to secure OAuth tokens in transit:"
echo "  sudo apt-get install -y certbot python3-certbot-nginx"
echo "  sudo certbot --nginx -d growlingeyes.com -d www.growlingeyes.com"
