import { randomBytes } from 'crypto';
import logger from '../utils/logger.js';

/**
 * Modern CSRF Protection using Double Submit Cookie pattern
 * Safe alternative to deprecated csurf package
 *
 * How it works:
 * 1. Server generates CSRF token and sends it in both:
 *    - A cookie (csrf-token)
 *    - Response body (for client to include in requests)
 * 2. Client includes token in X-CSRF-Token header
 * 3. Server validates that header matches cookie value
 */

const CSRF_COOKIE_NAME = 'csrf-token';
const CSRF_HEADER_NAME = 'x-csrf-token';

// Safe HTTP methods that don't require CSRF protection
const SAFE_METHODS = ['GET', 'HEAD', 'OPTIONS'];

/**
 * Generate a cryptographically secure CSRF token
 */
function generateToken() {
  return randomBytes(32).toString('hex');
}

/**
 * Middleware to generate and set CSRF token
 * Should be applied early in middleware chain
 */
export function csrfTokenMiddleware(req, res, next) {
  // Skip if token already exists in cookie
  if (!req.cookies[CSRF_COOKIE_NAME]) {
    const token = generateToken();

    // Set as httpOnly cookie
    res.cookie(CSRF_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });
  }

  next();
}

/**
 * Middleware to validate CSRF token
 * Should be applied to routes that modify data (POST, PUT, DELETE, PATCH)
 */
export function csrfProtection(req, res, next) {
  // Skip for safe methods
  if (SAFE_METHODS.includes(req.method)) {
    return next();
  }

  // Skip for health checks and auth login (special cases)
  if (req.path.includes('/health') || req.path.includes('/ready') || req.path.includes('/live')) {
    return next();
  }

  // Get token from cookie and header
  const tokenFromCookie = req.cookies[CSRF_COOKIE_NAME];
  const tokenFromHeader = req.headers[CSRF_HEADER_NAME];

  // Validate tokens exist and match
  if (!tokenFromCookie || !tokenFromHeader) {
    logger.warn('CSRF token missing', {
      method: req.method,
      path: req.path,
      ip: req.ip,
      hasCookie: !!tokenFromCookie,
      hasHeader: !!tokenFromHeader,
    });

    return res.status(403).json({
      error: 'CSRF token missing. Please refresh the page and try again.',
    });
  }

  if (tokenFromCookie !== tokenFromHeader) {
    logger.warn('CSRF token mismatch', {
      method: req.method,
      path: req.path,
      ip: req.ip,
    });

    return res.status(403).json({
      error: 'CSRF token invalid. Please refresh the page and try again.',
    });
  }

  next();
}

/**
 * Endpoint to get CSRF token for client-side JavaScript
 * Useful for SPA applications
 */
export function getCsrfToken(req, res) {
  const token = req.cookies[CSRF_COOKIE_NAME];

  if (!token) {
    const newToken = generateToken();
    res.cookie(CSRF_COOKIE_NAME, newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.json({ csrfToken: newToken });
  }

  res.json({ csrfToken: token });
}
