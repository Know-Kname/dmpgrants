# AGENTS.md

Instructions for AI agents working on the Detroit Memorial Park Cemetery Management System.

## Project Overview

This is a full-stack cemetery business management application serving three Michigan locations (Warren, Redford, Flint) with over 170 acres and 39,000+ historical burial records. It is a private, proprietary project.

## Tech Stack

- **Frontend**: React 18, TypeScript 5 (strict mode), Vite 5, Tailwind CSS 3.4
- **Backend**: Node.js 20, Express 4, plain JavaScript (ESM modules)
- **Database**: PostgreSQL 16 with `pg` driver (no ORM)
- **Validation**: Zod (client), express-validator (server)
- **State/Data**: TanStack React Query v5
- **Auth**: JWT (Bearer token in `Authorization` header), role-based access control (admin, manager, staff)
- **Testing**: Vitest, React Testing Library, supertest
- **Deployment**: Docker (multi-stage), Railway, Render, Vercel, Coolify

## Project Structure

```
/
├── src/                    # Frontend (React + TypeScript)
│   ├── components/         # Reusable UI components (ui.tsx is the design system)
│   ├── pages/              # Route page components
│   ├── hooks/              # Custom React hooks (useData, useForm)
│   ├── lib/                # Utilities, API client, auth, schemas, theme
│   ├── config/             # App configuration (company info)
│   ├── styles/             # Global CSS with design tokens (HSL variables)
│   ├── types/              # TypeScript type definitions
│   └── tests/              # Test setup
├── server/                 # Backend (Node.js + Express, plain JS)
│   ├── app.js              # Express app setup and route mounting
│   ├── index.js            # Server entry point
│   ├── routes/             # API route handlers
│   ├── middleware/          # auth, validation, errorHandler, normalizeRequest, requestContext
│   ├── db/                 # Database: schema.sql, migrate.js, import-data.js
│   ├── tests/              # Backend tests
│   └── utils/              # Error classes, pagination
├── public/                 # Static assets (favicon, manifest)
└── docs/                   # Documentation and exported guides
```

## Key Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite frontend dev server (port 5173) |
| `npm run server` | Start Express backend API server (port 3000) |
| `npm run build` | TypeScript check + Vite production build |
| `npm run test` | Run all tests with Vitest |
| `npm run test:frontend` | Run frontend tests only |
| `npm run test:backend` | Run backend tests only |
| `npm run test:all` | Run frontend + backend tests sequentially |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run db:migrate` | Run database migrations |
| `npm run db:import` | Import data from Excel/CSV |
| `npm run db:reset` | Reset DB (migrate + import) |

## Architecture & Conventions

### Frontend

- **Path aliases**: Use `@/` to reference `src/` (e.g., `@/lib/api`).
- **API client** (`src/lib/api.ts`): Automatically transforms between camelCase (frontend) and snake_case (backend). Do not manually convert casing when using `api.get/post/put/patch/delete`.
- **Validation schemas** (`src/lib/schemas.ts`): All form validation uses Zod schemas. Each domain entity has its own form schema and inferred TypeScript type.
- **Types** (`src/types/index.ts`): All domain entity interfaces live here. Use camelCase for all property names.
- **UI components** (`src/components/ui.tsx`): Custom design system with Button, Card, Badge, Modal, Input, Select, Textarea, Alert, EmptyState, LoadingSpinner, Skeleton, Avatar, Tooltip. Prefer these over third-party component libraries.
- **Routing**: React Router v6 with nested routes. Protected routes require authentication via `useAuth()` context.
- **Theming**: Dark/light mode via `class` strategy on Tailwind. Colors use HSL CSS variables defined in `src/styles/index.css`. Use semantic color tokens (e.g., `bg-card`, `text-foreground`, `border-border`), not raw color values.
- **Data fetching**: Use `useData` hook and React Query patterns. Do not use `useEffect` + `fetch` for data loading.

### Backend

- **Server code is plain JavaScript** (ESM with `"type": "module"`). Do not use TypeScript for server files.
- **Error handling**: Use structured error classes from `server/utils/errors.js` (AppError, ValidationError, NotFoundError, UnauthorizedError, ForbiddenError, ConflictError, DatabaseError). Never send raw error messages to clients.
- **Middleware stack** (in order): cors, requestContext, express.json, normalizeRequest, then routes, then notFoundHandler, errorHandler.
- **Validation**: Server-side validation uses express-validator chains defined in `server/middleware/validation.js`. Each route has its own validation chain.
- **Database**: Raw SQL queries via `pg`. No ORM. Use parameterized queries to prevent SQL injection. UUIDs via `gen_random_uuid()`. All tables have `created_at` and `updated_at` timestamps.
- **API routes** are mounted at `/api/<resource>` (e.g., `/api/work-orders`, `/api/burials`, `/api/grants`).
- **Request normalization**: The `normalizeRequest` middleware converts incoming camelCase keys to snake_case. Keep this in mind when accessing `req.body` in route handlers.

### Naming Conventions

- **Frontend**: camelCase for variables, functions, and object properties. PascalCase for React components and TypeScript interfaces/types.
- **Backend**: camelCase for JavaScript variables and functions. snake_case for database column names and API request/response keys.
- **Files**: PascalCase for React components (`WorkOrders.tsx`), camelCase for utilities and hooks (`useForm.ts`, `api.ts`), kebab-case for CSS files.
- **Database**: snake_case for table names, column names, and enum values.

### Testing

- Frontend tests use Vitest + jsdom + React Testing Library. Test files are co-located with source files as `*.test.{ts,tsx}` in `src/`.
- Backend tests use Vitest + Node environment + supertest. Test files live in `server/tests/` as `*.test.js`.
- Test setup file at `src/tests/setup.ts` provides polyfills for localStorage, matchMedia, and scrollTo.
- Tests use `globals: true` so `describe`, `it`, `expect`, `vi` are available without imports.

### Environment Variables

Required in `.env` (see `.env.example`):

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT token signing
- `PORT` - Server port (default 3000)
- `NODE_ENV` - `development` or `production`

## Code Quality Rules

1. **TypeScript strict mode** is enforced: `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch` are all enabled. Fix all type errors before committing.
2. **No unused imports or variables** -- the build will fail.
3. Run `npm run build` to verify TypeScript compilation before considering frontend changes complete.
4. Run `npm run test` to verify tests pass before committing.
5. Always use parameterized SQL queries -- never interpolate user input into SQL strings.
6. Prefer editing existing files over creating new ones.
7. Do not introduce new UI component libraries. Use the custom design system in `src/components/ui.tsx`.
8. Keep backend route handlers thin -- extract complex logic into utility functions.
9. Maintain the automatic camelCase/snake_case conversion boundary. Frontend = camelCase, database = snake_case.

## API Patterns

### Standard response format (success):

```json
{
  "data": [ ... ],
  "pagination": { "page": 1, "limit": 25, "total": 100, "totalPages": 4, "hasMore": true }
}
```

### Standard error response:

```json
{
  "success": false,
  "error": { "message": "...", "code": "VALIDATION_ERROR", "details": [...] },
  "statusCode": 400,
  "requestId": "..."
}
```

### Adding a new API endpoint

1. Add the route handler in `server/routes/<resource>.js`.
2. Add validation rules in `server/middleware/validation.js`.
3. Add corresponding Zod schema in `src/lib/schemas.ts`.
4. Add TypeScript types in `src/types/index.ts`.
5. Use the `api` client from `src/lib/api.ts` for frontend requests.

## Git Practices

- Create feature branches from `main`.
- Write clear, descriptive commit messages.
- Include tests for new features.
- Do not commit `.env` files, `node_modules`, `dist`, or `coverage` directories.
