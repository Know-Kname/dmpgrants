# Vercel Deployment Guide

This guide explains how to deploy the Detroit Memorial Park application to Vercel.

## Prerequisites

1.  A [GitHub](https://github.com) account.
2.  A [Vercel](https://vercel.com) account.
3.  A PostgreSQL database (e.g., [Neon](https://neon.tech), [Railway](https://railway.app), or [Supabase](https://supabase.com)).

## Deployment Steps

1.  **Push to GitHub**: Ensure your latest code is pushed to your GitHub repository.

2.  **Import to Vercel**:
    *   Go to your Vercel Dashboard.
    *   Click **"Add New..."** -> **"Project"**.
    *   Import your `dmpgrants` repository.

3.  **Configure Project**:
    *   **Framework Preset**: Vercel should automatically detect "Vite". If not, select it.
    *   **Root Directory**: Leave as `./`.
    *   **Build Command**: `npm run build` (default).
    *   **Output Directory**: `dist` (default).
    *   **Install Command**: `npm install` (default).

4.  **Environment Variables**:
    Expand the "Environment Variables" section and add the following:

    *   `DATABASE_URL`: Your full PostgreSQL connection string (e.g., `postgres://user:password@host:port/dbname?sslmode=require`).
    *   `JWT_SECRET`: A long, random string for signing tokens (e.g., `your-super-secret-jwt-key-change-this`).

5.  **Deploy**:
    *   Click **"Deploy"**.
    *   Wait for the build to complete.

## Verification

Once deployed, visit your Vercel URL (e.g., `https://dmpgrants.vercel.app`).
*   **Frontend**: You should see the login page.
*   **Backend**: You can test the API health check at `/api/health`. It should return `{"status":"ok",...}`.

## Troubleshooting

*   **Database Connection**: If you get login errors, check your `DATABASE_URL`. Ensure your database accepts connections from the internet (or Vercel IPs).
*   **CORS**: The application is configured to allow requests from the origin. If you have issues, check the browser console.
