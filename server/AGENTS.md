# Backend Agent Guide (server/)

All code in this directory is **plain JavaScript** (ESM with `"type": "module"`). Do NOT use TypeScript here.

## Key Files to Read First

1. `app.js` -- Express app: middleware stack + route mounting order
2. `db/schema.sql` -- full database DDL (tables, constraints, indexes)
3. `db/index.js` -- pg Pool configuration
4. `utils/errors.js` -- structured error classes
5. `middleware/validation.js` -- express-validator rules for all endpoints
6. `middleware/auth.js` -- JWT authentication + role authorization

## Middleware Order (Critical)

In `app.js`, middleware runs in this exact order:

```
cors -> requestContext -> express.json -> normalizeRequest -> [routes] -> notFoundHandler -> errorHandler
```

The `normalizeRequest` middleware converts **incoming request body keys from camelCase to snake_case** before they reach route handlers. So in your route handler, access `req.body.first_name`, not `req.body.firstName`.

However, **express-validator chains in `validation.js` use camelCase** field names (like `body('firstName')`) because they are attached to specific routes and may run in a different order context. Follow the existing patterns.

## Rules

- **Imports**: Use relative paths with `.js` extensions (e.g., `import pool from '../db/index.js'`).
- **Errors**: Always throw from `utils/errors.js`: `AppError`, `ValidationError`, `NotFoundError`, `UnauthorizedError`, `ForbiddenError`, `ConflictError`, `DatabaseError`.
- **Never** send `res.status(500).json({ error: err.message })`. Let the `errorHandler` middleware handle it via `next(err)`.
- **SQL**: Always parameterized queries. Use `$1`, `$2`, etc.
- **Auth**: Protect routes with `authenticateToken`. Restrict by role with `requireRole('admin', 'manager')`.

## Patterns

### Route handler (standard CRUD)

```javascript
import { Router } from 'express';
import pool from '../db/index.js';
import { authenticateToken } from '../middleware/auth.js';
import { NotFoundError } from '../utils/errors.js';

const router = Router();

// GET all
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const { page = 1, limit = 25 } = req.query;
    const offset = (page - 1) * limit;
    const result = await pool.query(
      'SELECT * FROM resources ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    const countResult = await pool.query('SELECT COUNT(*) FROM resources');
    const total = parseInt(countResult.rows[0].count);
    res.json({
      data: result.rows,
      pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / limit), hasMore: page * limit < total },
    });
  } catch (err) {
    next(err);
  }
});

// GET by ID
router.get('/:id', authenticateToken, async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM resources WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) throw new NotFoundError('Resource');
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

export default router;
```

### Adding validation

In `middleware/validation.js`:

```javascript
export const validateResource = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be positive'),
  validate,  // always end with the validate handler
];
```

Then use in route: `router.post('/', authenticateToken, validateResource, handler)`

## Testing

- Framework: Vitest + Node environment + supertest
- Tests go in `server/tests/` as `*.test.js`
- Globals enabled: `describe`, `it`, `expect` available without imports
- Import the Express app from `app.js` (not `index.js`) for supertest

```javascript
import request from 'supertest';
import app from '../app.js';

describe('GET /api/health', () => {
  it('returns ok status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
```

## Database

- All primary keys are UUIDs via `gen_random_uuid()`.
- All tables have `created_at` and `updated_at` TIMESTAMP columns.
- Use CHECK constraints for enum-like columns.
- Index columns used in WHERE clauses and JOINs.
- Connection pool is in `db/index.js` -- import as `pool`.
