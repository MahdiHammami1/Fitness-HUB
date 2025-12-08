/**
 * API Client Configuration
 * Centralized API client for all backend requests with auth interceptors
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT ? parseInt(import.meta.env.VITE_API_TIMEOUT) : 30000;

interface RequestOptions extends RequestInit {
  timeout?: number;
}

/**
 * Get auth token from localStorage
 */
function getAuthToken(): string | null {
  return localStorage.getItem("authToken");
}

/**
 * Check if token exists and is valid
 */
export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

/**
 * Clear auth token (logout)
 */
export function clearAuthToken(): void {
  localStorage.removeItem("authToken");
  localStorage.removeItem("signupEmail");
  localStorage.removeItem("signupPassword");
  localStorage.removeItem("signupFullName");
}

/**
 * Fetch wrapper with timeout and auth interceptor
 */
async function apiFetch(endpoint: string, options: RequestOptions = {}) {
  const { timeout = API_TIMEOUT, ...fetchOptions } = options;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    // Add auth token to headers if available
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    };

    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...fetchOptions,
      signal: controller.signal,
      headers,
    });

    // Handle 401 Unauthorized - redirect to login
    if (response.status === 401) {
      clearAuthToken();
      window.location.href = '/sign-in';
      throw new Error('Unauthorized. Please sign in again.');
    }

    // Handle 403 Forbidden
    if (response.status === 403) {
      throw new Error('You do not have permission to access this resource.');
    }

    if (!response.ok) {
      // Try to read response body for better error context (may be JSON or plain text)
      const respText = await response.text().catch(() => '');
      let errorMessage = `API Error: ${response.status} ${response.statusText}`;
      try {
        const errorData = JSON.parse(respText);
        if (errorData && errorData.message) errorMessage = String(errorData.message);
      } catch (e) {
        // not JSON, keep respText as additional info
      }
      // Log full response for debugging (trim to avoid huge logs)
      console.error(`API ${response.status} ${response.statusText} at ${endpoint}:`, respText?.slice(0, 2000));
      const bodySnippet = respText ? ` Response body: ${respText.slice(0, 1000)}` : '';
      throw new Error(errorMessage + bodySnippet);
    }

    // Handle empty responses (204 No Content or empty body)
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return null;
    }

    const text = await response.text();
    if (!text) return null;

    try {
      return JSON.parse(text);
    } catch (e) {
      // If parsing fails, log and return null
      console.warn('Failed to parse JSON response from', endpoint, e);
      return null;
    }
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * GET request
 */
export const apiGet = (endpoint: string, options?: RequestOptions) =>
  apiFetch(endpoint, { ...options, method: 'GET' });

/**
 * POST request
 */
export const apiPost = (endpoint: string, data?: any, options?: RequestOptions) =>
  apiFetch(endpoint, {
    ...options,
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });

/**
 * PUT request
 */
export const apiPut = (endpoint: string, data?: any, options?: RequestOptions) =>
  apiFetch(endpoint, {
    ...options,
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });

/**
 * DELETE request
 */
export const apiDelete = (endpoint: string, options?: RequestOptions) =>
  apiFetch(endpoint, { ...options, method: 'DELETE' });

/**
 * PATCH request
 */
export const apiPatch = (endpoint: string, data?: any, options?: RequestOptions) =>
  apiFetch(endpoint, {
    ...options,
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined,
  });

export default apiFetch;
