import { describe, it, expect, beforeEach, vi } from 'vitest';
import { api, ApiError } from './api';

describe('API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET requests', () => {
    it('should successfully fetch data', async () => {
      const mockData = { id: 1, name: 'Test' };
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => mockData,
          headers: new Headers({ 'content-type': 'application/json' }),
        } as Response)
      );

      const result = await api.get('/test');
      expect(result).toEqual(mockData);
      expect(fetch).toHaveBeenCalledWith(
        '/api/test',
        expect.objectContaining({
          method: 'GET',
          credentials: 'include',
        })
      );
    });

    it('should throw ApiError on 404', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 404,
          json: async () => ({ error: 'Not found' }),
          headers: new Headers({ 'content-type': 'application/json' }),
        } as Response)
      );

      await expect(api.get('/test')).rejects.toThrow(ApiError);
      await expect(api.get('/test')).rejects.toThrow('Not found');
    });

    it('should handle network errors', async () => {
      global.fetch = vi.fn(() => Promise.reject(new TypeError('Network error')));

      await expect(api.get('/test')).rejects.toThrow(ApiError);
      await expect(api.get('/test')).rejects.toThrow('Network error');
    });
  });

  describe('POST requests', () => {
    it('should send data and include CSRF token', async () => {
      const mockData = { success: true };
      const postData = { name: 'Test' };

      // Mock CSRF token fetch
      global.fetch = vi
        .fn()
        .mockImplementationOnce(() =>
          Promise.resolve({
            ok: true,
            status: 200,
            json: async () => ({ csrfToken: 'test-token' }),
            headers: new Headers({ 'content-type': 'application/json' }),
          } as Response)
        )
        .mockImplementationOnce(() =>
          Promise.resolve({
            ok: true,
            status: 201,
            json: async () => mockData,
            headers: new Headers({ 'content-type': 'application/json' }),
          } as Response)
        );

      const result = await api.post('/test', postData);
      expect(result).toEqual(mockData);

      // Verify CSRF token was included
      expect(fetch).toHaveBeenCalledWith(
        '/api/test',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(postData),
          credentials: 'include',
          headers: expect.objectContaining({
            'X-CSRF-Token': 'test-token',
          }),
        })
      );
    });
  });

  describe('Error handling', () => {
    it('should handle timeout errors', async () => {
      global.fetch = vi.fn(
        () =>
          new Promise((_, reject) => {
            const error = new Error('AbortError');
            error.name = 'AbortError';
            reject(error);
          })
      );

      await expect(api.get('/test')).rejects.toThrow('Request timeout');
    });

    it('should handle 401 unauthorized', async () => {
      const mockLocation = { href: '' };
      Object.defineProperty(window, 'location', {
        value: mockLocation,
        writable: true,
      });

      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 401,
          json: async () => ({ error: 'Unauthorized' }),
          headers: new Headers({ 'content-type': 'application/json' }),
        } as Response)
      );

      await expect(api.get('/test')).rejects.toThrow('Session expired');
      expect(mockLocation.href).toBe('/login');
    });
  });
});
