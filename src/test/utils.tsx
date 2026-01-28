import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { AuthProvider } from '../lib/auth';
import { ToastProvider } from '../components/ui';
import { ConfirmDialogProvider } from '../components/ConfirmDialog';

/**
 * Custom render function that wraps components with common providers
 * Use this instead of @testing-library/react's render for components that need context
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <ConfirmDialogProvider>
              {children}
            </ConfirmDialogProvider>
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    );
  }

  return render(ui, { wrapper: Wrapper, ...options });
}

/**
 * Mock fetch responses for testing API calls
 */
export function mockFetch(response: any, status: number = 200) {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: status >= 200 && status < 300,
      status,
      json: async () => response,
      headers: new Headers({ 'content-type': 'application/json' }),
    } as Response)
  );
}

/**
 * Mock fetch error
 */
export function mockFetchError(message: string = 'Network error') {
  global.fetch = vi.fn(() => Promise.reject(new Error(message)));
}

/**
 * Wait for async operations to complete
 */
export const waitForAsync = () =>
  new Promise((resolve) => setTimeout(resolve, 0));

// Re-export everything from testing library
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
