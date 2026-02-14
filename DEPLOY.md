# Deployment Guide - DMP Cemetery Management System

Deploy the DMP Cemetery Management System using **Supabase** (database + auth), **Vercel** (hosting), and **GitHub** (CI/CD).

---

## Quick Start (Automated)

Run the interactive setup wizard:

```bash
npm run deploy:setup
```

This walks you through each step. If you prefer manual setup, follow the sections below.

---

## Architecture

```
+-------------+     +----------+     +-----------+
|   GitHub    | --> |  Vercel  | --> | Supabase  |
|  (Source +  |     | (Hosting)|     | (Database |
|   CI/CD)    |     |          |     |  + Auth)  |
+-------------+     +----------+     +-----------+
```

- **GitHub**: Source code, version control, CI/CD via GitHub Actions
- **Vercel**: Builds and hosts the React frontend + serverless API functions
- **Supabase**: PostgreSQL database + user authentication + Row Level Security

---

## Prerequisites

- [Node.js 18+](https://nodejs.org/) installed
- A [GitHub](https://github.com) account
- A [Supabase](https://supabase.com) account (free tier works)
- A [Vercel](https://vercel.com) account (free tier works)

---

## Step 1: Supabase Setup (Database + Auth)

### 1.1 Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in (GitHub login recommended)
2. Click **"New Project"**
3. Fill in:
   - **Name**: `dmp-cemetery`
   - **Database Password**: Choose a strong password and **save it**
   - **Region**: US East (closest to Detroit)
4. Click **"Create new project"** and wait for initialization

### 1.2 Set Up the Database Schema

1. In your Supabase project, click **"SQL Editor"** in the left sidebar
2. Click **"New query"**
3. Open the file `supabase/schema.sql` from this project
4. Copy the entire contents and paste into the SQL Editor
5. Click **"Run"**

You should see success messages for all table creations, RLS policies, and indexes.

### 1.3 Create an Admin User

1. Go to **"Authentication"** in the left sidebar
2. Click **"Users"** tab
3. Click **"Add User"** > **"Create New User"**
4. Enter:
   - **Email**: `admin@dmp.com` (or your preferred email)
   - **Password**: Choose a strong password
5. Click **"Create User"**

### 1.4 Get Your API Credentials

1. Go to **Settings** > **API** (in the left sidebar)
2. Copy these two values (you'll need them in Step 3):
   - **Project URL**: `https://[your-project-id].supabase.co`
   - **anon/public key**: `eyJ...` (the long key under "Project API keys")

---

## Step 2: GitHub Setup

### 2.1 Push to GitHub

If your code isn't already on GitHub:

```bash
# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/dmpgrants.git
git branch -M main
git push -u origin main
```

### 2.2 CI/CD (Automatic)

GitHub Actions CI is already configured at `.github/workflows/ci.yml`. It automatically:
- Runs TypeScript type checking on every push and PR
- Builds the application to catch errors early

No additional setup needed - it works as soon as you push to GitHub.

---

## Step 3: Vercel Deployment

### Option A: Vercel Dashboard (Recommended for First Time)

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New..."** > **"Project"**
3. Find and **import** your `dmpgrants` repository
4. Vercel auto-detects the framework. Verify these settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Expand **"Environment Variables"** and add:

   | Variable | Value |
   |----------|-------|
   | `VITE_SUPABASE_URL` | Your Supabase project URL |
   | `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key |

6. Click **"Deploy"**

Vercel will build and deploy your app. You'll get a URL like `https://dmpgrants-xxxxx.vercel.app`.

### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Link this project
vercel link

# Set environment variables
vercel env add VITE_SUPABASE_URL    # paste your Supabase URL
vercel env add VITE_SUPABASE_ANON_KEY  # paste your anon key

# Deploy to production
vercel --prod
```

### Auto-Deploy

Once connected to GitHub, Vercel automatically:
- Deploys to **production** on every push to `main`/`master`
- Creates **preview deployments** for every pull request

---

## Step 4: Verify Deployment

Run the verification script with your deployment URL:

```bash
npm run deploy:verify -- https://your-app.vercel.app
```

Or manually check:
1. Visit your Vercel URL - you should see the login page
2. Sign in with the admin user you created in Supabase
3. Check that the Dashboard loads with stats cards
4. Try creating a work order or grant to verify database connectivity

---

## Environment Variables Reference

| Variable | Where | Required | Description |
|----------|-------|----------|-------------|
| `VITE_SUPABASE_URL` | Vercel + local `.env` | Yes | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Vercel + local `.env` | Yes | Supabase anonymous API key |
| `DATABASE_URL` | Vercel (for API functions) | Optional | Supabase PostgreSQL connection string |
| `JWT_SECRET` | Vercel (for API functions) | Optional | Secret for Express JWT tokens |
| `NODE_ENV` | Auto-set by Vercel | No | `production` in deployed environment |

**Required variables**: Only `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are needed. The app talks directly to Supabase from the browser for auth and data operations.

**Optional variables**: `DATABASE_URL` and `JWT_SECRET` are only needed if you use the Express API serverless functions (the `/api/*` endpoints).

---

## How the App Connects to Supabase

The app has a dual-mode architecture:

1. **Supabase Mode** (production): When `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set, the app connects directly to Supabase for authentication and database operations. Row Level Security (RLS) policies protect the data.

2. **Express Mode** (fallback): If Supabase isn't configured, the app falls back to the Express API backend. This is useful for local development without Supabase.

---

## Troubleshooting

### Build fails on Vercel

- Check that environment variables are set correctly (Settings > Environment Variables)
- Check the build logs for TypeScript errors
- Try building locally first: `npm run build`

### Login doesn't work

- Verify the admin user was created in Supabase Authentication > Users
- Check that `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct
- Open browser console for error messages

### Data operations fail

- Verify the schema was applied: check Tables in Supabase Dashboard
- Verify RLS policies are enabled: check each table's policies
- Check that the user is authenticated (logged in)

### API functions return errors

- Check that `DATABASE_URL` is set in Vercel if using Express API endpoints
- The Supabase connection string can be found in: Settings > Database > Connection string > URI
- Make sure SSL is enabled for the connection

### Preview deployments

- Every PR automatically gets a preview URL from Vercel
- Preview deployments use the same environment variables as production
- Useful for testing changes before merging

---

## Local Development

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Fill in your Supabase credentials in .env
# Then start the dev server:
npm run dev
```

The Vite dev server runs at `http://localhost:5173` and proxies `/api/*` requests to the Express backend at `http://localhost:3000`.

To also run the Express backend locally:
```bash
npm run server
```

---

## Useful Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start local development server |
| `npm run build` | Build for production |
| `npm run server` | Start Express backend locally |
| `npm run deploy:setup` | Interactive deployment wizard |
| `npm run deploy:verify` | Verify deployment health |
| `vercel` | Deploy to preview |
| `vercel --prod` | Deploy to production |
