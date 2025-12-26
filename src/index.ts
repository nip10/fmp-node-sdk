/**
 * FMP Node SDK - TypeScript SDK for Financial Modeling Prep API
 * @packageDocumentation
 */

export { FMP } from './fmp.js';
export type { FMPConfig, RequestInterceptor } from './types/index.js';

// Cache exports
export { MemoryCache, CacheTTL, DEFAULT_ENDPOINT_TTLS } from './cache/index.js';
export type {
  CacheProvider,
  CacheConfig,
  CacheEntry,
  EndpointTTLConfig,
} from './cache/index.js';

// Export enums (values, not just types)
export { Period, Exchange } from './types/index.js';
export { IntradayInterval } from './resources/market.js';
export { TechnicalTimeframe } from './resources/technical.js';

// Export types
export type {
  DateRange,
  Pagination,
  // Company types
  CompanyProfile,
  Quote,
  SymbolsList,
  CompanyNotes,
  StockPeer,
  DelistedCompany,
  EmployeeCount,
  HistoricalEmployeeCount,
  MarketCap,
  HistoricalMarketCap,
  SharesFloat,
  MergerAcquisition,
  Executive,
  ExecutiveCompensation,
  CompensationBenchmark,
  CIKMapping,
  SymbolChange,
  ExchangeInfo,
  SectorIndustry,
  TradableSymbol,
  // Market types
  HistoricalPrice,
  IntradayChart,
  ForexPrice,
  CryptoPrice,
  MarketHours,
  MarketHoliday,
  // Financial statement types
  IncomeStatement,
  BalanceSheet,
  CashFlowStatement,
  FinancialRatios,
  KeyMetrics,
  FinancialScores,
  OwnerEarnings,
  FinancialGrowth,
  ReportDate,
  LatestFinancialStatement,
  FinancialReportDownload,
  // Analyst types
  AnalystEstimate,
  PriceTarget,
  PriceTargetSummary,
  PriceTargetConsensus,
  AnalystRecommendation,
  StockGrade,
  UpgradesDowngradesConsensus,
  // Events types
  Earnings,
  EarningsCalendar,
  Dividend,
  DividendCalendar,
  StockSplit,
  IPOCalendar,
  EconomicCalendar,
  // Insider types
  InsiderTrade,
  InsiderTradingStatistics,
  InsiderRoster,
  InstitutionalHolder,
  Form13F,
  CongressionalTrade,
  // News types
  FMPArticle,
  StockNews,
  PressRelease,
  EarningsTranscript,
  // SEC types
  SECFiling,
  SECRSSFeed,
  SICCode,
  CompanyCIKSearch,
  // Technical types
  SMA,
  EMA,
  RSI,
  ADX,
  Williams,
  StandardDeviation,
  WMA,
  DEMA,
  TEMA,
  // Performance types
  StockMover,
  SectorPerformance,
  SectorPE,
  HistoricalSectorPerformance,
  // ETF types
  ETFHolding,
  ETFInfo,
  ETFSectorWeighting,
  ETFCountryWeighting,
  ETFStockExposure,
  MutualFundHolder,
  // Index types
  IndexConstituent,
  HistoricalIndexConstituent,
  // Commodities types
  CommodityList,
  CommodityQuote,
  // Economics types
  TreasuryRate,
  EconomicIndicator,
  MarketRiskPremium,
  // Valuation types
  DCFValuation,
  LeveredDCF,
  AdvancedDCF,
  // ESG types
  ESGData,
  ESGRating,
  ESGBenchmark,
  // COT types
  COTReport,
  COTAnalysis,
  COTSymbol,
  // Fundraisers types
  Crowdfunding,
  EquityOffering,
  CrowdfundingRSSItem,
  EquityOfferingRSSItem,
  // Search types
  SymbolSearchResult,
  NameSearchResult,
  CIKSearchResult,
  CUSIPSearchResult,
  ISINSearchResult,
  StockScreenerParams,
  StockScreenerResult,
  ExchangeSymbol,
  // Financial statement growth types
  IncomeStatementGrowth,
  BalanceSheetGrowth,
  CashFlowStatementGrowth,
} from './types/index.js';

// Export bulk types
export type {
  EarningsSurprise,
  EODPrice,
} from './resources/bulk.js';

// Export errors
export {
  FMPError,
  FMPAPIError,
  FMPValidationError,
} from './errors/index.js';

// Export economic indicator names
export type { EconomicIndicatorName } from './resources/economics.js';
