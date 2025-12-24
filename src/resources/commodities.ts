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
    return this.client.get<CommodityList[]>('v3/symbol/available-commodities');
  }

  /**
   * Get commodity quote
   * @param symbol - Commodity symbol (e.g., "GCUSD" for Gold)
   */
  async getQuote(symbol: string): Promise<CommodityQuote[]> {
    return this.client.get<CommodityQuote[]>(`v3/quote/${symbol.toUpperCase()}`);
  }

  /**
   * Get short quote (simplified quote data)
   * @param symbol - Commodity symbol
   */
  async getQuoteShort(symbol: string): Promise<Record<string, unknown>[]> {
    return this.client.get<Record<string, unknown>[]>(`v3/quote-short/${symbol.toUpperCase()}`);
  }

  /**
   * Get all commodity quotes
   */
  async getAllQuotes(): Promise<CommodityQuote[]> {
    return this.client.get<CommodityQuote[]>('v3/quotes/commodity');
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
  ): Promise<{ historical: HistoricalPrice[] }> {
    const params: Record<string, string> = {};
    if (from) params.from = from;
    if (to) params.to = to;

    return this.client.get<{ historical: HistoricalPrice[] }>(
      `v3/historical-price-full/${symbol.toUpperCase()}`,
      { searchParams: params }
    );
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
    const params: Record<string, string> = {};
    if (from) params.from = from;
    if (to) params.to = to;

    return this.client.get<{ date: string; close: number }[]>(
      `v3/historical-chart/line/${symbol.toUpperCase()}`,
      { searchParams: params }
    );
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
    const params: Record<string, string> = {};
    if (from) params.from = from;
    if (to) params.to = to;

    return this.client.get<IntradayChart[]>(
      `v3/historical-chart/${interval}/${symbol.toUpperCase()}`,
      { searchParams: params }
    );
  }
}
