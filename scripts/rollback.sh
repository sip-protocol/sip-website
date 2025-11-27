#!/bin/bash
set -e

# Instant Rollback Script for SIP Website
# Switches traffic back to the previous (standby) container

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(dirname "$SCRIPT_DIR")"
ACTIVE_FILE="$APP_DIR/active.txt"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() { echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"; }
success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# Check active file exists
if [ ! -f "$ACTIVE_FILE" ]; then
    error "No active deployment found. Cannot rollback."
fi

CURRENT=$(cat "$ACTIVE_FILE")

# Determine rollback target
if [ "$CURRENT" = "blue" ]; then
    TARGET="green"
    TARGET_PORT="5001"
else
    TARGET="blue"
    TARGET_PORT="5000"
fi

log "Current active: $CURRENT"
log "Rolling back to: $TARGET"

# Verify rollback target is running
CONTAINER_NAME="sip-website-$TARGET"
if ! docker ps --format '{{.Names}}' | grep -q "$CONTAINER_NAME"; then
    error "Rollback target ($TARGET) is not running!"
fi

# Verify rollback target is healthy
HEALTH=$(docker inspect --format='{{.State.Health.Status}}' "$CONTAINER_NAME" 2>/dev/null || echo "unknown")
if [ "$HEALTH" != "healthy" ]; then
    warn "Rollback target health status: $HEALTH (proceeding anyway)"
fi

# Verify the application responds
log "Verifying rollback target responds..."
if curl -sf "http://localhost:$TARGET_PORT/" > /dev/null; then
    success "Rollback target responding on port $TARGET_PORT"
else
    error "Rollback target not responding on port $TARGET_PORT"
fi

# Switch active slot
echo "$TARGET" > "$ACTIVE_FILE"
success "Active slot switched to: $TARGET"

# Update nginx config to point to rollback upstream
NGINX_CONF="/etc/nginx/sites-available/sip-protocol.org"
if [ -f "$NGINX_CONF" ]; then
    log "Switching nginx to $TARGET upstream..."

    if [ "$TARGET" = "blue" ]; then
        OLD_UPSTREAM="sip_green"
        NEW_UPSTREAM="sip_blue"
    else
        OLD_UPSTREAM="sip_blue"
        NEW_UPSTREAM="sip_green"
    fi

    sudo sed -i "s|proxy_pass http://$OLD_UPSTREAM;|proxy_pass http://$NEW_UPSTREAM;|g" "$NGINX_CONF"
    sudo sed -i "s|# ACTIVE_UPSTREAM: $OLD_UPSTREAM|# ACTIVE_UPSTREAM: $NEW_UPSTREAM|g" "$NGINX_CONF"

    if sudo nginx -t 2>/dev/null; then
        sudo systemctl reload nginx
        success "Nginx switched to $TARGET"
    else
        error "Nginx config test failed!"
    fi
fi

success "Rollback complete!"
log "Active: $TARGET (port $TARGET_PORT)"
log "Standby: $CURRENT"
