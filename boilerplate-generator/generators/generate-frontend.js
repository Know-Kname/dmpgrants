#!/usr/bin/env node

/**
 * Frontend Boilerplate Generator
 * Generates production-ready React + TypeScript app structure
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FRONTEND_STRUCTURE = {
  'src': {
    'components': {
      'ui.tsx': 'UI_COMPONENTS_TEMPLATE',
      'Layout.tsx': 'LAYOUT_TEMPLATE',
      'ErrorBoundary.tsx': 'ERROR_BOUNDARY_TEMPLATE',
      'ConfirmDialog.tsx': 'CONFIRM_DIALOG_TEMPLATE',
    },
    'hooks': {
      'useDebounce.ts': 'USE_DEBOUNCE_TEMPLATE',
      'useFormValidation.ts': 'USE_FORM_VALIDATION_TEMPLATE',
      'useKeyboard.ts': 'USE_KEYBOARD_TEMPLATE',
    },
    'lib': {
      'api.ts': 'API_CLIENT_TEMPLATE',
      'auth.tsx': 'AUTH_CONTEXT_TEMPLATE',
    },
    'pages': {
      'Login.tsx': 'LOGIN_PAGE_TEMPLATE',
      'Dashboard.tsx': 'DASHBOARD_PAGE_TEMPLATE',
    },
    'types': {
      'index.ts': 'TYPES_TEMPLATE',
    },
    'styles': {
      'index.css': 'STYLES_TEMPLATE',
    },
    'App.tsx': 'APP_TEMPLATE',
    'main.tsx': 'MAIN_TEMPLATE',
  },
  'public': {
    'index.html': 'HTML_TEMPLATE',
  },
  'package.json': 'PACKAGE_JSON_TEMPLATE',
  'tsconfig.json': 'TSCONFIG_TEMPLATE',
  'vite.config.ts': 'VITE_CONFIG_TEMPLATE',
  'tailwind.config.js': 'TAILWIND_CONFIG_TEMPLATE',
  'postcss.config.js': 'POSTCSS_CONFIG_TEMPLATE',
  '.gitignore': 'GITIGNORE_TEMPLATE',
  'README.md': 'README_TEMPLATE',
};

function generateFrontend(projectName = 'my-app', options = {}) {
  const projectPath = path.join(process.cwd(), projectName);

  console.log(`🚀 Generating frontend app: ${projectName}`);
  console.log(`📁 Location: ${projectPath}\n`);

  // Create project directory
  if (fs.existsSync(projectPath)) {
    console.error(`❌ Error: Directory ${projectName} already exists!`);
    process.exit(1);
  }

  fs.mkdirSync(projectPath, { recursive: true });

  // Create directory structure
  createDirectoryStructure(projectPath, FRONTEND_STRUCTURE);

  console.log(`\n✅ Frontend app generated successfully!\n`);
  console.log(`📦 Next steps:`);
  console.log(`   cd ${projectName}`);
  console.log(`   npm install`);
  console.log(`   npm run dev\n`);
}

function createDirectoryStructure(basePath, structure) {
  for (const [name, content] of Object.entries(structure)) {
    const fullPath = path.join(basePath, name);

    if (typeof content === 'object') {
      // It's a directory
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`📁 Created: ${name}/`);
      createDirectoryStructure(fullPath, content);
    } else {
      // It's a file
      const templateContent = getTemplate(content);
      fs.writeFileSync(fullPath, templateContent);
      console.log(`📄 Created: ${name}`);
    }
  }
}

function getTemplate(templateName) {
  const templatePath = path.join(__dirname, '../templates/frontend', `${templateName}.txt`);

  if (fs.existsSync(templatePath)) {
    return fs.readFileSync(templatePath, 'utf-8');
  }

  // Fallback templates
  return getInlineTemplate(templateName);
}

function getInlineTemplate(templateName) {
  const templates = {
    'PACKAGE_JSON_TEMPLATE': JSON.stringify({
      "name": "frontend-app",
      "version": "1.0.0",
      "type": "module",
      "scripts": {
        "dev": "vite",
        "build": "tsc && vite build",
        "preview": "vite preview"
      },
      "dependencies": {
        "react": "^18.2.0",
        "react-dom": "^18.2.0",
        "react-router-dom": "^6.20.0",
        "lucide-react": "^0.300.0",
        "date-fns": "^3.0.0"
      },
      "devDependencies": {
        "@types/react": "^18.2.43",
        "@types/react-dom": "^18.2.17",
        "@vitejs/plugin-react": "^4.2.1",
        "autoprefixer": "^10.4.16",
        "postcss": "^8.4.32",
        "tailwindcss": "^3.4.0",
        "typescript": "^5.3.3",
        "vite": "^5.0.8"
      }
    }, null, 2),

    'TSCONFIG_TEMPLATE': JSON.stringify({
      "compilerOptions": {
        "target": "ES2020",
        "useDefineForClassFields": true,
        "lib": ["ES2020", "DOM", "DOM.Iterable"],
        "module": "ESNext",
        "skipLibCheck": true,
        "moduleResolution": "bundler",
        "allowImportingTsExtensions": true,
        "resolveJsonModule": true,
        "isolatedModules": true,
        "noEmit": true,
        "jsx": "react-jsx",
        "strict": true,
        "noUnusedLocals": true,
        "noUnusedParameters": true,
        "noFallthroughCasesInSwitch": true
      },
      "include": ["src"],
      "references": [{ "path": "./tsconfig.node.json" }]
    }, null, 2),

    'GITIGNORE_TEMPLATE': `node_modules
dist
*.local
.env
.DS_Store`,

    'README_TEMPLATE': `# Frontend App

Production-ready React + TypeScript application with best practices.

## Features

- React 18 + TypeScript
- Tailwind CSS
- Custom hooks
- Error handling
- Form validation
- Toast notifications

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

## Build

\`\`\`bash
npm run build
\`\`\`
`,
  };

  return templates[templateName] || `// ${templateName}\n// TODO: Add template content\n`;
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const projectName = process.argv[2] || 'my-app';
  generateFrontend(projectName);
}

export { generateFrontend };
