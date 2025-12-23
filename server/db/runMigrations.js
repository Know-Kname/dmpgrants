import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Run all SQL migrations in the migrations directory
 * Migrations are run in alphabetical order
 */
async function runMigrations() {
  try {
    const migrationsDir = path.join(__dirname, 'migrations');

    // Check if migrations directory exists
    if (!fs.existsSync(migrationsDir)) {
      console.log('📋 No migrations directory found. Skipping migrations.');
      return;
    }

    // Get all SQL files in the migrations directory
    const migrationFiles = fs
      .readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    if (migrationFiles.length === 0) {
      console.log('📋 No migration files found.');
      return;
    }

    console.log(`\n🔄 Running ${migrationFiles.length} migration(s)...\n`);

    for (const file of migrationFiles) {
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');

      console.log(`   Applying: ${file}`);

      try {
        await pool.query(sql);
        console.log(`   ✅ Success: ${file}\n`);
      } catch (error) {
        console.error(`   ❌ Failed: ${file}`);
        console.error(`   Error: ${error.message}\n`);
        throw error;
      }
    }

    console.log('✅ All migrations completed successfully!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
}

runMigrations();
