# AGENTS.md

Instructions for AI coding agents working on the Detroit Memorial Park Cemetery Management System.

> **Scope**: This file covers project-wide guidance. See also `src/AGENTS.md` (frontend) and `server/AGENTS.md` (backend) for layer-specific rules.

## Project at a Glance

| Aspect | Detail |
|--------|--------|
| **What** | Full-stack cemetery business management app (work orders, burials, inventory, financials, contracts, grants) |
| **Frontend** | React 18 + TypeScript 5 (strict) + Vite 5 + Tailwind CSS 3.4 |
| **Backend** | Node.js 20 + Express 4 + **plain JavaScript** (ESM) |
| **Database** | PostgreSQL 16, raw SQL via `pg` (no ORM) |
| **Validation** | Zod (client), express-validator (server) |
| **Data layer** | TanStack React Query v5 |
| **Auth** | JWT Bearer tokens, role-based (admin, manager, staff) |
| **Testing** | Vitest + React Testing Library + supertest |
| **Private** | Proprietary, not open source. Treat all data as sensitive. |

## Commands

```bash
npm run dev            # Vite frontend (port 5173)
npm run server         # Express backend (port 3000)
npm run dev:full       # Both servers concurrently
npm run build          # tsc + vite build (catches type errors)
npm run test           # Run all tests
npm run test:frontend  # Frontend tests only
npm run test:backend   # Backend tests only
npm run test:all       # Frontend + backend sequentially
npm run test:coverage  # Tests with coverage report
npm run db:migrate     # Run database migrations
npm run db:import      # Import data from Excel/CSV
npm run db:reset       # Migrate + import (full reset)
./setup.sh             # One-command first-time setup (installs deps, creates .env, starts DB, migrates)
```

## Project Structure

```
/
├── src/                        # FRONTEND (React + TypeScript)
│   ├── components/
│   │   ├── ui.tsx              # Design system: Button, Card, Modal, Input, Select, Badge, etc.
│   │   ├── Layout.tsx          # App shell with sidebar navigation
│   │   ├── Pagination.tsx      # Pagination component
│   │   └── ErrorBoundary.tsx   # React error boundary
│   ├── pages/                  # Route pages (Dashboard, WorkOrders, Grants, Login, etc.)
│   ├── hooks/
│   │   ├── useData.ts          # Data fetching hooks (wraps React Query)
│   │   └── useForm.ts          # Form state management
│   ├── lib/
│   │   ├── api.ts              # API client with auto camelCase<->snake_case
│   │   ├── auth.tsx            # Auth context + useAuth hook
│   │   ├── query.tsx           # React Query provider + config
│   │   ├── schemas.ts          # ALL Zod validation schemas
│   │   ├── theme.tsx           # Dark/light theme context
│   │   ├── utils.ts            # Helpers (case conversion, formatting)
│   │   ├── demo-data.ts        # Demo mode sample data
│   │   └── errors.ts           # Frontend error utilities
│   ├── config/company.ts       # Company info constants
│   ├── styles/index.css        # Global CSS + HSL design tokens
│   ├── types/index.ts          # ALL TypeScript interfaces
│   ├── tests/setup.ts          # Test polyfills
│   ├── App.tsx                 # Router + providers
│   └── main.tsx                # Entry point
│
├── server/                     # BACKEND (Node.js + Express, PLAIN JS)
│   ├── app.js                  # Express app: middleware + route mounting
│   ├── index.js                # Server entry point (dotenv + listen)
│   ├── routes/                 # REST route handlers (auth, burials, contracts, etc.)
│   ├── middleware/
│   │   ├── auth.js             # JWT auth + role guards
│   │   ├── validation.js       # express-validator rules for every endpoint
│   │   ├── errorHandler.js     # Centralized error handler
│   │   ├── normalizeRequest.js # camelCase -> snake_case body transform
│   │   └── requestContext.js   # Request ID + timing
│   ├── db/
│   │   ├── schema.sql          # Full database DDL
│   │   ├── index.js            # pg Pool setup
│   │   ├── migrate.js          # Migration runner
│   │   └── import-data.js      # Excel/CSV bulk importer
│   ├── utils/
│   │   ├── errors.js           # Error classes (AppError, ValidationError, NotFoundError, etc.)
│   │   └── pagination.js       # Pagination helpers
│   └── tests/                  # Backend tests (*.test.js)
│
├── public/                     # Static assets (favicon, manifest)
├── docs/                       # Additional documentation
├── .cursorrules                # Cursor-specific AI instructions
├── .cursorignore               # Files excluded from AI indexing
└── AGENTS.md                   # This file
```

## Critical Rules

These are the rules that, if broken, cause build failures, bugs, or architectural regressions:

### 1. Language boundary

| Directory | Language | Modules |
|-----------|----------|---------|
| `src/` | TypeScript (strict) | ESM (bundled by Vite) |
| `server/` | **Plain JavaScript** | ESM (`"type": "module"`) |

Never put `.ts` files in `server/`. Never put untyped `.js` in `src/`.

### 2. Case conversion boundary

```
Frontend (camelCase) ←→ API client auto-converts ←→ Backend (snake_case) ←→ Database (snake_case)
```

- `src/lib/api.ts` automatically converts outgoing request bodies from camelCase to snake_case, and incoming responses from snake_case to camelCase.
- `server/middleware/normalizeRequest.js` also converts incoming body keys to snake_case.
- **Do not manually convert casing** when using the `api` client or accessing `req.body` in route handlers.

### 3. UI components

Use the design system in `src/components/ui.tsx`. It exports: `Button`, `Card`, `CardHeader`, `CardBody`, `CardFooter`, `Badge`, `Modal`, `Input`, `Select`, `Textarea`, `Alert`, `EmptyState`, `LoadingSpinner`, `Skeleton`, `Avatar`, `Tooltip`, `Divider`.

Do not install or use shadcn/ui, Material UI, Chakra, Ant Design, or any other component library.

### 4. Color tokens

Use semantic Tailwind tokens mapped to CSS variables:

```
bg-background, bg-card, bg-primary, bg-secondary, bg-accent
text-foreground, text-foreground-muted, text-card-foreground
border-border, border-input
```

Never use raw Tailwind colors (`bg-blue-500`, `text-gray-700`). The theme system handles light/dark mode via CSS variables.

### 5. Data fetching

Always use `useData` hook or React Query's `useQuery`/`useMutation`. Never use `useEffect` + `fetch`.

### 6. SQL safety

Always parameterized queries:

```javascript
// CORRECT
const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);

// WRONG - SQL injection vulnerability
const result = await pool.query(`SELECT * FROM users WHERE id = '${userId}'`);
```

### 7. Error handling (backend)

Always throw structured errors from `server/utils/errors.js`:

```javascript
import { NotFoundError, ValidationError } from '../utils/errors.js';

// CORRECT
throw new NotFoundError('Work order');

// WRONG
res.status(404).json({ error: 'Not found' });
```

## Common Gotchas (Read Before Coding)

### Gotcha 1: `req.body` is already snake_case

The `normalizeRequest` middleware converts incoming body keys. In route handlers, access `req.body.first_name`, not `req.body.firstName`. But the validation rules in `validation.js` use camelCase field names (like `body('firstName')`) because express-validator runs before normalizeRequest in the middleware chain for route-specific validation.

### Gotcha 2: TypeScript strict mode will reject unused variables

`noUnusedLocals` and `noUnusedParameters` are enabled. If you add a parameter you don't use yet, prefix it with `_` (e.g., `_req`).

### Gotcha 3: Path alias `@/` only works in frontend

The `@/` alias maps to `src/` via both `tsconfig.json` and `vite.config.ts`. It does not exist in the backend -- use relative imports in `server/`.

### Gotcha 4: Demo mode bypasses the API

`src/lib/demo-data.ts` provides mock data for the demo mode. If you add new data types, also add demo data or the demo mode will show empty states.

### Gotcha 5: The API health check path differs from routes

Health check is at `GET /api/health` (defined in `server/app.js`), not as a separate route file.

### Gotcha 6: Zod v4 syntax

This project uses Zod v4 (`zod@^4.3.6`). Some APIs differ from Zod v3. Check the imports and existing patterns in `src/lib/schemas.ts` before writing new schemas.

## Adding a New Feature (Step by Step)

Here is the complete workflow for adding a new entity (e.g., "Payments"):

### Step 1: Database

Add table to `server/db/schema.sql` and create a migration.

### Step 2: Backend route

Create `server/routes/payments.js`:

```javascript
import { Router } from 'express';
import pool from '../db/index.js';
import { authenticateToken } from '../middleware/auth.js';
import { NotFoundError } from '../utils/errors.js';

const router = Router();

router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM payments ORDER BY created_at DESC');
    res.json({ data: result.rows });
  } catch (err) {
    next(err);
  }
});

export default router;
```

### Step 3: Mount route

In `server/app.js`:

```javascript
import paymentsRoutes from './routes/payments.js';
app.use('/api/payments', paymentsRoutes);
```

### Step 4: Validation

Add to `server/middleware/validation.js`:

```javascript
export const validatePayment = [
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be positive'),
  body('date').isISO8601().withMessage('Invalid date format'),
  validate,
];
```

### Step 5: TypeScript types

Add to `src/types/index.ts`:

```typescript
export interface Payment {
  id: string;
  amount: number;
  date: Date;
  // ...
  createdAt: Date;
  updatedAt: Date;
}
```

### Step 6: Zod schema

Add to `src/lib/schemas.ts`:

```typescript
export const paymentFormSchema = z.object({
  amount: z.union([z.string().transform(parseFloat), z.number()]).pipe(positiveNumberSchema),
  date: z.string().min(1, 'Date is required').pipe(dateStringSchema),
});

export type PaymentFormData = z.infer<typeof paymentFormSchema>;
```

### Step 7: Frontend page

Use existing patterns from `src/pages/WorkOrders.tsx` or `src/pages/Grants.tsx` as templates. Use `api.get`, `api.post`, etc. from `src/lib/api.ts`.

### Step 8: Tests

- Backend: `server/tests/payments.test.js`
- Frontend: `src/pages/Payments.test.tsx`

## Environment Variables

Required in `.env` (copy from `.env.example`):

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes | -- | PostgreSQL connection string |
| `JWT_SECRET` | Yes | -- | JWT signing secret (32+ chars) |
| `PORT` | No | `3000` | Backend server port |
| `NODE_ENV` | No | `development` | `development` or `production` |

## Verification Checklist

Before considering any change complete:

- [ ] `npm run build` passes with zero TypeScript errors
- [ ] `npm run test` passes with zero failures
- [ ] No unused imports or variables
- [ ] New API endpoints have validation rules in `server/middleware/validation.js`
- [ ] New types added to `src/types/index.ts`
- [ ] New form schemas added to `src/lib/schemas.ts`
- [ ] Semantic color tokens used (no raw colors)
- [ ] SQL queries are parameterized

## Git Practices

- Feature branches from `main`.
- Clear, descriptive commit messages.
- Tests for new features.
- Never commit: `.env`, `node_modules/`, `dist/`, `coverage/`.
