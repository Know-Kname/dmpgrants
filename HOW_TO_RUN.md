# 🚀 How to Run - Cemetery Management System

A complete guide to running and understanding the Detroit Memorial Park Cemetery Management System.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start (5 Minutes)](#quick-start-5-minutes)
3. [Detailed Setup Explanation](#detailed-setup-explanation)
4. [How the System Works](#how-the-system-works)
5. [Using the Application](#using-the-application)
6. [Architecture Overview](#architecture-overview)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before running, ensure you have:

✅ **Node.js** (v18 or higher)
```bash
node --version  # Should show v18.x.x or higher
```

✅ **PostgreSQL** (v16 recommended)
```bash
psql --version  # Should show PostgreSQL 16.x
```

✅ **npm** (comes with Node.js)
```bash
npm --version
```

---

## Quick Start (5 Minutes)

### Step 1: Install Dependencies
```bash
cd /home/user/dmpgrants
npm install
```
**What this does**: Downloads all required packages (Express, React, PostgreSQL driver, etc.)

### Step 2: Start PostgreSQL (if not running)
```bash
sudo service postgresql start
```
**What this does**: Starts the PostgreSQL database server on port 5432

### Step 3: Verify Database Setup
```bash
# Check database exists
PGPASSWORD=password psql -h localhost -U user -d dmp_cemetery -c "\dt"
```
**Expected**: List of 8 tables (users, work_orders, inventory, burials, etc.)

If database doesn't exist, run:
```bash
npm run db:migrate
npm run db:migrations
node server/db/createAdmin.js
```

### Step 4: Start the Backend Server
```bash
npm run server
```
**What you'll see**:
```
✅ Server running on port 3000
📋 Environment: development
🔒 CORS allowed origins: http://localhost:5173, http://localhost:3000
```

**Keep this terminal open!** The server must stay running.

### Step 5: Start the Frontend (New Terminal)
Open a **new terminal window**, then:
```bash
cd /home/user/dmpgrants
npm run dev
```
**What you'll see**:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Step 6: Open Your Browser
Visit: **http://localhost:5173**

**Login with**:
- Email: `admin@detroitmemorialpark.com`
- Password: `AdminDMP2025!Secure`

🎉 **You're in!** You should see the cemetery management dashboard.

---

## Detailed Setup Explanation

### What Each npm Command Does

#### `npm install`
- **Purpose**: Downloads all project dependencies
- **What gets installed**:
  - **Backend**: Express (server), PostgreSQL driver, bcrypt (password hashing), JWT (authentication)
  - **Frontend**: React (UI), Vite (build tool), TailwindCSS (styling)
  - **Security**: Helmet (headers), express-rate-limit (anti-brute-force), CORS protection
- **When to run**: First time setup, or after pulling code changes
- **Output**: Creates `node_modules/` folder with 300+ packages

#### `npm run server`
- **Purpose**: Starts the backend API server
- **What it runs**: `node server/index.js`
- **What happens**:
  1. Loads environment variables from `.env`
  2. Validates JWT_SECRET and DATABASE_URL
  3. Connects to PostgreSQL database
  4. Sets up security middleware (Helmet, CORS, rate limiting)
  5. Loads all API routes (auth, work orders, inventory, etc.)
  6. Starts listening on port 3000
- **Port**: http://localhost:3000
- **API Base**: http://localhost:3000/api
- **Health Check**: http://localhost:3000/api/health

#### `npm run dev`
- **Purpose**: Starts the frontend development server
- **What it runs**: `vite` (super-fast build tool)
- **What happens**:
  1. Compiles TypeScript and React code
  2. Bundles JavaScript modules
  3. Applies TailwindCSS styles
  4. Enables hot-reload (changes update instantly)
  5. Serves the application
- **Port**: http://localhost:5173
- **Features**: Auto-refresh when you edit code

#### `npm run db:migrate`
- **Purpose**: Creates database schema (tables, columns)
- **What it runs**: `node server/db/migrate.js`
- **What happens**:
  1. Reads `server/db/schema.sql`
  2. Creates all 8 tables
  3. Creates initial indexes
  4. Sets up foreign keys
  5. Optionally creates admin user (if env vars set)
- **When to run**: First time only, or to reset database

#### `npm run db:migrations`
- **Purpose**: Applies performance improvements to existing database
- **What it runs**: `node server/db/runMigrations.js`
- **What happens**:
  1. Reads all files in `server/db/migrations/`
  2. Runs them in alphabetical order
  3. Applies: 15+ indexes, unique constraints, check constraints
- **When to run**: After `db:migrate`, or when adding new optimizations

#### `npm run build`
- **Purpose**: Creates production-ready files
- **What it runs**: `tsc && vite build`
- **Output**: `dist/` folder with optimized code
- **When to run**: Before deploying to production server

---

## How the System Works

### 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        BROWSER                              │
│                  http://localhost:5173                      │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │   Login     │  │  Dashboard  │  │ Work Orders │       │
│  │    Page     │  │    Page     │  │    Page     │  ...  │
│  └─────────────┘  └─────────────┘  └─────────────┘       │
│          │                │                 │              │
│          └────────────────┴─────────────────┘              │
│                          │                                 │
└──────────────────────────┼─────────────────────────────────┘
                           │
                  HTTP Requests (JSON)
                           │
┌──────────────────────────▼─────────────────────────────────┐
│                   API SERVER                                │
│              http://localhost:3000/api                      │
│                                                             │
│  ┌──────────────────────────────────────────────────┐     │
│  │   Security Layer (Middleware)                    │     │
│  │   • Helmet (Security Headers)                    │     │
│  │   • CORS (Origin Validation)                     │     │
│  │   • Rate Limiting (Anti-Brute-Force)             │     │
│  │   • JWT Token Verification                       │     │
│  └──────────────────────────────────────────────────┘     │
│                          │                                 │
│  ┌──────────────────────▼──────────────────────────┐     │
│  │   Route Handlers                                 │     │
│  │   • /auth/login     - Authentication             │     │
│  │   • /auth/register  - User creation (admin only) │     │
│  │   • /work-orders    - CRUD operations            │     │
│  │   • /inventory      - Stock management           │     │
│  │   • /burials        - Burial records             │     │
│  │   • /financial      - AR/AP management           │     │
│  │   • /grants         - Grant tracking             │     │
│  └──────────────────────────────────────────────────┘     │
│                          │                                 │
└──────────────────────────┼─────────────────────────────────┘
                           │
                    SQL Queries
                           │
┌──────────────────────────▼─────────────────────────────────┐
│               PostgreSQL Database                           │
│                    Port 5432                                │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │   users     │  │ work_orders │  │  inventory  │       │
│  ├─────────────┤  ├─────────────┤  ├─────────────┤       │
│  │ id          │  │ id          │  │ id          │       │
│  │ email       │  │ title       │  │ name        │       │
│  │ password    │  │ status      │  │ quantity    │  ...  │
│  │ role        │  │ priority    │  │ category    │       │
│  └─────────────┘  └─────────────┘  └─────────────┘       │
│                                                             │
│  With: 15+ Indexes, Foreign Keys, Constraints              │
└─────────────────────────────────────────────────────────────┘
```

### 🔄 Request Flow Example: Login

Let's trace what happens when you login:

#### 1. User Action (Frontend)
```typescript
// src/pages/Login.tsx
const handleSubmit = async (e) => {
  await login(email, password);  // Calls API
  navigate('/');
};
```

#### 2. API Call (Frontend → Backend)
```typescript
// src/lib/api.ts
api.login('admin@dmp.com', 'password123')
// Sends: POST http://localhost:3000/api/auth/login
// Body: {"email":"admin@dmp.com","password":"password123"}
```

#### 3. Security Checks (Backend)
```javascript
// server/index.js - Middleware runs first
1. Rate Limiter: "Is this IP making too many requests?"
   - If > 5 login attempts in 15 min → Block
2. CORS: "Is this request from an allowed origin?"
   - If origin not in whitelist → Block
3. Input Validation: "Is email valid? Is password present?"
   - If invalid → Return 400 error
```

#### 4. Authentication Logic (Backend)
```javascript
// server/routes/auth.js
router.post('/login', validateLogin, asyncHandler(async (req, res) => {
  // 1. Query database for user by email
  const user = await query('SELECT * FROM users WHERE email = $1', [email]);

  // 2. Check if user exists
  if (!user) throw new AppError(401, 'Invalid credentials');

  // 3. Verify password with bcrypt
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw new AppError(401, 'Invalid credentials');

  // 4. Generate JWT token (expires in 24 hours)
  const token = jwt.sign({ id, email, role }, JWT_SECRET, { expiresIn: '24h' });

  // 5. Send success response
  res.json({ success: true, token, user });
}));
```

#### 5. Database Query (PostgreSQL)
```sql
-- Fast lookup thanks to idx_users_email index
SELECT id, email, password_hash, name, role, created_at
FROM users
WHERE email = 'admin@dmp.com';
```

#### 6. Response Back to Frontend
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-here",
    "email": "admin@dmp.com",
    "name": "Admin User",
    "role": "admin"
  }
}
```

#### 7. Frontend Stores Token
```typescript
// src/lib/auth.tsx
localStorage.setItem('token', token);  // Save for future requests
localStorage.setItem('user', JSON.stringify(user));
setUser(user);  // Update React state
// Redirect to dashboard
```

#### 8. Subsequent Requests Use Token
```typescript
// All future API calls include token
headers: {
  'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
}
```

---

## Using the Application

### Initial Login

**URL**: http://localhost:5173

**Credentials**:
- Email: `admin@detroitmemorialpark.com`
- Password: `AdminDMP2025!Secure`

⚠️ **Important**: Change this password immediately after first login!

### Dashboard Overview

After login, you'll see the main dashboard with:

1. **Work Orders Section**
   - View pending, in-progress, completed work orders
   - Filter by status, type, priority
   - Create new maintenance tasks
   - Assign to staff members

2. **Inventory Section**
   - Track caskets, urns, vaults, markers, supplies
   - Low stock alerts (when quantity ≤ reorder point)
   - Add/edit inventory items
   - View by category

3. **Financial Management**
   - Accounts Receivable (customer payments)
   - Accounts Payable (vendor bills)
   - Deposits tracking
   - Statement generation

4. **Burial Records**
   - Complete burial information
   - Plot location tracking (section, lot, grave)
   - Deceased information
   - Contact details

5. **Grants & Benefits**
   - Track available grants
   - Application status
   - Approval/denial tracking
   - Received funds management

### User Roles & Permissions

#### Admin (Full Access)
- ✅ Create/manage users
- ✅ All work orders
- ✅ All inventory
- ✅ All financial records
- ✅ All burial records
- ✅ System configuration

#### Manager (Limited Admin)
- ✅ View all records
- ✅ Create/edit work orders
- ✅ Manage inventory
- ✅ View financial reports
- ❌ Cannot create users
- ❌ Cannot delete critical records

#### Staff (Basic Access)
- ✅ View assigned work orders
- ✅ Update work order status
- ✅ View inventory
- ❌ Cannot create users
- ❌ Limited financial access
- ❌ Cannot delete records

### Creating a New User (Admin Only)

You need to use the API directly (no UI yet):

```bash
# First, login and get token
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@detroitmemorialpark.com","password":"AdminDMP2025!Secure"}' \
  | grep -o '"token":"[^"]*' | sed 's/"token":"//')

# Create new user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "email": "manager@dmp.com",
    "password": "SecurePass123!",
    "name": "John Manager",
    "role": "manager"
  }'
```

**Password Requirements**:
- Minimum 12 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (!@#$%^&*(),.?":{}|<>)

---

## Architecture Overview

### Frontend (React + TypeScript)

**Location**: `src/`

**Key Files**:
- `src/main.tsx` - Entry point, renders App
- `src/App.tsx` - Main routing, layout
- `src/pages/` - Page components (Dashboard, Login, WorkOrders, etc.)
- `src/components/` - Reusable UI components
- `src/lib/api.ts` - API client with error handling
- `src/lib/auth.tsx` - Authentication context
- `src/lib/constants.ts` - Shared constants and types

**How It Works**:
1. Vite bundles React code into optimized JavaScript
2. Browser downloads and runs the single-page application
3. React Router handles navigation (no page reloads)
4. Components fetch data from backend API
5. TailwindCSS provides styling

### Backend (Node.js + Express)

**Location**: `server/`

**Key Files**:
- `server/index.js` - Main server file, sets up middleware
- `server/routes/` - API endpoint handlers
  - `auth.js` - Login, register, get current user
  - `workOrders.js` - CRUD for work orders
  - `inventory.js` - CRUD for inventory
  - `burials.js` - CRUD for burial records
  - `financial.js` - AR/AP/deposits management
  - `grants.js` - Grant tracking
  - `customers.js` - Customer management
  - `contracts.js` - Contract management
- `server/middleware/` - Request processing
  - `auth.js` - JWT verification, role checks
  - `validation.js` - Input validation rules
  - `errorHandler.js` - Global error handling
- `server/db/` - Database management
  - `index.js` - PostgreSQL connection pool
  - `schema.sql` - Database structure
  - `migrate.js` - Schema setup script
  - `migrations/` - Incremental updates
- `server/utils/` - Utility functions
  - `errors.js` - Custom error classes
  - `constants.js` - Shared constants

**How It Works**:
1. Express creates HTTP server on port 3000
2. Middleware processes all requests (security, validation)
3. Routes handle specific endpoints
4. PostgreSQL stores/retrieves data
5. Responses sent back as JSON

### Database (PostgreSQL)

**Schema**: 8 main tables

1. **users** - Authentication and access control
   - id, email, password_hash, name, role
   - Indexed: email (fast login)

2. **work_orders** - Maintenance tasks
   - id, title, description, type, status, priority, assigned_to, due_date
   - Indexed: status, assigned_to, created_at, due_date
   - Partial indexes: pending, urgent

3. **inventory** - Stock management
   - id, name, category, quantity, reorder_point, unit_price
   - Indexed: category
   - Partial index: low_stock (quantity ≤ reorder_point)

4. **burials** - Burial records
   - id, deceased_first_name, deceased_last_name, burial_date, section, lot, grave
   - Indexed: burial_date, deceased_name, location
   - Unique constraint: (section, lot, grave) prevents double-booking

5. **contracts** - Service contracts
   - id, customer_id, contract_type, total_amount, status, payment_plan

6. **accounts_receivable** - Customer payments
   - id, customer_id, amount, due_date, status
   - Indexed: customer_id, status, due_date
   - Partial index: overdue

7. **accounts_payable** - Vendor bills
   - id, vendor, amount, due_date, status
   - Indexed: vendor, status, due_date
   - Partial index: overdue

8. **grants** - Grant tracking
   - id, title, source, amount, deadline, status, type
   - Indexed: status, deadline, type

**Performance Features**:
- Connection pooling (reuses database connections)
- Prepared statements (prevents SQL injection)
- Indexed columns (100x faster queries)
- Partial indexes (filter at database level)

---

## Troubleshooting

### Problem: Port 3000 Already in Use

**Error**: `EADDRINUSE: address already in use :::3000`

**Solution**:
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or change port in .env
echo "PORT=3001" >> .env
npm run server
```

### Problem: Port 5173 Already in Use

**Error**: `Port 5173 is in use`

**Solution**: Vite will automatically try 5174, 5175, etc.

Or specify port:
```bash
npm run dev -- --port 4000
```

### Problem: Database Connection Failed

**Error**: `ECONNREFUSED 127.0.0.1:5432`

**Check 1**: Is PostgreSQL running?
```bash
sudo service postgresql status
# If not running:
sudo service postgresql start
```

**Check 2**: Does database exist?
```bash
PGPASSWORD=password psql -h localhost -U user -d dmp_cemetery -c "SELECT 1;"
```

**Check 3**: Are credentials correct?
```bash
# Check .env file
cat .env | grep DATABASE_URL
```

### Problem: Login Failed / Invalid Credentials

**Check 1**: Is admin user created?
```bash
PGPASSWORD=password psql -h localhost -U user -d dmp_cemetery \
  -c "SELECT email, role FROM users WHERE role='admin';"
```

**Check 2**: Create admin if missing:
```bash
node server/db/createAdmin.js
```

**Check 3**: Reset password if forgotten:
```bash
# Connect to database
PGPASSWORD=password psql -h localhost -U user -d dmp_cemetery

-- Generate new password hash (use Node.js)
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('NewPassword123!', 10).then(console.log);"

-- Update in database
UPDATE users
SET password_hash = '<hash from above>'
WHERE email = 'admin@detroitmemorialpark.com';
```

### Problem: Rate Limited (Too Many Requests)

**Error**: `Too many requests from this IP, please try again later.`

**Cause**: Made >5 login attempts in 15 minutes

**Solution 1**: Wait 15 minutes

**Solution 2**: Increase limits temporarily (development only)
```javascript
// server/index.js - Find authLimiter
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // Increase from 5 to 100
  // ...
});
```

### Problem: CORS Error in Browser Console

**Error**: `Access to fetch blocked by CORS policy`

**Check**: Origin in browser matches allowed origins
```bash
cat .env | grep ALLOWED_ORIGINS
```

**Fix**: Add your origin
```bash
# Edit .env
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173
```

Restart server after changing.

### Problem: Page Shows "Invalid credentials" but password is correct

**Possible Causes**:
1. Password has special characters that need escaping
2. Rate limited (wait 15 minutes)
3. Database password hash doesn't match
4. Backend server not running

**Debug**:
```bash
# Check server is running
curl http://localhost:3000/api/health

# Try login with curl
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@detroitmemorialpark.com","password":"AdminDMP2025!Secure"}'

# Check response - should include token if successful
```

### Problem: npm install fails

**Error**: Various package errors

**Solutions**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install

# If still failing, try legacy peer deps
npm install --legacy-peer-deps
```

---

## Summary: Complete Workflow

### First Time Setup
```bash
# 1. Clone or navigate to project
cd /home/user/dmpgrants

# 2. Install dependencies
npm install

# 3. Start PostgreSQL
sudo service postgresql start

# 4. Set up database (if not already done)
npm run db:migrate
npm run db:migrations
node server/db/createAdmin.js

# 5. Verify .env exists with correct settings
cat .env
```

### Daily Development
```bash
# Terminal 1: Start backend
npm run server

# Terminal 2: Start frontend (new terminal)
npm run dev

# Browser: Open application
http://localhost:5173

# Login and start developing!
```

### Making Changes

**Frontend Changes**:
1. Edit files in `src/`
2. Browser auto-refreshes (hot reload)
3. No restart needed

**Backend Changes**:
1. Edit files in `server/`
2. Stop server (Ctrl+C)
3. Restart: `npm run server`

**Database Changes**:
1. Create new migration file in `server/db/migrations/`
2. Run: `npm run db:migrations`

---

## 📚 Additional Resources

- **API Endpoints**: See `server/routes/` for all available endpoints
- **Database Schema**: See `server/db/schema.sql` for complete structure
- **Security Details**: See `IMPROVEMENTS.md` for security features
- **Setup Verification**: See `SETUP_COMPLETE.md` for testing guide

---

**Last Updated**: December 23, 2025
**System Version**: 2.0
**Status**: ✅ Ready to Use
