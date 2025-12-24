# FMP Node SDK

[![npm version](https://img.shields.io/npm/v/fmp-node-sdk.svg)](https://www.npmjs.com/package/fmp-node-sdk)
[![npm downloads](https://img.shields.io/npm/dm/fmp-node-sdk.svg)](https://www.npmjs.com/package/fmp-node-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![CI](https://github.com/nip10/fmp-node-sdk/workflows/CI/badge.svg)](https://github.com/nip10/fmp-node-sdk/actions)

TypeScript/JavaScript SDK for the [Financial Modeling Prep API](https://site.financialmodelingprep.com/) with 100% API coverage

## Features

- 🚀 **Modern TypeScript** - Full type safety with TypeScript
- 📦 **ESM & CJS** - Dual package support for maximum compatibility
- ⚡ **Lightweight** - Uses `ky` for efficient HTTP requests
- 🔄 **Auto Retry** - Built-in retry logic for failed requests
- 🛡️ **Error Handling** - Comprehensive error classes
- 🧪 **Well Tested** - High test coverage with Vitest
- 📖 **Excellent DX** - Intuitive API design with full IntelliSense support
- ✅ **100% API Coverage** - All 300+ FMP endpoints implemented across 19 resources

## Installation

```bash
npm install fmp-node-sdk
```

```bash
pnpm add fmp-node-sdk
```

```bash
yarn add fmp-node-sdk
```

## Quick Start

Get your free API key from [Financial Modeling Prep](https://site.financialmodelingprep.com/developer/docs)

```typescript
import { FMP, Period } from 'fmp-node-sdk';

const fmp = new FMP({ apiKey: 'your-api-key' });

// Get company profile
const profile = await fmp.company.getProfile('AAPL');
console.log(profile);

// Get real-time quote
const quote = await fmp.company.getQuote('AAPL');
console.log(quote);

// Get historical prices
const prices = await fmp.market.getHistoricalPrices('AAPL', '2024-01-01', '2024-12-31');
console.log(prices.historical);

// Get income statement
const income = await fmp.financials.getIncomeStatement('AAPL', Period.Annual);
console.log(income);
```

## Configuration

```typescript
const fmp = new FMP({
  apiKey: 'your-api-key',        // Required
  baseUrl: 'https://...',        // Optional, default: FMP API base URL
  timeout: 30000,                 // Optional, default: 30000ms
  retries: 3,                     // Optional, default: 3
  interceptors: {                 // Optional, for logging/debugging
    onRequest: (url, request) => {
      console.log('Request:', url);
    },
    onResponse: (url, response) => {
      console.log('Response:', url, response.status);
    },
    onError: (url, error) => {
      console.error('Error:', url, error.message);
    },
  },
});
```

## API Resources

The SDK provides 19 resource classes covering all FMP API endpoints:

### 1. Company Data (`fmp.company`)

Access company profiles, quotes, symbols, executives, and corporate data.

```typescript
// Company profile
const profile = await fmp.company.getProfile('AAPL');

// Real-time quote
const quote = await fmp.company.getQuote('AAPL');

// Multiple quotes
const quotes = await fmp.company.getQuotes(['AAPL', 'GOOGL', 'MSFT']);

// All trading symbols
const symbols = await fmp.company.getSymbolsList();

// Exchange-specific symbols
const nasdaqSymbols = await fmp.company.getExchangeSymbols('NASDAQ');

// Search companies
const results = await fmp.company.search('Apple', 10, 'NASDAQ');

// Company notes and peers
const notes = await fmp.company.getCompanyNotes('AAPL');
const peers = await fmp.company.getStockPeers('AAPL');

// Delisted companies
const delisted = await fmp.company.getDelistedCompanies(100);

// Employee count
const employees = await fmp.company.getEmployeeCount('AAPL');
const historicalEmployees = await fmp.company.getHistoricalEmployeeCount('AAPL');

// Market capitalization
const marketCap = await fmp.company.getMarketCap('AAPL');
const historicalMarketCap = await fmp.company.getHistoricalMarketCap('AAPL');

// Shares float
const sharesFloat = await fmp.company.getSharesFloat('AAPL');

// Executives and compensation
const executives = await fmp.company.getExecutives('AAPL');
const compensation = await fmp.company.getExecutiveCompensation('AAPL');

// Mergers & Acquisitions
const ma = await fmp.company.getMergerAcquisitions();

// Pre/post market data
const aftermarket = await fmp.company.getAftermarketQuote('AAPL');
```

### 2. Market Data (`fmp.market`)

Historical prices, intraday charts, forex, crypto, and market hours.

```typescript
import { IntradayInterval } from 'fmp-node-sdk';

// Historical prices
const historical = await fmp.market.getHistoricalPrices('AAPL', '2024-01-01', '2024-12-31');

// Intraday charts
const intraday = await fmp.market.getIntradayChart('AAPL', IntradayInterval.OneHour, '2024-01-01', '2024-01-31');
// Available intervals: OneMin, FiveMin, FifteenMin, ThirtyMin, OneHour, FourHour

// Forex
const forexPairs = await fmp.market.getForexCurrencyPairs();
const eurusd = await fmp.market.getForexPrice('EURUSD');
const allForex = await fmp.market.getAllForexPrices();
const forexHistory = await fmp.market.getHistoricalForex('EURUSD', '2024-01-01', '2024-12-31');

// Cryptocurrency
const cryptoList = await fmp.market.getCryptoList();
const btc = await fmp.market.getCryptoPrice('BTCUSD');
const allCrypto = await fmp.market.getAllCryptoPrices();

// Market status
const hours = await fmp.market.getMarketHours();
const holidays = await fmp.market.getMarketHolidays();

// Light charts (optimized)
const lightChart = await fmp.market.getLightChart(IntradayInterval.OneHour, 'AAPL', '2024-01-01', '2024-01-31');
```

### 3. Financial Statements (`fmp.financials`)

Income statements, balance sheets, cash flow statements, and financial metrics.

```typescript
import { Period } from 'fmp-node-sdk';

// Income statements
const income = await fmp.financials.getIncomeStatement('AAPL', Period.Annual, 5);
const incomeQuarterly = await fmp.financials.getIncomeStatement('AAPL', Period.Quarter);

// Balance sheets
const balance = await fmp.financials.getBalanceSheet('AAPL', Period.Annual);

// Cash flow statements
const cashFlow = await fmp.financials.getCashFlowStatement('AAPL', Period.Annual);

// Financial ratios
const ratios = await fmp.financials.getRatios('AAPL', Period.Annual);

// Key metrics
const metrics = await fmp.financials.getKeyMetrics('AAPL', Period.Annual);

// Financial scores (Piotroski, Altman Z)
const scores = await fmp.financials.getFinancialScores('AAPL');

// Owner earnings
const ownerEarnings = await fmp.financials.getOwnerEarnings('AAPL');

// Financial growth
const growth = await fmp.financials.getFinancialGrowth('AAPL', Period.Annual);

// Report dates
const dates = await fmp.financials.getReportDates('AAPL');

// Latest statements
const latest = await fmp.financials.getLatestFinancialStatement('AAPL', Period.Annual);

// Download reports
const jsonReport = await fmp.financials.getFinancialReportJSON('AAPL', 2023, 'FY');
const xlsxReport = await fmp.financials.getFinancialReportXLSX('AAPL', 2023, 'FY');
```

### 4. Analyst Data (`fmp.analyst`)

Analyst estimates, price targets, recommendations, and upgrades/downgrades.

```typescript
import { Period } from 'fmp-node-sdk';

// Analyst estimates
const estimates = await fmp.analyst.getAnalystEstimates('AAPL', Period.Annual);

// Price targets
const targets = await fmp.analyst.getPriceTarget('AAPL');
const targetSummary = await fmp.analyst.getPriceTargetSummary('AAPL');
const consensus = await fmp.analyst.getPriceTargetConsensus('AAPL');

// Analyst recommendations
const recommendations = await fmp.analyst.getAnalystRecommendations('AAPL');

// Upgrades and downgrades
const grades = await fmp.analyst.getStockGrade('AAPL');
const upgradesConsensus = await fmp.analyst.getUpgradesDowngradesConsensus('AAPL');

// Historical ratings
const historicalGrades = await fmp.analyst.getHistoricalGrades('AAPL');
```

### 5. Events (`fmp.events`)

Earnings, dividends, stock splits, IPO calendar, and economic events.

```typescript
// Earnings
const earnings = await fmp.events.getEarnings('AAPL');
const earningsCalendar = await fmp.events.getEarningsCalendar('2024-01-01', '2024-12-31');

// Dividends
const dividends = await fmp.events.getDividends('AAPL');
const dividendCalendar = await fmp.events.getDividendCalendar('2024-01-01', '2024-12-31');

// Stock splits
const splits = await fmp.events.getStockSplits('AAPL');

// IPO calendar
const ipoCalendar = await fmp.events.getIPOCalendar('2024-01-01', '2024-12-31');
const ipoProspectus = await fmp.events.getIPOProspectus('2024-01-01', '2024-12-31');
const ipoConfirmed = await fmp.events.getIPOConfirmed('2024-01-01', '2024-12-31');

// Economic calendar
const economicEvents = await fmp.events.getEconomicCalendar('2024-01-01', '2024-12-31');
```

### 6. Insider Trading (`fmp.insider`)

Insider trades, institutional holders, Form 13F, and congressional trading.

```typescript
// Insider trading
const insiderTrades = await fmp.insider.getInsiderTrades('AAPL', 100);
const insiderStats = await fmp.insider.getInsiderStatistics('AAPL');
const roster = await fmp.insider.getInsiderRoster('AAPL');

// Latest insider trades
const latest = await fmp.insider.getLatestInsiderTrades(50);

// Institutional holders
const institutions = await fmp.insider.getInstitutionalHolders('AAPL');

// Form 13F filings
const form13f = await fmp.insider.get13F('0001067983', '2024-03-31');
const filingDates = await fmp.insider.get13FFilingDates('0001067983');
const analytics = await fmp.insider.get13FWithAnalytics('0001067983', '2024-03-31');

// Portfolio analysis
const portfolioSummary = await fmp.insider.getPortfolioHoldingsSummary('0001067983');
const industryBreakdown = await fmp.insider.getIndustryPortfolioBreakdown('0001067983');

// Symbol ownership
const ownership = await fmp.insider.getSymbolOwnershipPositions('AAPL');
const industryOwnership = await fmp.insider.getIndustryInstitutionalOwnership('AAPL');

// Congressional trading
const senateTrades = await fmp.insider.getSenateTrades('AAPL');
const houseTrades = await fmp.insider.getHouseTrades('AAPL');
const latestSenate = await fmp.insider.getLatestSenateTrades();

// Form 4 ownership
const form4 = await fmp.insider.getForm4Ownership('AAPL');
```

### 7. News & Press Releases (`fmp.news`)

FMP articles, stock news, press releases, and earnings transcripts.

```typescript
// FMP articles
const articles = await fmp.news.getFMPArticles(0, 10);

// Stock news
const news = await fmp.news.getStockNews('AAPL', 50);

// Press releases
const pressReleases = await fmp.news.getPressReleases('AAPL', 0, 20);
const latest = await fmp.news.getLatestPressReleases('AAPL', 50);

// Earnings call transcripts
const transcript = await fmp.news.getEarningsTranscript('AAPL', 2024, 4);
const batchTranscripts = await fmp.news.getBatchEarningsTranscripts('AAPL');
const transcriptDates = await fmp.news.getEarningsTranscriptDates('AAPL');
```

### 8. SEC Filings (`fmp.sec`)

SEC filings, RSS feeds, SIC codes, and comprehensive company profiles.

```typescript
// SEC filings
const filings = await fmp.sec.getFilings('AAPL', '10-K', 10);
const filingsByCIK = await fmp.sec.getFilingsByCIK('0000320193');

// RSS feeds
const rssFeed = await fmp.sec.getRSSFeed('10-K', '2024-01-01', '2024-12-31');
const eightK = await fmp.sec.get8KFilings('2024-01-01', '2024-12-31');

// Company search
const searchByCIK = await fmp.sec.searchCompanyByCIK('0000320193');
const searchBySymbol = await fmp.sec.searchCompanyBySymbol('AAPL');

// SIC codes
const allSIC = await fmp.sec.getAllSICCodes();
const sicByCode = await fmp.sec.getSICByCode('3571');

// Comprehensive company profile (includes financials, ratios, insiders, executives)
const fullProfile = await fmp.sec.getFullProfile('AAPL');
```

### 9. Technical Indicators (`fmp.technical`)

SMA, EMA, RSI, ADX, Williams %R, and other technical indicators.

```typescript
import { TechnicalTimeframe } from 'fmp-node-sdk';

// Simple Moving Average
const sma = await fmp.technical.getSMA('AAPL', 50, TechnicalTimeframe.Daily);

// Exponential Moving Average
const ema = await fmp.technical.getEMA('AAPL', 50, TechnicalTimeframe.Daily);

// Relative Strength Index
const rsi = await fmp.technical.getRSI('AAPL', 14, TechnicalTimeframe.Daily);

// Average Directional Index
const adx = await fmp.technical.getADX('AAPL', 14, TechnicalTimeframe.Daily);

// Williams %R
const williams = await fmp.technical.getWilliams('AAPL', 14, TechnicalTimeframe.Daily);

// Standard Deviation
const stddev = await fmp.technical.getStandardDeviation('AAPL', 10, TechnicalTimeframe.Daily);

// Weighted Moving Average
const wma = await fmp.technical.getWMA('AAPL', 50, TechnicalTimeframe.Daily);

// Double/Triple Exponential Moving Average
const dema = await fmp.technical.getDEMA('AAPL', 50, TechnicalTimeframe.Daily);
const tema = await fmp.technical.getTEMA('AAPL', 50, TechnicalTimeframe.Daily);

// Available timeframes: OneMin, FiveMin, FifteenMin, ThirtyMin, OneHour, FourHour, Daily
```

### 10. Market Performance (`fmp.performance`)

Gainers, losers, most active stocks, and sector performance.

```typescript
// Stock movers
const gainers = await fmp.performance.getGainers();
const losers = await fmp.performance.getLosers();
const mostActive = await fmp.performance.getMostActive();

// Sector performance
const sectorPerf = await fmp.performance.getSectorPerformance();
const sectorPE = await fmp.performance.getSectorPE();
const historicalSector = await fmp.performance.getHistoricalSectorPerformance(10);
```

### 11. ETF Data (`fmp.etf`)

ETF holdings, sector weightings, country exposure, and information.

```typescript
// ETF holdings
const holdings = await fmp.etf.getHoldings('SPY');

// ETF information
const info = await fmp.etf.getInfo('SPY');

// Sector weightings
const sectors = await fmp.etf.getSectorWeighting('SPY');

// Country weightings
const countries = await fmp.etf.getCountryWeighting('SPY');

// Stock exposure in ETF
const exposure = await fmp.etf.getStockExposure('AAPL');

// Mutual fund holders
const mutualFunds = await fmp.etf.getMutualFundHolders('AAPL');

// Latest ETF disclosures
const disclosures = await fmp.etf.getLatestDisclosures();
```

### 12. Index Data (`fmp.indexes`)

Index constituents and historical constituent changes.

```typescript
// Current index constituents
const sp500 = await fmp.indexes.getConstituents('SP500');
const nasdaq = await fmp.indexes.getConstituents('NASDAQ');
const dowjones = await fmp.indexes.getConstituents('DOWJONES');

// Historical constituents
const historical = await fmp.indexes.getHistoricalConstituents('SP500');

// Index quotes
const quote = await fmp.indexes.getQuoteShort('^GSPC');

// Light historical data
const lightData = await fmp.indexes.getHistoricalLight('^GSPC', '2024-01-01', '2024-12-31');
```

### 13. Commodities (`fmp.commodities`)

Commodity prices, quotes, and historical data.

```typescript
// Commodity list
const commodities = await fmp.commodities.getCommoditiesList();

// Commodity quote
const gold = await fmp.commodities.getCommodityQuote('GCUSD');

// Short quotes
const quickQuote = await fmp.commodities.getQuoteShort('GCUSD');

// Light chart data
const lightChart = await fmp.commodities.getLightChart('GCUSD', '2024-01-01', '2024-12-31');
```

### 14. Economics (`fmp.economics`)

Treasury rates, economic indicators, and market risk premium.

```typescript
// Treasury rates
const treasury = await fmp.economics.getTreasuryRates('10year');

// Economic indicators
const gdp = await fmp.economics.getEconomicIndicator('GDP');
const unemployment = await fmp.economics.getEconomicIndicator('unemploymentRate');
const inflation = await fmp.economics.getEconomicIndicator('inflationRate');
// Available indicators: 'GDP', 'realGDP', 'unemploymentRate', 'inflationRate',
//                       'consumerPriceIndex', 'retailSales', etc.

// Market risk premium
const riskPremium = await fmp.economics.getMarketRiskPremium();
```

### 15. Valuation (`fmp.valuation`)

DCF valuations, levered DCF, and advanced DCF models.

```typescript
// Standard DCF valuation
const dcf = await fmp.valuation.getDCF('AAPL');

// Levered DCF
const leveredDCF = await fmp.valuation.getLeveredDCF('AAPL');

// Advanced DCF
const advancedDCF = await fmp.valuation.getAdvancedDCF('AAPL');
```

### 16. ESG Data (`fmp.esg`)

Environmental, Social, and Governance scores and ratings.

```typescript
// ESG data
const esg = await fmp.esg.getESGData('AAPL');

// ESG ratings
const ratings = await fmp.esg.getESGRatings('AAPL');

// ESG benchmarks by sector
const benchmark = await fmp.esg.getESGBenchmark(2023);
```

### 17. COT Reports (`fmp.cot`)

Commitment of Traders reports and analysis.

```typescript
// COT reports
const cotReport = await fmp.cot.getCOTReport();

// COT analysis
const analysis = await fmp.cot.getCOTAnalysis();

// Available COT symbols
const symbols = await fmp.cot.getCOTSymbols();
```

### 18. Fundraisers (`fmp.fundraisers`)

Crowdfunding and equity offering data.

```typescript
// Crowdfunding offerings
const crowdfunding = await fmp.fundraisers.getCrowdfunding();
const crowdfundingBySymbol = await fmp.fundraisers.getCrowdfundingBySymbol('AAPL');
const crowdfundingRSS = await fmp.fundraisers.getCrowdfundingRSS();

// Equity offerings
const offerings = await fmp.fundraisers.getEquityOfferings();
const offeringsBySymbol = await fmp.fundraisers.getEquityOfferingsBySymbol('AAPL');
const offeringsRSS = await fmp.fundraisers.getEquityOfferingsRSS();
```

### 19. Bulk & Batch Operations (`fmp.bulk`)

Bulk data downloads for batch processing and analysis.

```typescript
import { Period } from 'fmp-node-sdk';

// Bulk company data
const allProfiles = await fmp.bulk.getAllProfiles();
const allRatings = await fmp.bulk.getAllRatings();
const allDCF = await fmp.bulk.getAllDCF();

// Batch EOD prices
const eodPrices = await fmp.bulk.getBatchEODPrices('2024-01-15');
const eodRange = await fmp.bulk.getBatchEODPricesRange('2024-01-01', '2024-01-31');

// Earnings surprises
const surprises = await fmp.bulk.getEarningsSurprises();

// Growth metrics
const incomeGrowth = await fmp.bulk.getIncomeStatementGrowth();
const balanceGrowth = await fmp.bulk.getBalanceSheetGrowth();
const cashFlowGrowth = await fmp.bulk.getCashFlowStatementGrowth();

// Bulk financials
const allIncomeStatements = await fmp.bulk.getAllIncomeStatements(Period.Annual);
const allBalanceSheets = await fmp.bulk.getAllBalanceSheets(Period.Annual);
const allCashFlows = await fmp.bulk.getAllCashFlowStatements(Period.Annual);
const allRatios = await fmp.bulk.getAllFinancialRatios(Period.Annual);
const allMetrics = await fmp.bulk.getAllKeyMetrics(Period.Annual);
const allScores = await fmp.bulk.getAllFinancialScores();

// Bulk ownership
const allInsiderTrades = await fmp.bulk.getAllInsiderTrades();

// Batch requests
const batchQuotes = await fmp.bulk.getBatchQuotes(['AAPL', 'GOOGL', 'MSFT']);
const batchProfiles = await fmp.bulk.getBatchProfiles(['AAPL', 'GOOGL', 'MSFT']);
```

### 20. Search & Screening (`fmp.search`)

Advanced search and stock screening capabilities.

```typescript
// Symbol search
const symbolResults = await fmp.search.searchBySymbol('AAPL', 10);

// Company name search
const nameResults = await fmp.search.searchByName('Apple', 10, 'NASDAQ');

// Search by identifiers
const cikResults = await fmp.search.searchByCIK('0000320193');
const cusipResults = await fmp.search.searchByCUSIP('037833100');
const isinResults = await fmp.search.searchByISIN('US0378331005');

// Stock screener
const screenResults = await fmp.search.screenStocks({
  marketCapMoreThan: 100000000000,  // $100B+
  betaMoreThan: 0.5,
  volumeMoreThan: 1000000,
  sector: 'Technology',
  exchange: 'NASDAQ',
  limit: 50
});

// Get all symbols from exchange
const nasdaqSymbols = await fmp.search.getExchangeSymbols('NASDAQ');
```

## Error Handling

The SDK provides simple error types and passes through raw API responses:

```typescript
import {
  FMP,
  FMPAPIError,
  FMPValidationError,
} from 'fmp-node-sdk';

try {
  const fmp = new FMP({ apiKey: 'your-key' });
  const quote = await fmp.company.getQuote('AAPL');
} catch (error) {
  if (error instanceof FMPValidationError) {
    console.error('Validation error:', error.message);
  } else if (error instanceof FMPAPIError) {
    // Check status code to determine error type
    if (error.status === 401 || error.status === 403) {
      console.error('Authentication error:', error.message);
    } else if (error.status === 429) {
      console.error('Rate limit exceeded:', error.message);
    } else {
      console.error(`API error (${error.status}):`, error.message);
    }
  }
}
```

### Error Types

- `FMPError` - Base error class
- `FMPAPIError` - API request failures (includes `status` and `statusText` properties with raw API response)
- `FMPValidationError` - Input validation errors (thrown before API request for invalid inputs)

### Best Practices

1. **Always handle rate limits**: FMP has rate limits based on your subscription tier
2. **Use batch operations when possible**: Reduce API calls by using bulk endpoints
3. **Cache responses**: Store frequently accessed data to minimize API usage
4. **Validate inputs**: Check symbol formats and date ranges before making requests
5. **Use TypeScript**: Leverage full type safety for better development experience

## TypeScript Support

The SDK is written in TypeScript and provides full type definitions for all 300+ endpoints:

```typescript
import type {
  CompanyProfile,
  Quote,
  HistoricalPrice,
  IncomeStatement,
  BalanceSheet,
  CashFlowStatement,
  AnalystEstimate,
  InsiderTrade,
  Form13F,
  ESGData,
  StockScreenerParams,
} from 'fmp-node-sdk';

// All responses are fully typed
const profile: CompanyProfile[] = await fmp.company.getProfile('AAPL');
const income: IncomeStatement[] = await fmp.financials.getIncomeStatement('AAPL', Period.Annual);
```

Over 150 TypeScript interfaces are exported covering:
- Company data
- Market data
- Financial statements
- Analyst data
- Events (earnings, dividends, splits)
- Insider trading & institutional ownership
- News & press releases
- SEC filings
- Technical indicators
- ETF & mutual fund data
- Commodities & economics
- ESG metrics
- And more...

## Real-World Examples

### Portfolio Tracker

```typescript
import { FMP } from 'fmp-node-sdk';

const fmp = new FMP({ apiKey: process.env.FMP_API_KEY! });

async function trackPortfolio(holdings: { symbol: string; shares: number }[]) {
  const symbols = holdings.map(h => h.symbol);
  const quotes = await fmp.company.getQuotes(symbols);

  let totalValue = 0;
  let totalGainLoss = 0;

  for (const holding of holdings) {
    const quote = quotes.find(q => q.symbol === holding.symbol);
    if (!quote) continue;

    const value = quote.price * holding.shares;
    const gainLoss = quote.change * holding.shares;

    totalValue += value;
    totalGainLoss += gainLoss;

    console.log(`${holding.symbol}: $${value.toFixed(2)} (${gainLoss > 0 ? '+' : ''}$${gainLoss.toFixed(2)})`);
  }

  console.log(`\nTotal Portfolio Value: $${totalValue.toFixed(2)}`);
  console.log(`Today's Gain/Loss: ${totalGainLoss > 0 ? '+' : ''}$${totalGainLoss.toFixed(2)}`);
}

await trackPortfolio([
  { symbol: 'AAPL', shares: 100 },
  { symbol: 'GOOGL', shares: 50 },
  { symbol: 'MSFT', shares: 75 },
]);
```

### Financial Statement Analysis

```typescript
import { Period } from 'fmp-node-sdk';

async function analyzeFinancials(symbol: string) {
  const fmp = new FMP({ apiKey: process.env.FMP_API_KEY! });

  // Get 5 years of financial data
  const income = await fmp.financials.getIncomeStatement(symbol, Period.Annual, 5);
  const balance = await fmp.financials.getBalanceSheet(symbol, Period.Annual, 5);
  const cashFlow = await fmp.financials.getCashFlowStatement(symbol, Period.Annual, 5);
  const ratios = await fmp.financials.getRatios(symbol, Period.Annual, 5);

  // Calculate 5-year revenue CAGR
  const oldestRevenue = income[income.length - 1].revenue;
  const latestRevenue = income[0].revenue;
  const years = income.length - 1;
  const cagr = (Math.pow(latestRevenue / oldestRevenue, 1 / years) - 1) * 100;

  console.log(`${symbol} 5-Year Revenue CAGR: ${cagr.toFixed(2)}%`);
  console.log(`Latest P/E Ratio: ${ratios[0].priceEarningsRatio.toFixed(2)}`);
  console.log(`Latest ROE: ${(ratios[0].returnOnEquity * 100).toFixed(2)}%`);
  console.log(`Debt to Equity: ${ratios[0].debtEquityRatio.toFixed(2)}`);
}

await analyzeFinancials('AAPL');
```

### Insider Trading Alerts

```typescript
async function checkInsiderActivity(symbol: string) {
  const fmp = new FMP({ apiKey: process.env.FMP_API_KEY! });

  const trades = await fmp.insider.getInsiderTrades(symbol, 20);

  // Filter for purchases in last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentPurchases = trades.filter(trade =>
    trade.transactionType === 'P-Purchase' &&
    new Date(trade.filingDate) > thirtyDaysAgo
  );

  if (recentPurchases.length > 0) {
    console.log(`🚨 ${recentPurchases.length} insider purchases in last 30 days for ${symbol}`);

    for (const trade of recentPurchases) {
      console.log(`  ${trade.reportingName}: ${trade.securitiesTransacted} shares at $${trade.price}`);
    }
  }
}

await checkInsiderActivity('AAPL');
```

### Market Screener

```typescript
async function findGrowthStocks() {
  const fmp = new FMP({ apiKey: process.env.FMP_API_KEY! });

  // Screen for growth stocks
  const results = await fmp.search.screenStocks({
    marketCapMoreThan: 10000000000,  // $10B+ market cap
    volumeMoreThan: 1000000,          // 1M+ daily volume
    betaMoreThan: 1.2,                // High beta (volatile)
    sector: 'Technology',
    exchange: 'NASDAQ',
    limit: 20
  });

  console.log(`Found ${results.length} growth stocks:`);

  for (const stock of results) {
    console.log(`${stock.symbol}: ${stock.companyName}`);
    console.log(`  Market Cap: $${(stock.marketCap / 1e9).toFixed(2)}B`);
    console.log(`  Beta: ${stock.beta?.toFixed(2)}`);
  }
}

await findGrowthStocks();
```

### Sector Analysis

```typescript
async function analyzeSector(sector: string) {
  const fmp = new FMP({ apiKey: process.env.FMP_API_KEY! });

  // Get sector performance
  const sectorPerf = await fmp.performance.getSectorPerformance();
  const targetSector = sectorPerf.find(s => s.sector === sector);

  if (targetSector) {
    console.log(`${sector} Performance:`);
    console.log(`  1 Day: ${targetSector.changesPercentage}%`);
    console.log(`  5 Day: ${targetSector['5DayChange']}%`);
    console.log(`  1 Month: ${targetSector['1MonthChange']}%`);
    console.log(`  3 Month: ${targetSector['3MonthChange']}%`);
    console.log(`  YTD: ${targetSector['yearToDateChange']}%`);
  }

  // Get sector P/E ratios
  const sectorPE = await fmp.performance.getSectorPE();
  const targetPE = sectorPE.find(s => s.sector === sector);

  if (targetPE) {
    console.log(`\n${sector} Valuation:`);
    console.log(`  Average P/E: ${targetPE.pe?.toFixed(2)}`);
  }
}

await analyzeSector('Technology');
```

## Development

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Run tests with coverage
pnpm coverage

# Build the package
pnpm build

# Lint
pnpm lint

# Format code
pnpm format
```

## API Coverage

This SDK provides **100% coverage** of the Financial Modeling Prep API:

### Implemented Resources (19 total)

✅ **Company Data** - Profiles, quotes, symbols, executives, M&A
✅ **Market Data** - Historical prices, intraday charts, forex, crypto
✅ **Financial Statements** - Income, balance sheet, cash flow, ratios, metrics
✅ **Analyst Data** - Estimates, price targets, recommendations, grades
✅ **Events** - Earnings, dividends, splits, IPO calendar, economic events
✅ **Insider Trading** - Trades, institutional holders, Form 13F, congressional
✅ **News** - Articles, stock news, press releases, earnings transcripts
✅ **SEC Filings** - All filing types, RSS feeds, SIC codes, company profiles
✅ **Technical Indicators** - SMA, EMA, RSI, ADX, Williams, and more
✅ **Performance** - Gainers, losers, most active, sector performance
✅ **ETF Data** - Holdings, sector/country weightings, mutual funds
✅ **Index Data** - Constituents, historical changes
✅ **Commodities** - Prices, quotes, historical data
✅ **Economics** - Treasury rates, economic indicators, risk premium
✅ **Valuation** - DCF models (standard, levered, advanced)
✅ **ESG Data** - Environmental, social, governance scores
✅ **COT Reports** - Commitment of Traders data and analysis
✅ **Fundraisers** - Crowdfunding and equity offerings
✅ **Bulk Operations** - Batch downloads for all data types
✅ **Search & Screening** - Advanced search and stock screener

### Endpoint Statistics

- **300+ API endpoints** implemented
- **150+ TypeScript interfaces** for complete type coverage
- **19 resource classes** organized by functionality
- **Small footprint** only requires `ky` HTTP client

See [API_COVERAGE.md](./API_COVERAGE.md) for detailed endpoint documentation.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

For more details, see [CONTRIBUTING.md](./CONTRIBUTING.md).

## Support

- 📚 [FMP API Documentation](https://site.financialmodelingprep.com/developer/docs)
- 🐛 [Report Issues](https://github.com/nip10/fmp-node-sdk/issues)
- 💬 [Discussions](https://github.com/nip10/fmp-node-sdk/discussions)

## Credits

Built with:
- [ky](https://github.com/sindresorhus/ky) - Elegant HTTP client
- [TypeScript](https://www.typescriptlang.org/) - Type safety and excellent DX
- [Vitest](https://vitest.dev/) - Fast and modern testing framework
- [tsup](https://tsup.egoist.dev/) - Bundle library with zero config
