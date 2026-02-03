import { describe, expect, it } from 'vitest';
import express from 'express';
import request from 'supertest';
import { normalizeRequest } from '../middleware/normalizeRequest.js';
import { requestContext } from '../middleware/requestContext.js';
import { errorHandler, notFoundHandler } from '../middleware/errorHandler.js';

const buildApp = () => {
  const app = express();
  app.use(requestContext);
  app.use(express.json());
  app.use(normalizeRequest);

  app.post('/echo', (req, res) => {
    res.json(req.body);
  });

  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
};

describe('normalizeRequest middleware', () => {
  it('converts snake_case keys to camelCase', async () => {
    const app = buildApp();
    const response = await request(app)
      .post('/echo')
      .send({
        first_name: 'Ada',
        last_name: 'Lovelace',
        address_info: { zip_code: '12345' },
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      firstName: 'Ada',
      lastName: 'Lovelace',
      addressInfo: { zipCode: '12345' },
    });
  });
});
