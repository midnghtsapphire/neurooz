#!/bin/bash
# Deploy Neurooz to DigitalOcean droplet
# This script builds the app, installs nginx if needed,
# and configures it to serve the SPA with proper OAuth redirect handling.
#
# 2026-11-14: from Audrey's machine, export DEPLOY_HOST and DEPLOY_USER
# (optional DEPLOY_PATH, DEPLOY_SSH_KEY) and run `npm run deploy:do`.
# That path builds here, rsyncs dist/ to the droplet, and reloads nginx.
# No secrets are written into the repo. The root-only section below is the
# previous on-droplet installer and still runs when DEPLOY_HOST is unset.

set -e

if [[ -n "${DEPLOY_HOST:-}" ]]; then
  set -euo pipefail
  if [[ -z "${DEPLOY_USER:-}" ]]; then
    echo "Error: set DEPLOY_USER (the SSH user on the droplet)." >&2
    exit 1
  fi
  DEPLOY_PATH="${DEPLOY_PATH:-/home/ubuntu/neurooz/dist}"
  REMOTE_APP="${DEPLOY_APP_DIR:-/home/ubuntu/neurooz}"
  SSH=(ssh)
  if [[ -n "${DEPLOY_SSH_KEY:-}" ]]; then
    SSH=(ssh -i "$DEPLOY_SSH_KEY" -o IdentitiesOnly=yes)
  fi

  echo "Building Neurooz locally..."
  npm run build

  echo "Copying dist/ to ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/"
  "${SSH[@]}" "${DEPLOY_USER}@${DEPLOY_HOST}" "mkdir -p '${DEPLOY_PATH}' '${REMOTE_APP}'"
  rsync -az -e "${SSH[*]}" dist/ "${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/"
  rsync -az -e "${SSH[*]}" nginx.conf "${DEPLOY_USER}@${DEPLOY_HOST}:${REMOTE_APP}/nginx.conf"
  rsync -az -e "${SSH[*]}" nginx/neurooz-security-headers.conf "${DEPLOY_USER}@${DEPLOY_HOST}:${REMOTE_APP}/neurooz-security-headers.conf"

  SUDO="sudo"
  if [[ "$DEPLOY_USER" == "root" ]]; then
    SUDO=""
  fi

  if ! "${SSH[@]}" "${DEPLOY_USER}@${DEPLOY_HOST}" "${SUDO} test -d /etc/letsencrypt/live/neurooz.com"; then
    echo "Error: no Let's Encrypt certificate for neurooz.com on the droplet." >&2
    echo "Run certbot on the droplet before this deploy. Do not switch DNS until this script succeeds." >&2
    exit 1
  fi

  echo "Reloading nginx on the droplet..."
  "${SSH[@]}" "${DEPLOY_USER}@${DEPLOY_HOST}" "${SUDO} mkdir -p /etc/nginx/snippets && ${SUDO} cp '${REMOTE_APP}/neurooz-security-headers.conf' /etc/nginx/snippets/neurooz-security-headers.conf && ${SUDO} cp '${REMOTE_APP}/nginx.conf' /etc/nginx/sites-available/neurooz && ${SUDO} ln -sfn /etc/nginx/sites-available/neurooz /etc/nginx/sites-enabled/neurooz && ${SUDO} nginx -t && ${SUDO} systemctl reload nginx"
  echo "Droplet copy finished."
  exit 0
fi

# On the droplet itself, the rest of this file must be run as root (or with sudo).

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
