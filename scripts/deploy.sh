#!/bin/bash
set -e

# Simple Deployment Script for SIP Website
# Usage: ./deploy.sh <image_tag>

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(dirname "$SCRIPT_DIR")"

IMAGE_TAG="${1:-latest}"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

log() { echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"; }
success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

log "Deploying sip-website with tag: $IMAGE_TAG"

cd "$APP_DIR"

# Set the image tag
export IMAGE_TAG="$IMAGE_TAG"

# Stop and remove old blue-green containers if they exist (migration from blue-green)
log "Cleaning up old blue-green containers..."
docker stop sip-website-blue sip-website-green sip-website-staging 2>/dev/null || true
docker rm sip-website-blue sip-website-green sip-website-staging 2>/dev/null || true

# Pull new image
log "Pulling image: ghcr.io/sip-protocol/sip-website:$IMAGE_TAG"
docker compose pull

# Stop old container and start new one
log "Restarting container..."
docker compose up -d --force-recreate

# Wait for container to be healthy
log "Waiting for health check..."
MAX_RETRIES=30
RETRY_COUNT=0
CONTAINER_NAME="sip-website"

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    HEALTH=$(docker inspect --format='{{.State.Health.Status}}' "$CONTAINER_NAME" 2>/dev/null || echo "unknown")

    if [ "$HEALTH" = "healthy" ]; then
        success "Container is healthy!"
        break
    fi

    RETRY_COUNT=$((RETRY_COUNT + 1))
    log "Health check attempt $RETRY_COUNT/$MAX_RETRIES (status: $HEALTH)"
    sleep 2
done

if [ "$HEALTH" != "healthy" ]; then
    error "Container failed health check after $MAX_RETRIES attempts"
fi

# Verify the application responds
log "Verifying application response..."
if command -v curl &> /dev/null; then
    if curl -sf "http://localhost:5000/" > /dev/null; then
        success "Application responding on port 5000"
    else
        error "Application not responding on port 5000"
    fi
elif command -v wget &> /dev/null; then
    if wget -q --spider "http://localhost:5000/"; then
        success "Application responding on port 5000"
    else
        error "Application not responding on port 5000"
    fi
else
    log "No curl/wget available, trusting Docker health check"
fi

# Clean up old images
log "Cleaning up old images..."
docker image prune -f --filter "until=24h"

success "Deployment complete! Site live at https://sip-protocol.org"
