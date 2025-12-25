---
"fmp-node-sdk": major
---

## Breaking Changes

- **DCFValuation and LeveredDCF types**: Renamed `'Stock Price'` property to `stockPrice` to follow JavaScript naming conventions and match actual API response format

## New Features

### NewsResource
- `getAvailableTranscriptSymbols()` - Get list of symbols with available earnings call transcripts
- `searchPressReleases(query, limit)` - Search press releases by query
- `searchStockNews(query, limit)` - Search stock news by query
- `searchCryptoNews(query, limit)` - Search crypto news by query
- `searchForexNews(query, limit)` - Search forex news by query

### InsiderResource
- `getHolderPerformanceSummary(cik, date)` - Get 13F portfolio holdings performance summary
- `getIndustryPerformanceSummary(cik, date)` - Get 13F industry portfolio holdings performance summary

### AnalystResource
- `getGradesSummary(symbol)` - Get analyst grades summary for a symbol

### ValuationResource
- `getCustomLeveredDCF(symbol)` - Get custom levered DCF valuation

### CompanyResource
- `getBatchAftermarketTrades(symbols)` - Get batch aftermarket trades for multiple symbols
- `getETFList()` - Get list of all ETFs
- `getMutualFundList()` - Get list of all mutual funds

## Type Fixes

### Quote type
- `marketCap` is now `number | null` (was `number`)
- `priceAvg50` is now `number | null` (was `number`)
- `priceAvg200` is now `number | null` (was `number`)
- `eps` is now `number | null` (was `number`)
- `pe` is now `number | null` (was `number`)
- `earningsAnnouncement` is now `string | null` (was `string`)
- `sharesOutstanding` is now `number | null` (was `number`)

### New Types
- `PortfolioHoldingsSummary` - 13F portfolio holdings summary
- `IndustryPortfolioHoldingsSummary` - 13F industry portfolio holdings summary
- `FundListItem` - ETF/Mutual fund list item
