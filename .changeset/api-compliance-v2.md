---
"fmp-node-sdk": major
---

## Breaking Changes

### API Migration: v3/v4 → Stable API

**This is a complete API migration.** The SDK now uses FMP's new stable API instead of the legacy v3/v4 endpoints.

- Base URL changed from `https://financialmodelingprep.com/api` to `https://financialmodelingprep.com/stable`
- All endpoint paths have been updated to match the stable API specification
- Path parameters converted to query parameters (e.g., `/v3/profile/AAPL` → `/profile?symbol=AAPL`)

If you were customizing the `baseUrl` in your config, you'll need to update it.

### Endpoint Changes

All endpoints have been migrated. Examples of changes:

| Resource | Old Endpoint | New Endpoint |
|----------|-------------|--------------|
| Company | `v3/profile/{symbol}` | `profile?symbol=` |
| Company | `v3/quote/{symbol}` | `quote?symbol=` |
| Company | `v3/search` | `search-symbol`, `search-name` |
| Analyst | `v3/analyst-estimates` | `analyst-estimates` |
| Analyst | `v4/price-target` | `price-target` |
| Analyst | `v3/grade` | `grades` |
| Bulk | `v4/profile/all` | `profile-bulk` |
| Bulk | `v4/dcf` | `dcf-bulk` |
| Financials | `v3/income-statement/{symbol}` | `income-statement?symbol=` |
| Market | `v3/historical-price-full/{symbol}` | `historical-price-eod/full?symbol=` |

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
