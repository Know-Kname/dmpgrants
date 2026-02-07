/**
 * Centralized Error Handling Middleware
 * Following 2025 Express.js best practices
 */

import { AppError, DatabaseError, NotFoundError, ValidationError } from '../utils/errors.js';

/**
 * Format error response for client
 * Ensures no sensitive data is exposed
 */
const formatErrorResponse = (err, req, env) => {
  const isProduction = env === 'production';
  const includeDetails = err.code === 'VALIDATION_ERROR' || (!isProduction && err.details);

  const errorPayload = {
    message: err.isOperational ? err.message : 'Internal server error',
    code: err.code || 'INTERNAL_SERVER_ERROR',
    type: err.name,
  };

  if (includeDetails) {
    errorPayload.details = err.details;
  }

  if (!isProduction && err.stack) {
    errorPayload.stack = err.stack;
  }

  return {
    success: false,
    statusCode: err.statusCode || 500,
    error: errorPayload,
    requestId: req.requestId,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Log error for monitoring
 */
const logError = (err, req) => {
  console.error('ERROR:', {
    name: err.name,
    message: err.message,
    statusCode: err.statusCode,
    code: err.code,
    requestId: req.requestId,
    method: req.method,
    path: req.originalUrl,
    userId: req.user?.id,
    durationMs: req.requestStart ? Date.now() - req.requestStart : undefined,
    details: err.details,
    stack: err.stack,
    timestamp: new Date().toISOString(),
  });
};

const mapPostgresError = (err) => {
  if (!err?.code) return null;

  const details = {
    dbCode: err.code,
    constraint: err.constraint,
    table: err.table,
    column: err.column,
  };

  switch (err.code) {
    case '23505':
      return new AppError(409, 'Resource already exists', {
        code: 'CONFLICT',
        details,
        isOperational: true,
      });
    case '23503':
      return new AppError(409, 'Related resource not found', {
        code: 'FOREIGN_KEY_CONFLICT',
        details,
        isOperational: true,
      });
    case '23502':
      return new AppError(400, 'Missing required field', {
        code: 'NOT_NULL_VIOLATION',
        details,
        isOperational: true,
      });
    case '23514':
      return new AppError(400, 'Invalid value', {
        code: 'CHECK_VIOLATION',
        details,
        isOperational: true,
      });
    case '22P02':
      return new AppError(400, 'Invalid input syntax', {
        code: 'INVALID_INPUT',
        details,
        isOperational: true,
      });
    default:
      return new DatabaseError(err.message, details, err);
  }
};

const normalizeError = (err) => {
  if (err instanceof AppError) return err;

  const mappedDbError = mapPostgresError(err);
  if (mappedDbError) return mappedDbError;

  if (err instanceof SyntaxError && 'body' in err) {
    return new ValidationError('Invalid JSON payload');
  }

  return new AppError(500, 'Internal server error', {
    code: 'INTERNAL_SERVER_ERROR',
    isOperational: false,
    cause: err,
  });
};

/**
 * Main error handling middleware
 * Must be placed last in middleware chain
 */
export const errorHandler = (err, req, res, _next) => {
  const normalizedError = normalizeError(err);

  // Log all errors
  logError(normalizedError, req);

  // Format and send response
  const errorResponse = formatErrorResponse(normalizedError, req, process.env.NODE_ENV);

  res.status(normalizedError.statusCode || 500).json(errorResponse);
};

/**
 * Handle async route errors
 * Wrapper for async functions to catch errors
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * 404 Not Found handler
 * For undefined routes
 */
export const notFoundHandler = (req, res, next) => {
  const err = new NotFoundError(`Route ${req.originalUrl}`);
  next(err);
};
