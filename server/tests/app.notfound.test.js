import { describe, expect, it } from 'vitest';
import request from 'supertest';
import app from '../app.js';

describe('404 handler', () => {
  it('returns standardized error response', async () => {
    const response = await request(app).get('/api/does-not-exist');

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.error?.code).toBe('NOT_FOUND');
    expect(response.body.requestId).toBeTruthy();
    expect(response.body.timestamp).toBeTruthy();
  });

  it('preserves request id header when provided', async () => {
    const response = await request(app)
      .get('/api/does-not-exist')
      .set('x-request-id', 'req-test-123');

    expect(response.headers['x-request-id']).toBe('req-test-123');
    expect(response.body.requestId).toBe('req-test-123');
  });
});
