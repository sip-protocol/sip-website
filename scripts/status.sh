#!/bin/bash

# Status Script for SIP Website Deployment

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(dirname "$SCRIPT_DIR")"
ACTIVE_FILE="$APP_DIR/active.txt"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo -e "${BLUE}       SIP Website Deployment Status       ${NC}"
echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo ""

# Active slot
if [ -f "$ACTIVE_FILE" ]; then
    ACTIVE=$(cat "$ACTIVE_FILE")
    echo -e "Active Slot: ${GREEN}$ACTIVE${NC}"
else
    echo -e "Active Slot: ${YELLOW}Not set${NC}"
    ACTIVE="none"
fi

echo ""
echo -e "${BLUE}Container Status:${NC}"
echo "─────────────────────────────────────────"

# Blue container
BLUE_STATUS=$(docker inspect --format='{{.State.Status}}' sip-website-blue 2>/dev/null || echo "not found")
BLUE_HEALTH=$(docker inspect --format='{{.State.Health.Status}}' sip-website-blue 2>/dev/null || echo "n/a")
BLUE_IMAGE=$(docker inspect --format='{{.Config.Image}}' sip-website-blue 2>/dev/null || echo "n/a")

if [ "$ACTIVE" = "blue" ]; then
    BLUE_MARKER="← ACTIVE"
else
    BLUE_MARKER=""
fi

if [ "$BLUE_STATUS" = "running" ] && [ "$BLUE_HEALTH" = "healthy" ]; then
    echo -e "Blue  (5000): ${GREEN}$BLUE_STATUS${NC} | Health: ${GREEN}$BLUE_HEALTH${NC} $BLUE_MARKER"
elif [ "$BLUE_STATUS" = "running" ]; then
    echo -e "Blue  (5000): ${GREEN}$BLUE_STATUS${NC} | Health: ${YELLOW}$BLUE_HEALTH${NC} $BLUE_MARKER"
else
    echo -e "Blue  (5000): ${RED}$BLUE_STATUS${NC} | Health: $BLUE_HEALTH $BLUE_MARKER"
fi

# Green container
GREEN_STATUS=$(docker inspect --format='{{.State.Status}}' sip-website-green 2>/dev/null || echo "not found")
GREEN_HEALTH=$(docker inspect --format='{{.State.Health.Status}}' sip-website-green 2>/dev/null || echo "n/a")
GREEN_IMAGE=$(docker inspect --format='{{.Config.Image}}' sip-website-green 2>/dev/null || echo "n/a")

if [ "$ACTIVE" = "green" ]; then
    GREEN_MARKER="← ACTIVE"
else
    GREEN_MARKER=""
fi

if [ "$GREEN_STATUS" = "running" ] && [ "$GREEN_HEALTH" = "healthy" ]; then
    echo -e "Green (5001): ${GREEN}$GREEN_STATUS${NC} | Health: ${GREEN}$GREEN_HEALTH${NC} $GREEN_MARKER"
elif [ "$GREEN_STATUS" = "running" ]; then
    echo -e "Green (5001): ${GREEN}$GREEN_STATUS${NC} | Health: ${YELLOW}$GREEN_HEALTH${NC} $GREEN_MARKER"
else
    echo -e "Green (5001): ${RED}$GREEN_STATUS${NC} | Health: $GREEN_HEALTH $GREEN_MARKER"
fi

# Staging container
STAGING_STATUS=$(docker inspect --format='{{.State.Status}}' sip-website-staging 2>/dev/null || echo "not found")
STAGING_HEALTH=$(docker inspect --format='{{.State.Health.Status}}' sip-website-staging 2>/dev/null || echo "n/a")

if [ "$STAGING_STATUS" = "running" ] && [ "$STAGING_HEALTH" = "healthy" ]; then
    echo -e "Staging(5002): ${GREEN}$STAGING_STATUS${NC} | Health: ${GREEN}$STAGING_HEALTH${NC}"
elif [ "$STAGING_STATUS" = "running" ]; then
    echo -e "Staging(5002): ${GREEN}$STAGING_STATUS${NC} | Health: ${YELLOW}$STAGING_HEALTH${NC}"
else
    echo -e "Staging(5002): ${YELLOW}$STAGING_STATUS${NC}"
fi

echo ""
echo -e "${BLUE}Images:${NC}"
echo "─────────────────────────────────────────"
echo "Blue:    $BLUE_IMAGE"
echo "Green:   $GREEN_IMAGE"

echo ""
echo -e "${BLUE}Quick Commands:${NC}"
echo "─────────────────────────────────────────"
echo "Deploy:   ./scripts/deploy.sh <tag>"
echo "Rollback: ./scripts/rollback.sh"
echo "Logs:     docker logs -f sip-website-\$SLOT"
echo ""
