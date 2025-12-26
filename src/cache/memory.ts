/**
 * In-memory cache provider with TTL and LRU eviction
 */

import type { CacheEntry, CacheProvider } from './types.js';

/**
 * Default in-memory cache implementation
 *
 * Features:
 * - TTL-based expiration
 * - LRU eviction when maxSize is reached
 * - Synchronous operations for performance
 *
 * @example
 * ```typescript
 * const cache = new MemoryCache({ maxSize: 500 });
 * cache.set('key', { data: 'value' }, 60000);
 * const value = cache.get('key');
 * ```
 */
export class MemoryCache implements CacheProvider {
  private cache: Map<string, CacheEntry>;
  private readonly maxSize: number;

  /**
   * Create a new in-memory cache
   * @param options - Cache options
   * @param options.maxSize - Maximum number of entries (default: 1000)
   */
  constructor(options: { maxSize?: number } = {}) {
    this.cache = new Map();
    this.maxSize = options.maxSize ?? 1000;
  }

  /**
   * Get a value from the cache
   */
  get<T>(key: string): T | undefined {
    const entry = this.cache.get(key);

    if (!entry) {
      return undefined;
    }

    // Check if expired
    if (this.isExpired(entry)) {
      this.cache.delete(key);
      return undefined;
    }

    // Move to end for LRU (most recently used)
    this.cache.delete(key);
    this.cache.set(key, entry);

    return entry.value as T;
  }

  /**
   * Set a value in the cache
   */
  set<T>(key: string, value: T, ttl: number): void {
    // If key exists, delete first to update position
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }

    // Evict oldest entries if at capacity
    while (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }

    const entry: CacheEntry<T> = {
      value,
      createdAt: Date.now(),
      ttl,
    };

    this.cache.set(key, entry);
  }

  /**
   * Delete a value from the cache
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all entries from the cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Check if a key exists and is not expired
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) {
      return false;
    }

    if (this.isExpired(entry)) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Get the current number of entries in the cache
   */
  get size(): number {
    return this.cache.size;
  }

  /**
   * Get cache statistics
   */
  stats(): { size: number; maxSize: number } {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
    };
  }

  /**
   * Remove all expired entries
   * Call periodically if needed for memory management
   */
  prune(): number {
    let pruned = 0;
    for (const [key, entry] of this.cache) {
      if (this.isExpired(entry)) {
        this.cache.delete(key);
        pruned++;
      }
    }
    return pruned;
  }

  /**
   * Check if an entry has expired
   */
  private isExpired(entry: CacheEntry): boolean {
    return Date.now() > entry.createdAt + entry.ttl;
  }
}
