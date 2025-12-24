/**
 * Commitment of Traders (COT) data types
 */

/**
 * COT Report data
 */
export interface COTReport {
  symbol: string;
  name: string;
  date: string;
  short_name: string;
  exchange: string;
  current_long_marketmaker: number;
  current_short_marketmaker: number;
  current_long_otherreportables: number;
  current_short_otherreportables: number;
  current_long_nonreportables: number;
  current_short_nonreportables: number;
  change_long_marketmaker: number;
  change_short_marketmaker: number;
  change_long_otherreportables: number;
  change_short_otherreportables: number;
  change_long_nonreportables: number;
  change_short_nonreportables: number;
  pct_long_marketmaker: number;
  pct_short_marketmaker: number;
  pct_long_otherreportables: number;
  pct_short_otherreportables: number;
  pct_long_nonreportables: number;
  pct_short_nonreportables: number;
}

/**
 * COT Analysis data
 */
export interface COTAnalysis {
  symbol: string;
  name: string;
  date: string;
  short_name: string;
  exchange: string;
  netposition_marketmaker: number;
  netposition_otherreportables: number;
  netposition_nonreportables: number;
  change_netposition_marketmaker: number;
  change_netposition_otherreportables: number;
  change_netposition_nonreportables: number;
  pct_netposition_marketmaker: number;
  pct_netposition_otherreportables: number;
  pct_netposition_nonreportables: number;
}

/**
 * COT Symbol
 */
export interface COTSymbol {
  symbol: string;
  name: string;
  trading_symbol: string;
}
