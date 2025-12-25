import type { FMPClient } from '../client.js';
import type {
  IndexConstituent,
  HistoricalIndexConstituent,
  Quote,
  HistoricalPrice,
  IntradayChart,
} from '../types/index.js';
import { IntradayInterval } from './market.js';

/**
 * Indexes resource
 * Provides access to index quotes and constituents (S&P 500, NASDAQ, Dow Jones)
 */
export class IndexesResource {
  constructor(private readonly client: FMPClient) {}

  /**
   * Get S&P 500 constituents
   */
  async getSP500Constituents(): Promise<IndexConstituent[]> {
    return this.client.get<IndexConstituent[]>('sp500-constituent');
  }

  /**
   * Get NASDAQ constituents
   */
  async getNASDAQConstituents(): Promise<IndexConstituent[]> {
    return this.client.get<IndexConstituent[]>('nasdaq-constituent');
  }

  /**
   * Get Dow Jones constituents
   */
  async getDowJonesConstituents(): Promise<IndexConstituent[]> {
    return this.client.get<IndexConstituent[]>('dowjones-constituent');
  }

  /**
   * Get historical S&P 500 constituents
   */
  async getHistoricalSP500(): Promise<HistoricalIndexConstituent[]> {
    return this.client.get<HistoricalIndexConstituent[]>('historical-sp500-constituent');
  }

  /**
   * Get historical NASDAQ constituents
   */
  async getHistoricalNASDAQ(): Promise<HistoricalIndexConstituent[]> {
    return this.client.get<HistoricalIndexConstituent[]>('historical-nasdaq-constituent');
  }

  /**
   * Get historical Dow Jones constituents
   */
  async getHistoricalDowJones(): Promise<HistoricalIndexConstituent[]> {
    return this.client.get<HistoricalIndexConstituent[]>('historical-dowjones-constituent');
  }

  /**
   * Get index quote
   * @param symbol - Index symbol (e.g., "^GSPC" for S&P 500)
   */
  async getQuote(symbol: string): Promise<Quote[]> {
    return this.client.get<Quote[]>('quote', {
      searchParams: { symbol: symbol.toUpperCase() },
    });
  }

  /**
   * Get short quote (simplified quote data)
   * @param symbol - Index symbol
   */
  async getQuoteShort(symbol: string): Promise<Record<string, unknown>[]> {
    return this.client.get<Record<string, unknown>[]>('quote-short', {
      searchParams: { symbol: symbol.toUpperCase() },
    });
  }

  /**
   * Get all index quotes
   */
  async getAllQuotes(): Promise<Quote[]> {
    return this.client.get<Quote[]>('batch-index-quotes');
  }

  /**
   * Get index list
   */
  async getList(): Promise<Record<string, unknown>[]> {
    return this.client.get<Record<string, unknown>[]>('index-list');
  }

  /**
   * Get historical index prices
   * @param symbol - Index symbol
   * @param from - Start date (YYYY-MM-DD)
   * @param to - End date (YYYY-MM-DD)
   */
  async getHistoricalPrices(
    symbol: string,
    from?: string,
    to?: string
  ): Promise<HistoricalPrice[]> {
    const params: Record<string, string> = { symbol: symbol.toUpperCase() };
    if (from) params.from = from;
    if (to) params.to = to;

    return this.client.get<HistoricalPrice[]>('historical-price-eod/full', {
      searchParams: params,
    });
  }

  /**
   * Get historical index prices (light version - date and close only)
   * @param symbol - Index symbol
   * @param from - Start date (YYYY-MM-DD)
   * @param to - End date (YYYY-MM-DD)
   */
  async getHistoricalLight(
    symbol: string,
    from?: string,
    to?: string
  ): Promise<{ date: string; close: number }[]> {
    const params: Record<string, string> = { symbol: symbol.toUpperCase() };
    if (from) params.from = from;
    if (to) params.to = to;

    return this.client.get<{ date: string; close: number }[]>('historical-price-eod/light', {
      searchParams: params,
    });
  }

  /**
   * Get intraday index chart
   * @param symbol - Index symbol
   * @param interval - Time interval
   * @param from - Start date (YYYY-MM-DD)
   * @param to - End date (YYYY-MM-DD)
   */
  async getIntradayChart(
    symbol: string,
    interval: IntradayInterval = IntradayInterval.OneHour,
    from?: string,
    to?: string
  ): Promise<IntradayChart[]> {
    const params: Record<string, string> = { symbol: symbol.toUpperCase() };
    if (from) params.from = from;
    if (to) params.to = to;

    return this.client.get<IntradayChart[]>(`historical-chart/${interval}`, {
      searchParams: params,
    });
  }
}
