# Quick Start - View Your Cemetery Management System

## Fastest Way to See It Running

### Prerequisites Check
First, check if you have the required software:

```bash
node --version    # Should be v18 or higher
npm --version     # Should be 9 or higher
psql --version    # PostgreSQL should be installed
```

Don't have them? Install:
- **Node.js**: https://nodejs.org/ (download LTS version)
- **PostgreSQL**: https://www.postgresql.org/download/

---

## Step-by-Step: Get It Running in 5 Minutes

### 1. Install Dependencies (1 minute)

```bash
cd /home/user/dmpgrants
npm install
```

### 2. Set Up Database (2 minutes)

#### Option A: Quick Setup (PostgreSQL installed)

```bash
# Create database
psql -U postgres -c "CREATE DATABASE dmp_cemetery;"

# Create .env file
cat > .env << 'EOF'
DATABASE_URL=postgresql://postgres:password@localhost:5432/dmp_cemetery
JWT_SECRET=my-super-secret-key-change-this-in-production
PORT=3000
NODE_ENV=development
EOF

# Run migration
npm run db:migrate
```

#### Option B: Custom PostgreSQL User

```bash
# Copy example file
cp .env.example .env

# Edit .env with your database info
nano .env  # or use any text editor
```

Then update:
```env
DATABASE_URL=postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/dmp_cemetery
JWT_SECRET=change-this-to-random-string
PORT=3000
NODE_ENV=development
```

Run migration:
```bash
npm run db:migrate
```

### 3. Start the Application (2 minutes)

#### Open TWO terminal windows/tabs:

**Terminal 1 - Backend:**
```bash
cd /home/user/dmpgrants
npm run server
```

You should see:
```
Server running on port 3000
```

**Terminal 2 - Frontend:**
```bash
cd /home/user/dmpgrants
npm run dev
```

You should see:
```
  VITE ready in XXX ms
  ➜  Local:   http://localhost:5173/
```

### 4. Open in Browser

Open your browser and go to:
```
http://localhost:5173
```

### 5. Log In

Use the default credentials:
- **Email:** `admin@dmp.com`
- **Password:** `admin123`

---

## 🎉 You're In!

You should now see:
1. **Login Page** - Clean, professional login
2. **Dashboard** - Stats, alerts, recent activity
3. **Sidebar Navigation** - Access to all modules
4. **Work Orders, Grants, etc.** - All functional pages

---

## Troubleshooting

### Error: "Cannot connect to database"

**Fix:**
```bash
# Check if PostgreSQL is running
# Mac:
brew services start postgresql

# Linux:
sudo service postgresql start

# Windows:
# Start PostgreSQL from Services
```

### Error: "Port 3000 already in use"

**Fix:**
```bash
# Find and kill the process
# Mac/Linux:
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
# Then kill the PID shown
```

### Error: "Module not found"

**Fix:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Still Having Issues?

1. Make sure you're in the correct directory: `/home/user/dmpgrants`
2. Check PostgreSQL is running: `psql -U postgres -c "SELECT version();"`
3. Verify .env file exists and has correct database URL
4. Check both terminals are running (backend AND frontend)

---

## Quick Demo Actions

Once logged in, try these:

1. **View Dashboard**
   - See stats overview
   - Check the quick actions

2. **Create a Work Order**
   - Click "Work Orders" in sidebar
   - Click "New Work Order" button
   - Fill out the form
   - See it appear in the list!

3. **Add a Grant**
   - Click "Grants" in sidebar
   - Click "Add Grant" button
   - Fill out grant details
   - Watch the stats update!

4. **Explore the UI**
   - Try the search filters
   - Edit items by clicking the edit icon
   - See the responsive design (resize browser)

---

## Stopping the Application

When you're done:

1. Press `Ctrl + C` in both terminal windows
2. Type `y` if prompted

---

## Next Steps

After viewing:
1. Read `NOTION_VS_CUSTOM.md` - Decide which platform to use
2. Read `SETUP_GUIDE.md` - Full setup for production
3. Read `claude.md` - Technical documentation
4. Start adding your real data!

---

## Need Help?

- Check `SETUP_GUIDE.md` for detailed instructions
- Review error messages in terminal
- Make sure all prerequisites are installed
- Verify database credentials in `.env`
