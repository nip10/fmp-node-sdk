import type { FMPClient } from '../client.js';
import type { SMA, EMA, RSI, ADX, Williams, StandardDeviation, WMA, DEMA, TEMA } from '../types/index.js';

/**
 * Technical indicators timeframes
 */
export enum TechnicalTimeframe {
  OneMin = '1min',
  FiveMin = '5min',
  FifteenMin = '15min',
  ThirtyMin = '30min',
  OneHour = '1hour',
  FourHour = '4hour',
  Daily = '1day',
}

/**
 * Technical indicators resource
 */
export class TechnicalResource {
  constructor(private readonly client: FMPClient) {}

  /**
   * Get Simple Moving Average (SMA)
   * @param symbol - Stock symbol
   * @param period - Period length
   * @param timeframe - Time interval
   */
  async getSMA(
    symbol: string,
    period = 10,
    timeframe: TechnicalTimeframe = TechnicalTimeframe.Daily
  ): Promise<SMA[]> {
    return this.client.get<SMA[]>(`v3/technical_indicator/${timeframe}/${symbol.toUpperCase()}`, {
      searchParams: { type: 'sma', period },
    });
  }

  /**
   * Get Exponential Moving Average (EMA)
   * @param symbol - Stock symbol
   * @param period - Period length
   * @param timeframe - Time interval
   */
  async getEMA(
    symbol: string,
    period = 10,
    timeframe: TechnicalTimeframe = TechnicalTimeframe.Daily
  ): Promise<EMA[]> {
    return this.client.get<EMA[]>(`v3/technical_indicator/${timeframe}/${symbol.toUpperCase()}`, {
      searchParams: { type: 'ema', period },
    });
  }

  /**
   * Get Relative Strength Index (RSI)
   * @param symbol - Stock symbol
   * @param period - Period length
   * @param timeframe - Time interval
   */
  async getRSI(
    symbol: string,
    period = 14,
    timeframe: TechnicalTimeframe = TechnicalTimeframe.Daily
  ): Promise<RSI[]> {
    return this.client.get<RSI[]>(`v3/technical_indicator/${timeframe}/${symbol.toUpperCase()}`, {
      searchParams: { type: 'rsi', period },
    });
  }

  /**
   * Get ADX indicator
   * @param symbol - Stock symbol
   * @param period - Period length
   * @param timeframe - Time interval
   */
  async getADX(
    symbol: string,
    period = 14,
    timeframe: TechnicalTimeframe = TechnicalTimeframe.Daily
  ): Promise<ADX[]> {
    return this.client.get<ADX[]>(`v3/technical_indicator/${timeframe}/${symbol.toUpperCase()}`, {
      searchParams: { type: 'adx', period },
    });
  }

  /**
   * Get Williams %R
   * @param symbol - Stock symbol
   * @param period - Period length
   * @param timeframe - Time interval
   */
  async getWilliams(
    symbol: string,
    period = 14,
    timeframe: TechnicalTimeframe = TechnicalTimeframe.Daily
  ): Promise<Williams[]> {
    return this.client.get<Williams[]>(`v3/technical_indicator/${timeframe}/${symbol.toUpperCase()}`, {
      searchParams: { type: 'williams', period },
    });
  }

  /**
   * Get Standard Deviation
   * @param symbol - Stock symbol
   * @param period - Period length
   * @param timeframe - Time interval
   */
  async getStandardDeviation(
    symbol: string,
    period = 10,
    timeframe: TechnicalTimeframe = TechnicalTimeframe.Daily
  ): Promise<StandardDeviation[]> {
    return this.client.get<StandardDeviation[]>(
      `v3/technical_indicator/${timeframe}/${symbol.toUpperCase()}`,
      {
        searchParams: { type: 'standardDeviation', period },
      }
    );
  }

  /**
   * Get Weighted Moving Average (WMA)
   * @param symbol - Stock symbol
   * @param period - Period length
   * @param timeframe - Time interval
   */
  async getWMA(
    symbol: string,
    period = 10,
    timeframe: TechnicalTimeframe = TechnicalTimeframe.Daily
  ): Promise<WMA[]> {
    return this.client.get<WMA[]>(`v3/technical_indicator/${timeframe}/${symbol.toUpperCase()}`, {
      searchParams: { type: 'wma', period },
    });
  }

  /**
   * Get Double Exponential Moving Average (DEMA)
   * @param symbol - Stock symbol
   * @param period - Period length
   * @param timeframe - Time interval
   */
  async getDEMA(
    symbol: string,
    period = 10,
    timeframe: TechnicalTimeframe = TechnicalTimeframe.Daily
  ): Promise<DEMA[]> {
    return this.client.get<DEMA[]>(`v3/technical_indicator/${timeframe}/${symbol.toUpperCase()}`, {
      searchParams: { type: 'dema', period },
    });
  }

  /**
   * Get Triple Exponential Moving Average (TEMA)
   * @param symbol - Stock symbol
   * @param period - Period length
   * @param timeframe - Time interval
   */
  async getTEMA(
    symbol: string,
    period = 10,
    timeframe: TechnicalTimeframe = TechnicalTimeframe.Daily
  ): Promise<TEMA[]> {
    return this.client.get<TEMA[]>(`v3/technical_indicator/${timeframe}/${symbol.toUpperCase()}`, {
      searchParams: { type: 'tema', period },
    });
  }
}
