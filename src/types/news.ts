/**
 * News and press releases types
 */

/**
 * FMP article
 */
export interface FMPArticle {
  title: string;
  date: string;
  content: string;
  tickers: string;
  image: string;
  link: string;
  author: string;
  site: string;
}

/**
 * Stock news
 */
export interface StockNews {
  symbol: string;
  publishedDate: string;
  title: string;
  image: string;
  site: string;
  text: string;
  url: string;
}

/**
 * Press release
 */
export interface PressRelease {
  symbol: string;
  date: string;
  title: string;
  text: string;
}

/**
 * Earnings transcript
 */
export interface EarningsTranscript {
  symbol: string;
  quarter: number;
  year: number;
  date: string;
  content: string;
}
