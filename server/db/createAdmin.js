import bcrypt from 'bcryptjs';
import pool from './index.js';
import dotenv from 'dotenv';

dotenv.config();

async function createAdmin() {
  try {
    const adminEmail = process.env.INITIAL_ADMIN_EMAIL;
    const adminPassword = process.env.INITIAL_ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.error('❌ INITIAL_ADMIN_EMAIL and INITIAL_ADMIN_PASSWORD must be set in .env');
      process.exit(1);
    }

    if (adminPassword.length < 12) {
      console.warn('⚠️  Warning: Admin password should be at least 12 characters');
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

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

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
}

createAdmin();
