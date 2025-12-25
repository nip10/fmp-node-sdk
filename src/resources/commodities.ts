import type { FMPClient } from '../client.js';
import type {
  CommodityList,
  CommodityQuote,
  HistoricalPrice,
  IntradayChart,
} from '../types/index.js';
import { IntradayInterval } from './market.js';

/**
 * Commodities resource
 * Provides access to commodity quotes and historical data
 */
export class CommoditiesResource {
  constructor(private readonly client: FMPClient) {}

  /**
   * Get commodities list
   */
  async getList(): Promise<CommodityList[]> {
    return this.client.get<CommodityList[]>('commodities-list');
  }

  /**
   * Get commodity quote
   * @param symbol - Commodity symbol (e.g., "GCUSD" for Gold)
   */
  async getQuote(symbol: string): Promise<CommodityQuote[]> {
    return this.client.get<CommodityQuote[]>('quote', {
      searchParams: { symbol: symbol.toUpperCase() },
    });
  }

  /**
   * Get short quote (simplified quote data)
   * @param symbol - Commodity symbol
   */
  async getQuoteShort(symbol: string): Promise<Record<string, unknown>[]> {
    return this.client.get<Record<string, unknown>[]>('quote-short', {
      searchParams: { symbol: symbol.toUpperCase() },
    });
  }

  /**
   * Get all commodity quotes
   */
  async getAllQuotes(): Promise<CommodityQuote[]> {
    return this.client.get<CommodityQuote[]>('batch-commodity-quotes');
  }

  /**
   * Get historical commodity prices
   * @param symbol - Commodity symbol
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
   * Get historical commodity prices (light version - date and close only)
   * @param symbol - Commodity symbol
   * @param from - Start date (YYYY-MM-DD)
   * @param to - End date (YYYY-MM-DD)
   */
  async getLightChart(
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
   * Get intraday commodity chart
   * @param symbol - Commodity symbol
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
