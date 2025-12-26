/**
 * Redis Cache Examples
 *
 * The FMP SDK includes a RedisCacheProvider that works with any
 * Redis-compatible client. Just pass your client instance.
 *
 * Compatible with:
 * - redis (node-redis)
 * - ioredis
 * - @upstash/redis
 * - Vercel KV (@vercel/kv)
 * - AWS ElastiCache
 * - Azure Cache for Redis
 * - KeyDB, DragonflyDB, etc.
 */

import { FMP, RedisCacheProvider, CacheTTL } from 'fmp-node-sdk';

// =============================================================================
// Example 1: Using node-redis
// =============================================================================

/*
import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

await redisClient.connect();

const fmp = new FMP({
  apiKey: process.env.FMP_API_KEY!,
  cache: {
    enabled: true,
    provider: new RedisCacheProvider({
      client: redisClient,
      keyPrefix: 'fmp:v1:', // Optional: namespace your keys
    }),
  },
});
*/

// =============================================================================
// Example 2: Using ioredis
// =============================================================================

/*
import Redis from 'ioredis';

const redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

const fmp = new FMP({
  apiKey: process.env.FMP_API_KEY!,
  cache: {
    enabled: true,
    provider: new RedisCacheProvider({ client: redisClient }),
  },
});
*/

// =============================================================================
// Example 3: Using Upstash (serverless Redis)
// =============================================================================

/*
import { Redis } from '@upstash/redis';

const redisClient = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const fmp = new FMP({
  apiKey: process.env.FMP_API_KEY!,
  cache: {
    enabled: true,
    provider: new RedisCacheProvider({ client: redisClient }),
  },
});
*/

// =============================================================================
// Example 4: Using Vercel KV
// =============================================================================

/*
import { kv } from '@vercel/kv';

const fmp = new FMP({
  apiKey: process.env.FMP_API_KEY!,
  cache: {
    enabled: true,
    provider: new RedisCacheProvider({ client: kv }),
  },
});
*/

// =============================================================================
// Example 5: Custom TTLs for specific use cases
// =============================================================================

/*
const fmp = new FMP({
  apiKey: process.env.FMP_API_KEY!,
  cache: {
    enabled: true,
    provider: new RedisCacheProvider({ client: redisClient }),
    // Override default TTLs for your use case
    endpointTTL: {
      // Static data - cache for a week
      'profile': 7 * CacheTTL.DAY,
      'stock-list': 7 * CacheTTL.DAY,
      'etf-list': 7 * CacheTTL.DAY,

      // Financial statements - cache for a day (updated quarterly)
      'income-statement': CacheTTL.DAY,
      'balance-sheet-statement': CacheTTL.DAY,
      'cash-flow-statement': CacheTTL.DAY,

      // Force cache real-time quotes (if you don't need real-time)
      'quote': CacheTTL.SHORT, // 1 minute

      // Never cache certain endpoints
      'earnings-calendar': CacheTTL.NONE,
    },
  },
});

// Usage
const profile = await fmp.company.getProfile('AAPL'); // Cached for 1 week
const quote = await fmp.company.getQuote('AAPL');     // Cached for 1 minute
const earnings = await fmp.events.getEarningsCalendar(); // Never cached

// Clear all cached data when needed
await fmp.clearCache();
*/

// =============================================================================
// Example 6: Production setup with error handling
// =============================================================================

/*
import { createClient } from 'redis';

async function createFMPClient() {
  const redisClient = createClient({
    url: process.env.REDIS_URL,
    socket: {
      connectTimeout: 5000,
      reconnectStrategy: (retries) => {
        if (retries > 10) return new Error('Max retries reached');
        return Math.min(retries * 100, 3000);
      },
    },
  });

  redisClient.on('error', (err) => console.error('Redis error:', err));
  redisClient.on('reconnecting', () => console.log('Redis reconnecting...'));

  await redisClient.connect();

  return new FMP({
    apiKey: process.env.FMP_API_KEY!,
    cache: {
      enabled: true,
      provider: new RedisCacheProvider({
        client: redisClient,
        keyPrefix: `fmp:${process.env.NODE_ENV}:`,
      }),
    },
  });
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  await redisClient.quit();
  process.exit(0);
});
*/

export {};
