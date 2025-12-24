# Project Index: FMP Node SDK

**Generated:** 2025-12-24
**Version:** 1.0.0
**Description:** TypeScript SDK for Financial Modeling Prep API with 100% API coverage

---

## 📁 Project Structure

```
fmp-node-sdk/
├── src/                      # Source code
│   ├── client.ts            # HTTP client wrapper (ky)
│   ├── fmp.ts               # Main SDK class
│   ├── index.ts             # Public API exports
│   ├── errors/              # Error classes
│   │   └── index.ts         # FMPError, FMPAPIError, etc.
│   ├── resources/           # API resource classes (19 files)
│   │   ├── analyst.ts       # Analyst estimates & ratings
│   │   ├── bulk.ts          # Bulk/batch operations
│   │   ├── commodities.ts   # Commodity data
│   │   ├── company.ts       # Company profiles & quotes
│   │   ├── cot.ts          # Commitment of Traders
│   │   ├── economics.ts     # Economic indicators
│   │   ├── esg.ts          # ESG scores & ratings
│   │   ├── etf.ts          # ETF holdings & info
│   │   ├── events.ts        # Earnings, dividends, IPOs
│   │   ├── financials.ts    # Financial statements
│   │   ├── fundraisers.ts   # Crowdfunding & offerings
│   │   ├── indexes.ts       # Index constituents
│   │   ├── insider.ts       # Insider trading & Form 13F
│   │   ├── market.ts        # Market data & prices
│   │   ├── news.ts          # News & press releases
│   │   ├── performance.ts   # Gainers, losers, sectors
│   │   ├── search.ts        # Search & screening
│   │   ├── sec.ts          # SEC filings
│   │   ├── technical.ts     # Technical indicators
│   │   └── valuation.ts     # DCF valuations
│   └── types/               # TypeScript type definitions (23 files)
│       ├── index.ts         # Common types & re-exports
│       ├── common.ts        # Shared types (Period, DateRange, etc.)
│       ├── analyst.ts       # Analyst data types
│       ├── commodities.ts   # Commodity types
│       ├── company.ts       # Company & quote types
│       ├── cot.ts          # COT types
│       ├── economics.ts     # Economic indicator types
│       ├── esg.ts          # ESG types
│       ├── etf.ts          # ETF types
│       ├── events.ts        # Event types
│       ├── financials.ts    # Financial statement types
│       ├── fundraisers.ts   # Fundraiser types
│       ├── indexes.ts       # Index types
│       ├── insider.ts       # Insider trading types
│       ├── market.ts        # Market data types
│       ├── news.ts          # News types
│       ├── performance.ts   # Performance types
│       ├── search.ts        # Search types
│       ├── sec.ts          # SEC filing types
│       ├── technical.ts     # Technical indicator types
│       └── valuation.ts     # Valuation types
├── tests/                   # Test files (22 files)
│   ├── analyst.test.ts
│   ├── bulk.test.ts
│   ├── commodities.test.ts
│   ├── company.test.ts
│   ├── cot.test.ts
│   ├── economics.test.ts
│   ├── errors.test.ts
│   ├── esg.test.ts
│   ├── etf.test.ts
│   ├── events.test.ts
│   ├── financials.test.ts
│   ├── fmp.test.ts
│   ├── fundraisers.test.ts
│   ├── indexes.test.ts
│   ├── insider.test.ts
│   ├── market.test.ts
│   ├── news.test.ts
│   ├── performance.test.ts
│   ├── search.test.ts
│   ├── sec.test.ts
│   ├── technical.test.ts
│   └── valuation.test.ts
├── examples/                # Usage examples (7 files)
│   ├── basic-usage.ts
│   ├── financial-analysis.ts
│   ├── forex-usage.ts
│   ├── insider-trading.ts
│   ├── market-screener.ts
│   ├── portfolio-tracker.ts
│   └── sector-analysis.ts
├── dist/                    # Build output (generated)
├── package.json             # Package configuration
├── tsconfig.json           # TypeScript configuration
├── vitest.config.ts        # Test configuration
├── README.md               # Main documentation
├── API_COVERAGE.md         # API endpoint tracking
└── CONTRIBUTING.md         # Contribution guidelines
```

---

## 🚀 Entry Points

**Main Package Entry:**
- **File:** `src/index.ts`
- **Exports:** `FMP` class, type definitions, error classes
- **Build Output:** `dist/index.js` (ESM), `dist/index.cjs` (CommonJS)

**Primary SDK Class:**
- **File:** `src/fmp.ts`
- **Class:** `FMP`
- **Purpose:** Main orchestrator - instantiates all 19 resource classes

**HTTP Client:**
- **File:** `src/client.ts`
- **Class:** `FMPClient`
- **Purpose:** Wraps `ky` HTTP library with retry logic & error handling

---

## 📦 Core Modules

### Main SDK (`src/fmp.ts`)
- **Exports:** `FMP` class
- **Properties:** 19 public resource instances (company, market, financials, etc.)
- **Purpose:** Single entry point for all FMP API operations

### HTTP Client (`src/client.ts`)
- **Exports:** `FMPClient` class
- **Features:** Request/response handling, automatic retries, error transformation
- **Dependencies:** `ky` HTTP library

### Error Handling (`src/errors/index.ts`)
- **Exports:**
  - `FMPError` - Base error class
  - `FMPAPIError` - API request failures (includes HTTP status)
  - `FMPAuthenticationError` - Invalid API key (401)
  - `FMPRateLimitError` - Rate limit exceeded (429, includes retry-after)
  - `FMPValidationError` - Input validation errors
- **Purpose:** Typed error hierarchy for precise error handling

### Resource Classes (`src/resources/*.ts`)

19 resource classes implementing 300+ API endpoints:

1. **CompanyResource** (`company.ts`)
   - Profiles, quotes, symbols, executives, M&A, market cap, employee data
   - Key methods: `getProfile()`, `getQuote()`, `getQuotes()`, `search()`

2. **MarketResource** (`market.ts`)
   - Historical prices, intraday charts, forex, crypto, market hours
   - Key methods: `getHistoricalPrices()`, `getIntradayChart()`, `getForexPrice()`

3. **FinancialsResource** (`financials.ts`)
   - Income statements, balance sheets, cash flow, ratios, metrics
   - Key methods: `getIncomeStatement()`, `getBalanceSheet()`, `getFinancialRatios()`

4. **AnalystResource** (`analyst.ts`)
   - Estimates, price targets, recommendations, upgrades/downgrades
   - Key methods: `getAnalystEstimates()`, `getPriceTarget()`, `getStockGrade()`

5. **EventsResource** (`events.ts`)
   - Earnings, dividends, stock splits, IPO calendar, economic events
   - Key methods: `getEarnings()`, `getDividends()`, `getIPOCalendar()`

6. **InsiderResource** (`insider.ts`)
   - Insider trades, institutional holders, Form 13F, congressional trading
   - Key methods: `getInsiderTrades()`, `get13F()`, `getSenateTrades()`

7. **NewsResource** (`news.ts`)
   - FMP articles, stock news, press releases, earnings transcripts
   - Key methods: `getStockNews()`, `getPressReleases()`, `getEarningsTranscript()`

8. **SECResource** (`sec.ts`)
   - SEC filings, RSS feeds, SIC codes, company search
   - Key methods: `getFilings()`, `getRSSFeed()`, `searchCompanyByCIK()`

9. **TechnicalResource** (`technical.ts`)
   - SMA, EMA, RSI, ADX, Williams %R, and other indicators
   - Key methods: `getSMA()`, `getEMA()`, `getRSI()`, `getADX()`

10. **PerformanceResource** (`performance.ts`)
    - Gainers, losers, most active, sector performance
    - Key methods: `getGainers()`, `getLosers()`, `getSectorPerformance()`

11. **ETFResource** (`etf.ts`)
    - ETF holdings, sector weightings, country exposure
    - Key methods: `getHoldings()`, `getSectorWeighting()`, `getStockExposure()`

12. **IndexesResource** (`indexes.ts`)
    - Index constituents, historical changes
    - Key methods: `getConstituents()`, `getHistoricalConstituents()`

13. **CommoditiesResource** (`commodities.ts`)
    - Commodity prices, quotes, historical data
    - Key methods: `getCommoditiesList()`, `getCommodityQuote()`

14. **EconomicsResource** (`economics.ts`)
    - Treasury rates, economic indicators, market risk premium
    - Key methods: `getTreasuryRates()`, `getEconomicIndicator()`

15. **ValuationResource** (`valuation.ts`)
    - DCF valuations (standard, levered, advanced)
    - Key methods: `getDCF()`, `getLeveredDCF()`, `getAdvancedDCF()`

16. **ESGResource** (`esg.ts`)
    - Environmental, Social, Governance scores & ratings
    - Key methods: `getESGData()`, `getESGRatings()`, `getESGBenchmark()`

17. **COTResource** (`cot.ts`)
    - Commitment of Traders reports & analysis
    - Key methods: `getCOTReport()`, `getCOTAnalysis()`, `getCOTSymbols()`

18. **FundraisersResource** (`fundraisers.ts`)
    - Crowdfunding & equity offering data
    - Key methods: `getCrowdfunding()`, `getEquityOfferings()`

19. **BulkResource** (`bulk.ts`)
    - Bulk data downloads for batch processing
    - Key methods: `getAllProfiles()`, `getBatchEODPrices()`, `getAllIncomeStatements()`

20. **SearchResource** (`search.ts`)
    - Symbol search, company search, stock screener
    - Key methods: `searchBySymbol()`, `searchByName()`, `screenStocks()`

### Type Definitions (`src/types/*.ts`)

Over 150 TypeScript interfaces organized by domain:

- **common.ts** - Shared types: `Period`, `DateRange`, `Pagination`, `FMPConfig`
- **company.ts** - `CompanyProfile`, `Quote`, `Executive`, `MarketCap`, etc.
- **market.ts** - `HistoricalPrice`, `IntradayChart`, `ForexPrice`, `CryptoPrice`
- **financials.ts** - `IncomeStatement`, `BalanceSheet`, `CashFlowStatement`, `FinancialRatios`
- **analyst.ts** - `AnalystEstimate`, `PriceTarget`, `StockGrade`
- **events.ts** - `Earnings`, `Dividend`, `StockSplit`, `IPOCalendar`
- **insider.ts** - `InsiderTrade`, `Form13F`, `InstitutionalHolder`, `CongressionalTrade`
- **news.ts** - `StockNews`, `PressRelease`, `EarningsTranscript`
- **sec.ts** - `SECFiling`, `SICCode`, `CompanyCIKSearch`
- **technical.ts** - `SMA`, `EMA`, `RSI`, `ADX`, etc.
- **performance.ts** - `StockMover`, `SectorPerformance`, `SectorPE`
- **etf.ts** - `ETFHolding`, `ETFInfo`, `ETFSectorWeighting`
- **search.ts** - `StockScreenerParams`, `SymbolSearchResult`

All types are exported from `src/types/index.ts` for easy importing.

---

## 🔧 Configuration

**TypeScript Config (`tsconfig.json`)**
- Target: ES2022
- Module: NodeNext
- Strict mode enabled
- Libraries: ES2022 + DOM

**Build Tool (`tsup`)**
- Dual output: ESM + CommonJS
- Entry: `src/index.ts`
- Output: `dist/`

**Testing (`vitest`)**
- Framework: Vitest
- Coverage: vitest/coverage-v8
- UI: @vitest/ui
- Config: `vitest.config.ts`

**Package Manager**
- pnpm (lockfile: `pnpm-lock.yaml`)

---

## 📚 Documentation

- **README.md** - Main documentation with usage examples
- **API_COVERAGE.md** - Comprehensive endpoint tracking (300+ endpoints, 100% coverage)
- **CONTRIBUTING.md** - Development guidelines & workflow
- **examples/** - 7 real-world usage examples

---

## 🧪 Test Coverage

**Test Structure:**
- **22 test files** - One per resource + core functionality
- **Framework:** Vitest
- **Coverage:** High coverage with unit tests for each resource

**Test Files:**
- Core: `fmp.test.ts`, `errors.test.ts`
- Resources: 20 resource-specific test files

**Running Tests:**
```bash
pnpm test          # Run tests
pnpm coverage      # Run with coverage report
pnpm test:ui       # Run with UI
```

---

## 🔗 Key Dependencies

**Runtime:**
- `ky` (^1.14.1) - Modern HTTP client with retry logic & JSON handling

**Development:**
- `typescript` (^5.9.3) - Type safety
- `vitest` (^4.0.8) - Testing framework
- `tsup` (^8.5.0) - Zero-config bundler
- `eslint` (^9.39.1) - Linting
- `prettier` (^3.6.2) - Code formatting
- `@changesets/cli` (^2.29.7) - Version management

**Zero Production Dependencies** (except `ky`)

---

## 📝 Quick Start

### Installation
```bash
npm install fmp-node-sdk
# or
pnpm add fmp-node-sdk
# or
yarn add fmp-node-sdk
```

### Basic Usage
```typescript
import { FMP } from 'fmp-node-sdk';

const fmp = new FMP({ apiKey: 'your-api-key' });

// Get company profile
const profile = await fmp.company.getProfile('AAPL');

// Get real-time quote
const quote = await fmp.company.getQuote('AAPL');

// Get historical prices
const prices = await fmp.market.getHistoricalPrices('AAPL', '2024-01-01', '2024-12-31');

// Get income statement
const income = await fmp.financials.getIncomeStatement('AAPL', 'annual');
```

### Error Handling
```typescript
import { FMPAuthenticationError, FMPRateLimitError } from 'fmp-node-sdk';

try {
  const quote = await fmp.company.getQuote('AAPL');
} catch (error) {
  if (error instanceof FMPAuthenticationError) {
    console.error('Invalid API key');
  } else if (error instanceof FMPRateLimitError) {
    console.error('Rate limit exceeded, retry after:', error.retryAfter);
  }
}
```

---

## 📊 API Coverage Statistics

- **300+ API endpoints** fully implemented
- **19 resource classes** organized by functionality
- **150+ TypeScript interfaces** for complete type safety
- **100% FMP API coverage** - All documented endpoints
- **22 comprehensive test suites**
- **7 real-world examples**

---

## 🏗️ Architecture

**Design Patterns:**
- **Resource Pattern:** Each API domain is a separate resource class
- **Dependency Injection:** FMPClient injected into all resources
- **Error Hierarchy:** Specific error types for different failure modes
- **Type Safety:** Full TypeScript coverage with exported types

**Data Flow:**
```
User Code
   ↓
FMP Class (orchestrator)
   ↓
Resource Class (company, market, etc.)
   ↓
FMPClient (HTTP wrapper)
   ↓
ky (HTTP library)
   ↓
FMP API
```

**Error Handling Flow:**
```
API Response
   ↓
ky HTTP errors
   ↓
FMPClient transforms to FMPError subclasses
   ↓
Resource methods (pass through)
   ↓
User code (catch specific error types)
```

---

## 🎯 Development Commands

```bash
pnpm install           # Install dependencies
pnpm build             # Build package (ESM + CJS)
pnpm test              # Run tests
pnpm coverage          # Run tests with coverage
pnpm test:ui           # Run tests with UI
pnpm lint              # Lint code
pnpm format            # Format code with Prettier
pnpm check-exports     # Validate package exports
pnpm release           # Build and publish (uses changesets)
```

---

## 📈 Token Efficiency

**Index Benefits:**
- **Before:** Reading all files → ~58,000 tokens per session
- **After:** Reading PROJECT_INDEX.md → ~3,000 tokens per session
- **Savings:** 94% token reduction
- **Use Case:** Quick codebase orientation without reading all files

**Index Size:** ~4KB (human-readable, comprehensive)

---

## 🔍 Finding Code

**By Feature:**
- Company data → `src/resources/company.ts`
- Market prices → `src/resources/market.ts`
- Financial statements → `src/resources/financials.ts`
- Analyst data → `src/resources/analyst.ts`
- Events → `src/resources/events.ts`
- Insider trading → `src/resources/insider.ts`

**By Type:**
- All types → `src/types/index.ts`
- Specific domain types → `src/types/{domain}.ts`

**By Example:**
- Portfolio tracking → `examples/portfolio-tracker.ts`
- Financial analysis → `examples/financial-analysis.ts`
- Market screening → `examples/market-screener.ts`

**By Test:**
- Resource tests → `tests/{resource}.test.ts`
- Error handling → `tests/errors.test.ts`

---

**Last Updated:** 2025-12-24
**Index Version:** 1.0
**Repository:** https://github.com/nip10/fmp-node-sdk
