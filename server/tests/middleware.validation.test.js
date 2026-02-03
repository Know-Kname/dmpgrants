import { describe, expect, it } from 'vitest';
import express from 'express';
import request from 'supertest';
import { validateGrant } from '../middleware/validation.js';
import { errorHandler } from '../middleware/errorHandler.js';

const buildApp = () => {
  const app = express();
  app.use(express.json());

  app.post('/grants', validateGrant, (req, res) => {
    res.json({ success: true });
  });

  app.use(errorHandler);
  return app;
};

describe('validation middleware', () => {
  it('returns validation errors with details', async () => {
    const app = buildApp();
    const response = await request(app).post('/grants').send({});

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error?.code).toBe('VALIDATION_ERROR');
    expect(Array.isArray(response.body.error?.details)).toBe(true);
  });
});
