---
"fmp-node-sdk": major
---

Add response caching support with flexible configuration

## Features

- **In-memory LRU cache** (default) with configurable max size
- **Custom cache providers** - implement `CacheProvider` interface for Redis, Memcached, etc.
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
import { FMP, CacheTTL } from 'fmp-node-sdk';

// Enable caching with sensible defaults
const fmp = new FMP({
  apiKey: 'your-api-key',
  cache: { enabled: true }
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

// Custom cache provider (e.g., Redis)
const fmp = new FMP({
  apiKey: 'your-api-key',
  cache: {
    enabled: true,
    provider: new RedisCacheProvider(redisClient)
  }
});

// Clear cache
await fmp.clearCache();
```
