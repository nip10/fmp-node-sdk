---
"fmp-node-sdk": major
---

Add response caching support with flexible configuration

## Features

- **In-memory LRU cache** (default) with configurable max size
- **Built-in Redis provider** - works with any Redis-compatible client:
  - `redis` (node-redis)
  - `ioredis`
  - `@upstash/redis`
  - `@vercel/kv`
  - AWS ElastiCache, Azure Cache, KeyDB, DragonflyDB, etc.
- **Custom cache providers** - implement `CacheProvider` interface
- **Per-endpoint TTL configuration** with sensible defaults:
  - Real-time data (quotes, forex, crypto): No cache
  - Market movers (gainers, losers): 1 minute
  - News, analyst data: 1 hour
  - Company profiles, financial statements: 24 hours
- **Cache management methods**: `clearCache()`, `getCacheProvider()`
- **TTL presets**: `CacheTTL.NONE`, `CacheTTL.SHORT`, `CacheTTL.MEDIUM`, `CacheTTL.LONG`, `CacheTTL.DAY`

## Breaking Changes

- Cache configuration uses `defaultTTL` instead of `ttl`
- Cache is disabled by default (opt-in with `enabled: true`)

## Usage

```typescript
import { FMP, RedisCacheProvider, CacheTTL } from 'fmp-node-sdk';

// In-memory cache (default)
const fmp = new FMP({
  apiKey: 'your-api-key',
  cache: { enabled: true }
});

// Redis cache (works with any Redis-compatible client)
import { createClient } from 'redis';
const redisClient = createClient({ url: 'redis://localhost:6379' });
await redisClient.connect();

const fmp = new FMP({
  apiKey: 'your-api-key',
  cache: {
    enabled: true,
    provider: new RedisCacheProvider({ client: redisClient }),
  }
});

// Custom per-endpoint TTLs
const fmp = new FMP({
  apiKey: 'your-api-key',
  cache: {
    enabled: true,
    endpointTTL: {
      'profile': CacheTTL.DAY,      // 24 hours
      'quote': CacheTTL.NONE,       // Never cache
      'news': CacheTTL.LONG,        // 1 hour
    }
  }
});

// Clear cache
await fmp.clearCache();
```
