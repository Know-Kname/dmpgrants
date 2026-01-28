import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../db/index.js';
import { logAudit, AuditAction, getClientIp } from '../utils/auditLogger.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  const ipAddress = getClientIp(req);
  try {
    const { email, password } = req.body;

    const result = await query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      logAudit(AuditAction.LOGIN_FAILED, { email, reason: 'User not found' }, null, ipAddress);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      logAudit(AuditAction.LOGIN_FAILED, { email, reason: 'Invalid password' }, { id: user.id, email: user.email }, ipAddress);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Set httpOnly cookie - secure against XSS attacks
    res.cookie('token', token, {
      httpOnly: true, // Cannot be accessed by JavaScript
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'strict', // CSRF protection
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    // Log successful login
    logAudit(AuditAction.LOGIN_SUCCESS, { role: user.role }, { id: user.id, email: user.email }, ipAddress);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Register (admin only)
router.post('/register', async (req, res) => {
  const ipAddress = getClientIp(req);
  try {
    const { email, password, name, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await query(
      'INSERT INTO users (email, password_hash, name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role',
      [email, hashedPassword, name, role || 'staff']
    );

    const newUser = result.rows[0];

    // Log user creation
    logAudit(AuditAction.USER_CREATED, {
      newUserId: newUser.id,
      newUserEmail: newUser.email,
      newUserRole: newUser.role
    }, req.user, ipAddress);

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current authenticated user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const result = await query(
      'SELECT id, email, name, role, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Logout
router.post('/logout', authenticateToken, (req, res) => {
  const ipAddress = getClientIp(req);

  // Log logout
  logAudit(AuditAction.LOGOUT, {}, req.user, ipAddress);

  // Clear the httpOnly cookie
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  res.json({ success: true, message: 'Logged out successfully' });
});

export default router;
