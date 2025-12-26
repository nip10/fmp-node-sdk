import ky, { type KyInstance, type Options } from 'ky';
import type { FMPConfig } from './types/common.js';
import type { CacheProvider, EndpointTTLConfig } from './cache/index.js';
import {
  MemoryCache,
  CacheTTL,
  DEFAULT_ENDPOINT_TTLS,
} from './cache/index.js';
import { FMPAPIError } from './errors/index.js';

/**
 * Default configuration values
 */
const DEFAULT_CONFIG = {
  baseUrl: 'https://financialmodelingprep.com/stable',
  timeout: 30000,
  retries: 3,
  cache: {
    enabled: false, // Disabled by default - opt-in
    defaultTTL: CacheTTL.MEDIUM, // 5 minutes
    maxSize: 1000,
    useDefaultTTLs: true,
  },
} as const;

/**
 * Generate a cache key from endpoint and parameters
 */
function defaultKeyGenerator(
  endpoint: string,
  params?: Record<string, unknown>
): string {
  if (!params || Object.keys(params).length === 0) {
    return endpoint;
  }
  // Sort keys for consistent cache keys
  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}=${String(params[key])}`)
    .join('&');
  return `${endpoint}?${sortedParams}`;
}

/**
 * Core HTTP client for FMP API requests
 */
export class FMPClient {
  private readonly apiKey: string;
  private readonly client: KyInstance;
  private readonly interceptors?: FMPConfig['interceptors'];
  private readonly cache?: CacheProvider;
  private readonly cacheEnabled: boolean;
  private readonly defaultTTL: number;
  private readonly endpointTTLs: EndpointTTLConfig;
  private readonly cacheKeyGenerator: (
    endpoint: string,
    params?: Record<string, unknown>
  ) => string;

  constructor(config: FMPConfig) {
    if (!config.apiKey || config.apiKey.trim() === '') {
      throw new FMPAPIError('API key is required');
    }

    this.apiKey = config.apiKey;
    this.interceptors = config.interceptors;

    // Initialize cache
    const cacheConfig = config.cache;
    this.cacheEnabled = cacheConfig?.enabled ?? DEFAULT_CONFIG.cache.enabled;
    this.defaultTTL = cacheConfig?.defaultTTL ?? DEFAULT_CONFIG.cache.defaultTTL;
    this.cacheKeyGenerator = cacheConfig?.keyGenerator ?? defaultKeyGenerator;

    // Build endpoint TTL configuration
    const useDefaultTTLs =
      cacheConfig?.useDefaultTTLs ?? DEFAULT_CONFIG.cache.useDefaultTTLs;
    this.endpointTTLs = {
      ...(useDefaultTTLs ? DEFAULT_ENDPOINT_TTLS : {}),
      ...(cacheConfig?.endpointTTL ?? {}),
    };

    if (this.cacheEnabled) {
      this.cache =
        cacheConfig?.provider ??
        new MemoryCache({
          maxSize: cacheConfig?.maxSize ?? DEFAULT_CONFIG.cache.maxSize,
        });
    }

    const baseUrl = config.baseUrl ?? DEFAULT_CONFIG.baseUrl;
    const timeout = config.timeout ?? DEFAULT_CONFIG.timeout;
    const retry = config.retries ?? DEFAULT_CONFIG.retries;

    // Create ky instance with default configuration
    this.client = ky.create({
      prefixUrl: baseUrl,
      timeout,
      retry: {
        limit: retry,
        methods: ['get'],
        statusCodes: [408, 413, 429, 500, 502, 503, 504],
      },
      hooks: {
        beforeRequest: [
          (request) => {
            // Call interceptor before request
            this.interceptors?.onRequest?.(request.url, request);

            // Add API key to all requests
            const url = new URL(request.url);
            url.searchParams.set('apikey', this.apiKey);
            return new Request(url.toString(), request);
          },
        ],
        afterResponse: [
          async (request, _options, response) => {
            // Call interceptor after successful response
            if (response.ok) {
              this.interceptors?.onResponse?.(request.url, response);
              return response;
            }

            // Handle all errors the same way - just pass through the raw response
            const errorText = await response.text().catch(() => '');
            const error = new FMPAPIError(
              errorText || `HTTP ${response.status}: ${response.statusText}`,
              response.status,
              response.statusText
            );
            this.interceptors?.onError?.(request.url, error);
            throw error;
          },
        ],
      },
    });
  }

  /**
   * Get the TTL for a specific endpoint
   * Checks for exact match first, then falls back to default TTL
   */
  private getTTLForEndpoint(endpoint: string): number {
    // Check for exact match
    const ttl = this.endpointTTLs[endpoint];
    if (ttl !== undefined) {
      return ttl;
    }
    // Return default TTL
    return this.defaultTTL;
  }

  /**
   * Make a GET request to the FMP API
   */
  async get<T>(endpoint: string, options?: Options): Promise<T> {
    // Get TTL for this endpoint
    const ttl = this.getTTLForEndpoint(endpoint);

    // Generate cache key
    const searchParams = options?.searchParams as
      | Record<string, unknown>
      | undefined;
    const cacheKey = this.cacheKeyGenerator(endpoint, searchParams);

    // Check cache first (only if TTL > 0 and caching is enabled)
    if (this.cache && this.cacheEnabled && ttl > 0) {
      const cached = await this.cache.get<T>(cacheKey);
      if (cached !== undefined) {
        return cached;
      }
    }

    try {
      const response = await this.client.get(endpoint, options);
      const data = await response.json<T>();

      // Store in cache (only if TTL > 0 and caching is enabled)
      if (this.cache && this.cacheEnabled && ttl > 0) {
        await this.cache.set(cacheKey, data, ttl);
      }

      return data;
    } catch (error) {
      // Re-throw FMP errors as-is
      if (error instanceof FMPAPIError) {
        throw error;
      }

      // Wrap unknown errors and call interceptor
      const wrappedError = new FMPAPIError(
        error instanceof Error ? error.message : 'Unknown error occurred'
      );
      this.interceptors?.onError?.(endpoint, wrappedError);
      throw wrappedError;
    }
  }

  /**
   * Clear the cache
   */
  async clearCache(): Promise<void> {
    if (this.cache) {
      await this.cache.clear();
    }
  }

  /**
   * Delete a specific cache entry by endpoint and params
   */
  async invalidateCache(
    endpoint: string,
    params?: Record<string, unknown>
  ): Promise<boolean> {
    if (!this.cache) {
      return false;
    }
    const cacheKey = this.cacheKeyGenerator(endpoint, params);
    return await this.cache.delete(cacheKey);
  }

  /**
   * Get the cache provider instance (if caching is enabled)
   */
  getCacheProvider(): CacheProvider | undefined {
    return this.cache;
  }
}
