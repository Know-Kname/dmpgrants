# Deployment Guide

Complete deployment instructions for Detroit Memorial Park Cemetery Management System across all platforms.

---

## Table of Contents

- [Quick Preview](#-quick-preview)
- [Docker Deployment](#-docker-deployment)
- [Windows Deployment](#-windows-deployment)
- [Linux Deployment](#-linux-deployment)
- [WSL2 Development](#-wsl2-development)
- [Cloud Deployment](#-cloud-deployment)
- [Mobile Access (iPhone/iPad)](#-mobile-access-iphoneipad)
- [Production Checklist](#-production-checklist)

---

## 🎯 Quick Preview

Try the application without any setup using **Demo Mode**:

1. Visit the login page
2. Click **"Preview Demo"** button
3. Explore all features with sample data

Demo mode provides:
- Full UI navigation
- Sample work orders, burials, inventory
- Mock financial data
- No database or server required

---

## 🐳 Docker Deployment

### Development (Quick Start)

```bash
# Clone and enter directory
git clone https://github.com/Know-Kname/dmpgrants.git
cd dmpgrants

# Start PostgreSQL container
docker-compose up -d

# Install dependencies and start
npm install
npm run db:migrate
npm run dev
```

### Production (Full Stack)

Create `docker-compose.production.yml`:

```yaml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:16-alpine
    container_name: dmp-postgres
    restart: always
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./server/db/schema.sql:/docker-entrypoint-initdb.d/01-schema.sql:ro
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER} -d ${DB_NAME}"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - dmp-network

  # Node.js Backend API
  api:
    build:
      context: .
      dockerfile: Dockerfile.api
    container_name: dmp-api
    restart: always
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://${DB_USER}:${DB_PASSWORD}@postgres:5432/${DB_NAME}
      JWT_SECRET: ${JWT_SECRET}
      PORT: 3000
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - dmp-network

  # React Frontend (Nginx)
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    container_name: dmp-frontend
    restart: always
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - api
    networks:
      - dmp-network

volumes:
  postgres_data:

networks:
  dmp-network:
    driver: bridge
```

Create `Dockerfile.api`:

```dockerfile
FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy server files
COPY server/ ./server/

# Security: Run as non-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001
USER nodejs

EXPOSE 3000
CMD ["node", "server/index.js"]
```

Create `Dockerfile.frontend`:

```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]
```

Deploy:

```bash
# Create .env file with production values
cat > .env.production << EOF
DB_USER=dmp_prod_user
DB_PASSWORD=$(openssl rand -base64 32)
DB_NAME=dmp_cemetery
JWT_SECRET=$(openssl rand -base64 64)
EOF

# Deploy
docker-compose -f docker-compose.production.yml --env-file .env.production up -d
```

---

## 🪟 Windows Deployment

### Prerequisites

1. **Node.js 20+**: Download from [nodejs.org](https://nodejs.org/)
2. **PostgreSQL 16**: Download from [postgresql.org](https://www.postgresql.org/download/windows/)
3. **Git**: Download from [git-scm.com](https://git-scm.com/download/win)

### Installation Steps

```powershell
# 1. Clone repository
git clone https://github.com/Know-Kname/dmpgrants.git
cd dmpgrants

# 2. Install dependencies
npm install

# 3. Create environment file
@"
DATABASE_URL=postgresql://dmp_user:your_password@localhost:5432/dmp_cemetery
JWT_SECRET=your-secure-jwt-secret-key
PORT=3000
NODE_ENV=development
"@ | Out-File -FilePath .env -Encoding UTF8

# 4. Create database (run in pgAdmin or psql)
# CREATE DATABASE dmp_cemetery;
# CREATE USER dmp_user WITH PASSWORD 'your_password';
# GRANT ALL PRIVILEGES ON DATABASE dmp_cemetery TO dmp_user;

# 5. Run migrations
npm run db:migrate

# 6. Import data (optional)
npm run db:import

# 7. Start development
npm run dev          # Frontend: http://localhost:5173
npm run server       # Backend: http://localhost:3000 (separate terminal)
```

### Windows Service (Production)

Install as Windows Service using [node-windows](https://github.com/coreybutler/node-windows):

```powershell
# Install node-windows
npm install -g node-windows

# Create service script (install-service.js)
@"
const Service = require('node-windows').Service;

const svc = new Service({
  name: 'DMP Cemetery API',
  description: 'Detroit Memorial Park Cemetery Management API',
  script: require('path').join(__dirname, 'server', 'index.js'),
  env: [
    { name: 'NODE_ENV', value: 'production' },
    { name: 'PORT', value: '3000' }
  ]
});

svc.on('install', () => svc.start());
svc.install();
"@ | Out-File -FilePath install-service.js -Encoding UTF8

# Install and start service
node install-service.js
```

---

## 🐧 Linux Deployment

### Ubuntu/Debian

```bash
# 1. Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Install PostgreSQL
sudo apt-get install -y postgresql postgresql-contrib

# 3. Configure PostgreSQL
sudo -u postgres psql << EOF
CREATE DATABASE dmp_cemetery;
CREATE USER dmp_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE dmp_cemetery TO dmp_user;
\c dmp_cemetery
GRANT ALL ON SCHEMA public TO dmp_user;
EOF

# 4. Clone and setup
git clone https://github.com/Know-Kname/dmpgrants.git
cd dmpgrants
npm install

# 5. Create .env
cat > .env << EOF
DATABASE_URL=postgresql://dmp_user:your_secure_password@localhost:5432/dmp_cemetery
JWT_SECRET=$(openssl rand -base64 64)
PORT=3000
NODE_ENV=production
EOF

# 6. Build and migrate
npm run build
npm run db:migrate

# 7. Setup systemd service
sudo cat > /etc/systemd/system/dmp-api.service << EOF
[Unit]
Description=DMP Cemetery API
After=network.target postgresql.service

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/dmpgrants
ExecStart=/usr/bin/node server/index.js
Restart=on-failure
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

# 8. Enable and start
sudo systemctl daemon-reload
sudo systemctl enable dmp-api
sudo systemctl start dmp-api
```

### Nginx Reverse Proxy

```nginx
# /etc/nginx/sites-available/dmp-cemetery
server {
    listen 80;
    server_name cemetery.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name cemetery.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/cemetery.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/cemetery.yourdomain.com/privkey.pem;

    # Frontend
    location / {
        root /opt/dmpgrants/dist;
        try_files $uri $uri/ /index.html;
    }

    # API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🔧 WSL2 Development

### Setup WSL2 + Docker

```powershell
# Windows PowerShell (Admin)
# 1. Enable WSL2
wsl --install -d Ubuntu

# 2. Set WSL2 as default
wsl --set-default-version 2
```

### Configure WSL2

```bash
# Inside WSL2 Ubuntu terminal

# 1. Update system
sudo apt update && sudo apt upgrade -y

# 2. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Clone to Linux filesystem (important for performance!)
cd ~
mkdir projects && cd projects
git clone https://github.com/Know-Kname/dmpgrants.git
cd dmpgrants

# 4. Install dependencies
npm install
```

### Docker Desktop Integration

1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop/)
2. Enable WSL2 integration in Docker Desktop settings
3. Run Docker commands from WSL2:

```bash
# Start database
docker-compose up -d

# Run app
npm run dev
```

### VS Code Integration

```bash
# Open project in VS Code from WSL2
code .
```

### Performance Tips

Create `~/.wslconfig` in Windows:

```ini
[wsl2]
memory=8GB
processors=4
swap=2GB

[experimental]
sparseVhd=true
```

---

## ☁️ Cloud Deployment

### Railway (Recommended)

```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Initialize project
railway init

# 4. Add PostgreSQL
railway add --plugin postgresql

# 5. Deploy
railway up
```

### Render

1. Create account at [render.com](https://render.com)
2. Connect GitHub repository
3. Create **Web Service** for API
4. Create **Static Site** for frontend
5. Create **PostgreSQL** database
6. Set environment variables

### Coolify (Self-Hosted)

```bash
# On your VPS
curl -fsSL https://get.coolify.io | bash

# Access Coolify dashboard
# Add GitHub repository
# Deploy with one click
```

### Vercel + Railway

```bash
# Frontend on Vercel
npm i -g vercel
vercel

# Backend on Railway
railway up
```

---

## 📱 Mobile Access (iPhone/iPad)

### Progressive Web App (PWA)

The application works as a PWA on iOS devices:

#### Installation on iPhone/iPad

1. Open Safari and navigate to your deployed app URL
2. Tap the **Share** button (square with arrow)
3. Scroll down and tap **"Add to Home Screen"**
4. Name the app and tap **"Add"**
5. The app icon appears on your home screen

#### PWA Configuration

Add to `public/manifest.json`:

```json
{
  "name": "Detroit Memorial Park",
  "short_name": "DMP Cemetery",
  "description": "Cemetery Management System",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f172a",
  "theme_color": "#0d9488",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-maskable.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ]
}
```

Add to `index.html`:

```html
<!-- iOS PWA Meta Tags -->
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="DMP Cemetery">
<link rel="apple-touch-icon" href="/icons/icon-192.png">

<!-- Splash screens for iOS -->
<link rel="apple-touch-startup-image" href="/splash/splash-640x1136.png" 
      media="(device-width: 320px) and (device-height: 568px)">
<link rel="apple-touch-startup-image" href="/splash/splash-750x1334.png" 
      media="(device-width: 375px) and (device-height: 667px)">
<link rel="apple-touch-startup-image" href="/splash/splash-1242x2208.png" 
      media="(device-width: 414px) and (device-height: 736px)">
```

### Android Installation

On Android devices, Chrome will automatically prompt to install:

1. Visit your deployed app URL
2. Tap **"Add to Home Screen"** in the browser menu or accept the install prompt
3. The app is installed like a native application

---

## ✅ Production Checklist

### Security

- [ ] Use strong, unique `JWT_SECRET`
- [ ] Enable HTTPS/SSL certificates
- [ ] Set secure PostgreSQL password
- [ ] Configure firewall rules
- [ ] Enable rate limiting
- [ ] Set up CORS properly
- [ ] Use environment variables (never commit secrets)

### Performance

- [ ] Enable gzip compression
- [ ] Configure CDN for static assets
- [ ] Set up database connection pooling
- [ ] Enable response caching
- [ ] Optimize images

### Monitoring

- [ ] Set up error logging (Sentry, LogRocket)
- [ ] Configure uptime monitoring
- [ ] Set up database backups
- [ ] Monitor server resources

### Backup

- [ ] Automated PostgreSQL backups
- [ ] Off-site backup storage
- [ ] Tested restore procedure
- [ ] Document recovery steps

### Environment Variables

```bash
# Required
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=minimum-32-characters-random-string
NODE_ENV=production

# Optional
PORT=3000
LOG_LEVEL=info
CORS_ORIGIN=https://yourdomain.com
```

---

## 🆘 Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Database connection failed | Check `DATABASE_URL` and PostgreSQL service |
| Port already in use | Change `PORT` or kill existing process |
| Build fails | Clear `node_modules` and reinstall |
| Docker permission denied | Add user to docker group or use sudo |
| WSL2 slow | Store files in Linux filesystem, not `/mnt/c` |

### Getting Help

- Check [GitHub Issues](https://github.com/Know-Kname/dmpgrants/issues)
- Review logs: `docker-compose logs -f`
- Contact: support@detroitmemorialpark.org

---

*Last updated: February 2026*
