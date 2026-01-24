# 🚀 Quick Start Guide

Get up and running in 5 minutes!

## 📦 Installation

### Option 1: Use npx (Recommended)
```bash
npx @yourname/app-boilerplate-generator my-awesome-app
```

### Option 2: Global Install
```bash
npm install -g @yourname/app-boilerplate-generator
create-app my-awesome-app
```

### Option 3: Clone & Run
```bash
git clone https://github.com/yourusername/app-boilerplate-generator.git
cd app-boilerplate-generator
npm install
npm run generate
```

---

## 🎯 Choose Your Path

### Path 1: Full-Stack App (Frontend + Backend + Database)

**Perfect for:** Complete applications, SaaS products, internal tools

```bash
npm run generate:fullstack my-saas-app
```

**What you get:**
- ✅ React frontend (localhost:5173)
- ✅ Express backend (localhost:3000)
- ✅ PostgreSQL setup
- ✅ Authentication
- ✅ All best practices

**Next steps:**
```bash
cd my-saas-app
npm run install:all
cd backend && cp .env.example .env
# Edit .env with database credentials
npm run db:migrate
npm run dev
```

---

### Path 2: Frontend Only

**Perfect for:** Dashboards, admin panels, static sites, JAMstack

```bash
npm run generate:frontend my-dashboard
```

**What you get:**
- ✅ React + TypeScript
- ✅ Tailwind CSS
- ✅ Custom hooks
- ✅ Toast notifications
- ✅ Error handling
- ✅ Form validation

**Next steps:**
```bash
cd my-dashboard
npm install
npm run dev
```

---

### Path 3: Backend Only

**Perfect for:** APIs, microservices, backend for mobile apps

```bash
npm run generate:backend my-api
```

**What you get:**
- ✅ Express + security
- ✅ JWT authentication
- ✅ Input validation
- ✅ Rate limiting
- ✅ Database connection
- ✅ Audit logging

**Next steps:**
```bash
cd my-api
npm install
cp .env.example .env
# Edit .env
npm run db:migrate
npm start
```

---

## 🎨 Interactive Mode

Run the CLI for guided generation:

```bash
npm run generate
```

You'll see:
```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   🚀  PRODUCTION-READY APP GENERATOR                         ║
║                                                               ║
║   Generate high-quality, production-ready applications       ║
║   with best practices baked in                               ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝

What would you like to generate?

  1. 📱 Frontend (React + TypeScript + Tailwind)
  2. ⚙️  Backend (Express + Security + Database)
  3. 🎯 Full-Stack (Frontend + Backend + Database)
  4. 📚 View Documentation
  5. 🚪 Exit

Enter your choice (1-5):
```

---

## 📚 Example Projects

### Example 1: Todo App

```bash
# Generate full-stack app
npm run generate:fullstack todo-app

cd todo-app
npm run install:all

# Configure database
cd backend
cp .env.example .env
# Edit .env: DATABASE_URL=postgresql://localhost:5432/todos

# Run migrations
npm run db:migrate

# Start dev servers
cd ..
npm run dev
```

**Result:** Complete todo app with:
- Frontend on http://localhost:5173
- Backend API on http://localhost:3000
- Authentication, CRUD operations, real-time feedback

---

### Example 2: Admin Dashboard

```bash
# Frontend only
npm run generate:frontend admin-dashboard

cd admin-dashboard
npm install
npm run dev
```

**Result:** Beautiful admin dashboard with:
- Charts, tables, forms
- Toast notifications
- Error handling
- Responsive design

---

### Example 3: REST API

```bash
# Backend only
npm run generate:backend product-api

cd product-api
npm install
cp .env.example .env

# Setup PostgreSQL
# Edit .env with database credentials

npm run db:migrate
npm start
```

**Result:** Production-ready API with:
- Authentication endpoints
- CRUD operations
- Input validation
- Rate limiting
- Audit logging

---

## ⚡ Commands Reference

### Full-Stack
```bash
npm run install:all      # Install all dependencies
npm run dev              # Start frontend + backend
npm run dev:frontend     # Start frontend only
npm run dev:backend      # Start backend only
npm run build            # Build for production
npm run db:migrate       # Run database migrations
```

### Frontend Only
```bash
npm install             # Install dependencies
npm run dev             # Start dev server (port 5173)
npm run build           # Build for production
npm run preview         # Preview production build
```

### Backend Only
```bash
npm install             # Install dependencies
npm start               # Start server (port 3000)
npm run dev             # Start with nodemon
npm run db:migrate      # Run migrations
```

---

## 🔧 Customization

### Change Ports
```bash
# Frontend (vite.config.ts)
server: {
  port: 3001
}

# Backend (.env)
PORT=4000
```

### Add Routes
```bash
# Backend: Create new route file
touch backend/server/routes/products.js

# Add to backend/server/index.js
import productRoutes from './routes/products.js';
app.use('/api/products', productRoutes);
```

### Add Pages
```bash
# Frontend: Create new page
touch frontend/src/pages/Products.tsx

# Add to frontend/src/App.tsx
const Products = lazy(() => import('./pages/Products'));
<Route path="products" element={<Products />} />
```

---

## 🐛 Troubleshooting

### Database Connection Error
```bash
# Check PostgreSQL is running
psql -U postgres

# Verify DATABASE_URL in .env
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
```

### Port Already in Use
```bash
# Find process using port
lsof -ti:3000
# Kill process
kill -9 <PID>

# Or change port in .env / vite.config.ts
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## 📖 Next Steps

Once you have your app running:

1. **Frontend:** [Read Frontend Guide](./FRONTEND.md)
   - Learn about custom hooks
   - Understand components
   - Add new features

2. **Backend:** [Read Backend Guide](./BACKEND.md)
   - Set up authentication
   - Create API endpoints
   - Implement validation

3. **Best Practices:** [Read Best Practices](./BEST_PRACTICES.md)
   - Security tips
   - Performance optimization
   - Production deployment

---

## 🎯 Common Use Cases

### SaaS Application
```bash
npm run generate:fullstack my-saas
# Includes: Auth, Dashboard, API, Database
```

### Portfolio Site
```bash
npm run generate:frontend my-portfolio
# Includes: React, Tailwind, Routing
```

### Mobile Backend
```bash
npm run generate:backend mobile-api
# Includes: REST API, Auth, Database
```

### Internal Dashboard
```bash
npm run generate:fullstack company-dashboard
# Includes: Everything you need
```

---

## 💡 Tips

### Tip 1: Start Small
Begin with what you need. You can always add more later.

### Tip 2: Read the Docs
Each generated app includes comprehensive README files.

### Tip 3: Customize Freely
The generated code is yours. Modify it to fit your needs.

### Tip 4: Use TypeScript
The boilerplate uses TypeScript for better developer experience.

### Tip 5: Follow Patterns
The boilerplate follows industry best practices. Keep using them!

---

## 🚀 You're Ready!

Generate your first app:

```bash
npm run generate
```

Happy coding! 🎉
