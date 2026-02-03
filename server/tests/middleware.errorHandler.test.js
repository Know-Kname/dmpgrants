import { describe, expect, it } from 'vitest';
import express from 'express';
import request from 'supertest';
import { AppError } from '../utils/errors.js';
import { errorHandler } from '../middleware/errorHandler.js';
import { requestContext } from '../middleware/requestContext.js';

const buildApp = () => {
  const app = express();
  app.use(requestContext);

  app.get('/app-error', (req, res, next) => {
    next(new AppError(403, 'Access forbidden', { code: 'FORBIDDEN' }));
  });

  app.get('/pg-error', (req, res, next) => {
    next({
      code: '23505',
      constraint: 'users_email_key',
      table: 'users',
      column: 'email',
    });
  });

  app.use(errorHandler);
  return app;
};

describe('errorHandler middleware', () => {
  it('formats AppError responses', async () => {
    const app = buildApp();
    const response = await request(app).get('/app-error');

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
    expect(response.body.error?.code).toBe('FORBIDDEN');
    expect(response.body.requestId).toBeTruthy();
  });

  it('maps database constraint errors to conflict', async () => {
    const app = buildApp();
    const response = await request(app).get('/pg-error');

    expect(response.status).toBe(409);
    expect(response.body.error?.code).toBe('CONFLICT');
    expect(response.body.error?.details?.table).toBe('users');
  });
});
