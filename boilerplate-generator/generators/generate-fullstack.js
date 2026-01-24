#!/usr/bin/env node

/**
 * Full-Stack App Generator
 * Generates complete production-ready application (Frontend + Backend + Database)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateFrontend } from './generate-frontend.js';
import { generateBackend } from './generate-backend.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function generateFullStack(projectName = 'my-app', options = {}) {
  const projectPath = path.join(process.cwd(), projectName);

  console.log(`\n${'='.repeat(60)}`);
  console.log(`🚀 FULL-STACK APP GENERATOR`);
  console.log(`${'='.repeat(60)}\n`);
  console.log(`📦 Project: ${projectName}`);
  console.log(`📁 Location: ${projectPath}\n`);

  // Create main project directory
  if (fs.existsSync(projectPath)) {
    console.error(`❌ Error: Directory ${projectName} already exists!`);
    process.exit(1);
  }

  fs.mkdirSync(projectPath, { recursive: true });
  process.chdir(projectPath);

  console.log(`${'─'.repeat(60)}`);
  console.log(`📱 GENERATING FRONTEND...`);
  console.log(`${'─'.repeat(60)}\n`);

  // Generate frontend in 'frontend' subdirectory
  generateFrontend('frontend', options);

  console.log(`\n${'─'.repeat(60)}`);
  console.log(`⚙️  GENERATING BACKEND...`);
  console.log(`${'─'.repeat(60)}\n`);

  // Generate backend in 'backend' subdirectory
  generateBackend('backend', options);

  // Create root configuration files
  console.log(`\n${'─'.repeat(60)}`);
  console.log(`📄 CREATING ROOT CONFIGURATION...`);
  console.log(`${'─'.repeat(60)}\n`);

  createRootFiles(projectPath, projectName);

  console.log(`\n${'='.repeat(60)}`);
  console.log(`✅ FULL-STACK APP GENERATED SUCCESSFULLY!`);
  console.log(`${'='.repeat(60)}\n`);

  printNextSteps(projectName);
}

function createRootFiles(projectPath, projectName) {
  // Root package.json with scripts to manage both frontend and backend
  const rootPackageJson = {
    "name": projectName,
    "version": "1.0.0",
    "description": "Full-stack application",
    "scripts": {
      "install:all": "npm install && cd frontend && npm install && cd ../backend && npm install && cd ..",
      "dev:frontend": "cd frontend && npm run dev",
      "dev:backend": "cd backend && npm start",
      "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
      "build:frontend": "cd frontend && npm run build",
      "build": "npm run build:frontend",
      "db:migrate": "cd backend && npm run db:migrate"
    },
    "devDependencies": {
      "concurrently": "^8.2.0"
    }
  };

  fs.writeFileSync(
    path.join(projectPath, 'package.json'),
    JSON.stringify(rootPackageJson, null, 2)
  );
  console.log(`📄 Created: package.json`);

  // Root README
  const rootReadme = `# ${projectName}

Full-stack application with React frontend and Express backend.

## 🏗️ Project Structure

\`\`\`
${projectName}/
├── frontend/          # React + TypeScript + Tailwind
├── backend/           # Express + Node.js + PostgreSQL
├── package.json       # Root package with helpful scripts
└── README.md          # This file
\`\`\`

## 🚀 Quick Start

### 1. Install all dependencies
\`\`\`bash
npm run install:all
\`\`\`

### 2. Configure environment
\`\`\`bash
cd backend
cp .env.example .env
# Edit .env with your database credentials
\`\`\`

### 3. Run database migrations
\`\`\`bash
npm run db:migrate
\`\`\`

### 4. Start development servers
\`\`\`bash
npm run dev
\`\`\`

This will start:
- Frontend on http://localhost:5173
- Backend on http://localhost:3000

## 📦 Individual Commands

### Frontend
\`\`\`bash
npm run dev:frontend        # Start frontend dev server
cd frontend && npm run build # Build for production
\`\`\`

### Backend
\`\`\`bash
npm run dev:backend         # Start backend server
npm run db:migrate          # Run database migrations
\`\`\`

## 🔧 Features

### Frontend
- ✅ React 18 + TypeScript
- ✅ Tailwind CSS
- ✅ Custom hooks (useDebounce, useFormValidation, useKeyboard)
- ✅ Toast notifications
- ✅ Error boundary
- ✅ Lazy loading & code splitting
- ✅ Form validation
- ✅ API client with error handling

### Backend
- ✅ Express.js with security
- ✅ JWT authentication
- ✅ Input validation
- ✅ Rate limiting
- ✅ Helmet security headers
- ✅ Audit logging
- ✅ Database connection pooling
- ✅ Error handling

### Database
- ✅ PostgreSQL setup
- ✅ Migration system
- ✅ Connection pooling
- ✅ Error translation

## 📚 Documentation

- [Frontend Guide](./frontend/README.md)
- [Backend Guide](./backend/README.md)

## 🎯 Production Deployment

See individual README files in frontend/ and backend/ for deployment instructions.

## 📝 License

MIT
`;

  fs.writeFileSync(path.join(projectPath, 'README.md'), rootReadme);
  console.log(`📄 Created: README.md`);

  // .gitignore
  const gitignore = `node_modules
.env
*.log
.DS_Store
dist
build
`;

  fs.writeFileSync(path.join(projectPath, '.gitignore'), gitignore);
  console.log(`📄 Created: .gitignore`);
}

function printNextSteps(projectName) {
  console.log(`📋 NEXT STEPS:\n`);
  console.log(`   1️⃣  Navigate to project:`);
  console.log(`      cd ${projectName}\n`);
  console.log(`   2️⃣  Install all dependencies:`);
  console.log(`      npm run install:all\n`);
  console.log(`   3️⃣  Configure backend:`);
  console.log(`      cd backend`);
  console.log(`      cp .env.example .env`);
  console.log(`      # Edit .env with your database credentials`);
  console.log(`      cd ..\n`);
  console.log(`   4️⃣  Run database migrations:`);
  console.log(`      npm run db:migrate\n`);
  console.log(`   5️⃣  Start development:`);
  console.log(`      npm run dev\n`);
  console.log(`   Frontend: http://localhost:5173`);
  console.log(`   Backend:  http://localhost:3000\n`);
  console.log(`${'='.repeat(60)}\n`);
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const projectName = process.argv[2] || 'my-fullstack-app';
  const options = {
    typescript: true,
    database: 'postgresql',
    auth: true,
  };
  generateFullStack(projectName, options);
}

export { generateFullStack };
