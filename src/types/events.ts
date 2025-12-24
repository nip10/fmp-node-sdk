/**
 * Corporate events types
 */

/**
 * Earnings data
 */
export interface Earnings {
  date: string;
  symbol: string;
  eps: number;
  epsEstimated: number;
  time: string;
  revenue: number;
  revenueEstimated: number;
  fiscalDateEnding: string;
  updatedFromDate: string;
}

/**
 * Earnings calendar
 */
export interface EarningsCalendar {
  date: string;
  symbol: string;
  eps: number | null;
  epsEstimated: number | null;
  time: string;
  revenue: number | null;
  revenueEstimated: number | null;
  fiscalDateEnding: string;
  updatedFromDate: string;
}

/**
 * Dividend data
 */
export interface Dividend {
  date: string;
  label: string;
  adjDividend: number;
  dividend: number;
  recordDate: string;
  paymentDate: string;
  declarationDate: string;
}

/**
 * Dividend calendar
 */
export interface DividendCalendar {
  date: string;
  label: string;
  adjDividend: number;
  symbol: string;
  dividend: number;
  recordDate: string;
  paymentDate: string;
  declarationDate: string;
}

/**
 * Stock split data
 */
export interface StockSplit {
  date: string;
  label: string;
  symbol: string;
  numerator: number;
  denominator: number;
}

/**
 * IPO calendar
 */
export interface IPOCalendar {
  date: string;
  company: string;
  symbol: string;
  exchange: string;
  actions: string;
  shares: number;
  priceRange: string;
  marketCap: number;
}

/**
 * IPO Prospectus/Disclosure
 */
export interface IPOProspectus {
  date: string;
  company: string;
  symbol: string;
  exchange: string;
  actions: string;
  shares: number;
  priceRange: string;
  marketCap: number;
}

/**
 * Confirmed IPO
 */
export interface IPOConfirmed {
  date: string;
  company: string;
  symbol: string;
  exchange: string;
  actions: string;
  shares: number;
  priceRange: string;
  marketCap: number;
}

/**
 * Economic calendar event
 */
export interface EconomicCalendar {
  event: string;
  date: string;
  country: string;
  actual: number;
  previous: number;
  change: number;
  changePercentage: number;
  estimate: number;
  impact: string;
}
