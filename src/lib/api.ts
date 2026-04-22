import axios, {
  type AxiosError,
  type AxiosHeaders,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios';
import toast from 'react-hot-toast';

import { API_URL, APP_URL, TOKEN_KEY, routes } from '@/constants/config';
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

function trimTrailingSlash(value: string): string {
  return value.endsWith('/') ? value.slice(0, -1) : value;
}

/** True in real browsers; false in Node/RSC/SSR (including SSR of client components). */
function isBrowserEnv(): boolean {
  return typeof document !== 'undefined';
}

/**
 * Browser can use relative `/api`; server-side Axios needs an absolute base URL.
 * Prefer explicit server-only origin (set in `.env.production` on the droplet), then public app URL, then localhost.
 */
function ssrApiOrigin(): string {
  const fromEnv = process.env.SSR_API_ORIGIN?.trim();
  if (fromEnv) return trimTrailingSlash(fromEnv);
  const fromApp = trimTrailingSlash(APP_URL);
  if (fromApp) return fromApp;
  return 'http://127.0.0.1';
}

/** Axios `baseURL` for this runtime (absolute on server when `API_URL` is `/api`). */
function axiosRuntimeBaseUrl(): string {
  if (isBrowserEnv()) return API_URL;
  if (!API_URL.startsWith('/')) return API_URL;
  return `${ssrApiOrigin()}${API_URL}`;
}

const AXIOS_RUNTIME_BASE_URL = axiosRuntimeBaseUrl();

// #region agent log
if (!isBrowserEnv()) {
  console.error('[debug-50d2c1][H5] SSR API origin', {
    API_URL,
    APP_URL,
    SSR_API_ORIGIN: process.env.SSR_API_ORIGIN ?? null,
    resolvedOrigin: ssrApiOrigin(),
    AXIOS_RUNTIME_BASE_URL,
  });
}
// #endregion

/** Bare client for refresh — avoids running the main `api` response interceptor. */
const refreshClient = axios.create({
  baseURL: AXIOS_RUNTIME_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

/**
 * Single in-flight refresh so concurrent 401s (multi-tab / parallel requests) do not
 * rotate the refresh cookie twice and invalidate each other.
 */
let refreshAccessTokenPromise: Promise<string> | null = null;

function getRefreshedAccessToken(): Promise<string> {
  if (refreshAccessTokenPromise !== null) {
    return refreshAccessTokenPromise;
  }

  refreshAccessTokenPromise = refreshClient
    .post<ApiResponse<{ accessToken: string }>>('auth/refresh-token')
    .then((res) => {
      const envelope = res.data;
      const token = envelope?.data?.accessToken;
      if (typeof token !== 'string' || token === '') {
        throw new Error('Refresh response missing accessToken');
      }
      persistAccessToken(token);
      return token;
    })
    .finally(() => {
      refreshAccessTokenPromise = null;
    });

  return refreshAccessTokenPromise;
}

export const api: AxiosInstance = axios.create({
  baseURL: AXIOS_RUNTIME_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = readAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // #region agent log
  const reqUrl = config.url ?? '';
  if (typeof reqUrl === 'string' && reqUrl.includes('auth/register') && config.data && typeof config.data === 'object') {
    const d = config.data as Record<string, unknown>;
    const em = typeof d.email === 'string' ? d.email : '';
    const nm = typeof d.name === 'string' ? d.name : '';
    fetch('http://127.0.0.1:7530/ingest/f1827538-6564-4331-b43b-32c165d17185', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '132df5' },
      body: JSON.stringify({
        sessionId: '132df5',
        runId: 'pre-fix',
        hypothesisId: 'H1-H2',
        location: 'api.ts:requestInterceptor',
        message: 'auth/register outgoing body shape',
        data: {
          keys: Object.keys(d),
          nameLen: nm.length,
          nameTrimDiff: nm !== nm.trim(),
          emailLen: em.length,
          emailTrimDiff: em !== em.trim(),
          pwdLen: typeof d.password === 'string' ? d.password.length : null,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
  }
  // #endregion
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

    // #region agent log
    const reqUrl = originalRequest?.url ?? error.config?.url;
    if (typeof reqUrl === 'string' && reqUrl.includes('auth/register')) {
      const errBody = error.response.data;
      fetch('http://127.0.0.1:7530/ingest/f1827538-6564-4331-b43b-32c165d17185', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '132df5' },
        body: JSON.stringify({
          sessionId: '132df5',
          runId: 'pre-fix',
          hypothesisId: 'H1-H3-H4',
          location: 'api.ts:responseInterceptor',
          message: 'auth/register error response',
          data: {
            status,
            message,
            baseURL: error.config?.baseURL,
            url: reqUrl,
            errorsPreview:
              errBody && typeof errBody === 'object' && 'errors' in errBody
                ? JSON.stringify((errBody as { errors?: unknown }).errors).slice(0, 800)
                : null,
          },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
    }
    // #endregion

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
      const newAccess = await getRefreshedAccessToken();
      originalRequest.headers.Authorization = `Bearer ${newAccess}`;
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

/**
 * Normalizes common Axios error payloads into user-facing text.
 */
export function getApiErrorMessage(
  error: unknown,
  fallback = 'Something went wrong. Please try again.'
): string {
  if (!error || typeof error !== 'object') {
    return fallback;
  }

  const axiosErr = error as AxiosError<ApiErrorBody>;
  const status = axiosErr.response?.status;
  const responseMessage = axiosErr.response?.data?.message;

  if (typeof responseMessage === 'string' && responseMessage.trim() !== '') {
    return responseMessage;
  }
  if (status === 401) return 'Session expired. Please sign in again.';
  if (status === 403) return 'You do not have permission to perform this action.';
  if (status === 404) return 'Requested resource was not found.';
  if (status === 429) return 'Too many requests. Please wait and retry.';
  if (status === 503) return 'Service is temporarily unavailable. Please try again shortly.';
  if (axiosErr.response === undefined) {
    return 'Unable to reach the server. Check network/CORS settings and try again.';
  }
  return fallback;
}
