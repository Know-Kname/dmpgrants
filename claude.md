# Detroit Memorial Park - Cemetery Business Software

## Project Overview

This is a comprehensive cemetery business management application for Detroit Memorial Park, designed to replace/supplement the current Cemetery Manager system by cemsites (dmpcm.cemsites.com). It serves three Michigan locations with over 170 acres and 39,000+ historical burial records.

## Core Modules

### 1. Work Orders
- Create, assign, and track maintenance and service work orders
- Schedule tasks and assign to staff
- Track completion status and time
- Generate work order reports

### 2. Inventory Management
- Track cemetery inventory (caskets, urns, vaults, markers, etc.)
- Monitor stock levels and reorder points
- Record purchases and usage
- Vendor management

### 3. Financial Management
- **Deposits**: Track all incoming payments
- **Accounts Receivable**: Manage customer payments and balances
- **Accounts Payable**: Track bills and vendor payments
- **Statements**: Generate financial statements and reports
- **Invoicing**: Create and send invoices

### 4. Burials
- Record burial information (location, date, deceased details)
- Plot management and mapping
- Burial permits and documentation
- Family contact information

### 5. Contracts
- Pre-need and at-need contract management
- Payment plans and tracking
- Contract templates and generation
- Digital signatures and document storage

### 6. Grants/Benefits/Opportunities
- Track available grants and funding opportunities
- Manage veteran benefits and assistance programs
- Application tracking and status
- Reporting and compliance

## Technical Stack

- **Frontend**: React 18 with TypeScript (strict mode)
- **Backend**: Node.js 20 with Express (plain JavaScript, ESM)
- **Database**: PostgreSQL 16 with pg driver (no ORM)
- **Build Tool**: Vite 5
- **UI**: Custom design system (Tailwind CSS + custom components in `src/components/ui.tsx`)
- **Validation**: Zod (client-side), express-validator (server-side)
- **Data Fetching**: TanStack React Query v5
- **Authentication**: JWT-based with role-based access control
- **Testing**: Vitest + React Testing Library + supertest

## Development Approach

This is built as a foundational system that will be improved iteratively over time. The focus is on:
- Clean, maintainable code
- Modular architecture
- Scalability
- User-friendly interfaces
- Data security and privacy

## Getting Started

```bash
# One-command setup (recommended for first time)
./setup.sh

# Or manual setup:
npm install
cp .env.example .env        # Then edit .env with your DB credentials
npm run db:migrate
npm run dev:full             # Starts both frontend + backend
```

## Project Structure

```
/
├── src/                    # Frontend (React + TypeScript)
│   ├── components/         # UI components (ui.tsx = design system)
│   ├── pages/              # Route page components
│   ├── hooks/              # Custom React hooks (useData, useForm)
│   ├── lib/                # API client, auth, schemas, utils, theme
│   ├── config/             # App configuration
│   ├── styles/             # Global CSS with design tokens
│   ├── types/              # TypeScript type definitions
│   └── tests/              # Test setup
├── server/                 # Backend (Express + plain JS, ESM)
│   ├── app.js              # Express app setup
│   ├── index.js            # Server entry point
│   ├── routes/             # API route handlers
│   ├── middleware/          # Auth, validation, error handling
│   ├── db/                 # Database schema, migrations, import
│   ├── utils/              # Error classes, pagination
│   └── tests/              # Backend tests
├── public/                 # Static assets
└── docs/                   # Additional documentation
```

## Current Features (v1.0 Foundation)

- User authentication and role-based access (admin, manager, staff)
- Dashboard with key metrics and alerts
- Work Orders management (full CRUD)
- Grants & Opportunities tracking (full CRUD)
- Demo mode (preview with sample data, no database required)
- Dark/light theme support
- Responsive design for desktop and tablet
- Data import from Excel/CSV (39,000+ burial records)

## Key Conventions

- **Frontend** uses camelCase; **backend/database** uses snake_case
- The API client (`src/lib/api.ts`) auto-converts between the two
- Always use parameterized SQL queries (never string interpolation)
- Always use the custom UI components from `src/components/ui.tsx`
- Always use semantic color tokens, not raw Tailwind colors
- Backend errors use structured classes from `server/utils/errors.js`

## Roadmap

- [ ] Complete Inventory, Financial, Burials, Contracts, Customers pages
- [ ] Mobile app development
- [ ] Advanced reporting and analytics
- [ ] Integration with cemsites data
- [ ] Document scanning and OCR
- [ ] Email/SMS notifications
- [ ] Online payment processing
- [ ] Public-facing website integration
- [ ] Cemetery plot visualization/mapping

## Contributing

This is a private project for Detroit Memorial Park. All changes should be committed to feature branches and reviewed before merging. See `AGENTS.md` for detailed coding guidelines.
