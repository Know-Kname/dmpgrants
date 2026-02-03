/**
 * Custom Error Classes for Cemetery Management System
 * Following 2025 Node.js best practices for error handling
 */

class AppError extends Error {
  constructor(statusCode, message, options = {}) {
    super(message);
    const { code, details, isOperational = true, cause } = options;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = isOperational;
    this.name = this.constructor.name;
    if (cause) {
      this.cause = cause;
    }
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message = 'Validation failed', details = []) {
    super(400, message, { code: 'VALIDATION_ERROR', details });
  }
}

class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(404, `${resource} not found`, { code: 'NOT_FOUND' });
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized access') {
    super(401, message, { code: 'UNAUTHORIZED' });
  }
}

class ForbiddenError extends AppError {
  constructor(message = 'Access forbidden') {
    super(403, message, { code: 'FORBIDDEN' });
  }
}

class ConflictError extends AppError {
  constructor(message = 'Conflict') {
    super(409, message, { code: 'CONFLICT' });
  }
}

class DatabaseError extends AppError {
  constructor(message, details, cause) {
    super(500, `Database error: ${message}`, {
      code: 'DATABASE_ERROR',
      details,
      cause,
      isOperational: false,
    });
  }
}

class TimeoutError extends AppError {
  constructor(operation) {
    super(408, `Operation '${operation}' timed out`, { code: 'TIMEOUT' });
  }
}

export {
  AppError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  DatabaseError,
  TimeoutError,
};
