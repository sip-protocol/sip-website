#!/bin/bash
set -e

# Blue-Green Deployment Script for SIP Website
# Usage: ./deploy.sh <image_tag> [staging]

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(dirname "$SCRIPT_DIR")"
ACTIVE_FILE="$APP_DIR/active.txt"

IMAGE_TAG="${1:-latest}"
DEPLOY_TYPE="${2:-production}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log() { echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"; }
success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# Handle staging deployment
if [ "$DEPLOY_TYPE" = "staging" ]; then
    log "Deploying to staging with tag: $IMAGE_TAG"

    cd "$APP_DIR"
    export STAGING_TAG="$IMAGE_TAG"

    # Pull new image
    docker compose pull staging

    # Deploy staging
    docker compose --profile staging up -d staging

    # Wait for health check
    sleep 5
    if docker inspect --format='{{.State.Health.Status}}' sip-website-staging 2>/dev/null | grep -q healthy; then
        success "Staging deployed successfully at port 5002"
    else
        warn "Staging container started but health check pending"
    fi

    exit 0
fi

# Production blue-green deployment
log "Starting blue-green deployment with tag: $IMAGE_TAG"

cd "$APP_DIR"

# Determine current active slot
if [ -f "$ACTIVE_FILE" ]; then
    CURRENT=$(cat "$ACTIVE_FILE")
else
    CURRENT="green"  # Default to green, so first deploy goes to blue
    echo "$CURRENT" > "$ACTIVE_FILE"
fi

# Determine target slot (opposite of current)
if [ "$CURRENT" = "blue" ]; then
    TARGET="green"
    TARGET_PORT="5001"
else
    TARGET="blue"
    TARGET_PORT="5000"
fi

log "Current active: $CURRENT | Deploying to: $TARGET"

# Export the tag for the target slot
if [ "$TARGET" = "blue" ]; then
    export BLUE_TAG="$IMAGE_TAG"
else
    export GREEN_TAG="$IMAGE_TAG"
fi

# Pull new image
log "Pulling image: ghcr.io/sip-protocol/sip-website:$IMAGE_TAG"
docker compose pull "$TARGET"

# Start the target container
log "Starting $TARGET container..."
docker compose up -d "$TARGET"

# Wait for container to be healthy
log "Waiting for health check..."
MAX_RETRIES=30
RETRY_COUNT=0
CONTAINER_NAME="sip-website-$TARGET"

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    HEALTH=$(docker inspect --format='{{.State.Health.Status}}' "$CONTAINER_NAME" 2>/dev/null || echo "unknown")

    if [ "$HEALTH" = "healthy" ]; then
        success "$TARGET container is healthy!"
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
if curl -sf "http://localhost:$TARGET_PORT/" > /dev/null; then
    success "Application responding on port $TARGET_PORT"
else
    error "Application not responding on port $TARGET_PORT"
fi

# Switch active slot
echo "$TARGET" > "$ACTIVE_FILE"
success "Active slot switched to: $TARGET"

# Update nginx config to point to new active upstream
NGINX_CONF="/etc/nginx/sites-available/sip-protocol.org"
if [ -f "$NGINX_CONF" ]; then
    log "Switching nginx to $TARGET upstream..."

    # Determine old and new upstream names
    if [ "$TARGET" = "blue" ]; then
        OLD_UPSTREAM="sip_green"
        NEW_UPSTREAM="sip_blue"
    else
        OLD_UPSTREAM="sip_blue"
        NEW_UPSTREAM="sip_green"
    fi

    # Replace upstream references in nginx config
    sudo sed -i "s|proxy_pass http://$OLD_UPSTREAM;|proxy_pass http://$NEW_UPSTREAM;|g" "$NGINX_CONF"
    sudo sed -i "s|# ACTIVE_UPSTREAM: $OLD_UPSTREAM|# ACTIVE_UPSTREAM: $NEW_UPSTREAM|g" "$NGINX_CONF"

    # Test and reload nginx
    if sudo nginx -t 2>/dev/null; then
        sudo systemctl reload nginx
        success "Nginx switched to $TARGET"
    else
        error "Nginx config test failed!"
    fi
fi

# Clean up old images (keep last 3)
log "Cleaning up old images..."
docker image prune -f --filter "until=24h"

success "Deployment complete!"
log "Active: $TARGET (port $TARGET_PORT)"
log "Standby: $CURRENT (ready for rollback)"
