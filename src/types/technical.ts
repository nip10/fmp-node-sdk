/**
 * Technical indicators types
 */

/**
 * Simple Moving Average
 */
export interface SMA {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  sma: number;
}

/**
 * Exponential Moving Average
 */
export interface EMA {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  ema: number;
}

/**
 * Relative Strength Index
 */
export interface RSI {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  rsi: number;
}

/**
 * ADX indicator
 */
export interface ADX {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  adx: number;
}

/**
 * Williams %R
 */
export interface Williams {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  williams: number;
}

/**
 * Standard Deviation
 */
export interface StandardDeviation {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  standardDeviation: number;
}

/**
 * Weighted Moving Average
 */
export interface WMA {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  wma: number;
}

/**
 * Double Exponential Moving Average
 */
export interface DEMA {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  dema: number;
}

/**
 * Triple Exponential Moving Average
 */
export interface TEMA {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  tema: number;
}
