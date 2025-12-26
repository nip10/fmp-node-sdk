/**
 * Cache types and interfaces
 */

/**
 * Cached item with value and metadata
 */
export interface CacheEntry<T = unknown> {
  /** The cached value */
  value: T;
  /** Timestamp when the entry was created (ms since epoch) */
  createdAt: number;
  /** TTL in milliseconds for this specific entry */
  ttl: number;
}

/**
 * Cache provider interface - implement this for custom cache backends
 *
 * @example Redis implementation
 * ```typescript
 * import { createClient } from 'redis';
 * import type { CacheProvider } from 'fmp-node-sdk';
 *
 * class RedisCacheProvider implements CacheProvider {
 *   private client;
 *
 *   constructor(redisUrl: string) {
 *     this.client = createClient({ url: redisUrl });
 *   }
 *
 *   async get<T>(key: string): Promise<T | undefined> {
 *     const data = await this.client.get(key);
 *     if (!data) return undefined;
 *     const entry = JSON.parse(data);
 *     if (Date.now() > entry.createdAt + entry.ttl) {
 *       await this.delete(key);
 *       return undefined;
 *     }
 *     return entry.value;
 *   }
 *
 *   async set<T>(key: string, value: T, ttl: number): Promise<void> {
 *     const entry = { value, createdAt: Date.now(), ttl };
 *     await this.client.set(key, JSON.stringify(entry), { PX: ttl });
 *   }
 *
 *   async delete(key: string): Promise<boolean> {
 *     const result = await this.client.del(key);
 *     return result > 0;
 *   }
 *
 *   async clear(): Promise<void> {
 *     await this.client.flushDb();
 *   }
 *
 *   async has(key: string): Promise<boolean> {
 *     return (await this.client.exists(key)) > 0;
 *   }
 * }
 * ```
 */
export interface CacheProvider {
  /**
   * Get a value from the cache
   * @param key - Cache key
   * @returns The cached value or undefined if not found/expired
   */
  get<T>(key: string): Promise<T | undefined> | T | undefined;

  /**
   * Set a value in the cache
   * @param key - Cache key
   * @param value - Value to cache
   * @param ttl - Time to live in milliseconds
   */
  set<T>(key: string, value: T, ttl: number): Promise<void> | void;

  /**
   * Delete a value from the cache
   * @param key - Cache key
   * @returns true if the key existed and was deleted
   */
  delete(key: string): Promise<boolean> | boolean;

  /**
   * Clear all entries from the cache
   */
  clear(): Promise<void> | void;

  /**
   * Check if a key exists in the cache
   * @param key - Cache key
   * @returns true if the key exists and is not expired
   */
  has(key: string): Promise<boolean> | boolean;
}

/**
 * TTL presets for different data freshness requirements
 */
export const CacheTTL = {
  /** No caching - for real-time data */
  NONE: 0,
  /** 1 minute - for frequently changing data */
  SHORT: 60 * 1000,
  /** 5 minutes - default for most endpoints */
  MEDIUM: 5 * 60 * 1000,
  /** 1 hour - for semi-static data */
  LONG: 60 * 60 * 1000,
  /** 24 hours - for static/historical data */
  DAY: 24 * 60 * 60 * 1000,
} as const;

/**
 * Per-endpoint TTL configuration
 * Use endpoint patterns or specific endpoints as keys
 * Supports wildcards: "quote*" matches "quote", "quote-short", etc.
 */
export type EndpointTTLConfig = Record<string, number>;

/**
 * Default TTL configuration by endpoint category
 *
 * Categories:
 * - NO_CACHE (0ms): Real-time quotes, intraday data, aftermarket data
 * - SHORT (1min): Live market data
 * - MEDIUM (5min): Default for most endpoints
 * - LONG (1hr): News, analyst data, performance data
 * - DAY (24hr): Company profiles, financial statements, SEC filings, historical data
 */
export const DEFAULT_ENDPOINT_TTLS: EndpointTTLConfig = {
  // Real-time data - NO CACHE
  'quote': CacheTTL.NONE,
  'quote-short': CacheTTL.NONE,
  'batch-quote': CacheTTL.NONE,
  'aftermarket-quote': CacheTTL.NONE,
  'aftermarket-trade': CacheTTL.NONE,
  'batch-aftermarket-quote': CacheTTL.NONE,
  'pre-post-market-quote': CacheTTL.NONE,
  'forex': CacheTTL.NONE,
  'crypto': CacheTTL.NONE,
  'batch-forex-quotes': CacheTTL.NONE,
  'batch-crypto-quotes': CacheTTL.NONE,

  // Intraday data - NO CACHE
  'historical-chart': CacheTTL.NONE, // Intraday charts

  // Short TTL (1 min) - Frequently updating market data
  'stock-price-change': CacheTTL.SHORT,
  'sector-performance': CacheTTL.SHORT,
  'gainers': CacheTTL.SHORT,
  'losers': CacheTTL.SHORT,
  'most-active': CacheTTL.SHORT,

  // Long TTL (1 hour) - Semi-static data
  'news': CacheTTL.LONG,
  'stock-news': CacheTTL.LONG,
  'press-releases': CacheTTL.LONG,
  'analyst-estimates': CacheTTL.LONG,
  'price-target': CacheTTL.LONG,
  'price-target-summary': CacheTTL.LONG,
  'analyst-recommendations': CacheTTL.LONG,
  'stock-grade': CacheTTL.LONG,

  // Day TTL (24 hours) - Static/historical data
  'profile': CacheTTL.DAY,
  'profile-cik': CacheTTL.DAY,
  'income-statement': CacheTTL.DAY,
  'balance-sheet-statement': CacheTTL.DAY,
  'cash-flow-statement': CacheTTL.DAY,
  'ratios': CacheTTL.DAY,
  'key-metrics': CacheTTL.DAY,
  'financial-scores': CacheTTL.DAY,
  'financial-growth': CacheTTL.DAY,
  'sec-filings': CacheTTL.DAY,
  'historical-price-eod': CacheTTL.DAY,
  'historical-dividends': CacheTTL.DAY,
  'historical-stock-splits': CacheTTL.DAY,
  'etf-holdings': CacheTTL.DAY,
  'etf-info': CacheTTL.DAY,
  'stock-list': CacheTTL.DAY,
  'etf-list': CacheTTL.DAY,
  'cik-list': CacheTTL.DAY,
  'available-exchanges': CacheTTL.DAY,
  'available-sectors': CacheTTL.DAY,
  'available-industries': CacheTTL.DAY,
  'available-countries': CacheTTL.DAY,
  'key-executives': CacheTTL.DAY,
  'company-notes': CacheTTL.DAY,
  'stock-peers': CacheTTL.DAY,
  'employee-count': CacheTTL.DAY,
  'historical-employee-count': CacheTTL.DAY,
  'esg-ratings': CacheTTL.DAY,
  'esg-benchmark': CacheTTL.DAY,
  'dcf': CacheTTL.DAY,
  'levered-dcf': CacheTTL.DAY,
  'advanced-dcf': CacheTTL.DAY,
  'sic-codes': CacheTTL.DAY,
  'cot-report': CacheTTL.DAY,
  'cot-analysis': CacheTTL.DAY,
};

/**
 * Cache configuration options
 */
export interface CacheConfig {
  /**
   * Enable or disable caching
   * @default false
   */
  enabled?: boolean;

  /**
   * Default TTL (time to live) in milliseconds
   * Used when no endpoint-specific TTL is configured
   * @default 300000 (5 minutes)
   */
  defaultTTL?: number;

  /**
   * Per-endpoint TTL configuration
   * Overrides default TTL for specific endpoints
   * Set to 0 to disable caching for an endpoint
   *
   * @example
   * ```typescript
   * endpointTTL: {
   *   'profile': CacheTTL.DAY,      // Cache profiles for 24 hours
   *   'quote': CacheTTL.NONE,       // Never cache quotes
   *   'news': CacheTTL.LONG,        // Cache news for 1 hour
   * }
   * ```
   */
  endpointTTL?: EndpointTTLConfig;

  /**
   * Use sensible default TTLs for different endpoint categories
   * When true, applies DEFAULT_ENDPOINT_TTLS configuration
   * @default true
   */
  useDefaultTTLs?: boolean;

  /**
   * Cache provider instance
   * If not provided, uses built-in MemoryCache
   */
  provider?: CacheProvider;

  /**
   * Maximum number of entries for the default in-memory cache
   * Only applies when using the built-in MemoryCache
   * @default 1000
   */
  maxSize?: number;

  /**
   * Custom function to generate cache keys
   * @param endpoint - API endpoint
   * @param params - Query parameters
   * @returns Cache key string
   */
  keyGenerator?: (endpoint: string, params?: Record<string, unknown>) => string;
}
