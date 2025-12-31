/**
 * Common types for Huawei LTE API
 */

/**
 * Generic GET response type
 */
export type GetResponseType<T = unknown> = T;

/**
 * Generic SET response type (usually returns "OK")
 */
export type SetResponseType = string;

/**
 * API Error response structure
 */
export interface ApiError {
  error: {
    code: number | string;
    message?: string;
  };
}

/**
 * API Response wrapper
 */
export interface ApiResponse<T = unknown> {
  response?: T;
  error?: {
    code: number | string;
    message?: string;
  };
}

/**
 * Request options
 */
export interface RequestOptions {
  endpoint: string;
  data?: unknown;
  prefix?: string;
  isEncrypted?: boolean;
  isJson?: boolean;
  refreshCsrf?: boolean;
}

/**
 * Connection configuration
 */
export interface ConnectionConfig {
  url: string;
  username?: string;
  password?: string;
  timeout?: number;
}

/**
 * Session configuration
 */
export interface SessionConfig {
  url: string;
  timeout?: number;
}
