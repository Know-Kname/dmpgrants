import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import authRoutes from './routes/auth.js';
import workOrderRoutes from './routes/workOrders.js';
import inventoryRoutes from './routes/inventory.js';
import financialRoutes from './routes/financial.js';
import burialsRoutes from './routes/burials.js';
import contractsRoutes from './routes/contracts.js';
import grantsRoutes from './routes/grants.js';
import customersRoutes from './routes/customers.js';
import healthRoutes from './routes/health.js';

import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { requestIdMiddleware } from './middleware/requestId.js';
import { csrfTokenMiddleware, csrfProtection, getCsrfToken } from './middleware/csrf.js';
import logger from './utils/logger.js';
import { validateEnv } from './utils/validateEnv.js';
import pool from './db/index.js';

dotenv.config();

// Validate environment variables on startup
validateEnv();

const app = express();
const PORT = process.env.PORT || 3000;

// Request ID tracking
app.use(requestIdMiddleware);

// HTTP request logging
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));

// Security middleware
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    }
  } : false,
  crossOriginEmbedderPolicy: false,
  hsts: process.env.NODE_ENV === 'production' ? {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  } : false,
}));

// Compression middleware for response optimization
app.use(compression());

// CORS - Restrict to known origins in production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:5173'
    : true,
  credentials: true, // Required for httpOnly cookies
};
app.use(cors(corsOptions));

// Cookie parser - Required for httpOnly cookies
app.use(cookieParser());

// CSRF token generation - Set token cookie for all requests
app.use(csrfTokenMiddleware);

// Body parser
app.use(express.json());

// Rate limiting - General API limit
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts per windowMs
  message: 'Too many login attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
});

// Apply general rate limiter to all API routes
app.use('/api/', generalLimiter);

// Health checks (no rate limiting, no auth)
app.use('/api', healthRoutes);

// CSRF token endpoint (no protection needed for GET)
app.get('/api/csrf-token', getCsrfToken);

// Routes (auth has additional stricter rate limiting)
// Note: Login doesn't need CSRF on first attempt, but other routes do
app.use('/api/auth', authLimiter, authRoutes);

// Apply CSRF protection to all data-modifying routes
app.use('/api/work-orders', csrfProtection, workOrderRoutes);
app.use('/api/inventory', csrfProtection, inventoryRoutes);
app.use('/api/financial', csrfProtection, financialRoutes);
app.use('/api/burials', csrfProtection, burialsRoutes);
app.use('/api/contracts', csrfProtection, contractsRoutes);
app.use('/api/grants', csrfProtection, grantsRoutes);
app.use('/api/customers', csrfProtection, customersRoutes);

// 404 handler for undefined routes - must be after all routes
app.use(notFoundHandler);

// Error handling middleware - must be last
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`, {
    environment: process.env.NODE_ENV,
    port: PORT,
  });
});

// Graceful shutdown handlers
const gracefulShutdown = async (signal) => {
  logger.info(`${signal} received, shutting down gracefully...`);

  server.close(async () => {
    logger.info('HTTP server closed');

    try {
      // Close database pool
      await pool.end();
      logger.info('Database connections closed');
      process.exit(0);
    } catch (error) {
      logger.error('Error during shutdown', { error: error.message });
      process.exit(1);
    }
  });

  // Force exit after 30 seconds if graceful shutdown hangs
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 30000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception', { error: error.message, stack: error.stack });
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled rejection', { reason, promise });
  gracefulShutdown('UNHANDLED_REJECTION');
});
