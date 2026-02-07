<div align="center">

# Detroit Memorial Park

### Cemetery Management System

*Preserving Memories Since 1925*

[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

A comprehensive business management solution for cemetery operations, serving three locations across Michigan with over 170 acres of sacred grounds.

[Preview](#-preview) • [Features](#-features) • [Installation](#-installation) • [Deployment](#-deployment) • [Documentation](#-documentation)

</div>

---

## 🎯 Preview

**Try the application without any setup!**

The application includes a **Demo Mode** that lets you explore all features with sample data:

1. Visit the login page
2. Click the **"Preview Demo"** button
3. Explore the full interface with mock data

Demo mode includes:
- ✅ Complete UI navigation
- ✅ Sample work orders, burials, inventory
- ✅ Mock financial and grant data
- ✅ Dark/Light theme switching
- ✅ No database or server required

> **Note:** Demo mode uses locally-stored sample data. Sign in with real credentials to access production features.

---

## 📋 Overview

Detroit Memorial Park Cemetery Management System is a full-stack application designed to modernize cemetery operations. It replaces legacy systems with a modern, intuitive interface while maintaining the dignity and respect these operations require.

**Serving:**
- **Detroit Memorial Park East** - Warren, MI
- **Detroit Memorial Park West** - Redford, MI  
- **Gracelawn Cemetery** - Flint, MI

---

## ✨ Features

### Core Modules

| Module | Description |
|--------|-------------|
| 📋 **Work Orders** | Create, assign, and track maintenance tasks with priority levels and status tracking |
| 📦 **Inventory** | Manage caskets, urns, vaults, markers, and supplies with reorder alerts |
| 💰 **Financial** | Complete AR/AP management, deposits, statements, and invoicing |
| ⚰️ **Burials** | Comprehensive burial records with plot management (39,000+ historical records) |
| 📝 **Contracts** | Pre-need and at-need contract management with payment tracking |
| 🎁 **Grants** | Track funding opportunities, veteran benefits, and assistance programs |

### Technical Highlights

- **Modern UI** - Responsive design with dark/light mode support
- **Real-time Data** - React Query for efficient data fetching and caching
- **Type Safety** - Full TypeScript coverage with Zod validation
- **Secure Auth** - JWT-based authentication with role-based access control
- **Data Import** - Automated import from Excel/CSV with intelligent deduplication

---

## 🚀 Installation

### Prerequisites

- **Node.js** 18.x or higher
- **PostgreSQL** 14.x or higher (or Docker)
- **npm** or **yarn**

### Quick Start

```bash
# Clone the repository
git clone https://github.com/Know-Kname/dmpgrants.git
cd dmpgrants

# One-command setup (installs deps, creates .env, starts DB, migrates)
./setup.sh

# Start both frontend + backend
npm run dev:full
```

Or step by step:

```bash
npm install
cp .env.example .env         # Edit with your DB credentials
docker-compose up -d          # Start PostgreSQL
npm run db:migrate
npm run dev:full              # Frontend (5173) + Backend (3000)
```

The application will be available at `http://localhost:5173`

---

## ⚙️ Configuration

Create a `.env` file in the project root:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dmp_cemetery

# Authentication
JWT_SECRET=your-secure-jwt-secret

# Server
PORT=3000
NODE_ENV=development
```

---

## 📁 Project Structure

```
dmpgrants/
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── ui.tsx       # Design system components
│   │   ├── Layout.tsx   # App layout with navigation
│   │   └── Pagination.tsx
│   ├── pages/           # Route page components
│   │   ├── Dashboard.tsx
│   │   ├── WorkOrders.tsx
│   │   ├── Burials.tsx
│   │   └── ...
│   ├── hooks/           # Custom React hooks
│   │   ├── useData.ts   # Data fetching hooks
│   │   └── useForm.ts   # Form management
│   ├── lib/             # Utilities and configuration
│   │   ├── api.ts       # API client
│   │   ├── auth.tsx     # Auth context
│   │   ├── query.tsx    # React Query setup
│   │   ├── schemas.ts   # Zod validation schemas
│   │   └── utils.ts     # Helper functions
│   ├── config/          # App configuration
│   │   └── company.ts   # Company information
│   ├── styles/          # Global styles
│   │   └── index.css    # Design system tokens
│   └── types/           # TypeScript definitions
├── server/
│   ├── routes/          # API route handlers
│   ├── middleware/      # Express middleware
│   ├── db/              # Database setup
│   │   ├── schema.sql   # Database schema
│   │   ├── migrate.js   # Migration script
│   │   └── import-data.js # Data import utility
│   └── utils/           # Server utilities
├── public/              # Static assets
└── docs/                # Additional documentation
```

---

## 🖥️ Usage

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev:full` | Start frontend + backend concurrently |
| `npm run dev` | Start frontend dev server only (Vite) |
| `npm run server` | Start backend API server only |
| `npm run build` | TypeScript check + production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm run check` | Full pipeline: lint + format + build + test |
| `npm run test` | Run all tests |
| `npm run db:migrate` | Run database migrations |
| `npm run db:import` | Import data from Excel/CSV |
| `npm run db:reset` | Reset and reimport all data |

### Default Accounts

After running migrations, these accounts are available:

| Email | Password | Role |
|-------|----------|------|
| admin@dmp.com | admin123 | Administrator |
| manager@dmp.com | admin123 | Manager |
| staff@dmp.com | admin123 | Staff |

---

## 📊 Data Import

The system includes a powerful data import utility that processes:

- **Burial Records** - Historical data from 1925-present (39,000+ records)
- **Work Orders** - Maintenance and service requests
- **Financial Data** - Sales, vendor bills, bank statements
- **Customer Data** - Extracted from burial contact information

See [Import Guide](./server/db/IMPORT-GUIDE.md) for detailed documentation.

---

## 🎨 Design System

The UI is built on a custom design system with:

- **CSS Variables** - HSL-based color primitives
- **Semantic Tokens** - Contextual color mapping
- **Dark Mode** - Full dark theme support
- **Animations** - Smooth transitions and micro-interactions

### Color Palette

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--primary` | Teal 600 | Teal 500 | Primary actions |
| `--success` | Green 500 | Green 400 | Success states |
| `--warning` | Amber 500 | Amber 400 | Warning states |
| `--error` | Red 500 | Red 400 | Error states |

---

## 🔒 Security

- **Authentication** - JWT tokens with secure httpOnly cookies
- **Authorization** - Role-based access control (Admin, Manager, Staff)
- **Validation** - Server-side validation with express-validator
- **Data Protection** - Parameterized queries to prevent SQL injection

---

## 🚀 Deployment

Deploy to any platform with our comprehensive guides:

| Platform | Description | Guide |
|----------|-------------|-------|
| 🐳 **Docker** | Containerized deployment for any environment | [View](#docker-deployment) |
| 🪟 **Windows** | Native Windows with PostgreSQL | [View](#windows-deployment) |
| 🐧 **Linux** | Ubuntu/Debian server deployment | [View](#linux-deployment) |
| 🔧 **WSL2** | Windows Subsystem for Linux development | [View](#wsl2-development) |
| ☁️ **Cloud** | Railway, Render, Vercel, Coolify | [View](#cloud-deployment) |
| 📱 **Mobile** | iPhone/iPad/Android PWA installation | [View](#mobile-access) |

**[📖 Full Deployment Guide →](./docs/DEPLOYMENT.md)**

### Quick Deploy Options

```bash
# Docker (recommended)
docker-compose up -d && npm run db:migrate && npm run dev

# Railway (one-click cloud)
railway up

# Self-hosted (Coolify)
curl -fsSL https://get.coolify.io | bash
```

---

## 🗺️ Roadmap

- [ ] Mobile application (React Native)
- [ ] Advanced reporting and analytics dashboard
- [ ] Integration with cemsites.com data
- [ ] Document scanning and OCR
- [ ] Email/SMS notifications
- [ ] Online payment processing
- [ ] Public-facing memorial website
- [ ] Cemetery plot visualization/mapping
- [ ] Automated backup and disaster recovery

---

## 📖 Documentation

| Document | Description |
|----------|-------------|
| [AGENTS.md](./AGENTS.md) | AI agent coding guidelines and project conventions |
| [claude.md](./claude.md) | Project overview and module details |
| [Deployment Guide](./docs/DEPLOYMENT.md) | Complete deployment instructions for all platforms |
| [Import Guide](./server/db/IMPORT-GUIDE.md) | Data import documentation |

---

## 🤝 Contributing

This is a private project for Detroit Memorial Park. Development guidelines:

1. Create feature branches from `main`
2. Run `npm run check` before pushing (lint + format + build + test)
3. Follow TypeScript strict mode (frontend) and ESLint rules
4. Include tests for new features
5. See [AGENTS.md](./AGENTS.md) for detailed coding conventions

---

## 📞 Contact

**Detroit Memorial Park Association, Inc.**

- **Phone:** (586) 751-1313
- **Website:** [detroitmemorialpark.org](https://detroitmemorialpark.org)
- **Email:** info@detroitmemorialpark.org

### Locations

| Location | Address | Phone |
|----------|---------|-------|
| East Cemetery | 4280 E. Thirteen Mile Rd, Warren, MI 48092 | (586) 751-1313 |
| West Cemetery | 25062 Plymouth Road, Redford, MI 48239 | (313) 533-1302 |
| Gracelawn | 5710 N. Saginaw Street, Flint, MI 48505 | (810) 785-7890 |

---

## 📄 License

**Proprietary** - © 2026 Detroit Memorial Park Association, Inc. All rights reserved.

This software is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

---

<div align="center">

*Recognized by the State of Michigan as an Official Historic Site*

**Preserving Memories Since 1925**

</div>
