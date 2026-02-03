import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../db/index.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { validateLogin, validateRegister } from '../middleware/validation.js';
import { ConflictError, UnauthorizedError } from '../utils/errors.js';

const router = express.Router();

// Login
router.post('/login', validateLogin, asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const result = await query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );

  if (result.rows.length === 0) {
    throw new UnauthorizedError('Invalid credentials');
  }

  const user = result.rows[0];
  const validPassword = await bcrypt.compare(password, user.password_hash);

  if (!validPassword) {
    throw new UnauthorizedError('Invalid credentials');
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
}));

// Register (admin only)
router.post('/register', validateRegister, asyncHandler(async (req, res) => {
  const { email, password, name, role } = req.body;

  const existing = await query('SELECT 1 FROM users WHERE email = $1', [email]);
  if (existing.rows.length > 0) {
    throw new ConflictError('Email already in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await query(
    'INSERT INTO users (email, password_hash, name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role',
    [email, hashedPassword, name, role || 'staff']
  );

  res.status(201).json(result.rows[0]);
}));

export default router;
