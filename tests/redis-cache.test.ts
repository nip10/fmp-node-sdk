import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RedisCacheProvider } from '../src/cache/redis.js';
import type { RedisClientLike } from '../src/cache/redis.js';

describe('RedisCacheProvider', () => {
  let mockClient: RedisClientLike;
  let provider: RedisCacheProvider;

  beforeEach(() => {
    mockClient = {
      get: vi.fn(),
      set: vi.fn(),
      del: vi.fn(),
      exists: vi.fn(),
      keys: vi.fn(),
    };
    provider = new RedisCacheProvider({ client: mockClient });
  });

  describe('get', () => {
    it('should return cached value', async () => {
      const entry = { v: { data: 'test' }, c: Date.now(), t: 60000 };
      vi.mocked(mockClient.get).mockResolvedValue(JSON.stringify(entry));

      const result = await provider.get('key');

      expect(mockClient.get).toHaveBeenCalledWith('fmp:key');
      expect(result).toEqual({ data: 'test' });
    });

    it('should return undefined for missing key', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(null);

      const result = await provider.get('missing');

      expect(result).toBeUndefined();
    });

    it('should return undefined for expired entry', async () => {
      const entry = { v: { data: 'test' }, c: Date.now() - 10000, t: 1000 };
      vi.mocked(mockClient.get).mockResolvedValue(JSON.stringify(entry));
      vi.mocked(mockClient.del).mockResolvedValue(1);

      const result = await provider.get('expired');

      expect(result).toBeUndefined();
      expect(mockClient.del).toHaveBeenCalledWith('fmp:expired');
    });

    it('should return undefined on error', async () => {
      vi.mocked(mockClient.get).mockRejectedValue(new Error('Connection error'));

      const result = await provider.get('key');

      expect(result).toBeUndefined();
    });
  });

  describe('set', () => {
    it('should store value with TTL', async () => {
      vi.mocked(mockClient.set).mockResolvedValue('OK');

      await provider.set('key', { data: 'test' }, 60000);

      expect(mockClient.set).toHaveBeenCalledWith(
        'fmp:key',
        expect.any(String),
        { PX: 60000, px: 60000 }
      );

      // Verify the stored JSON structure
      const storedValue = vi.mocked(mockClient.set).mock.calls[0][1];
      const parsed = JSON.parse(storedValue);
      expect(parsed.v).toEqual({ data: 'test' });
      expect(parsed.t).toBe(60000);
      expect(parsed.c).toBeDefined();
    });

    it('should not throw on error', async () => {
      vi.mocked(mockClient.set).mockRejectedValue(new Error('Connection error'));

      await expect(provider.set('key', 'value', 1000)).resolves.not.toThrow();
    });
  });

  describe('delete', () => {
    it('should delete key and return true', async () => {
      vi.mocked(mockClient.del).mockResolvedValue(1);

      const result = await provider.delete('key');

      expect(mockClient.del).toHaveBeenCalledWith('fmp:key');
      expect(result).toBe(true);
    });

    it('should return false when key does not exist', async () => {
      vi.mocked(mockClient.del).mockResolvedValue(0);

      const result = await provider.delete('missing');

      expect(result).toBe(false);
    });

    it('should return false on error', async () => {
      vi.mocked(mockClient.del).mockRejectedValue(new Error('Connection error'));

      const result = await provider.delete('key');

      expect(result).toBe(false);
    });
  });

  describe('has', () => {
    it('should return true when key exists', async () => {
      vi.mocked(mockClient.exists).mockResolvedValue(1);

      const result = await provider.has('key');

      expect(mockClient.exists).toHaveBeenCalledWith('fmp:key');
      expect(result).toBe(true);
    });

    it('should return false when key does not exist', async () => {
      vi.mocked(mockClient.exists).mockResolvedValue(0);

      const result = await provider.has('missing');

      expect(result).toBe(false);
    });

    it('should return false on error', async () => {
      vi.mocked(mockClient.exists).mockRejectedValue(
        new Error('Connection error')
      );

      const result = await provider.has('key');

      expect(result).toBe(false);
    });
  });

  describe('clear', () => {
    it('should delete all keys with prefix', async () => {
      vi.mocked(mockClient.keys).mockResolvedValue([
        'fmp:key1',
        'fmp:key2',
        'fmp:key3',
      ]);
      vi.mocked(mockClient.del).mockResolvedValue(3);

      await provider.clear();

      expect(mockClient.keys).toHaveBeenCalledWith('fmp:*');
      expect(mockClient.del).toHaveBeenCalledWith([
        'fmp:key1',
        'fmp:key2',
        'fmp:key3',
      ]);
    });

    it('should not call del when no keys found', async () => {
      vi.mocked(mockClient.keys).mockResolvedValue([]);

      await provider.clear();

      expect(mockClient.del).not.toHaveBeenCalled();
    });

    it('should handle client without keys method', async () => {
      const clientWithoutKeys: RedisClientLike = {
        get: vi.fn(),
        set: vi.fn(),
        del: vi.fn(),
        exists: vi.fn(),
        // No keys method
      };
      const providerWithoutKeys = new RedisCacheProvider({
        client: clientWithoutKeys,
      });

      await expect(providerWithoutKeys.clear()).resolves.not.toThrow();
    });
  });

  describe('keyPrefix', () => {
    it('should use default prefix', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(null);

      await provider.get('test');

      expect(mockClient.get).toHaveBeenCalledWith('fmp:test');
    });

    it('should use custom prefix', async () => {
      const customProvider = new RedisCacheProvider({
        client: mockClient,
        keyPrefix: 'myapp:cache:',
      });
      vi.mocked(mockClient.get).mockResolvedValue(null);

      await customProvider.get('test');

      expect(mockClient.get).toHaveBeenCalledWith('myapp:cache:test');
    });
  });

  describe('integration scenarios', () => {
    it('should work with typical usage pattern', async () => {
      // First call - cache miss
      vi.mocked(mockClient.get).mockResolvedValueOnce(null);
      vi.mocked(mockClient.set).mockResolvedValue('OK');

      const miss = await provider.get('profile:AAPL');
      expect(miss).toBeUndefined();

      // Store the value
      await provider.set('profile:AAPL', { symbol: 'AAPL' }, 86400000);

      // Second call - cache hit
      const entry = {
        v: { symbol: 'AAPL' },
        c: Date.now(),
        t: 86400000,
      };
      vi.mocked(mockClient.get).mockResolvedValueOnce(JSON.stringify(entry));

      const hit = await provider.get('profile:AAPL');
      expect(hit).toEqual({ symbol: 'AAPL' });
    });
  });
});
