/**
 * Redis Cache Provider Example
 *
 * Production-ready implementation of CacheProvider using Redis.
 * This example uses the 'redis' package (npm install redis).
 *
 * Usage:
 * ```typescript
 * import { FMP } from 'fmp-node-sdk';
 * import { RedisCacheProvider } from './redis-cache-provider';
 *
 * const cacheProvider = new RedisCacheProvider({
 *   url: process.env.REDIS_URL || 'redis://localhost:6379',
 *   keyPrefix: 'fmp:',
 * });
 *
 * await cacheProvider.connect();
 *
 * const fmp = new FMP({
 *   apiKey: process.env.FMP_API_KEY!,
 *   cache: {
 *     enabled: true,
 *     provider: cacheProvider,
 *   },
 * });
 *
 * // Use the SDK - responses will be cached in Redis
 * const profile = await fmp.company.getProfile('AAPL');
 *
 * // Graceful shutdown
 * process.on('SIGTERM', async () => {
 *   await cacheProvider.disconnect();
 * });
 * ```
 */

import type { CacheProvider } from '../src/cache/index.js';

// Type definitions for redis package (v4+)
// In production, these come from: import { createClient } from 'redis';
type RedisClientType = {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  quit(): Promise<string>;
  isOpen: boolean;
  get(key: string): Promise<string | null>;
  set(key: string, value: string, options?: { PX?: number }): Promise<string | null>;
  del(key: string | string[]): Promise<number>;
  exists(key: string | string[]): Promise<number>;
  keys(pattern: string): Promise<string[]>;
  flushDb(): Promise<string>;
  on(event: string, listener: (...args: unknown[]) => void): void;
};

// Placeholder for: import { createClient } from 'redis';
declare function createClient(options: { url: string }): RedisClientType;

/**
 * Redis cache provider configuration
 */
export interface RedisCacheProviderOptions {
  /**
   * Redis connection URL
   * @example 'redis://localhost:6379'
   * @example 'redis://user:password@host:6379'
   * @example 'rediss://host:6379' (TLS)
   */
  url: string;

  /**
   * Key prefix for all cache entries
   * Useful for namespacing in shared Redis instances
   * @default 'fmp:'
   */
  keyPrefix?: string;

  /**
   * Connection timeout in milliseconds
   * @default 5000
   */
  connectTimeout?: number;

  /**
   * Whether to reconnect automatically on connection loss
   * @default true
   */
  autoReconnect?: boolean;

  /**
   * Maximum number of reconnection attempts
   * @default 10
   */
  maxReconnectAttempts?: number;

  /**
   * Callback for connection events
   */
  onConnect?: () => void;

  /**
   * Callback for error events
   */
  onError?: (error: Error) => void;

  /**
   * Callback for reconnection events
   */
  onReconnect?: (attempt: number) => void;
}

/**
 * Cache entry structure stored in Redis
 */
interface CacheEntry<T = unknown> {
  value: T;
  createdAt: number;
  ttl: number;
}

/**
 * Production-ready Redis cache provider for FMP SDK
 *
 * Features:
 * - Automatic reconnection with exponential backoff
 * - Key prefixing for namespace isolation
 * - Graceful error handling
 * - Connection state management
 * - TTL-based expiration using Redis PEXPIRE
 */
export class RedisCacheProvider implements CacheProvider {
  private client: RedisClientType;
  private readonly keyPrefix: string;
  private readonly options: RedisCacheProviderOptions;
  private isConnected = false;
  private reconnectAttempts = 0;

  constructor(options: RedisCacheProviderOptions) {
    this.options = {
      keyPrefix: 'fmp:',
      connectTimeout: 5000,
      autoReconnect: true,
      maxReconnectAttempts: 10,
      ...options,
    };

    this.keyPrefix = this.options.keyPrefix!;

    // Create Redis client
    // In production: import { createClient } from 'redis';
    this.client = createClient({ url: options.url });

    // Set up event handlers
    this.setupEventHandlers();
  }

  /**
   * Set up Redis client event handlers
   */
  private setupEventHandlers(): void {
    this.client.on('connect', () => {
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.options.onConnect?.();
    });

    this.client.on('error', (error: Error) => {
      this.options.onError?.(error);

      if (this.options.autoReconnect && !this.client.isOpen) {
        this.handleReconnect();
      }
    });

    this.client.on('end', () => {
      this.isConnected = false;
    });
  }

  /**
   * Handle automatic reconnection with exponential backoff
   */
  private async handleReconnect(): Promise<void> {
    if (this.reconnectAttempts >= this.options.maxReconnectAttempts!) {
      this.options.onError?.(
        new Error(
          `Failed to reconnect after ${this.options.maxReconnectAttempts} attempts`
        )
      );
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts - 1), 30000);

    this.options.onReconnect?.(this.reconnectAttempts);

    await new Promise((resolve) => setTimeout(resolve, delay));

    try {
      await this.connect();
    } catch {
      // Will trigger another reconnect via error handler
    }
  }

  /**
   * Connect to Redis
   * Must be called before using the cache
   */
  async connect(): Promise<void> {
    if (this.client.isOpen) {
      return;
    }

    await this.client.connect();
    this.isConnected = true;
  }

  /**
   * Disconnect from Redis gracefully
   */
  async disconnect(): Promise<void> {
    if (this.client.isOpen) {
      await this.client.quit();
      this.isConnected = false;
    }
  }

  /**
   * Get prefixed key
   */
  private getKey(key: string): string {
    return `${this.keyPrefix}${key}`;
  }

  /**
   * Get a value from the cache
   */
  async get<T>(key: string): Promise<T | undefined> {
    if (!this.isConnected) {
      return undefined;
    }

    try {
      const data = await this.client.get(this.getKey(key));

      if (!data) {
        return undefined;
      }

      const entry: CacheEntry<T> = JSON.parse(data);

      // Check if expired (Redis should handle this, but double-check)
      if (Date.now() > entry.createdAt + entry.ttl) {
        await this.delete(key);
        return undefined;
      }

      return entry.value;
    } catch (error) {
      // Log error but don't throw - cache miss is acceptable
      this.options.onError?.(error as Error);
      return undefined;
    }
  }

  /**
   * Set a value in the cache
   */
  async set<T>(key: string, value: T, ttl: number): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      const entry: CacheEntry<T> = {
        value,
        createdAt: Date.now(),
        ttl,
      };

      await this.client.set(this.getKey(key), JSON.stringify(entry), {
        PX: ttl, // Set expiration in milliseconds
      });
    } catch (error) {
      // Log error but don't throw - cache write failure is acceptable
      this.options.onError?.(error as Error);
    }
  }

  /**
   * Delete a value from the cache
   */
  async delete(key: string): Promise<boolean> {
    if (!this.isConnected) {
      return false;
    }

    try {
      const result = await this.client.del(this.getKey(key));
      return result > 0;
    } catch (error) {
      this.options.onError?.(error as Error);
      return false;
    }
  }

  /**
   * Clear all FMP cache entries (by prefix)
   * Note: Uses KEYS command which can be slow on large datasets
   * For production with large datasets, consider using SCAN instead
   */
  async clear(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      const keys = await this.client.keys(`${this.keyPrefix}*`);

      if (keys.length > 0) {
        await this.client.del(keys);
      }
    } catch (error) {
      this.options.onError?.(error as Error);
    }
  }

  /**
   * Check if a key exists in the cache
   */
  async has(key: string): Promise<boolean> {
    if (!this.isConnected) {
      return false;
    }

    try {
      const result = await this.client.exists(this.getKey(key));
      return result > 0;
    } catch (error) {
      this.options.onError?.(error as Error);
      return false;
    }
  }

  /**
   * Get connection status
   */
  get connected(): boolean {
    return this.isConnected;
  }
}

// =============================================================================
// Usage Example
// =============================================================================

/*
import { FMP, CacheTTL } from 'fmp-node-sdk';
import { RedisCacheProvider } from './redis-cache-provider';

async function main() {
  // Create Redis cache provider
  const cacheProvider = new RedisCacheProvider({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    keyPrefix: 'fmp:v1:', // Version your cache keys
    onConnect: () => console.log('Redis connected'),
    onError: (err) => console.error('Redis error:', err.message),
    onReconnect: (attempt) => console.log(`Reconnecting... attempt ${attempt}`),
  });

  // Connect to Redis
  await cacheProvider.connect();

  // Create FMP client with Redis caching
  const fmp = new FMP({
    apiKey: process.env.FMP_API_KEY!,
    cache: {
      enabled: true,
      provider: cacheProvider,
      // Optionally customize TTLs
      endpointTTL: {
        // Cache company profiles for 1 week (they rarely change)
        'profile': 7 * 24 * 60 * 60 * 1000,
        // Cache financial statements for 1 day
        'income-statement': CacheTTL.DAY,
        'balance-sheet-statement': CacheTTL.DAY,
        'cash-flow-statement': CacheTTL.DAY,
      },
    },
  });

  // Make API calls - responses will be cached in Redis
  console.log('Fetching AAPL profile (first call - from API)...');
  const profile1 = await fmp.company.getProfile('AAPL');
  console.log(`Company: ${profile1[0]?.companyName}`);

  console.log('Fetching AAPL profile (second call - from cache)...');
  const profile2 = await fmp.company.getProfile('AAPL');
  console.log(`Company: ${profile2[0]?.companyName}`);

  // Real-time quotes are never cached (TTL = 0 by default)
  console.log('Fetching AAPL quote (always from API)...');
  const quote = await fmp.company.getQuote('AAPL');
  console.log(`Price: $${quote[0]?.price}`);

  // Clear cache when needed
  // await fmp.clearCache();

  // Graceful shutdown
  await cacheProvider.disconnect();
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Shutting down...');
  process.exit(0);
});

main().catch(console.error);
*/
