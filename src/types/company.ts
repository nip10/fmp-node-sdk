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
  marketCap: number;
  priceAvg50: number;
  priceAvg200: number;
  exchange: string;
  volume: number;
  avgVolume: number;
  open: number;
  previousClose: number;
  eps: number;
  pe: number;
  earningsAnnouncement: string;
  sharesOutstanding: number;
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
