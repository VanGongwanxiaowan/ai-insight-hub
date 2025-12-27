/**
 * API Client with JWT interceptors and error handling
 * Provides a typed HTTP client for backend communication
 */

import type {
  ApiError,
  TokenResponse,
  RefreshTokenResponse,
} from './types';

// ============================================
// Configuration
// ============================================

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Storage keys
const ACCESS_TOKEN_KEY = 'ai_hub_access_token';
const REFRESH_TOKEN_KEY = 'ai_hub_refresh_token';
const USER_KEY = 'ai_hub_user';

// ============================================
// Token Management
// ============================================

export const tokenManager = {
  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },

  clearTokens(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getUser(): string | null {
    return localStorage.getItem(USER_KEY);
  },

  setUser(user: string): void {
    localStorage.setItem(USER_KEY, user);
  },
};

// ============================================
// API Error Class
// ============================================

export class ApiRequestError extends Error {
  public readonly status: number;
  public readonly detail: string;
  public readonly code?: string;

  constructor(message: string, status: number, detail?: string, code?: string) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
    this.detail = detail || message;
    this.code = code;
  }

  static async fromResponse(response: Response): Promise<ApiRequestError> {
    let detail: string;
    let code: string | undefined;

    try {
      const error: ApiError = await response.json();
      detail = error.detail || error.error || 'An error occurred';
      code = error.code;
    } catch {
      detail = `HTTP ${response.status}: ${response.statusText}`;
    }

    return new ApiRequestError(
      detail,
      response.status,
      detail,
      code
    );
  }
}

// ============================================
// HTTP Client with Interceptors
// ============================================

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

function subscribeTokenRefresh(callback: (token: string) => void): void {
  refreshSubscribers.push(callback);
}

function onTokenRefreshed(token: string): void {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}

/**
 * Make an API request with automatic token refresh
 */
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  // Get access token
  let accessToken = tokenManager.getAccessToken();

  // Add Authorization header if token exists
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  let response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle 401 Unauthorized - try to refresh token
  if (response.status === 401 && accessToken) {
    if (!isRefreshing) {
      isRefreshing = true;

      try {
        const refreshToken = tokenManager.getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Refresh the token
        const refreshResponse = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });

        if (!refreshResponse.ok) {
          throw new Error('Token refresh failed');
        }

        const data: RefreshTokenResponse = await refreshResponse.json();

        // Save new tokens
        tokenManager.setTokens(data.access_token, refreshToken);
        accessToken = data.access_token;

        // Retry original request with new token
        headers['Authorization'] = `Bearer ${accessToken}`;
        response = await fetch(url, {
          ...options,
          headers,
        });

        // Notify waiting requests
        onTokenRefreshed(accessToken);
      } catch (error) {
        // Refresh failed - clear tokens and redirect to login
        tokenManager.clearTokens();
        window.location.href = '/auth/login';
        throw new ApiRequestError(
          'Session expired. Please log in again.',
          401
        );
      } finally {
        isRefreshing = false;
      }
    } else {
      // Wait for token refresh to complete
      await new Promise<void>((resolve) => {
        subscribeTokenRefresh((token) => {
          headers['Authorization'] = `Bearer ${token}`;
          resolve();
        });
      });

      // Retry request
      response = await fetch(url, {
        ...options,
        headers,
      });
    }
  }

  // Handle response errors
  if (!response.ok) {
    throw await ApiRequestError.fromResponse(response);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

// ============================================
// Typed API Methods
// ============================================

export const api = {
  /**
   * GET request
   */
  async get<T>(endpoint: string, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
    const queryString = params
      ? '?' + new URLSearchParams(
          Object.entries(params)
            .filter(([_, value]) => value !== undefined)
            .map(([key, value]) => [key, String(value)])
        ).toString()
      : '';
    return request<T>(`${endpoint}${queryString}`, { method: 'GET' });
  },

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<T> {
    return request<T>(endpoint, { method: 'DELETE' });
  },
};

// ============================================
// SSE (Server-Sent Events) for streaming
// ============================================

export interface SSEOptions {
  onMessage: (data: string) => void;
  onError?: (error: Error) => void;
  onClose?: () => void;
  onOpen?: () => void;
}

/**
 * Connect to SSE endpoint for streaming responses
 */
export function connectSSE(
  endpoint: string,
  options: SSEOptions
): () => void {
  const accessToken = tokenManager.getAccessToken();
  const url = new URL(`${API_BASE_URL}${endpoint}`);

  if (accessToken) {
    url.searchParams.set('access_token', accessToken);
  }

  const eventSource = new EventSource(url.toString());

  eventSource.onopen = () => {
    options.onOpen?.();
  };

  eventSource.onmessage = (event) => {
    options.onMessage(event.data);
  };

  eventSource.onerror = (error) => {
    options.onError?.(new Error('SSE connection error'));
    eventSource.close();
  };

  // Return cleanup function
  return () => {
    eventSource.close();
  };
}

/**
 * Stream fetch for AI chat responses
 */
export async function streamChat(
  endpoint: string,
  data: unknown,
  onChunk: (chunk: string) => void,
  signal?: AbortSignal
): Promise<void> {
  const accessToken = tokenManager.getAccessToken();

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify(data),
    signal,
  });

  if (!response.ok) {
    throw await ApiRequestError.fromResponse(response);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('Response body is not readable');
  }

  const decoder = new TextDecoder();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      onChunk(chunk);
    }
  } finally {
    reader.releaseLock();
  }
}

// ============================================
// Export utilities
// ============================================

export { API_BASE_URL };
