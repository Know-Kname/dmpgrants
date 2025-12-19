# Cloud Deployment Guide - Cemetery Management System

Complete guide for deploying to cloud platforms with managed PostgreSQL databases.
Based on 2025 best practices and current platform capabilities.

---

## 🌐 Platform Comparison & Recommendations

### **Railway.app** ⭐ **RECOMMENDED**

**Best For:** Full-stack apps with database
**Pricing:** $5/month + usage-based ($0.000463/GB-hour RAM)
**Database:** Built-in PostgreSQL included

✅ **Pros:**
- Native PostgreSQL support
- Easiest setup (one-click deploy)
- Pay only for what you use
- Excellent developer experience
- Automatic HTTPS/SSL
- No infrastructure management

❌ **Cons:**
- Can be expensive at scale
- Less control than self-hosting

**Total Cost Estimate:** $10-20/month for small cemetery operation

---

### **Render.com**

**Best For:** Production apps with predictable pricing
**Pricing:** $7/month (Web Service) + $7/month (PostgreSQL)
**Database:** Managed PostgreSQL available

✅ **Pros:**
- Predictable flat-rate pricing
- Built-in background workers
- Free SSL certificates
- Good for production workloads
- Automatic deploys from Git

❌ **Cons:**
- Higher base cost
- Services can be slow to wake (free tier)

**Total Cost Estimate:** $14-25/month

---

### **Vercel + Railway** (Hybrid)

**Best For:** Maximum performance frontend
**Pricing:** Vercel $20/month + Railway $10/month
**Database:** Use Railway for backend + database

✅ **Pros:**
- Blazing fast frontend delivery
- Best-in-class Next.js support
- Global CDN
- Great analytics

❌ **Cons:**
- Higher total cost
- More complex setup
- Two platforms to manage

**Total Cost Estimate:** $30-40/month

---

## 🚀 Quick Deploy: Railway.app (Recommended)

### Step 1: Prepare Your Code

```bash
# Ensure all changes are committed
git add .
git commit -m "Prepare for Railway deployment"
git push origin main
```

### Step 2: Create Railway Account

1. Go to https://railway.app
2. Sign up with GitHub
3. Link your repository

### Step 3: Deploy Backend + Database

```bash
# Install Railway CLI (optional but helpful)
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Add PostgreSQL database
railway add --database postgresql

# Deploy
railway up
```

Or use the web interface:

1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose `dmpgrants` repository
4. Railway auto-detects Node.js
5. Click "Add Plugin" → "PostgreSQL"
6. Click "Deploy"

### Step 4: Configure Environment Variables

In Railway dashboard → Variables:

```
NODE_ENV=production
DATABASE_URL=${RAILWAY_PROVIDED}
JWT_SECRET=generate-a-random-secret-here
PORT=3000
```

Railway automatically provides `DATABASE_URL` from PostgreSQL plugin.

### Step 5: Run Database Migration

In Railway dashboard → Deploy → Run Command:

```bash
npm run db:migrate
```

### Step 6: Access Your App

Railway provides a public URL: `https://your-app.up.railway.app`

**Done! Your app is live!** 🎉

---

## 🔧 Deploy to Render.com

### Step 1: Create Render Account

1. Go to https://render.com
2. Sign up with GitHub
3. Connect your repository

### Step 2: Create PostgreSQL Database

1. Click "New +" → "PostgreSQL"
2. Name: `dmp-cemetery-db`
3. Database: `dmp_cemetery`
4. User: `dmp_user`
5. Region: Choose closest to you
6. Plan: Select plan (Starter $7/month recommended)
7. Click "Create Database"
8. Copy the "Internal Database URL"

### Step 3: Create Web Service

1. Click "New +" → "Web Service"
2. Connect your `dmpgrants` repository
3. Configure:
   - **Name:** `dmp-cemetery-api`
   - **Region:** Same as database
   - **Branch:** `main`
   - **Root Directory:** (leave blank)
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run server`
   - **Plan:** Starter ($7/month)

4. Add Environment Variables:
   ```
   NODE_ENV=production
   DATABASE_URL=(paste Internal Database URL)
   JWT_SECRET=(generate random string)
   PORT=3000
   ```

5. Click "Create Web Service"

### Step 4: Run Migration

Once deployed, go to Shell tab and run:

```bash
npm run db:migrate
```

### Step 5: Deploy Frontend (Optional - Static Site)

1. Click "New +" → "Static Site"
2. Connect repository
3. Configure:
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`
4. Add Environment Variable:
   - `VITE_API_URL=https://your-api-url.onrender.com`

**Your app is live!** Access at the provided URL.

---

## ⚡ Deploy Frontend to Vercel (Optional)

If you want maximum frontend performance:

### Step 1: Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Or use the web interface at vercel.com
```

###Step 2: Configure

1. Import your GitHub repository
2. Framework Preset: "Vite"
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Environment Variables:
   ```
   VITE_API_URL=https://your-backend-url.railway.app
   ```

6. Deploy!

---

## 🔒 Security Best Practices

### 1. Environment Variables

**Never commit these to Git:**
- `JWT_SECRET` - Generate with: `openssl rand -base64 32`
- `DATABASE_URL` - Provided by hosting platform
- API keys, passwords, secrets

### 2. Database Security

```bash
# Enable SSL for database connections (production)
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require
```

### 3. CORS Configuration

Update `server/index.js`:

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
```

### 4. Rate Limiting

Already included in improved code:

```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

---

## 📊 Cost Breakdown

### Small Cemetery (1-5 users, <1000 monthly API calls)

| Platform | Backend | Database | Total/Month |
|----------|---------|----------|-------------|
| **Railway** | $10 | Included | **$10-15** |
| **Render** | $7 | $7 | **$14** |
| **Vercel + Railway** | $20 + $10 | Included | **$30** |

### Medium Cemetery (5-15 users, <10000 monthly API calls)

| Platform | Backend | Database | Total/Month |
|----------|---------|----------|-------------|
| **Railway** | $20 | Included | **$20-30** |
| **Render** | $25 | $15 | **$40** |
| **Vercel + Railway** | $20 + $20 | Included | **$40** |

---

## 🔄 Continuous Deployment

All platforms support automatic deployment from Git:

1. **Push to GitHub:**
   ```bash
   git push origin main
   ```

2. **Automatic Deploy:**
   - Railway/Render/Vercel detect changes
   - Automatically build and deploy
   - Zero downtime deployment

---

## 📈 Monitoring & Maintenance

### Railway

- Built-in metrics dashboard
- View logs in real-time
- Resource usage graphs
- Automatic backups (PostgreSQL)

### Render

- Detailed metrics and logs
- Email alerts for downtime
- Automatic SSL renewal
- Daily database backups

### Recommended Additions

```bash
# Add health check monitoring
npm install express-ping

# In server/index.js
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});
```

---

## 🆘 Troubleshooting

### Database Connection Failed

```bash
# Test database connection
psql $DATABASE_URL

# Check if migration ran
railway run npm run db:migrate
# or
render run npm run db:migrate
```

### Build Failures

```bash
# Clear cache and rebuild
railway up --detach
# or on Render: Manual Deploy → Clear cache
```

### Application Crashes

```bash
# View logs
railway logs
# or check Render logs in dashboard
```

---

## 🎯 Recommended Setup

**For Detroit Memorial Park:**

1. **Deploy to Railway.app**
   - Cost-effective ($10-20/month)
   - Easy management
   - Built-in database
   - No DevOps knowledge required

2. **Keep a Local Backup**
   - Export data weekly:
   ```bash
   railway run pg_dump $DATABASE_URL > backup.sql
   ```

3. **Monitor Usage**
   - Check Railway dashboard weekly
   - Set up billing alerts
   - Monitor error logs

---

## 📝 Migration Checklist

- [ ] Create cloud account (Railway/Render)
- [ ] Push code to GitHub
- [ ] Create database on cloud platform
- [ ] Deploy application
- [ ] Set environment variables
- [ ] Run database migration
- [ ] Test all features
- [ ] Set up custom domain (optional)
- [ ] Configure automated backups
- [ ] Set up monitoring/alerts
- [ ] Document access credentials

---

## 🌟 Next Steps After Deployment

1. **Custom Domain:** Point your domain to the cloud URL
2. **SSL Certificate:** Automatic on all platforms
3. **Backups:** Set up automated backups
4. **Monitoring:** Add application monitoring
5. **Analytics:** Track usage and errors

---

**Your cemetery management system is now cloud-hosted and accessible from anywhere, including iPad!** 🚀📱

All platforms provide excellent iPad support through responsive web design.
No app store submission required - just open in Safari!
