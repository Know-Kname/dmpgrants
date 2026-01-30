/**
 * Custom Error Classes for Cemetery Management System
 * Following 2025 Node.js best practices for error handling
 */

class AppError extends Error {
  constructor(statusCode, message, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message, details = []) {
    super(400, message);
    this.details = details;
  }
}

class NotFoundError extends AppError {
  constructor(resource) {
    super(404, `${resource} not found`);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized access') {
    super(401, message);
  }
}

class ForbiddenError extends AppError {
  constructor(message = 'Access forbidden') {
    super(403, message);
  }
}

class DatabaseError extends AppError {
  constructor(message) {
    super(500, `Database error: ${message}`);
  }
}

class TimeoutError extends AppError {
  constructor(operation) {
    super(408, `Operation '${operation}' timed out`);
  }
}

export {
  AppError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  DatabaseError,
  TimeoutError,
};
