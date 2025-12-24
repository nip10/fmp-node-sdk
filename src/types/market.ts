/**
 * Market and price-related types
 */

/**
 * Historical price data
 */
export interface HistoricalPrice {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  adjClose: number;
  volume: number;
  unadjustedVolume: number;
  change: number;
  changePercent: number;
  vwap: number;
  label: string;
  changeOverTime: number;
}

/**
 * Intraday chart data point
 */
export interface IntradayChart {
  date: string;
  open: number;
  low: number;
  high: number;
  close: number;
  volume: number;
}

/**
 * Forex pair data
 */
export interface ForexPrice {
  ticker: string;
  bid: number;
  ask: number;
  open: number;
  low: number;
  high: number;
  changes: number;
  date: string;
}

/**
 * Cryptocurrency data
 */
export interface CryptoPrice {
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
  volume: number;
  avgVolume: number;
  exchange: string;
  open: number;
  previousClose: number;
  timestamp: number;
}

/**
 * Market hours
 */
export interface MarketHours {
  stockExchangeName: string;
  stockMarketHours: {
    openingHour: string;
    closingHour: string;
  };
  stockMarketHolidays: string[];
  isTheStockMarketOpen: boolean;
  isTheEuronextMarketOpen: boolean;
  isTheForexMarketOpen: boolean;
  isTheCryptoMarketOpen: boolean;
}

/**
 * Market holiday
 */
export interface MarketHoliday {
  year: number;
  'New Years Day': string;
  'Martin Luther King, Jr. Day': string;
  "Washington's Birthday": string;
  'Good Friday': string;
  'Memorial Day': string;
  'Independence Day': string;
  'Labor Day': string;
  'Thanksgiving Day': string;
  'Christmas': string;
}

/**
 * Forex currency pair
 */
export interface ForexCurrencyPair {
  symbol: string;
  name: string;
  currency: string;
  stockExchange: string;
  exchangeShortName: string;
}

/**
 * Forex quote (short format)
 */
export interface ForexQuoteShort {
  symbol: string;
  price: number;
  volume: number;
}

/**
 * Light chart data point (date and close only)
 */
export interface LightChartData {
  date: string;
  close: number;
}

/**
 * Cryptocurrency list item
 */
export interface CryptoList {
  symbol: string;
  name: string;
  currency: string;
  stockExchange: string;
  exchangeShortName: string;
}
