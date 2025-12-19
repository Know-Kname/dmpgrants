/**
 * Centralized Error Handling Middleware
 * Following 2025 Express.js best practices
 */

import { AppError } from '../utils/errors.js';

/**
 * Format error response for client
 * Ensures no sensitive data is exposed
 */
const formatErrorResponse = (err, env) => {
  const response = {
    success: false,
    message: err.message || 'An error occurred',
    statusCode: err.statusCode || 500,
  };

  // Only include stack trace in development
  if (env === 'development') {
    response.stack = err.stack;
    response.details = err.details;
  }

  // Only include operational error details
  if (err.isOperational) {
    response.type = err.name;
  } else {
    // For non-operational errors, use generic message
    response.message = 'Internal server error';
  }

  return response;
};

/**
 * Log error for monitoring
 */
const logError = (err) => {
  console.error('ERROR:', {
    name: err.name,
    message: err.message,
    statusCode: err.statusCode,
    stack: err.stack,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Main error handling middleware
 * Must be placed last in middleware chain
 */
export const errorHandler = (err, req, res, next) => {
  // Log all errors
  logError(err);

  // Set default values if not an AppError
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  err.isOperational = err.isOperational !== undefined ? err.isOperational : false;

  // Format and send response
  const errorResponse = formatErrorResponse(err, process.env.NODE_ENV);

  res.status(err.statusCode).json(errorResponse);
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
  const err = new AppError(404, `Route ${req.originalUrl} not found`);
  next(err);
};
