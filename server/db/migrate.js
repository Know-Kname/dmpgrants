import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  try {
    const schemaSQL = fs.readFileSync(
      path.join(__dirname, 'schema.sql'),
      'utf8'
    );

    await pool.query(schemaSQL);
    console.log('✅ Database migration completed successfully!');

    // Check if initial admin user should be created
    const adminEmail = process.env.INITIAL_ADMIN_EMAIL;
    const adminPassword = process.env.INITIAL_ADMIN_PASSWORD;

    if (adminEmail && adminPassword) {
      // Validate password strength
      if (adminPassword.length < 12) {
        console.warn('⚠️  Admin password should be at least 12 characters');
      }

      const bcrypt = await import('bcryptjs');
      const hashedPassword = await bcrypt.default.hash(adminPassword, 10);

      const result = await pool.query(`
        INSERT INTO users (email, password_hash, name, role)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (email) DO NOTHING
        RETURNING id
      `, [adminEmail, hashedPassword, 'Admin User', 'admin']);

      if (result.rowCount > 0) {
        console.log(`✅ Initial admin user created: ${adminEmail}`);
        console.log('⚠️  Please change the password immediately after first login');
      } else {
        console.log('ℹ️  Admin user already exists, skipping creation');
      }
    } else {
      console.log('\n📋 No initial admin user created.');
      console.log('To create an admin user, set these environment variables:');
      console.log('  - INITIAL_ADMIN_EMAIL');
      console.log('  - INITIAL_ADMIN_PASSWORD (minimum 12 characters)');
      console.log('Then run: npm run db:migrate\n');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
}

runMigration();
