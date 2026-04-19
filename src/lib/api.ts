import axios, {
  type AxiosError,
  type AxiosHeaders,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios';
import toast from 'react-hot-toast';

import { API_URL, TOKEN_KEY, routes } from '@/constants/config';
import type { ApiErrorBody, ApiResponse } from '@/types/api';

/** `react-hot-toast` is client-only; avoid calling it during RSC / SSR fetches. */
function notifyError(message: string): void {
  if (typeof window !== 'undefined') {
    toast.error(message);
  }
}

declare module 'axios' {
  export interface AxiosRequestConfig {
    /** Prevents infinite retry when refreshing the access token. */
    _retry?: boolean;
  }
}

function getAuthorizationHeader(config: InternalAxiosRequestConfig): string | undefined {
  const headers = config.headers;
  if (!headers) return undefined;
  if (typeof (headers as AxiosHeaders).get === 'function') {
    const value = (headers as AxiosHeaders).get('Authorization');
    return typeof value === 'string' ? value : undefined;
  }
  const record = headers as Record<string, string | undefined>;
  return record['Authorization'] ?? record['authorization'];
}

function readAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

function persistAccessToken(token: string): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(TOKEN_KEY, token);
}

function clearSession(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(TOKEN_KEY);
}

/** Bare client for refresh — avoids running the main `api` response interceptor. */
const refreshClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

export const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = readAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  async (error: AxiosError<ApiErrorBody>) => {
    const originalRequest = error.config;

    if (!error.response) {
      notifyError('Network error. Check your connection and try again.');
      if (process.env.NODE_ENV === 'development') {
        console.error('[api] network error', error);
      }
      return Promise.reject(error);
    }

    const status = error.response.status;
    const message = error.response.data?.message ?? error.message ?? 'Something went wrong';

    if (status !== 401 || !originalRequest) {
      // Rate limits / transient overload: avoid toast spam (many layouts mount together in dev).
      if (status === 429 || status === 503) {
        if (process.env.NODE_ENV === 'development') {
          console.warn(`[api] ${status} ${originalRequest?.url ?? ''}`, message);
        }
      } else {
        notifyError(message);
      }
      return Promise.reject(error);
    }

    if (originalRequest.url?.includes('auth/refresh-token')) {
      clearSession();
      notifyError('Session expired. Please sign in again.');
      if (typeof window !== 'undefined') {
        window.location.assign(routes.login);
      }
      return Promise.reject(error);
    }

    const hadAuth = Boolean(getAuthorizationHeader(originalRequest));
    if (!hadAuth || originalRequest._retry) {
      notifyError(message);
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const refreshResponse =
        await refreshClient.post<ApiResponse<{ accessToken: string }>>('auth/refresh-token');
      const envelope = refreshResponse.data;
      persistAccessToken(envelope.data.accessToken);
      originalRequest.headers.Authorization = `Bearer ${envelope.data.accessToken}`;
      return api.request(originalRequest);
    } catch (refreshError) {
      clearSession();
      notifyError('Session expired. Please sign in again.');
      if (typeof window !== 'undefined') {
        window.location.assign(routes.login);
      }
      return Promise.reject(refreshError);
    }
  }
);

/**
 * Narrows a successful API envelope to its `data` field.
 */
export function unwrapApiData<T>(response: ApiResponse<T>): T {
  return response.data;
}
