/**
 * Company-related types
 */

/**
 * Company profile information
 */
export interface CompanyProfile {
  symbol: string;
  price: number;
  beta: number;
  volAvg: number;
  mktCap: number;
  lastDiv: number;
  range: string;
  changes: number;
  companyName: string;
  currency: string;
  cik: string;
  isin: string;
  cusip: string;
  exchange: string;
  exchangeShortName: string;
  industry: string;
  website: string;
  description: string;
  ceo: string;
  sector: string;
  country: string;
  fullTimeEmployees: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  dcfDiff: number;
  dcf: number;
  image: string;
  ipoDate: string;
  defaultImage: boolean;
  isEtf: boolean;
  isActivelyTrading: boolean;
  isAdr: boolean;
  isFund: boolean;
}

/**
 * Stock quote data
 */
export interface Quote {
  symbol: string;
  name: string;
  price: number;
  changesPercentage: number;
  change: number;
  dayLow: number;
  dayHigh: number;
  yearHigh: number;
  yearLow: number;
  marketCap: number | null;
  priceAvg50: number | null;
  priceAvg200: number | null;
  exchange: string;
  volume: number;
  avgVolume: number;
  open: number;
  previousClose: number;
  eps: number | null;
  pe: number | null;
  earningsAnnouncement: string | null;
  sharesOutstanding: number | null;
  timestamp: number;
}

/**
 * Available trading symbols
 */
export interface SymbolsList {
  symbol: string;
  name: string;
  price: number;
  exchange: string;
  exchangeShortName: string;
  type: string;
}

/**
 * Company notes
 */
export interface CompanyNotes {
  symbol: string;
  cik: string;
  title: string;
  exchange: string;
}

/**
 * Stock peers
 */
export interface StockPeer {
  symbol: string;
  peersList: string[];
}

/**
 * Delisted company
 */
export interface DelistedCompany {
  symbol: string;
  companyName: string;
  exchange: string;
  ipoDate: string;
  delistedDate: string;
}

/**
 * Employee count
 */
export interface EmployeeCount {
  symbol: string;
  cik: string;
  acceptanceTime: string;
  periodOfReport: string;
  companyName: string;
  formType: string;
  filingDate: string;
  employeeCount: number;
  source: string;
}

/**
 * Historical employee count
 */
export interface HistoricalEmployeeCount {
  symbol: string;
  cik: string;
  acceptanceTime: string;
  periodOfReport: string;
  companyName: string;
  formType: string;
  filingDate: string;
  employeeCount: number;
  source: string;
}

/**
 * Market capitalization
 */
export interface MarketCap {
  symbol: string;
  date: string;
  marketCap: number;
}

/**
 * Historical market capitalization
 */
export interface HistoricalMarketCap {
  symbol: string;
  date: string;
  marketCap: number;
}

/**
 * Shares float
 */
export interface SharesFloat {
  symbol: string;
  date: string;
  freeFloat: number;
  floatShares: number;
  outstandingShares: number;
  source: string;
}

/**
 * Merger and acquisition
 */
export interface MergerAcquisition {
  symbol: string;
  companyName: string;
  targetedCompanySymbol: string;
  targetedCompanyName: string;
  transactionDate: string;
  acceptanceTime: string;
  url: string;
}

/**
 * Company executive
 */
export interface Executive {
  title: string;
  name: string;
  pay: number;
  currencyPay: string;
  gender: string;
  yearBorn: number;
  titleSince: number;
}

/**
 * Executive compensation
 */
export interface ExecutiveCompensation {
  cik: string;
  symbol: string;
  companyName: string;
  industryTitle: string;
  filingDate: string;
  acceptanceDate: string;
  nameAndPosition: string;
  year: number;
  salary: number;
  bonus: number;
  stockAward: number;
  incentivePlanCompensation: number;
  allOtherCompensation: number;
  total: number;
  url: string;
}

/**
 * Compensation benchmark
 */
export interface CompensationBenchmark {
  industryTitle: string;
  year: number;
  averageSalary: number;
  averageBonus: number;
  averageStockAward: number;
  averageIncentivePlanCompensation: number;
  averageAllOtherCompensation: number;
  averageTotal: number;
}

/**
 * CIK mapping
 */
export interface CIKMapping {
  cik: string;
  name: string;
}

/**
 * Symbol change
 */
export interface SymbolChange {
  date: string;
  name: string;
  oldSymbol: string;
  newSymbol: string;
}

/**
 * Exchange information
 */
export interface ExchangeInfo {
  name: string;
  code: string;
  exchangeShortName: string;
  country: string;
}

/**
 * Sector/Industry
 */
export interface SectorIndustry {
  sector?: string;
  industry?: string;
}

/**
 * Tradable symbol
 */
export interface TradableSymbol {
  symbol: string;
  name: string;
  price: number;
  exchange: string;
}

/**
 * Short quote (simplified quote data)
 */
export interface QuoteShort {
  symbol: string;
  price: number;
  volume: number;
}

/**
 * Aftermarket trade data
 */
export interface AftermarketTrade {
  symbol: string;
  price: number;
  size: number;
  timestamp: number;
}

/**
 * Aftermarket quote data
 */
export interface AftermarketQuote {
  symbol: string;
  ask: number;
  bid: number;
  asize: number;
  bsize: number;
  timestamp: number;
}

/**
 * Stock price change data
 */
export interface PriceChange {
  symbol: string;
  '1D': number | null;
  '5D': number | null;
  '1M': number | null;
  '3M': number | null;
  '6M': number | null;
  ytd: number | null;
  '1Y': number | null;
  '3Y': number | null;
  '5Y': number | null;
  '10Y': number | null;
  max: number | null;
}

/**
 * Enterprise value data
 */
export interface EnterpriseValue {
  symbol: string;
  date: string;
  stockPrice: number | null;
  numberOfShares: number | null;
  marketCapitalization: number | null;
  minusCashAndCashEquivalents: number | null;
  addTotalDebt: number | null;
  enterpriseValue: number | null;
}

/**
 * ETF/Fund list item
 */
export interface FundListItem {
  symbol: string;
  name: string;
  price: number | null;
  exchange: string;
  exchangeShortName: string;
}
