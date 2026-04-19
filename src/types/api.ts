import type { AxiosRequestConfig } from 'axios';

/**
 * Success envelope returned by the Planora API (Express `ApiResponse` class).
 */
export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

/**
 * Paginated list payload (e.g. `GET /api/events` `data` field).
 */
export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/** Zod-style issue shape often returned in `errors` for validation failures. */
export interface ApiValidationIssue {
  path: string;
  message: string;
  code: string;
}

/**
 * Error JSON from the global Express error handler (`ErrorBody`).
 * `errors` may hold Zod issues, custom arrays, or be omitted.
 */
export interface ApiErrorBody {
  success: false;
  message: string;
  errors?: unknown[] | ApiValidationIssue[];
  stack?: string;
}

export type RequestConfig = AxiosRequestConfig;
