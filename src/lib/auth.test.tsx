import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './auth';
import { ReactNode } from 'react';

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  it('should check authentication on mount', async () => {
    const mockUser = { id: '1', email: 'test@example.com', name: 'Test User', role: 'staff' };

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: async () => ({ user: mockUser }),
        headers: new Headers({ 'content-type': 'application/json' }),
      } as Response)
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isAuthenticated).toBe(false);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should handle unauthenticated user', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 401,
        json: async () => ({ error: 'Unauthorized' }),
        headers: new Headers({ 'content-type': 'application/json' }),
      } as Response)
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should login successfully', async () => {
    const mockUser = { id: '1', email: 'test@example.com', name: 'Test User', role: 'staff' };

    global.fetch = vi
      .fn()
      // First call: /auth/me (initial check)
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: false,
          status: 401,
          json: async () => ({ error: 'Unauthorized' }),
          headers: new Headers({ 'content-type': 'application/json' }),
        } as Response)
      )
      // Second call: /auth/login
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({ user: mockUser }),
          headers: new Headers({ 'content-type': 'application/json' }),
        } as Response)
      );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await result.current.login('test@example.com', 'password');

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should logout successfully', async () => {
    const mockUser = { id: '1', email: 'test@example.com', name: 'Test User', role: 'staff' };

    global.fetch = vi
      .fn()
      // First call: /auth/me (initial check)
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({ user: mockUser }),
          headers: new Headers({ 'content-type': 'application/json' }),
        } as Response)
      )
      // Second call: /auth/logout
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({ success: true }),
          headers: new Headers({ 'content-type': 'application/json' }),
        } as Response)
      );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });

    await result.current.logout();

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });
});
