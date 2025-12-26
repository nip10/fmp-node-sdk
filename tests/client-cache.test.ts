import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FMPClient } from '../src/client.js';
import { MemoryCache, CacheTTL } from '../src/cache/index.js';
import type { CacheProvider } from '../src/cache/index.js';

// Mock ky
vi.mock('ky', () => {
  const mockResponse = {
    json: vi.fn(),
    ok: true,
  };

  const mockKyInstance = {
    get: vi.fn().mockResolvedValue(mockResponse),
  };

  return {
    default: {
      create: vi.fn(() => mockKyInstance),
    },
    __mockInstance: mockKyInstance,
    __mockResponse: mockResponse,
  };
});

describe('FMPClient Cache Integration', () => {
  let mockKyInstance: { get: ReturnType<typeof vi.fn> };
  let mockResponse: { json: ReturnType<typeof vi.fn>; ok: boolean };

  beforeEach(async () => {
    vi.clearAllMocks();
    const kyMock = await import('ky');
    mockKyInstance = (
      kyMock as unknown as { __mockInstance: typeof mockKyInstance }
    ).__mockInstance;
    mockResponse = (
      kyMock as unknown as { __mockResponse: typeof mockResponse }
    ).__mockResponse;
  });

  describe('cache disabled by default', () => {
    it('should not cache when cache is not explicitly enabled', async () => {
      const mockData = [{ symbol: 'AAPL', price: 150 }];
      mockResponse.json.mockResolvedValue(mockData);

      const client = new FMPClient({ apiKey: 'test-key' });

      await client.get('profile', { searchParams: { symbol: 'AAPL' } });
      await client.get('profile', { searchParams: { symbol: 'AAPL' } });

      // API should be called twice since caching is disabled by default
      expect(mockKyInstance.get).toHaveBeenCalledTimes(2);
    });
  });

  describe('cache enabled', () => {
    it('should cache when enabled', async () => {
      const mockData = [{ symbol: 'AAPL', price: 150 }];
      mockResponse.json.mockResolvedValue(mockData);

      const client = new FMPClient({
        apiKey: 'test-key',
        cache: { enabled: true },
      });

      // First call - should hit the API
      const result1 = await client.get<typeof mockData>('profile', {
        searchParams: { symbol: 'AAPL' },
      });

      // Second call - should return cached result
      const result2 = await client.get<typeof mockData>('profile', {
        searchParams: { symbol: 'AAPL' },
      });

      expect(result1).toEqual(mockData);
      expect(result2).toEqual(mockData);
      // API should only be called once (profile has 24hr TTL by default)
      expect(mockKyInstance.get).toHaveBeenCalledTimes(1);
    });

    it('should cache different endpoints separately', async () => {
      const profileData = [{ symbol: 'AAPL', companyName: 'Apple' }];
      const newsData = [{ title: 'News' }];

      mockResponse.json
        .mockResolvedValueOnce(profileData)
        .mockResolvedValueOnce(newsData);

      const client = new FMPClient({
        apiKey: 'test-key',
        cache: { enabled: true },
      });

      await client.get('profile', { searchParams: { symbol: 'AAPL' } });
      await client.get('news', { searchParams: { symbol: 'AAPL' } });

      expect(mockKyInstance.get).toHaveBeenCalledTimes(2);
    });

    it('should cache different params separately', async () => {
      const aaplData = [{ symbol: 'AAPL', price: 150 }];
      const msftData = [{ symbol: 'MSFT', price: 350 }];

      mockResponse.json
        .mockResolvedValueOnce(aaplData)
        .mockResolvedValueOnce(msftData);

      const client = new FMPClient({
        apiKey: 'test-key',
        cache: { enabled: true },
      });

      await client.get('profile', { searchParams: { symbol: 'AAPL' } });
      await client.get('profile', { searchParams: { symbol: 'MSFT' } });

      expect(mockKyInstance.get).toHaveBeenCalledTimes(2);
    });
  });

  describe('per-endpoint TTL', () => {
    it('should not cache endpoints with TTL of 0 (quotes)', async () => {
      const mockData = [{ symbol: 'AAPL', price: 150 }];
      mockResponse.json.mockResolvedValue(mockData);

      const client = new FMPClient({
        apiKey: 'test-key',
        cache: { enabled: true },
      });

      // Quotes have TTL of 0 by default
      await client.get('quote', { searchParams: { symbol: 'AAPL' } });
      await client.get('quote', { searchParams: { symbol: 'AAPL' } });

      // API should be called twice since quote has no cache
      expect(mockKyInstance.get).toHaveBeenCalledTimes(2);
    });

    it('should cache endpoints with long TTL (profiles)', async () => {
      const mockData = [{ symbol: 'AAPL', companyName: 'Apple' }];
      mockResponse.json.mockResolvedValue(mockData);

      const client = new FMPClient({
        apiKey: 'test-key',
        cache: { enabled: true },
      });

      // Profiles have 24hr TTL by default
      await client.get('profile', { searchParams: { symbol: 'AAPL' } });
      await client.get('profile', { searchParams: { symbol: 'AAPL' } });

      // API should be called once
      expect(mockKyInstance.get).toHaveBeenCalledTimes(1);
    });

    it('should allow custom per-endpoint TTLs', async () => {
      vi.useFakeTimers();

      const mockData = [{ symbol: 'AAPL', price: 150 }];
      mockResponse.json.mockResolvedValue(mockData);

      const client = new FMPClient({
        apiKey: 'test-key',
        cache: {
          enabled: true,
          endpointTTL: {
            'custom-endpoint': 1000, // 1 second TTL
          },
        },
      });

      await client.get('custom-endpoint', { searchParams: { symbol: 'AAPL' } });

      // Still cached
      vi.advanceTimersByTime(500);
      await client.get('custom-endpoint', { searchParams: { symbol: 'AAPL' } });
      expect(mockKyInstance.get).toHaveBeenCalledTimes(1);

      // Cache expired
      vi.advanceTimersByTime(600);
      await client.get('custom-endpoint', { searchParams: { symbol: 'AAPL' } });
      expect(mockKyInstance.get).toHaveBeenCalledTimes(2);

      vi.useRealTimers();
    });

    it('should override default TTLs with custom endpointTTL', async () => {
      const mockData = [{ symbol: 'AAPL', price: 150 }];
      mockResponse.json.mockResolvedValue(mockData);

      const client = new FMPClient({
        apiKey: 'test-key',
        cache: {
          enabled: true,
          endpointTTL: {
            quote: CacheTTL.LONG, // Override quote to have 1hr cache
          },
        },
      });

      await client.get('quote', { searchParams: { symbol: 'AAPL' } });
      await client.get('quote', { searchParams: { symbol: 'AAPL' } });

      // API should be called once now (overridden to cache)
      expect(mockKyInstance.get).toHaveBeenCalledTimes(1);
    });

    it('should disable default TTLs when useDefaultTTLs is false', async () => {
      const mockData = [{ symbol: 'AAPL', companyName: 'Apple' }];
      mockResponse.json.mockResolvedValue(mockData);

      const client = new FMPClient({
        apiKey: 'test-key',
        cache: {
          enabled: true,
          useDefaultTTLs: false,
          defaultTTL: CacheTTL.MEDIUM,
        },
      });

      // With useDefaultTTLs: false, all endpoints use defaultTTL
      await client.get('profile', { searchParams: { symbol: 'AAPL' } });
      await client.get('profile', { searchParams: { symbol: 'AAPL' } });

      expect(mockKyInstance.get).toHaveBeenCalledTimes(1);
    });
  });

  describe('custom cache provider', () => {
    it('should use custom cache provider', async () => {
      const customCache: CacheProvider = {
        get: vi.fn().mockResolvedValue(undefined),
        set: vi.fn(),
        delete: vi.fn(),
        clear: vi.fn(),
        has: vi.fn(),
      };

      const mockData = [{ symbol: 'AAPL', price: 150 }];
      mockResponse.json.mockResolvedValue(mockData);

      const client = new FMPClient({
        apiKey: 'test-key',
        cache: { enabled: true, provider: customCache },
      });

      await client.get('profile', { searchParams: { symbol: 'AAPL' } });

      expect(customCache.get).toHaveBeenCalled();
      expect(customCache.set).toHaveBeenCalled();
    });

    it('should return cached value from custom provider', async () => {
      const cachedData = [{ symbol: 'AAPL', price: 999 }];
      const customCache: CacheProvider = {
        get: vi.fn().mockResolvedValue(cachedData),
        set: vi.fn(),
        delete: vi.fn(),
        clear: vi.fn(),
        has: vi.fn(),
      };

      const client = new FMPClient({
        apiKey: 'test-key',
        cache: { enabled: true, provider: customCache },
      });

      const result = await client.get('profile', {
        searchParams: { symbol: 'AAPL' },
      });

      expect(result).toEqual(cachedData);
      // API should not be called when cache hits
      expect(mockKyInstance.get).not.toHaveBeenCalled();
    });
  });

  describe('custom key generator', () => {
    it('should use custom key generator', async () => {
      const customKeyGen = vi.fn().mockReturnValue('custom-key');
      const mockData = [{ symbol: 'AAPL', price: 150 }];
      mockResponse.json.mockResolvedValue(mockData);

      const client = new FMPClient({
        apiKey: 'test-key',
        cache: { enabled: true, keyGenerator: customKeyGen },
      });

      await client.get('profile', { searchParams: { symbol: 'AAPL' } });

      expect(customKeyGen).toHaveBeenCalledWith('profile', { symbol: 'AAPL' });
    });
  });

  describe('cache management methods', () => {
    it('should clear cache', async () => {
      const mockData = [{ symbol: 'AAPL', price: 150 }];
      mockResponse.json.mockResolvedValue(mockData);

      const client = new FMPClient({
        apiKey: 'test-key',
        cache: { enabled: true },
      });

      await client.get('profile', { searchParams: { symbol: 'AAPL' } });
      await client.clearCache();
      await client.get('profile', { searchParams: { symbol: 'AAPL' } });

      expect(mockKyInstance.get).toHaveBeenCalledTimes(2);
    });

    it('should invalidate specific cache entry', async () => {
      const mockData = [{ symbol: 'AAPL', price: 150 }];
      mockResponse.json.mockResolvedValue(mockData);

      const client = new FMPClient({
        apiKey: 'test-key',
        cache: { enabled: true },
      });

      await client.get('profile', { searchParams: { symbol: 'AAPL' } });
      const invalidated = await client.invalidateCache('profile', {
        symbol: 'AAPL',
      });
      await client.get('profile', { searchParams: { symbol: 'AAPL' } });

      expect(invalidated).toBe(true);
      expect(mockKyInstance.get).toHaveBeenCalledTimes(2);
    });

    it('should return cache provider when enabled', () => {
      const client = new FMPClient({
        apiKey: 'test-key',
        cache: { enabled: true },
      });
      const provider = client.getCacheProvider();

      expect(provider).toBeInstanceOf(MemoryCache);
    });

    it('should return undefined cache provider when disabled', () => {
      const client = new FMPClient({
        apiKey: 'test-key',
        cache: { enabled: false },
      });
      const provider = client.getCacheProvider();

      expect(provider).toBeUndefined();
    });
  });

  describe('cache key generation', () => {
    it('should generate consistent keys for same params', async () => {
      const mockData = [{ symbol: 'AAPL', price: 150 }];
      mockResponse.json.mockResolvedValue(mockData);

      const client = new FMPClient({
        apiKey: 'test-key',
        cache: { enabled: true },
      });

      await client.get('profile', {
        searchParams: { symbol: 'AAPL', limit: 10 },
      });
      await client.get('profile', {
        searchParams: { limit: 10, symbol: 'AAPL' },
      });

      // Same params (different order) should result in same cache key
      expect(mockKyInstance.get).toHaveBeenCalledTimes(1);
    });

    it('should handle endpoint without params', async () => {
      const mockData = [{ symbol: 'AAPL' }];
      mockResponse.json.mockResolvedValue(mockData);

      const client = new FMPClient({
        apiKey: 'test-key',
        cache: { enabled: true },
      });

      await client.get('stock-list');
      await client.get('stock-list');

      expect(mockKyInstance.get).toHaveBeenCalledTimes(1);
    });
  });
});
