const API_URL = '/api';

/**
 * API Error class for structured error handling
 */
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'APIError';
  }
}

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Handle API response and throw errors for non-ok responses
 */
async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type');
  const isJSON = contentType?.includes('application/json');

  let data: unknown;
  try {
    data = isJSON ? await response.json() : await response.text();
  } catch (error) {
    throw new APIError(
      'Failed to parse response',
      response.status,
      { originalError: error }
    );
  }

  if (!response.ok) {
    const errorMessage =
      (typeof data === 'object' && data && 'message' in data)
        ? String(data.message)
        : (typeof data === 'object' && data && 'error' in data)
        ? String(data.error)
        : `Request failed with status ${response.status}`;

    throw new APIError(errorMessage, response.status, data);
  }

  return data as T;
}

/**
 * Create fetch request with timeout
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout = 30000
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new APIError('Request timeout', 408);
    }
    throw new APIError(
      'Network error',
      0,
      { originalError: error }
    );
  }
}

export const api = {
  // Auth
  login: async (email: string, password: string) => {
    const response = await fetchWithTimeout(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse<{ success: boolean; token: string; user: unknown }>(response);
  },

  // Generic CRUD
  get: async <T = unknown>(endpoint: string): Promise<T> => {
    const response = await fetchWithTimeout(`${API_URL}${endpoint}`, {
      headers: getAuthHeader(),
    });
    return handleResponse<T>(response);
  },

  post: async <T = unknown>(endpoint: string, data: unknown): Promise<T> => {
    const response = await fetchWithTimeout(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    return handleResponse<T>(response);
  },

  put: async <T = unknown>(endpoint: string, data: unknown): Promise<T> => {
    const response = await fetchWithTimeout(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    return handleResponse<T>(response);
  },

  delete: async <T = unknown>(endpoint: string): Promise<T> => {
    const response = await fetchWithTimeout(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    return handleResponse<T>(response);
  },
};
