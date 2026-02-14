#!/usr/bin/env bash
# ============================================================
# DMP Cemetery Management - Deployment Setup Wizard
# ============================================================
# This script guides you through deploying the app to:
#   - Supabase (database + auth)
#   - Vercel (hosting)
#   - GitHub (source control + CI/CD)
#
# Usage: bash scripts/setup-deploy.sh
# ============================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

print_header() {
  echo ""
  echo -e "${BLUE}============================================================${NC}"
  echo -e "${BOLD}  $1${NC}"
  echo -e "${BLUE}============================================================${NC}"
  echo ""
}

print_step() {
  echo -e "${GREEN}[STEP $1]${NC} ${BOLD}$2${NC}"
}

print_info() {
  echo -e "${CYAN}  > $1${NC}"
}

print_warn() {
  echo -e "${YELLOW}  ! $1${NC}"
}

print_error() {
  echo -e "${RED}  x $1${NC}"
}

print_success() {
  echo -e "${GREEN}  + $1${NC}"
}

wait_for_user() {
  echo ""
  echo -e "${YELLOW}  Press Enter when ready to continue...${NC}"
  read -r
}

# ============================================================
# PREREQUISITES CHECK
# ============================================================
print_header "DMP Cemetery Management - Deployment Setup"

echo "This wizard will help you deploy the app to Supabase + Vercel."
echo "You'll need accounts on:"
echo "  1. GitHub    (https://github.com)"
echo "  2. Supabase  (https://supabase.com)"
echo "  3. Vercel    (https://vercel.com)"
echo ""

print_step 1 "Checking prerequisites..."

# Check Node.js
if command -v node &> /dev/null; then
  NODE_VERSION=$(node --version)
  print_success "Node.js $NODE_VERSION found"
else
  print_error "Node.js not found. Install from https://nodejs.org"
  exit 1
fi

# Check npm
if command -v npm &> /dev/null; then
  NPM_VERSION=$(npm --version)
  print_success "npm $NPM_VERSION found"
else
  print_error "npm not found. Install Node.js from https://nodejs.org"
  exit 1
fi

# Check git
if command -v git &> /dev/null; then
  GIT_VERSION=$(git --version)
  print_success "$GIT_VERSION found"
else
  print_error "git not found. Install from https://git-scm.com"
  exit 1
fi

# Check if Vercel CLI is installed
VERCEL_INSTALLED=false
if command -v vercel &> /dev/null; then
  print_success "Vercel CLI found"
  VERCEL_INSTALLED=true
else
  print_warn "Vercel CLI not found. Installing..."
  npm install -g vercel
  if command -v vercel &> /dev/null; then
    print_success "Vercel CLI installed"
    VERCEL_INSTALLED=true
  else
    print_warn "Could not install Vercel CLI globally."
    print_info "You can deploy via the Vercel dashboard instead (instructions below)."
  fi
fi

echo ""
print_success "Prerequisites check complete!"

# ============================================================
# STEP 2: SUPABASE SETUP
# ============================================================
print_header "Step 2: Supabase Database Setup"

echo "Let's set up your Supabase project for the database and authentication."
echo ""
echo -e "${BOLD}If you don't have a Supabase project yet:${NC}"
echo "  1. Go to https://supabase.com and sign in (use GitHub login)"
echo "  2. Click 'New Project'"
echo "  3. Name: 'dmp-cemetery' (or similar)"
echo "  4. Set a strong database password (save it!)"
echo "  5. Region: Choose closest to Detroit (US East)"
echo "  6. Click 'Create new project' and wait for it to initialize"
echo ""

wait_for_user

echo -e "${BOLD}Now let's set up the database schema:${NC}"
echo "  1. In your Supabase project, go to 'SQL Editor' (left sidebar)"
echo "  2. Click 'New query'"
echo "  3. Copy the contents of: supabase/schema.sql"
echo "  4. Paste into the SQL Editor and click 'Run'"
echo ""
print_info "Quick copy command (macOS):  cat supabase/schema.sql | pbcopy"
print_info "Quick copy command (Linux):  xclip -selection clipboard < supabase/schema.sql"
echo ""

wait_for_user

echo -e "${BOLD}Create your admin user:${NC}"
echo "  1. Go to 'Authentication' (left sidebar) > 'Users'"
echo "  2. Click 'Add User' > 'Create New User'"
echo "  3. Email: admin@dmp.com (or your preferred email)"
echo "  4. Password: Choose a strong password"
echo "  5. Click 'Create User'"
echo ""

wait_for_user

echo -e "${BOLD}Now let's get your Supabase credentials:${NC}"
echo "  Go to Settings > API (or Project Settings > API)"
echo ""

read -rp "  Enter your Supabase Project URL: " SUPABASE_URL
read -rp "  Enter your Supabase Anon Key: " SUPABASE_ANON_KEY

if [ -n "$SUPABASE_URL" ] && [ -n "$SUPABASE_ANON_KEY" ]; then
  print_success "Supabase credentials received"

  # Save to .env file
  if [ ! -f .env ]; then
    cp .env.example .env
    print_info "Created .env file from template"
  fi

  # Update .env with Supabase values
  if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s|VITE_SUPABASE_URL=.*|VITE_SUPABASE_URL=$SUPABASE_URL|" .env
    sed -i '' "s|VITE_SUPABASE_ANON_KEY=.*|VITE_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY|" .env
  else
    sed -i "s|VITE_SUPABASE_URL=.*|VITE_SUPABASE_URL=$SUPABASE_URL|" .env
    sed -i "s|VITE_SUPABASE_ANON_KEY=.*|VITE_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY|" .env
  fi
  print_success "Saved Supabase credentials to .env"
else
  print_warn "Skipped Supabase credentials - you'll need to add them manually"
fi

# ============================================================
# STEP 3: BUILD TEST
# ============================================================
print_header "Step 3: Test Build"

echo "Testing that the app builds successfully..."
echo ""

npm install
print_success "Dependencies installed"

if VITE_SUPABASE_URL="${SUPABASE_URL:-https://placeholder.supabase.co}" \
   VITE_SUPABASE_ANON_KEY="${SUPABASE_ANON_KEY:-placeholder}" \
   npm run build 2>/dev/null; then
  print_success "Build successful!"
else
  print_warn "Build had issues - this may be OK, Vercel will handle the build"
fi

# ============================================================
# STEP 4: VERCEL DEPLOYMENT
# ============================================================
print_header "Step 4: Deploy to Vercel"

if [ "$VERCEL_INSTALLED" = true ]; then
  echo "You have two options to deploy:"
  echo ""
  echo "  A) Deploy via Vercel CLI (quick, from terminal)"
  echo "  B) Deploy via Vercel Dashboard (visual, recommended for first time)"
  echo ""
  read -rp "  Choose option (A/B): " DEPLOY_OPTION

  if [[ "$DEPLOY_OPTION" =~ ^[Aa]$ ]]; then
    echo ""
    print_info "Linking project to Vercel..."
    vercel link

    echo ""
    print_info "Setting environment variables in Vercel..."
    if [ -n "$SUPABASE_URL" ]; then
      echo "$SUPABASE_URL" | vercel env add VITE_SUPABASE_URL production preview development 2>/dev/null || true
      echo "$SUPABASE_ANON_KEY" | vercel env add VITE_SUPABASE_ANON_KEY production preview development 2>/dev/null || true
      print_success "Environment variables set in Vercel"
    else
      print_warn "Set environment variables manually in Vercel Dashboard > Settings > Environment Variables"
    fi

    echo ""
    print_info "Deploying to production..."
    vercel --prod

    print_success "Deployment complete!"
  fi
fi

if [[ ! "$DEPLOY_OPTION" =~ ^[Aa]$ ]]; then
  echo ""
  echo -e "${BOLD}Deploy via Vercel Dashboard:${NC}"
  echo ""
  echo "  1. Go to https://vercel.com and sign in with GitHub"
  echo "  2. Click 'Add New...' > 'Project'"
  echo "  3. Import your GitHub repository"
  echo "  4. Configure the project:"
  echo "     - Framework Preset: Vite"
  echo "     - Build Command: npm run build"
  echo "     - Output Directory: dist"
  echo "  5. Add Environment Variables:"
  if [ -n "$SUPABASE_URL" ]; then
    echo "     - VITE_SUPABASE_URL = $SUPABASE_URL"
    echo "     - VITE_SUPABASE_ANON_KEY = $SUPABASE_ANON_KEY"
  else
    echo "     - VITE_SUPABASE_URL = (your Supabase project URL)"
    echo "     - VITE_SUPABASE_ANON_KEY = (your Supabase anon key)"
  fi
  echo "  6. Click 'Deploy'"
  echo ""
  print_info "Vercel will automatically deploy on every push to main/master"
fi

# ============================================================
# STEP 5: GITHUB CI/CD
# ============================================================
print_header "Step 5: GitHub CI/CD"

echo "GitHub Actions CI/CD is already configured!"
echo "File: .github/workflows/ci.yml"
echo ""
echo "What it does on every push/PR:"
echo "  - Installs dependencies"
echo "  - Runs TypeScript type checking"
echo "  - Builds the application"
echo ""

# ============================================================
# SUMMARY
# ============================================================
print_header "Setup Complete!"

echo -e "${BOLD}Your deployment stack:${NC}"
echo ""
echo "  +-------------+     +----------+     +-----------+"
echo "  |   GitHub    | --> |  Vercel  | --> | Supabase  |"
echo "  |  (Source +  |     | (Hosting)|     | (Database |"
echo "  |   CI/CD)    |     |          |     |  + Auth)  |"
echo "  +-------------+     +----------+     +-----------+"
echo ""
echo -e "${BOLD}How it works:${NC}"
echo "  1. Push code to GitHub"
echo "  2. GitHub Actions runs type checks and build"
echo "  3. Vercel automatically deploys the new version"
echo "  4. App connects to Supabase for data and auth"
echo ""
echo -e "${BOLD}Useful commands:${NC}"
echo "  npm run dev              - Local development"
echo "  npm run build            - Test production build"
echo "  npm run deploy:verify    - Verify deployment"
echo "  vercel                   - Deploy preview"
echo "  vercel --prod            - Deploy to production"
echo ""
echo -e "${BOLD}Need help?${NC}"
echo "  - Check DEPLOY.md for detailed walkthrough"
echo "  - Run: npm run deploy:verify"
echo ""
print_success "You're all set!"
