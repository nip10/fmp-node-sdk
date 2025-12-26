import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryCache } from '../src/cache/index.js';
import type { CacheProvider } from '../src/cache/index.js';

describe('MemoryCache', () => {
  let cache: MemoryCache;

  beforeEach(() => {
    cache = new MemoryCache({ maxSize: 100 });
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('set and get', () => {
    it('should store and retrieve a value', () => {
      cache.set('key1', { data: 'value1' }, 60000);
      expect(cache.get('key1')).toEqual({ data: 'value1' });
    });

    it('should return undefined for non-existent key', () => {
      expect(cache.get('nonexistent')).toBeUndefined();
    });

    it('should return undefined for expired entry', () => {
      cache.set('key1', { data: 'value1' }, 1000);
      vi.advanceTimersByTime(1001);
      expect(cache.get('key1')).toBeUndefined();
    });

    it('should not return expired entry before TTL', () => {
      cache.set('key1', { data: 'value1' }, 1000);
      vi.advanceTimersByTime(999);
      expect(cache.get('key1')).toEqual({ data: 'value1' });
    });

    it('should overwrite existing value', () => {
      cache.set('key1', { data: 'value1' }, 60000);
      cache.set('key1', { data: 'value2' }, 60000);
      expect(cache.get('key1')).toEqual({ data: 'value2' });
    });

    it('should store different types of values', () => {
      cache.set('string', 'hello', 60000);
      cache.set('number', 42, 60000);
      cache.set('array', [1, 2, 3], 60000);
      cache.set('object', { nested: { data: true } }, 60000);
      cache.set('null', null, 60000);

      expect(cache.get('string')).toBe('hello');
      expect(cache.get('number')).toBe(42);
      expect(cache.get('array')).toEqual([1, 2, 3]);
      expect(cache.get('object')).toEqual({ nested: { data: true } });
      expect(cache.get('null')).toBeNull();
    });
  });

  describe('has', () => {
    it('should return true for existing key', () => {
      cache.set('key1', 'value1', 60000);
      expect(cache.has('key1')).toBe(true);
    });

    it('should return false for non-existent key', () => {
      expect(cache.has('nonexistent')).toBe(false);
    });

    it('should return false for expired key', () => {
      cache.set('key1', 'value1', 1000);
      vi.advanceTimersByTime(1001);
      expect(cache.has('key1')).toBe(false);
    });
  });

  describe('delete', () => {
    it('should delete existing key', () => {
      cache.set('key1', 'value1', 60000);
      expect(cache.delete('key1')).toBe(true);
      expect(cache.get('key1')).toBeUndefined();
    });

    it('should return false for non-existent key', () => {
      expect(cache.delete('nonexistent')).toBe(false);
    });
  });

  describe('clear', () => {
    it('should remove all entries', () => {
      cache.set('key1', 'value1', 60000);
      cache.set('key2', 'value2', 60000);
      cache.set('key3', 'value3', 60000);

      cache.clear();

      expect(cache.get('key1')).toBeUndefined();
      expect(cache.get('key2')).toBeUndefined();
      expect(cache.get('key3')).toBeUndefined();
      expect(cache.size).toBe(0);
    });
  });

  describe('size', () => {
    it('should return correct size', () => {
      expect(cache.size).toBe(0);
      cache.set('key1', 'value1', 60000);
      expect(cache.size).toBe(1);
      cache.set('key2', 'value2', 60000);
      expect(cache.size).toBe(2);
    });

    it('should not count expired entries after access', () => {
      cache.set('key1', 'value1', 1000);
      cache.set('key2', 'value2', 60000);
      vi.advanceTimersByTime(1001);

      // Access to trigger cleanup
      cache.get('key1');
      expect(cache.size).toBe(1);
    });
  });

  describe('LRU eviction', () => {
    it('should evict oldest entry when maxSize is reached', () => {
      const smallCache = new MemoryCache({ maxSize: 3 });

      smallCache.set('key1', 'value1', 60000);
      smallCache.set('key2', 'value2', 60000);
      smallCache.set('key3', 'value3', 60000);

      // Adding a 4th entry should evict key1
      smallCache.set('key4', 'value4', 60000);

      expect(smallCache.get('key1')).toBeUndefined();
      expect(smallCache.get('key2')).toBe('value2');
      expect(smallCache.get('key3')).toBe('value3');
      expect(smallCache.get('key4')).toBe('value4');
    });

    it('should update LRU order on get', () => {
      const smallCache = new MemoryCache({ maxSize: 3 });

      smallCache.set('key1', 'value1', 60000);
      smallCache.set('key2', 'value2', 60000);
      smallCache.set('key3', 'value3', 60000);

      // Access key1 to make it most recently used
      smallCache.get('key1');

      // Add key4, should evict key2 (now oldest)
      smallCache.set('key4', 'value4', 60000);

      expect(smallCache.get('key1')).toBe('value1');
      expect(smallCache.get('key2')).toBeUndefined();
      expect(smallCache.get('key3')).toBe('value3');
      expect(smallCache.get('key4')).toBe('value4');
    });
  });

  describe('stats', () => {
    it('should return correct stats', () => {
      cache.set('key1', 'value1', 60000);
      cache.set('key2', 'value2', 60000);

      const stats = cache.stats();
      expect(stats.size).toBe(2);
      expect(stats.maxSize).toBe(100);
    });
  });

  describe('prune', () => {
    it('should remove all expired entries', () => {
      cache.set('key1', 'value1', 1000);
      cache.set('key2', 'value2', 2000);
      cache.set('key3', 'value3', 60000);

      vi.advanceTimersByTime(1500);

      const pruned = cache.prune();
      expect(pruned).toBe(1);
      expect(cache.size).toBe(2);
      expect(cache.get('key1')).toBeUndefined();
      expect(cache.get('key2')).toBe('value2');
      expect(cache.get('key3')).toBe('value3');
    });

    it('should return 0 when no expired entries', () => {
      cache.set('key1', 'value1', 60000);
      cache.set('key2', 'value2', 60000);

      const pruned = cache.prune();
      expect(pruned).toBe(0);
      expect(cache.size).toBe(2);
    });
  });

  describe('default maxSize', () => {
    it('should use default maxSize of 1000', () => {
      const defaultCache = new MemoryCache();
      const stats = defaultCache.stats();
      expect(stats.maxSize).toBe(1000);
    });
  });
});

describe('CacheProvider interface', () => {
  it('should allow custom cache implementations', async () => {
    // Mock custom cache provider (simulating Redis-like behavior)
    const customCache: CacheProvider = {
      storage: new Map<string, { value: unknown; expiresAt: number }>(),

      async get<T>(key: string): Promise<T | undefined> {
        const entry = this.storage.get(key);
        if (!entry) return undefined;
        if (Date.now() > entry.expiresAt) {
          this.storage.delete(key);
          return undefined;
        }
        return entry.value as T;
      },

      async set<T>(key: string, value: T, ttl: number): Promise<void> {
        this.storage.set(key, { value, expiresAt: Date.now() + ttl });
      },

      async delete(key: string): Promise<boolean> {
        return this.storage.delete(key);
      },

      async clear(): Promise<void> {
        this.storage.clear();
      },

      async has(key: string): Promise<boolean> {
        const entry = this.storage.get(key);
        if (!entry) return false;
        if (Date.now() > entry.expiresAt) {
          this.storage.delete(key);
          return false;
        }
        return true;
      },
    } as CacheProvider & { storage: Map<string, { value: unknown; expiresAt: number }> };

    // Test the custom provider
    await customCache.set('test-key', { data: 'test-value' }, 60000);
    expect(await customCache.get('test-key')).toEqual({ data: 'test-value' });
    expect(await customCache.has('test-key')).toBe(true);
    expect(await customCache.delete('test-key')).toBe(true);
    expect(await customCache.get('test-key')).toBeUndefined();
  });
});
