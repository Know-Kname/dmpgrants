# ⚙️ Backend Boilerplate Guide

Complete guide to the production-ready Express + Node.js backend.

## 🏗️ Structure

```
backend/
├── server/
│   ├── db/
│   │   ├── index.js            # Database connection
│   │   ├── schema.sql          # Database schema
│   │   └── migrate.js          # Migration runner
│   ├── middleware/
│   │   ├── auth.js             # JWT authentication
│   │   ├── errorHandler.js    # Error handling
│   │   └── validation.js       # Input validation
│   ├── routes/
│   │   ├── auth.js             # Auth endpoints
│   │   └── index.js            # Route aggregator
│   ├── utils/
│   │   ├── errors.js           # Custom error classes
│   │   └── auditLogger.js      # Audit logging
│   └── index.js                # Server entry point
├── package.json
├── .env.example
└── README.md
```

---

## 🔒 Security Features

### 1. Rate Limiting
Prevents brute force attacks:

```javascript
import rateLimit from 'express-rate-limit';

// General API rate limiter (100 requests per 15 minutes)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later.'
});

// Stricter limiter for auth (5 requests per 15 minutes)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts, please try again later.'
});

app.use('/api/', apiLimiter);
app.use('/api/auth', authLimiter);
```

### 2. Helmet Security Headers
```javascript
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    }
  }
}));
```

### 3. JWT Authentication
```javascript
// middleware/auth.js
export function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
}
```

### 4. Input Validation
```javascript
import { body, param, validationResult } from 'express-validator';

// Validation rules
export const validateUser = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Invalid email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
];

// Validation middleware
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// Usage
router.post('/users', validateUser, validate, async (req, res) => {
  // Handler code
});
```

---

## 💾 Database

### Connection Pooling
```javascript
// db/index.js
import pg from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,                      // Max connections
  idleTimeoutMillis: 30000,     // Close idle after 30s
  connectionTimeoutMillis: 2000 // Fail fast
});

// Enhanced query with error handling
export const query = async (text, params) => {
  try {
    const result = await pool.query(text, params);
    return result;
  } catch (error) {
    // Translate error codes
    if (error.code === '23505') {
      error.message = 'Record already exists';
    } else if (error.code === '23503') {
      error.message = 'Referenced record not found';
    }
    throw error;
  }
};
```

### Migrations
```javascript
// db/migrate.js
import fs from 'fs';
import pool from './index.js';

async function migrate() {
  const schema = fs.readFileSync('./schema.sql', 'utf-8');
  await pool.query(schema);
  console.log('✅ Migration complete');
}

migrate();
```

### Error Translation
Database errors are automatically translated to user-friendly messages:

| Code | Meaning | User Message |
|------|---------|--------------|
| 23505 | Duplicate key | "Record already exists" |
| 23503 | Foreign key violation | "Referenced record not found" |
| 23502 | Not null violation | "Required field missing" |
| 22P02 | Invalid type | "Invalid data type" |

---

## 🛡️ Error Handling

### Custom Error Classes
```javascript
// utils/errors.js
export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class ValidationError extends ApiError {
  constructor(message) {
    super(422, message);
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'Resource not found') {
    super(404, message);
  }
}
```

### Error Handler Middleware
```javascript
// middleware/errorHandler.js
export function errorHandler(err, req, res, next) {
  console.error(err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      error: err.message
    });
  }

  res.status(500).json({
    error: 'Internal server error'
  });
}

// Usage
app.use(errorHandler);
```

---

## 📝 Audit Logging

Track sensitive operations:

```javascript
// utils/auditLogger.js
export const AuditAction = {
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILED: 'LOGIN_FAILED',
  USER_CREATED: 'USER_CREATED',
  DATA_DELETED: 'DATA_DELETED',
};

export function logAudit(action, data, user, ipAddress) {
  const entry = {
    timestamp: new Date().toISOString(),
    action,
    userId: user?.id,
    ipAddress,
    data
  };

  console.log('[AUDIT]', JSON.stringify(entry));

  // In production: save to database or send to logging service
}

// Usage
logAudit(
  AuditAction.LOGIN_SUCCESS,
  { role: user.role },
  user,
  req.ip
);
```

---

## 🔐 Authentication Flow

### Login Endpoint
```javascript
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Find user
  const result = await query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );

  if (result.rows.length === 0) {
    logAudit(AuditAction.LOGIN_FAILED, { email }, null, req.ip);
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const user = result.rows[0];

  // Verify password
  const validPassword = await bcrypt.compare(password, user.password_hash);

  if (!validPassword) {
    logAudit(AuditAction.LOGIN_FAILED, { email }, user, req.ip);
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Generate token
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  logAudit(AuditAction.LOGIN_SUCCESS, { role: user.role }, user, req.ip);

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }
  });
});
```

### Protected Routes
```javascript
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Apply auth to all routes
router.use(authenticateToken);

// Now all routes require authentication
router.get('/', async (req, res) => {
  // req.user is available
  const userId = req.user.id;
});
```

---

## ✅ Input Validation Examples

### Create User
```javascript
export const validateUser = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),

  body('password')
    .isLength({ min: 8, max: 100 })
    .withMessage('Password must be 8-100 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain uppercase letter'),

  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 255 })
    .withMessage('Name too long'),
];

router.post('/users', validateUser, validate, async (req, res) => {
  // Input is validated
});
```

### UUID Validation
```javascript
router.delete('/:id',
  param('id').isUUID().withMessage('Invalid ID'),
  validate,
  async (req, res) => {
    const { id } = req.params;
    // id is guaranteed to be valid UUID
  }
);
```

---

## 🚀 API Routes Structure

### CRUD Pattern
```javascript
// GET all (with pagination)
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const offset = (page - 1) * limit;

  const result = await query(
    'SELECT * FROM items ORDER BY created_at DESC LIMIT $1 OFFSET $2',
    [limit, offset]
  );

  const count = await query('SELECT COUNT(*) FROM items');

  res.json({
    data: result.rows,
    pagination: {
      page,
      limit,
      totalCount: parseInt(count.rows[0].count),
      totalPages: Math.ceil(count.rows[0].count / limit)
    }
  });
});

// GET one
router.get('/:id',
  param('id').isUUID(),
  validate,
  async (req, res) => {
    const result = await query(
      'SELECT * FROM items WHERE id = $1',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('Item not found');
    }

    res.json(result.rows[0]);
  }
);

// CREATE
router.post('/',
  validateItem,
  validate,
  async (req, res) => {
    const { name, description } = req.body;

    const result = await query(
      'INSERT INTO items (name, description, created_by) VALUES ($1, $2, $3) RETURNING *',
      [name, description, req.user.id]
    );

    logAudit(AuditAction.ITEM_CREATED, { itemId: result.rows[0].id }, req.user, req.ip);

    res.status(201).json(result.rows[0]);
  }
);

// UPDATE
router.put('/:id',
  param('id').isUUID(),
  validateItem,
  validate,
  async (req, res) => {
    const { name, description } = req.body;

    const result = await query(
      'UPDATE items SET name = $1, description = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
      [name, description, req.params.id]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('Item not found');
    }

    res.json(result.rows[0]);
  }
);

// DELETE
router.delete('/:id',
  param('id').isUUID(),
  validate,
  async (req, res) => {
    const result = await query(
      'DELETE FROM items WHERE id = $1 RETURNING id',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('Item not found');
    }

    logAudit(AuditAction.ITEM_DELETED, { itemId: req.params.id }, req.user, req.ip);

    res.json({ success: true });
  }
);
```

---

## 🎯 Best Practices

### 1. Always Validate Input
```javascript
// ❌ Bad
router.post('/users', async (req, res) => {
  const { email, password } = req.body;
  // No validation!
});

// ✅ Good
router.post('/users', validateUser, validate, async (req, res) => {
  // Input is validated
});
```

### 2. Use Parameterized Queries
```javascript
// ❌ Bad - SQL injection risk
const query = `SELECT * FROM users WHERE email = '${email}'`;

// ✅ Good - safe from injection
await query('SELECT * FROM users WHERE email = $1', [email]);
```

### 3. Return 404 for Missing Resources
```javascript
// ❌ Bad
const result = await query('DELETE FROM items WHERE id = $1', [id]);
res.json({ success: true }); // Returns success even if nothing deleted

// ✅ Good
const result = await query('DELETE FROM items WHERE id = $1 RETURNING id', [id]);
if (result.rows.length === 0) {
  throw new NotFoundError('Item not found');
}
```

### 4. Log Sensitive Operations
```javascript
// ✅ Good
await deleteUser(id);
logAudit(AuditAction.USER_DELETED, { userId: id }, req.user, req.ip);
```

---

## 📦 Environment Variables

```bash
# .env.example
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/mydb

# JWT
JWT_SECRET=your-secret-key-change-in-production

# CORS
CORS_ORIGIN=http://localhost:5173
```

---

## 🚀 Deployment

### Production Checklist
- [ ] Set strong JWT_SECRET
- [ ] Configure DATABASE_URL
- [ ] Enable HTTPS
- [ ] Set NODE_ENV=production
- [ ] Configure CORS for your domain
- [ ] Set up database backups
- [ ] Configure logging service
- [ ] Set up monitoring

---

## 🎯 Summary

This backend boilerplate provides:
- ✅ Express.js with security
- ✅ JWT authentication
- ✅ Input validation
- ✅ Rate limiting
- ✅ Database connection pooling
- ✅ Error handling
- ✅ Audit logging
- ✅ CORS configuration
- ✅ Helmet security headers

Perfect foundation for any Node.js API!
