# fmp-node-sdk

## 3.0.0

### Major Changes

- 28b8649: Add response caching support with flexible configuration

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
    cache: { enabled: true },
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
    },
  });

  // Custom per-endpoint TTLs
  const fmp = new FMP({
    apiKey: 'your-api-key',
    cache: {
      enabled: true,
      endpointTTL: {
        profile: CacheTTL.DAY, // 24 hours
        quote: CacheTTL.NONE, // Never cache
        news: CacheTTL.LONG, // 1 hour
      },
    },
  });

  // Clear cache
  await fmp.clearCache();
  ```

## 2.0.0

### Major Changes

- 49cda76: ## Breaking Changes

  ### API Migration: v3/v4 → Stable API

  **This is a complete API migration.** The SDK now uses FMP's new stable API instead of the legacy v3/v4 endpoints.
  - Base URL changed from `https://financialmodelingprep.com/api` to `https://financialmodelingprep.com/stable`
  - All endpoint paths have been updated to match the stable API specification
  - Path parameters converted to query parameters (e.g., `/v3/profile/AAPL` → `/profile?symbol=AAPL`)

  If you were customizing the `baseUrl` in your config, you'll need to update it.

  ### Endpoint Changes

  All endpoints have been migrated. Examples of changes:

  | Resource   | Old Endpoint                        | New Endpoint                        |
  | ---------- | ----------------------------------- | ----------------------------------- |
  | Company    | `v3/profile/{symbol}`               | `profile?symbol=`                   |
  | Company    | `v3/quote/{symbol}`                 | `quote?symbol=`                     |
  | Company    | `v3/search`                         | `search-symbol`, `search-name`      |
  | Analyst    | `v3/analyst-estimates`              | `analyst-estimates`                 |
  | Analyst    | `v4/price-target`                   | `price-target`                      |
  | Analyst    | `v3/grade`                          | `grades`                            |
  | Bulk       | `v4/profile/all`                    | `profile-bulk`                      |
  | Bulk       | `v4/dcf`                            | `dcf-bulk`                          |
  | Financials | `v3/income-statement/{symbol}`      | `income-statement?symbol=`          |
  | Market     | `v3/historical-price-full/{symbol}` | `historical-price-eod/full?symbol=` |

  ### Method Signature Changes
  - `CompanyResource.search()` is now deprecated, use `searchSymbol()` or `searchName()`
  - `CompanyResource.getDelistedCompanies(limit?)` now takes `(page, limit)` parameters
  - `BulkResource.getAllProfiles()` now takes optional `part` parameter for pagination
  - `BulkResource.getAllETFHoldings()` now takes optional `part` parameter for pagination
  - `CommoditiesResource.getHistoricalPrices()` now returns `HistoricalPrice[]` instead of `{ historical: HistoricalPrice[] }`

  ### Type Changes

  #### DCFValuation and LeveredDCF
  - Renamed `'Stock Price'` property to `stockPrice`

  #### Quote type - Nullable fields

  The following fields are now nullable to accurately reflect the API response:
  - `marketCap`: `number` → `number | null`
  - `priceAvg50`: `number` → `number | null`
  - `priceAvg200`: `number` → `number | null`
  - `eps`: `number` → `number | null`
  - `pe`: `number` → `number | null`
  - `earningsAnnouncement`: `string` → `string | null`
  - `sharesOutstanding`: `number` → `number | null`

  #### EarningsSurprise type
  - `actualEarningResult`: `number` → `number | null`
  - `estimatedEarning`: `number` → `number | null`

  ## New Features

  ### NewsResource
  - `getAvailableTranscriptSymbols()` - Get symbols with available earnings call transcripts
  - `searchPressReleases(query, limit)` - Search press releases
  - `searchStockNews(query, limit)` - Search stock news
  - `searchCryptoNews(query, limit)` - Search crypto news
  - `searchForexNews(query, limit)` - Search forex news

  ### InsiderResource
  - `getHolderPerformanceSummary(cik, date)` - 13F portfolio holdings performance
  - `getIndustryPerformanceSummary(cik, date)` - 13F industry portfolio holdings performance

  ### AnalystResource
  - `getGradesSummary(symbol)` - Analyst grades summary

  ### ValuationResource
  - `getCustomLeveredDCF(symbol)` - Custom levered DCF valuation

  ### CompanyResource
  - `searchSymbol(query, limit, exchange)` - Search by symbol
  - `searchName(query, limit, exchange)` - Search by company name
  - `getBatchAftermarketTrades(symbols)` - Batch aftermarket trades
  - `getETFList()` - List of all ETFs
  - `getMutualFundList()` - List of all mutual funds

  ## New Types
  - `PortfolioHoldingsSummary` - 13F portfolio holdings summary
  - `IndustryPortfolioHoldingsSummary` - 13F industry portfolio holdings summary
  - `FundListItem` - ETF/Mutual fund list item
  - `QuoteShort` - Simplified quote data
  - `AftermarketTrade` - Aftermarket trade data
  - `AftermarketQuote` - Aftermarket quote data
  - `PriceChange` - Stock price change data

  ## Migration Guide
  1. **Update base URL** (if customizing): Change from `/api` to `/stable`
  2. **Update search calls**: Replace `.search()` with `.searchSymbol()` or `.searchName()`
  3. **Handle nullable fields**: Add null checks for Quote fields that are now nullable
  4. **Update DCF access**: Change `result['Stock Price']` to `result.stockPrice`
  5. **Update commodity historical**: Handle direct array return instead of `{ historical: [] }`

## 1.0.0

### Major Changes

- 55b8685: # v1.0.0 - Initial Production Release

  This is the first production-ready release of the FMP Node SDK with complete API coverage and comprehensive documentation.

  ## Features

  ### 100% API Coverage
  - **19 resource classes** covering all FMP API endpoints
  - **300+ methods** for accessing Financial Modeling Prep data
  - **150+ TypeScript interfaces** for complete type safety

  ### Comprehensive Resources
  - Company Data - Profiles, quotes, symbols, executives, M&A
  - Market Data - Historical prices, intraday charts, forex, crypto
  - Financial Statements - Income, balance sheet, cash flow, ratios, metrics
  - Analyst Data - Estimates, price targets, recommendations, grades
  - Events - Earnings, dividends, splits, IPO calendar, economic events
  - Insider Trading - Trades, institutional holders, Form 13F, congressional
  - News - Articles, stock news, press releases, earnings transcripts
  - SEC Filings - All filing types, RSS feeds, SIC codes, company profiles
  - Technical Indicators - SMA, EMA, RSI, ADX, Williams, and more
  - Performance - Gainers, losers, most active, sector performance
  - ETF Data - Holdings, sector/country weightings, mutual funds
  - Index Data - Constituents, historical changes
  - Commodities - Prices, quotes, historical data
  - Economics - Treasury rates, economic indicators, risk premium
  - Valuation - DCF models (standard, levered, advanced)
  - ESG Data - Environmental, social, governance scores
  - COT Reports - Commitment of Traders data and analysis
  - Fundraisers - Crowdfunding and equity offerings
  - Bulk Operations - Batch downloads for all data types
  - Search & Screening - Advanced search and stock screener

  ### Developer Experience
  - Full TypeScript support with strict type checking
  - Dual package support (ESM + CommonJS)
  - Comprehensive error handling with specific error types
  - Built-in retry logic for failed requests
  - Intuitive resource-based API design
  - Extensive documentation and examples

  ### Documentation
  - Complete README with API reference for all 19 resources
  - 5 real-world example applications
  - Contributing guidelines for open source contributors
  - 100% API endpoint coverage tracking

  ## Breaking Changes

  This is the initial v1.0.0 release. There are no breaking changes from v0.x as this is the first production release.
