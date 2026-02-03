import { describe, expect, it } from 'vitest';
import { AppError, ValidationError, NotFoundError } from '../utils/errors.js';

describe('error classes', () => {
  it('creates AppError with metadata', () => {
    const error = new AppError(400, 'Bad request', { code: 'BAD_REQUEST' });

    expect(error.statusCode).toBe(400);
    expect(error.code).toBe('BAD_REQUEST');
    expect(error.isOperational).toBe(true);
  });

  it('creates typed errors with defaults', () => {
    const validation = new ValidationError();
    const notFound = new NotFoundError('Grant');

    expect(validation.statusCode).toBe(400);
    expect(validation.code).toBe('VALIDATION_ERROR');
    expect(notFound.statusCode).toBe(404);
    expect(notFound.message).toBe('Grant not found');
  });
});
