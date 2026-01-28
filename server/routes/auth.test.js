import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from './auth.js';

// Mock dependencies
vi.mock('../db/index.js', () => ({
  query: vi.fn(),
}));

vi.mock('../utils/auditLogger.js', () => ({
  logAudit: vi.fn(),
  AuditAction: {
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGIN_FAILED: 'LOGIN_FAILED',
    LOGOUT: 'LOGOUT',
  },
  getClientIp: vi.fn(() => '127.0.0.1'),
}));

vi.mock('../middleware/auth.js', () => ({
  authenticateToken: (req, res, next) => {
    req.user = { id: 'test-user-id', email: 'test@example.com', role: 'staff' };
    next();
  },
}));

import { query } from '../db/index.js';
import bcrypt from 'bcryptjs';

describe('Auth Routes', () => {
  let app;

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup express app for testing
    app = express();
    app.use(express.json());
    app.use(cookieParser());
    app.use('/auth', authRoutes);
  });

  describe('POST /auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const mockUser = {
        id: 'user-id-123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'staff',
        password_hash: hashedPassword,
      };

      query.mockResolvedValueOnce({ rows: [mockUser] });

      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe('test@example.com');
      expect(response.body.user).not.toHaveProperty('password_hash');

      // Verify httpOnly cookie was set
      const cookies = response.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies.some(cookie => cookie.startsWith('token='))).toBe(true);
      expect(cookies.some(cookie => cookie.includes('HttpOnly'))).toBe(true);
    });

    it('should return 401 for invalid credentials', async () => {
      query.mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'wrong@example.com', password: 'wrong' });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Invalid credentials');
    });

    it('should return 401 for wrong password', async () => {
      const hashedPassword = await bcrypt.hash('correct', 10);
      const mockUser = {
        id: 'user-id-123',
        email: 'test@example.com',
        password_hash: hashedPassword,
      };

      query.mockResolvedValueOnce({ rows: [mockUser] });

      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'test@example.com', password: 'wrong' });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Invalid credentials');
    });
  });

  describe('GET /auth/me', () => {
    it('should return current user', async () => {
      const mockUser = {
        id: 'test-user-id',
        email: 'test@example.com',
        name: 'Test User',
        role: 'staff',
        created_at: new Date(),
      };

      query.mockResolvedValueOnce({ rows: [mockUser] });

      const response = await request(app).get('/auth/me');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('should return 404 if user not found', async () => {
      query.mockResolvedValueOnce({ rows: [] });

      const response = await request(app).get('/auth/me');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('User not found');
    });
  });

  describe('POST /auth/logout', () => {
    it('should logout successfully and clear cookie', async () => {
      const response = await request(app).post('/auth/logout');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      // Verify cookie was cleared
      const cookies = response.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies.some(cookie => cookie.includes('token=;'))).toBe(true);
    });
  });
});
