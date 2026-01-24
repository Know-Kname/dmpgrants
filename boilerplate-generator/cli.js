#!/usr/bin/env node

/**
 * 🚀 Production-Ready App Generator CLI
 * Interactive CLI for generating frontend, backend, or full-stack applications
 */

import { generateFrontend } from './generators/generate-frontend.js';
import { generateBackend } from './generators/generate-backend.js';
import { generateFullStack } from './generators/generate-fullstack.js';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function main() {
  console.clear();
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   🚀  PRODUCTION-READY APP GENERATOR                         ║
║                                                               ║
║   Generate high-quality, production-ready applications       ║
║   with best practices baked in                               ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
  `);

  console.log(`What would you like to generate?\n`);
  console.log(`  1. 📱 Frontend (React + TypeScript + Tailwind)`);
  console.log(`  2. ⚙️  Backend (Express + Security + Database)`);
  console.log(`  3. 🎯 Full-Stack (Frontend + Backend + Database)`);
  console.log(`  4. 📚 View Documentation`);
  console.log(`  5. 🚪 Exit\n`);

  const choice = await question('Enter your choice (1-5): ');

  switch (choice.trim()) {
    case '1':
      await generateFrontendInteractive();
      break;
    case '2':
      await generateBackendInteractive();
      break;
    case '3':
      await generateFullStackInteractive();
      break;
    case '4':
      showDocumentation();
      break;
    case '5':
      console.log('\n👋 Goodbye!\n');
      process.exit(0);
      break;
    default:
      console.log('\n❌ Invalid choice. Please try again.\n');
      await main();
  }

  rl.close();
}

async function generateFrontendInteractive() {
  console.log(`\n${'─'.repeat(60)}`);
  console.log(`📱 FRONTEND GENERATOR`);
  console.log(`${'─'.repeat(60)}\n`);

  const projectName = await question('Project name (e.g., my-dashboard): ');

  if (!projectName || projectName.trim() === '') {
    console.log('\n❌ Project name is required!\n');
    return;
  }

  console.log(`\n📦 Features included:`);
  console.log(`   ✅ React 18 + TypeScript`);
  console.log(`   ✅ Tailwind CSS`);
  console.log(`   ✅ Custom hooks (useDebounce, useFormValidation, etc.)`);
  console.log(`   ✅ Toast notifications`);
  console.log(`   ✅ Error boundary`);
  console.log(`   ✅ Lazy loading & code splitting`);
  console.log(`   ✅ Form validation`);
  console.log(`   ✅ API client with error handling\n`);

  const confirm = await question('Generate frontend? (y/n): ');

  if (confirm.toLowerCase() === 'y') {
    generateFrontend(projectName.trim());
  } else {
    console.log('\n❌ Generation cancelled.\n');
  }
}

async function generateBackendInteractive() {
  console.log(`\n${'─'.repeat(60)}`);
  console.log(`⚙️  BACKEND GENERATOR`);
  console.log(`${'─'.repeat(60)}\n`);

  const projectName = await question('Project name (e.g., my-api): ');

  if (!projectName || projectName.trim() === '') {
    console.log('\n❌ Project name is required!\n');
    return;
  }

  console.log(`\n📦 Features included:`);
  console.log(`   ✅ Express.js with security`);
  console.log(`   ✅ JWT authentication`);
  console.log(`   ✅ Input validation (express-validator)`);
  console.log(`   ✅ Rate limiting`);
  console.log(`   ✅ Helmet security headers`);
  console.log(`   ✅ Audit logging`);
  console.log(`   ✅ Database connection pooling`);
  console.log(`   ✅ Error handling middleware\n`);

  const confirm = await question('Generate backend? (y/n): ');

  if (confirm.toLowerCase() === 'y') {
    generateBackend(projectName.trim());
  } else {
    console.log('\n❌ Generation cancelled.\n');
  }
}

async function generateFullStackInteractive() {
  console.log(`\n${'─'.repeat(60)}`);
  console.log(`🎯 FULL-STACK GENERATOR`);
  console.log(`${'─'.repeat(60)}\n`);

  const projectName = await question('Project name (e.g., my-saas-app): ');

  if (!projectName || projectName.trim() === '') {
    console.log('\n❌ Project name is required!\n');
    return;
  }

  console.log(`\n📦 This will generate:`);
  console.log(`   📱 Frontend (React + TypeScript + Tailwind)`);
  console.log(`   ⚙️  Backend (Express + Security + Database)`);
  console.log(`   💾 Database setup (PostgreSQL + Migrations)`);
  console.log(`   📚 Complete documentation`);
  console.log(`   🚀 Production-ready configuration\n`);

  const confirm = await question('Generate full-stack app? (y/n): ');

  if (confirm.toLowerCase() === 'y') {
    generateFullStack(projectName.trim());
  } else {
    console.log('\n❌ Generation cancelled.\n');
  }
}

function showDocumentation() {
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`📚 DOCUMENTATION`);
  console.log(`${'═'.repeat(60)}\n`);

  console.log(`🎯 What Gets Generated:\n`);

  console.log(`📱 FRONTEND:`);
  console.log(`   • React 18 with TypeScript`);
  console.log(`   • Tailwind CSS pre-configured`);
  console.log(`   • Custom hooks:`);
  console.log(`     - useDebounce (300ms search debouncing)`);
  console.log(`     - useFormValidation (form validation with rules)`);
  console.log(`     - useKeyboard (keyboard shortcuts)`);
  console.log(`   • Components:`);
  console.log(`     - Toast notification system`);
  console.log(`     - Error boundary (crash prevention)`);
  console.log(`     - Confirmation dialogs`);
  console.log(`     - UI component library`);
  console.log(`   • API client with error handling`);
  console.log(`   • Lazy loading & code splitting\n`);

  console.log(`⚙️  BACKEND:`);
  console.log(`   • Express.js server`);
  console.log(`   • JWT authentication`);
  console.log(`   • Security:`);
  console.log(`     - Rate limiting (100 req/15min)`);
  console.log(`     - Helmet security headers`);
  console.log(`     - Input validation`);
  console.log(`     - CORS configuration`);
  console.log(`   • Database:`);
  console.log(`     - PostgreSQL connection pooling`);
  console.log(`     - Migration system`);
  console.log(`     - Error code translation`);
  console.log(`   • Audit logging system`);
  console.log(`   • Error handling middleware\n`);

  console.log(`🚀 USAGE:`);
  console.log(`   npm install                # Install CLI tool`);
  console.log(`   npm run generate:frontend  # Generate frontend only`);
  console.log(`   npm run generate:backend   # Generate backend only`);
  console.log(`   npm run generate:fullstack # Generate everything\n`);

  console.log(`${'═'.repeat(60)}\n`);
}

// Run CLI
main().catch((error) => {
  console.error('\n❌ Error:', error.message);
  process.exit(1);
});
