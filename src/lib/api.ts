const API_URL = '/api';

// Custom API Error class
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// API Response type
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

const getAuthHeader = (): Record<string, string> => {
  const token = localStorage.getItem('token');
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
};

// Handle API response with error checking
async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type');
  const isJson = contentType?.includes('application/json');

  // Parse response body
  let data: any;
  try {
    data = isJson ? await response.json() : await response.text();
  } catch (error) {
    throw new ApiError(response.status, 'Failed to parse response');
  }

  // Handle error responses
  if (!response.ok) {
    const errorMessage = data?.error || data?.message || `Request failed with status ${response.status}`;

    // Handle specific status codes
    if (response.status === 401) {
      // Clear auth token on unauthorized
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      throw new ApiError(401, 'Session expired. Please login again.');
    }

    if (response.status === 403) {
      throw new ApiError(403, 'You do not have permission to perform this action.');
    }

    if (response.status === 404) {
      throw new ApiError(404, data?.error || 'Resource not found.');
    }

    if (response.status === 422) {
      throw new ApiError(422, 'Validation failed. Please check your input.', data);
    }

    if (response.status >= 500) {
      throw new ApiError(response.status, 'Server error. Please try again later.');
    }

    throw new ApiError(response.status, errorMessage, data);
  }

  return data;
}

// Generic request handler with error handling
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    };

    // Merge custom headers if provided
    if (options.headers) {
      const customHeaders = new Headers(options.headers);
      customHeaders.forEach((value, key) => {
        headers[key] = value;
      });
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    return await handleResponse<T>(response);
  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError) {
      throw new ApiError(0, 'Network error. Please check your connection.');
    }

    // Re-throw ApiError
    if (error instanceof ApiError) {
      throw error;
    }

    // Handle unknown errors
    throw new ApiError(500, 'An unexpected error occurred.');
  }
}

export const api = {
  // Auth
  login: async (email: string, password: string) => {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  // Generic CRUD
  get: async <T = any>(endpoint: string): Promise<T> => {
    return request<T>(endpoint, { method: 'GET' });
  },

  post: async <T = any>(endpoint: string, data: any): Promise<T> => {
    return request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  put: async <T = any>(endpoint: string, data: any): Promise<T> => {
    return request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async <T = any>(endpoint: string): Promise<T> => {
    return request<T>(endpoint, { method: 'DELETE' });
  },
};
