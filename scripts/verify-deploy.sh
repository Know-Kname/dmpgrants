#!/usr/bin/env bash
# ============================================================
# DMP Cemetery Management - Deployment Verification
# ============================================================
# Verifies that your deployment is working correctly.
#
# Usage:
#   bash scripts/verify-deploy.sh
#   bash scripts/verify-deploy.sh https://your-app.vercel.app
# ============================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m'

PASS=0
FAIL=0
WARN=0

check_pass() {
  echo -e "  ${GREEN}+ PASS${NC} $1"
  ((PASS++))
}

check_fail() {
  echo -e "  ${RED}x FAIL${NC} $1"
  ((FAIL++))
}

check_warn() {
  echo -e "  ${YELLOW}! WARN${NC} $1"
  ((WARN++))
}

echo ""
echo -e "${BLUE}============================================================${NC}"
echo -e "${BOLD}  DMP Cemetery Management - Deployment Verification${NC}"
echo -e "${BLUE}============================================================${NC}"
echo ""

# Determine the deployment URL
DEPLOY_URL="${1}"

if [ -z "$DEPLOY_URL" ]; then
  if command -v vercel &> /dev/null; then
    DEPLOY_URL=$(vercel inspect 2>/dev/null | grep -o 'https://[^ ]*' | head -1 || true)
  fi

  if [ -z "$DEPLOY_URL" ]; then
    echo -e "${YELLOW}No deployment URL detected.${NC}"
    read -rp "  Enter your deployment URL: " DEPLOY_URL
  fi
fi

if [ -z "$DEPLOY_URL" ]; then
  echo -e "${RED}No URL provided. Exiting.${NC}"
  exit 1
fi

DEPLOY_URL="${DEPLOY_URL%/}"
echo -e "${BOLD}Checking: ${DEPLOY_URL}${NC}"
echo ""

# ============================================================
# CHECK 1: Site is reachable
# ============================================================
echo -e "${BOLD}1. Site Accessibility${NC}"

HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$DEPLOY_URL" 2>/dev/null || echo "000")
if [ "$HTTP_STATUS" = "200" ]; then
  check_pass "Site is reachable (HTTP $HTTP_STATUS)"
elif [ "$HTTP_STATUS" = "000" ]; then
  check_fail "Site is not reachable - check URL and DNS"
else
  check_warn "Site returned HTTP $HTTP_STATUS (expected 200)"
fi

# ============================================================
# CHECK 2: SPA Routing
# ============================================================
echo -e "${BOLD}2. SPA Routing${NC}"

LOGIN_STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$DEPLOY_URL/login" 2>/dev/null || echo "000")
if [ "$LOGIN_STATUS" = "200" ]; then
  check_pass "SPA routing works (/login returns 200)"
else
  check_fail "SPA routing may be broken (/login returned $LOGIN_STATUS)"
fi

# ============================================================
# CHECK 3: HTML content
# ============================================================
echo -e "${BOLD}3. Content${NC}"

CONTENT_TYPE=$(curl -s -I --max-time 10 "$DEPLOY_URL" 2>/dev/null | grep -i "content-type" | head -1 || echo "")
if echo "$CONTENT_TYPE" | grep -qi "text/html"; then
  check_pass "HTML content served correctly"
else
  check_warn "Unexpected content type: $CONTENT_TYPE"
fi

# ============================================================
# CHECK 4: API Health
# ============================================================
echo -e "${BOLD}4. API Health${NC}"

API_RESPONSE=$(curl -s --max-time 10 "$DEPLOY_URL/api/health" 2>/dev/null || echo "")
if echo "$API_RESPONSE" | grep -q '"status"'; then
  check_pass "API health endpoint responding"
elif [ -n "$API_RESPONSE" ]; then
  check_warn "API responded but format unexpected: ${API_RESPONSE:0:100}"
else
  check_warn "API health not responding (OK if using Supabase-only mode)"
fi

# ============================================================
# CHECK 5: Security Headers
# ============================================================
echo -e "${BOLD}5. Security Headers${NC}"

HEADERS=$(curl -s -I --max-time 10 "$DEPLOY_URL" 2>/dev/null || echo "")

if echo "$HEADERS" | grep -qi "x-content-type-options"; then
  check_pass "X-Content-Type-Options header present"
else
  check_warn "X-Content-Type-Options header missing"
fi

if echo "$HEADERS" | grep -qi "x-frame-options"; then
  check_pass "X-Frame-Options header present"
else
  check_warn "X-Frame-Options header missing"
fi

# ============================================================
# CHECK 6: Local Environment
# ============================================================
echo -e "${BOLD}6. Local Environment${NC}"

if [ -f .env ]; then
  check_pass ".env file exists"

  if grep -q "VITE_SUPABASE_URL=https://" .env 2>/dev/null; then
    check_pass "Supabase URL configured in .env"
  else
    check_warn "Supabase URL not configured in .env"
  fi

  if grep -q "VITE_SUPABASE_ANON_KEY=ey" .env 2>/dev/null; then
    check_pass "Supabase anon key configured in .env"
  else
    check_warn "Supabase anon key not configured in .env"
  fi
else
  check_warn ".env file not found (OK if using Vercel env vars only)"
fi

# ============================================================
# SUMMARY
# ============================================================
echo ""
echo -e "${BLUE}============================================================${NC}"
echo -e "${BOLD}  Results: ${GREEN}$PASS passed${NC}, ${RED}$FAIL failed${NC}, ${YELLOW}$WARN warnings${NC}"
echo -e "${BLUE}============================================================${NC}"

if [ "$FAIL" -eq 0 ]; then
  echo ""
  echo -e "  ${GREEN}${BOLD}Deployment looks good!${NC}"
  echo ""
else
  echo ""
  echo -e "  ${RED}${BOLD}Some checks failed. Review the issues above.${NC}"
  echo ""
  exit 1
fi
