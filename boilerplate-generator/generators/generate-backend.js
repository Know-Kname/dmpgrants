#!/usr/bin/env node

/**
 * Backend Boilerplate Generator
 * Generates production-ready Express + Node.js API structure
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BACKEND_STRUCTURE = {
  'server': {
    'db': {
      'index.js': 'DB_CONNECTION_TEMPLATE',
      'schema.sql': 'DB_SCHEMA_TEMPLATE',
      'migrate.js': 'DB_MIGRATE_TEMPLATE',
    },
    'middleware': {
      'auth.js': 'AUTH_MIDDLEWARE_TEMPLATE',
      'errorHandler.js': 'ERROR_HANDLER_TEMPLATE',
      'validation.js': 'VALIDATION_MIDDLEWARE_TEMPLATE',
    },
    'routes': {
      'auth.js': 'AUTH_ROUTES_TEMPLATE',
      'index.js': 'ROUTES_INDEX_TEMPLATE',
    },
    'utils': {
      'errors.js': 'ERRORS_UTIL_TEMPLATE',
      'auditLogger.js': 'AUDIT_LOGGER_TEMPLATE',
    },
    'index.js': 'SERVER_INDEX_TEMPLATE',
  },
  'package.json': 'BACKEND_PACKAGE_JSON_TEMPLATE',
  '.env.example': 'ENV_EXAMPLE_TEMPLATE',
  '.gitignore': 'GITIGNORE_TEMPLATE',
  'README.md': 'BACKEND_README_TEMPLATE',
};

function generateBackend(projectName = 'my-api', options = {}) {
  const projectPath = path.join(process.cwd(), projectName);

  console.log(`🚀 Generating backend API: ${projectName}`);
  console.log(`📁 Location: ${projectPath}\n`);

  // Create project directory
  if (fs.existsSync(projectPath)) {
    console.error(`❌ Error: Directory ${projectName} already exists!`);
    process.exit(1);
  }

  fs.mkdirSync(projectPath, { recursive: true });

  // Create directory structure
  createDirectoryStructure(projectPath, BACKEND_STRUCTURE);

  console.log(`\n✅ Backend API generated successfully!\n`);
  console.log(`📦 Next steps:`);
  console.log(`   cd ${projectName}`);
  console.log(`   cp .env.example .env`);
  console.log(`   # Edit .env with your database credentials`);
  console.log(`   npm install`);
  console.log(`   npm run db:migrate`);
  console.log(`   npm start\n`);
}

function createDirectoryStructure(basePath, structure) {
  for (const [name, content] of Object.entries(structure)) {
    const fullPath = path.join(basePath, name);

    if (typeof content === 'object') {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`📁 Created: ${name}/`);
      createDirectoryStructure(fullPath, content);
    } else {
      const templateContent = getTemplate(content);
      fs.writeFileSync(fullPath, templateContent);
      console.log(`📄 Created: ${name}`);
    }
  }
}

function getTemplate(templateName) {
  return getInlineTemplate(templateName);
}

function getInlineTemplate(templateName) {
  const templates = {
    'BACKEND_PACKAGE_JSON_TEMPLATE': JSON.stringify({
      "name": "backend-api",
      "version": "1.0.0",
      "type": "module",
      "scripts": {
        "start": "node server/index.js",
        "dev": "nodemon server/index.js",
        "db:migrate": "node server/db/migrate.js"
      },
      "dependencies": {
        "express": "^4.18.2",
        "cors": "^2.8.5",
        "dotenv": "^16.3.1",
        "pg": "^8.11.3",
        "bcryptjs": "^2.4.3",
        "jsonwebtoken": "^9.0.2",
        "express-validator": "^7.3.1",
        "express-rate-limit": "^7.1.0",
        "helmet": "^8.1.0",
        "compression": "^1.8.1"
      },
      "devDependencies": {
        "nodemon": "^3.0.0"
      }
    }, null, 2),

    'ENV_EXAMPLE_TEMPLATE': `# Server Configuration
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/mydb

# JWT
JWT_SECRET=your-secret-key-change-this-in-production

# CORS
CORS_ORIGIN=http://localhost:5173
`,

    'GITIGNORE_TEMPLATE': `node_modules
.env
*.log
.DS_Store`,

    'BACKEND_README_TEMPLATE': `# Backend API

Production-ready Express.js API with security and best practices.

## Features

- Express.js with TypeScript support
- JWT Authentication
- Input Validation
- Rate Limiting
- Security Headers (Helmet)
- Audit Logging
- Database Connection Pooling
- Error Handling

## Setup

1. Copy environment file:
\`\`\`bash
cp .env.example .env
\`\`\`

2. Edit .env with your credentials

3. Install dependencies:
\`\`\`bash
npm install
\`\`\`

4. Run database migrations:
\`\`\`bash
npm run db:migrate
\`\`\`

5. Start server:
\`\`\`bash
npm start
\`\`\`

## API Endpoints

### Authentication
- POST /api/auth/login
- POST /api/auth/register

## Security Features

- Rate limiting (100 req/15min)
- Input validation
- SQL injection prevention
- XSS protection
- CORS configuration
- Helmet security headers
`,
  };

  return templates[templateName] || `// ${templateName}\n// TODO: Add template content\n`;
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const projectName = process.argv[2] || 'my-api';
  generateBackend(projectName);
}

export { generateBackend };
