# 🚀 Deployment Guide: Vercel (Full Stack)

This guide explains how to deploy both the Frontend (React) and Backend (Express) to Vercel as a single application.

## 📋 Prerequisites

1.  **Vercel Account:** Sign up at [vercel.com](https://vercel.com)
2.  **GitHub Repository:** Your code must be pushed to GitHub.
3.  **Database:** You need a hosted PostgreSQL database (e.g., Neon, Railway, Supabase).

---

## 🗄️ Step 1: Set up a Database

Since Vercel is serverless, it doesn't host persistent databases. You need an external one.

**Recommended: Neon (Free Tier)**
1.  Go to [neon.tech](https://neon.tech)
2.  Create a project.
3.  Copy the **Connection String** (e.g., `postgres://user:pass@ep-xyz.us-east-2.aws.neon.tech/neondb...`).

---

## 🚀 Step 2: Deploy to Vercel

1.  **Go to Vercel Dashboard:** Click "Add New..." -> "Project".
2.  **Import Repository:** Select your `dmpgrants` repository.
3.  **Configure Project:**
    *   **Framework Preset:** Vite
    *   **Root Directory:** `./` (default)
    *   **Build Command:** `npm run build` (default)
    *   **Output Directory:** `dist` (default)
4.  **Environment Variables:**
    Expand the "Environment Variables" section and add:
    *   `DATABASE_URL`: (Paste your Neon connection string from Step 1)
    *   `JWT_SECRET`: (Enter a long random string for security)
    *   `NODE_ENV`: `production`
5.  **Click Deploy:** Vercel will build your frontend and deploy your backend as serverless functions.

---

## 🛠️ Step 3: Run Database Migrations

After deployment, you need to set up the database schema.

1.  **Install Vercel CLI (locally):**
    ```bash
    npm i -g vercel
    ```
2.  **Link Project:**
    ```bash
    vercel link
    ```
3.  **Run Migration Script:**
    You can run the migration script locally but point it to your production database by setting the env var temporarily:
    ```bash
    DATABASE_URL="your_neon_connection_string" npm run db:migrate
    ```

---

## 📱 Viewing on iPhone

**Option 1: Public URL (After Deployment)**
*   Once deployed, Vercel gives you a URL (e.g., `https://dmp-cemetery.vercel.app`).
*   Open this on your iPhone Safari/Chrome.

**Option 2: Local Network (Development)**
1.  Ensure your computer and iPhone are on the same Wi-Fi.
2.  Run the app locally:
    ```bash
    npm run dev
    ```
3.  Look for the "Network" URL in the terminal (e.g., `http://192.168.1.5:5173`).
4.  Open that URL on your iPhone.

---

## ⚠️ Important Note on Serverless

Vercel functions are serverless, meaning they "wake up" when called and "sleep" when idle.
*   **Cold Starts:** The first request might take 1-2 seconds.
*   **Database Connections:** Serverless functions can exhaust database connections. Neon handles this well, but standard Postgres might need a connection pooler (like PgBouncer).
