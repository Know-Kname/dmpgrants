#!/usr/bin/env bash
#
# Detroit Memorial Park - One-Command Setup
#
# Usage: ./setup.sh
#
# This script handles the complete first-time setup:
#   1. Checks prerequisites (Node.js, npm, Docker or PostgreSQL)
#   2. Installs npm dependencies
#   3. Creates .env from .env.example (if not present)
#   4. Starts PostgreSQL via Docker Compose (if Docker available)
#   5. Waits for the database to be ready
#   6. Runs database migrations
#   7. Prints next steps
#
# Safe to re-run -- skips steps that are already done.

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

info()    { echo -e "${BLUE}[INFO]${NC} $1"; }
success() { echo -e "${GREEN}[OK]${NC}   $1"; }
warn()    { echo -e "${YELLOW}[WARN]${NC} $1"; }
error()   { echo -e "${RED}[ERR]${NC}  $1"; }

echo ""
echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}  Detroit Memorial Park - Project Setup${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""

# ──────────────────────────────────────────────
# 1. Check prerequisites
# ──────────────────────────────────────────────
info "Checking prerequisites..."

if ! command -v node &> /dev/null; then
    error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | sed 's/v//' | cut -d. -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    error "Node.js 18+ required. Found: $(node -v)"
    exit 1
fi
success "Node.js $(node -v)"

if ! command -v npm &> /dev/null; then
    error "npm is not installed."
    exit 1
fi
success "npm $(npm -v)"

HAS_DOCKER=false
if command -v docker &> /dev/null && docker info &> /dev/null; then
    HAS_DOCKER=true
    success "Docker available"
else
    warn "Docker not available. You'll need a running PostgreSQL instance."
fi

HAS_PSQL=false
if command -v psql &> /dev/null; then
    HAS_PSQL=true
    success "psql available"
fi

echo ""

# ──────────────────────────────────────────────
# 2. Install dependencies
# ──────────────────────────────────────────────
if [ -d "node_modules" ] && [ -f "node_modules/.package-lock.json" ]; then
    success "Dependencies already installed"
else
    info "Installing dependencies..."
    npm install
    success "Dependencies installed"
fi

echo ""

# ──────────────────────────────────────────────
# 3. Create .env file
# ──────────────────────────────────────────────
if [ -f ".env" ]; then
    success ".env file exists"
else
    info "Creating .env from .env.example..."

    if [ "$HAS_DOCKER" = true ]; then
        # Use Docker Compose credentials
        cat > .env << 'ENVEOF'
DATABASE_URL=postgresql://dmp_user:dmp_password@localhost:5432/dmp_cemetery
JWT_SECRET=dev-jwt-secret-change-in-production
PORT=3000
NODE_ENV=development
ENVEOF
    else
        cp .env.example .env
        warn "Created .env from template. Please edit it with your PostgreSQL credentials."
    fi

    success ".env file created"
fi

echo ""

# ──────────────────────────────────────────────
# 4. Start PostgreSQL (Docker)
# ──────────────────────────────────────────────
if [ "$HAS_DOCKER" = true ]; then
    # Check if container is already running
    if docker ps --format '{{.Names}}' | grep -q 'dmp-postgres'; then
        success "PostgreSQL container already running"
    else
        info "Starting PostgreSQL via Docker Compose..."
        docker compose up -d 2>/dev/null || docker-compose up -d
        success "PostgreSQL container started"
    fi

    # Wait for database to be ready
    info "Waiting for PostgreSQL to be ready..."
    RETRIES=30
    until docker exec dmp-postgres pg_isready -U dmp_user -d dmp_cemetery &> /dev/null || [ $RETRIES -eq 0 ]; do
        RETRIES=$((RETRIES - 1))
        sleep 1
    done

    if [ $RETRIES -eq 0 ]; then
        error "PostgreSQL did not become ready in time."
        exit 1
    fi
    success "PostgreSQL is ready"
else
    warn "Skipping Docker setup. Make sure PostgreSQL is running and .env is configured."
    if [ "$HAS_PSQL" = true ]; then
        # Quick check if we can connect
        source .env 2>/dev/null || true
        if [ -n "${DATABASE_URL:-}" ]; then
            if psql "$DATABASE_URL" -c "SELECT 1" &> /dev/null; then
                success "PostgreSQL connection verified"
            else
                warn "Could not connect to PostgreSQL. Check DATABASE_URL in .env"
            fi
        fi
    fi
fi

echo ""

# ──────────────────────────────────────────────
# 5. Run database migrations
# ──────────────────────────────────────────────
info "Running database migrations..."
if npm run db:migrate; then
    success "Database migrations complete"
else
    error "Migration failed. Check your DATABASE_URL in .env"
    exit 1
fi

echo ""

# ──────────────────────────────────────────────
# Done!
# ──────────────────────────────────────────────
echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}  Setup complete!${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""
echo "  Start the application:"
echo ""
echo -e "    ${BLUE}npm run dev:full${NC}     # Both frontend + backend"
echo ""
echo "  Or start them separately:"
echo ""
echo -e "    ${BLUE}npm run dev${NC}          # Frontend only (port 5173)"
echo -e "    ${BLUE}npm run server${NC}       # Backend only (port 3000)"
echo ""
echo "  Open in browser:"
echo ""
echo -e "    ${BLUE}http://localhost:5173${NC}"
echo ""
echo "  Default login:"
echo ""
echo -e "    Email:    ${YELLOW}admin@dmp.com${NC}"
echo -e "    Password: ${YELLOW}admin123${NC}"
echo ""
echo "  Or click 'Preview Demo' on the login page to explore without a database."
echo ""
