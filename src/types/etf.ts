/**
 * ETF and Mutual Fund types
 */

/**
 * ETF holding
 */
export interface ETFHolding {
  asset: string;
  name: string;
  shares: number;
  weightPercentage: string;
  marketValue: number;
}

/**
 * ETF information
 */
export interface ETFInfo {
  symbol: string;
  companyName: string;
  cik: string;
  isin: string;
  cusip: string;
  exchange: string;
  exchangeShortName: string;
  description: string;
  domicile: string;
  etfCompany: string;
  aum: number;
  nav: number;
  navCurrency: string;
  expenseRatio: number;
  inceptionDate: string;
  website: string;
}

/**
 * ETF sector weighting
 */
export interface ETFSectorWeighting {
  sector: string;
  weightPercentage: string;
}

/**
 * ETF country weighting
 */
export interface ETFCountryWeighting {
  country: string;
  weightPercentage: string;
}

/**
 * Stock exposure to ETFs
 */
export interface ETFStockExposure {
  etfSymbol: string;
  assetExposure: string;
  sharesNumber: number;
  weightPercentage: string;
  marketValue: number;
}

/**
 * Mutual fund holder
 */
export interface MutualFundHolder {
  holder: string;
  shares: number;
  dateReported: string;
  change: number;
  weightPercent: number;
}
