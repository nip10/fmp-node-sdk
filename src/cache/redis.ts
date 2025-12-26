/**
 * Redis-compatible cache provider
 *
 * Works with any Redis-compatible client including:
 * - redis (node-redis)
 * - ioredis
 * - @upstash/redis
 * - Vercel KV
 * - AWS ElastiCache
 * - Azure Cache for Redis
 * - KeyDB, DragonflyDB, etc.
 */

import type { CacheProvider } from './types.js';

/**
 * Minimal Redis client interface
 * Compatible with most Redis clients (redis, ioredis, upstash, etc.)
 */
export interface RedisClientLike {
  /** Get a value by key */
  get(key: string): Promise<string | null>;
  /** Set a value with optional expiration */
  set(
    key: string,
    value: string,
    options?: { PX?: number } | { px?: number }
  ): Promise<unknown>;
  /** Delete one or more keys */
  del(key: string | string[]): Promise<number>;
  /** Check if key(s) exist */
  exists(key: string | string[]): Promise<number>;
  /** Get keys matching pattern (optional - only needed for clear()) */
  keys?(pattern: string): Promise<string[]>;
}

/**
 * Redis cache provider configuration
 */
export interface RedisCacheProviderOptions {
  /**
   * Redis-compatible client instance
   * Must implement: get, set, del, exists
   * Optional: keys (for clear() support)
   */
  client: RedisClientLike;

  /**
   * Key prefix for all cache entries
   * Useful for namespacing in shared Redis instances
   * @default 'fmp:'
   */
  keyPrefix?: string;
}

/**
 * Cache entry structure stored in Redis
 */
interface CacheEntry<T = unknown> {
  /** Cached value */
  v: T;
  /** Created at timestamp */
  c: number;
  /** TTL in milliseconds */
  t: number;
}

/**
 * Redis-compatible cache provider for FMP SDK
 *
 * Works with any client that implements the RedisClientLike interface.
 * Handles serialization, TTL, and key prefixing automatically.
 *
 * @example Using node-redis
 * ```typescript
 * import { createClient } from 'redis';
 * import { FMP, RedisCacheProvider } from 'fmp-node-sdk';
 *
 * const redisClient = createClient({ url: 'redis://localhost:6379' });
 * await redisClient.connect();
 *
 * const fmp = new FMP({
 *   apiKey: 'your-api-key',
 *   cache: {
 *     enabled: true,
 *     provider: new RedisCacheProvider({ client: redisClient }),
 *   },
 * });
 * ```
 *
 * @example Using ioredis
 * ```typescript
 * import Redis from 'ioredis';
 * import { FMP, RedisCacheProvider } from 'fmp-node-sdk';
 *
 * const redisClient = new Redis('redis://localhost:6379');
 *
 * const fmp = new FMP({
 *   apiKey: 'your-api-key',
 *   cache: {
 *     enabled: true,
 *     provider: new RedisCacheProvider({ client: redisClient }),
 *   },
 * });
 * ```
 *
 * @example Using Upstash
 * ```typescript
 * import { Redis } from '@upstash/redis';
 * import { FMP, RedisCacheProvider } from 'fmp-node-sdk';
 *
 * const redisClient = new Redis({
 *   url: process.env.UPSTASH_REDIS_REST_URL,
 *   token: process.env.UPSTASH_REDIS_REST_TOKEN,
 * });
 *
 * const fmp = new FMP({
 *   apiKey: 'your-api-key',
 *   cache: {
 *     enabled: true,
 *     provider: new RedisCacheProvider({ client: redisClient }),
 *   },
 * });
 * ```
 */
export class RedisCacheProvider implements CacheProvider {
  private readonly client: RedisClientLike;
  private readonly keyPrefix: string;

  constructor(options: RedisCacheProviderOptions) {
    this.client = options.client;
    this.keyPrefix = options.keyPrefix ?? 'fmp:';
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
    try {
      const data = await this.client.get(this.getKey(key));

      if (!data) {
        return undefined;
      }

      const entry = JSON.parse(data) as CacheEntry<T>;

      // Double-check expiration (Redis should handle this via PX)
      if (Date.now() > entry.c + entry.t) {
        await this.delete(key);
        return undefined;
      }

      return entry.v;
    } catch {
      // Cache miss on error - don't break the application
      return undefined;
    }
  }

  /**
   * Set a value in the cache
   */
  async set<T>(key: string, value: T, ttl: number): Promise<void> {
    try {
      const entry: CacheEntry<T> = {
        v: value,
        c: Date.now(),
        t: ttl,
      };

      // Support both { PX: ttl } (node-redis) and { px: ttl } (ioredis)
      await this.client.set(this.getKey(key), JSON.stringify(entry), {
        PX: ttl,
        px: ttl,
      } as { PX?: number; px?: number });
    } catch {
      // Silently fail - cache write errors shouldn't break the application
    }
  }

  /**
   * Delete a value from the cache
   */
  async delete(key: string): Promise<boolean> {
    try {
      const result = await this.client.del(this.getKey(key));
      return result > 0;
    } catch {
      return false;
    }
  }

  /**
   * Clear all FMP cache entries (by prefix)
   *
   * Note: Requires the client to support the `keys` command.
   * Some serverless Redis providers may not support this.
   */
  async clear(): Promise<void> {
    try {
      if (!this.client.keys) {
        // Client doesn't support keys command
        return;
      }

      const keys = await this.client.keys(`${this.keyPrefix}*`);

      if (keys.length > 0) {
        await this.client.del(keys);
      }
    } catch {
      // Silently fail
    }
  }

  /**
   * Check if a key exists in the cache
   */
  async has(key: string): Promise<boolean> {
    try {
      const result = await this.client.exists(this.getKey(key));
      return result > 0;
    } catch {
      return false;
    }
  }
}
