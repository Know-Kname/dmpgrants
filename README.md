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

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Documentation](#-documentation)

</div>

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
git clone https://github.com/your-org/dmpgrants.git
cd dmpgrants

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Start PostgreSQL (using Docker)
docker-compose up -d

# Run database migrations
npm run db:migrate

# Import production data (optional)
npm run db:import

# Start development server
npm run dev
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
| `npm run dev` | Start frontend dev server (Vite) |
| `npm run server` | Start backend API server |
| `npm run build` | Build for production |
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
| [CLAUDE.md](./CLAUDE.md) | Project overview and module details |
| [Import Guide](./server/db/IMPORT-GUIDE.md) | Data import documentation |
| [API Reference](./docs/api.md) | API endpoint documentation |

---

## 🤝 Contributing

This is a private project for Detroit Memorial Park. Development guidelines:

1. Create feature branches from `main`
2. Follow TypeScript strict mode
3. Include tests for new features
4. Submit pull requests for review
5. Maintain clean commit history

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
