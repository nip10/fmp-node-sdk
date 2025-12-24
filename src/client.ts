import ky, { type KyInstance, type Options } from 'ky';
import type { FMPConfig } from './types/common.js';
import { FMPAPIError } from './errors/index.js';

/**
 * Default configuration values
 */
const DEFAULT_CONFIG = {
  baseUrl: 'https://financialmodelingprep.com/api',
  timeout: 30000,
  retries: 3,
} as const;

/**
 * Core HTTP client for FMP API requests
 */
export class FMPClient {
  private readonly apiKey: string;
  private readonly client: KyInstance;
  private readonly interceptors?: FMPConfig['interceptors'];

  constructor(config: FMPConfig) {
    if (!config.apiKey || config.apiKey.trim() === '') {
      throw new FMPAPIError('API key is required');
    }

    this.apiKey = config.apiKey;
    this.interceptors = config.interceptors;

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
   * Make a GET request to the FMP API
   */
  async get<T>(endpoint: string, options?: Options): Promise<T> {
    try {
      const response = await this.client.get(endpoint, options);
      return await response.json<T>();
    } catch (error) {
      // Re-throw FMP errors as-is
      if (error instanceof FMPAPIError) {
        throw error;
      }

      // Wrap unknown errors and call interceptor
      const wrappedError = new FMPAPIError(
        error instanceof Error ? error.message : 'Unknown error occurred',
      );
      this.interceptors?.onError?.(endpoint, wrappedError);
      throw wrappedError;
    }
  }
}
