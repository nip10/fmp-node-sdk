/**
 * Common types used across the SDK
 */

import type { CacheConfig } from '../cache/index.js';

/**
 * Request/response interceptor hooks for debugging and monitoring
 */
export interface RequestInterceptor {
  /**
   * Called before each request is sent
   * @param url - The request URL
   * @param options - Request options
   */
  onRequest?: (url: string, options: RequestInit) => void;

  /**
   * Called after a successful response is received
   * @param url - The request URL
   * @param response - The Response object
   */
  onResponse?: (url: string, response: Response) => void;

  /**
   * Called when a request fails
   * @param url - The request URL
   * @param error - The error that occurred
   */
  onError?: (url: string, error: Error) => void;
}

/**
 * FMP client configuration options
 */
export interface FMPConfig {
  /**
   * Your Financial Modeling Prep API key
   */
  apiKey: string;

  /**
   * Base URL for the FMP API
   * @default "https://financialmodelingprep.com/stable"
   */
  baseUrl?: string;

  /**
   * Request timeout in milliseconds
   * @default 30000
   */
  timeout?: number;

  /**
   * Number of retry attempts for failed requests
   * @default 3
   */
  retries?: number;

  /**
   * Optional request/response interceptors for logging and debugging
   */
  interceptors?: RequestInterceptor;

  /**
   * Cache configuration for response caching
   * Caching is disabled by default - opt-in by setting enabled: true
   *
   * Different endpoints have different default TTLs based on data freshness:
   * - Real-time data (quotes, forex, crypto): NO CACHE
   * - Market movers (gainers, losers): 1 minute
   * - News, analyst data: 1 hour
   * - Company profiles, financial statements: 24 hours
   *
   * @example Enable caching with defaults
   * ```typescript
   * const fmp = new FMP({
   *   apiKey: 'your-api-key',
   *   cache: { enabled: true }
   * });
   * ```
   *
   * @example Custom per-endpoint TTLs
   * ```typescript
   * import { CacheTTL } from 'fmp-node-sdk';
   *
   * const fmp = new FMP({
   *   apiKey: 'your-api-key',
   *   cache: {
   *     enabled: true,
   *     endpointTTL: {
   *       'profile': CacheTTL.DAY,      // 24 hours for profiles
   *       'quote': CacheTTL.NONE,       // Never cache quotes
   *       'news': CacheTTL.LONG,        // 1 hour for news
   *     }
   *   }
   * });
   * ```
   *
   * @example Custom cache provider (e.g., Redis)
   * ```typescript
   * const fmp = new FMP({
   *   apiKey: 'your-api-key',
   *   cache: {
   *     enabled: true,
   *     provider: new RedisCacheProvider(redisClient)
   *   }
   * });
   * ```
   */
  cache?: CacheConfig;
}

/**
 * Common financial period types
 */
export enum Period {
  Annual = 'annual',
  Quarter = 'quarter',
}

/**
 * Stock exchanges
 */
export enum Exchange {
  NYSE = 'NYSE',
  NASDAQ = 'NASDAQ',
  AMEX = 'AMEX',
  EURONEXT = 'EURONEXT',
  TSX = 'TSX',
  LSE = 'LSE',
  ETF = 'ETF',
  MUTUAL_FUND = 'MUTUAL_FUND',
}

/**
 * Common date range parameters
 */
export interface DateRange {
  from?: string;
  to?: string;
}

/**
 * Common pagination parameters
 */
export interface Pagination {
  limit?: number;
  page?: number;
}

/**
 * API response wrapper for error handling
 */
export interface APIResponse<T> {
  data: T;
  error?: {
    message: string;
    status: number;
  };
}
