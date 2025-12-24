/**
 * Search-related types
 */

/**
 * Symbol search result
 */
export interface SymbolSearchResult {
  symbol: string;
  name: string;
  currency: string;
  stockExchange: string;
  exchangeShortName: string;
}

/**
 * Name search result
 */
export interface NameSearchResult {
  symbol: string;
  name: string;
  currency: string;
  stockExchange: string;
  exchangeShortName: string;
}

/**
 * CIK search result
 */
export interface CIKSearchResult {
  cik: string;
  name: string;
}

/**
 * CUSIP search result
 */
export interface CUSIPSearchResult {
  symbol: string;
  name: string;
  cusip: string;
  isin: string;
  exchange: string;
}

/**
 * ISIN search result
 */
export interface ISINSearchResult {
  symbol: string;
  name: string;
  isin: string;
  cusip: string;
  exchange: string;
}

/**
 * Stock screener parameters
 */
export interface StockScreenerParams {
  marketCapMoreThan?: number;
  marketCapLowerThan?: number;
  priceMoreThan?: number;
  priceLowerThan?: number;
  betaMoreThan?: number;
  betaLowerThan?: number;
  volumeMoreThan?: number;
  volumeLowerThan?: number;
  dividendMoreThan?: number;
  dividendLowerThan?: number;
  isEtf?: boolean;
  isActivelyTrading?: boolean;
  sector?: string;
  industry?: string;
  country?: string;
  exchange?: string;
  limit?: number;
}

/**
 * Stock screener result
 */
export interface StockScreenerResult {
  symbol: string;
  companyName: string;
  marketCap: number;
  sector: string;
  industry: string;
  beta: number;
  price: number;
  lastAnnualDividend: number;
  volume: number;
  exchange: string;
  exchangeShortName: string;
  country: string;
  isEtf: boolean;
  isActivelyTrading: boolean;
}

/**
 * Exchange symbol list item
 */
export interface ExchangeSymbol {
  symbol: string;
  name: string;
  price: number;
  exchange: string;
  exchangeShortName: string;
  type: string;
}
