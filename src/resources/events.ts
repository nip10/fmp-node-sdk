import type { FMPClient } from '../client.js';
import type {
  Earnings,
  EarningsCalendar,
  Dividend,
  DividendCalendar,
  StockSplit,
  IPOCalendar,
  IPOProspectus,
  IPOConfirmed,
  EconomicCalendar,
} from '../types/index.js';

/**
 * Corporate events resource
 * Provides access to earnings, dividends, stock splits, IPOs, and economic events
 */
export class EventsResource {
  constructor(private readonly client: FMPClient) {}

  /**
   * Get historical earnings
   * @param symbol - Stock symbol
   * @param limit - Number of results
   */
  async getEarnings(symbol: string, limit?: number): Promise<Earnings[]> {
    const params: Record<string, string | number> = { symbol: symbol.toUpperCase() };
    if (limit) params.limit = limit;

    return this.client.get<Earnings[]>('earnings', {
      searchParams: params,
    });
  }

  /**
   * Get earnings calendar
   * @param from - Start date (YYYY-MM-DD)
   * @param to - End date (YYYY-MM-DD)
   */
  async getEarningsCalendar(from?: string, to?: string): Promise<EarningsCalendar[]> {
    const params: Record<string, string> = {};
    if (from) params.from = from;
    if (to) params.to = to;

    return this.client.get<EarningsCalendar[]>('earnings-calendar', {
      searchParams: params,
    });
  }

  /**
   * Get confirmed earnings
   * @param from - Start date (YYYY-MM-DD)
   * @param to - End date (YYYY-MM-DD)
   */
  async getConfirmedEarnings(from?: string, to?: string): Promise<EarningsCalendar[]> {
    const params: Record<string, string> = {};
    if (from) params.from = from;
    if (to) params.to = to;

    return this.client.get<EarningsCalendar[]>('earnings-calendar-confirmed', {
      searchParams: params,
    });
  }

  /**
   * Get historical dividends
   * @param symbol - Stock symbol
   */
  async getDividends(symbol: string): Promise<Dividend[]> {
    return this.client.get<Dividend[]>('dividends', {
      searchParams: { symbol: symbol.toUpperCase() },
    });
  }

  /**
   * Get dividend calendar
   * @param from - Start date (YYYY-MM-DD)
   * @param to - End date (YYYY-MM-DD)
   */
  async getDividendCalendar(from?: string, to?: string): Promise<DividendCalendar[]> {
    const params: Record<string, string> = {};
    if (from) params.from = from;
    if (to) params.to = to;

    return this.client.get<DividendCalendar[]>('dividends-calendar', {
      searchParams: params,
    });
  }

  /**
   * Get historical stock splits
   * @param symbol - Stock symbol
   */
  async getSplits(symbol: string): Promise<StockSplit[]> {
    return this.client.get<StockSplit[]>('splits', {
      searchParams: { symbol: symbol.toUpperCase() },
    });
  }

  /**
   * Get stock splits calendar
   * @param from - Start date (YYYY-MM-DD)
   * @param to - End date (YYYY-MM-DD)
   */
  async getSplitsCalendar(from?: string, to?: string): Promise<StockSplit[]> {
    const params: Record<string, string> = {};
    if (from) params.from = from;
    if (to) params.to = to;

    return this.client.get<StockSplit[]>('splits-calendar', {
      searchParams: params,
    });
  }

  /**
   * Get IPO calendar
   * @param from - Start date (YYYY-MM-DD)
   * @param to - End date (YYYY-MM-DD)
   */
  async getIPOCalendar(from?: string, to?: string): Promise<IPOCalendar[]> {
    const params: Record<string, string> = {};
    if (from) params.from = from;
    if (to) params.to = to;

    return this.client.get<IPOCalendar[]>('ipos-calendar', {
      searchParams: params,
    });
  }

  /**
   * Get IPO disclosures/prospectus
   * @param from - Start date (YYYY-MM-DD)
   * @param to - End date (YYYY-MM-DD)
   */
  async getIPOProspectus(from?: string, to?: string): Promise<IPOProspectus[]> {
    const params: Record<string, string> = {};
    if (from) params.from = from;
    if (to) params.to = to;

    return this.client.get<IPOProspectus[]>('ipos-prospectus', {
      searchParams: params,
    });
  }

  /**
   * Get confirmed IPO calendar
   * @param from - Start date (YYYY-MM-DD)
   * @param to - End date (YYYY-MM-DD)
   */
  async getIPOConfirmed(from?: string, to?: string): Promise<IPOConfirmed[]> {
    const params: Record<string, string> = {};
    if (from) params.from = from;
    if (to) params.to = to;

    return this.client.get<IPOConfirmed[]>('ipos-confirmed', {
      searchParams: params,
    });
  }

  /**
   * Get economic calendar
   * @param from - Start date (YYYY-MM-DD)
   * @param to - End date (YYYY-MM-DD)
   */
  async getEconomicCalendar(from?: string, to?: string): Promise<EconomicCalendar[]> {
    const params: Record<string, string> = {};
    if (from) params.from = from;
    if (to) params.to = to;

    return this.client.get<EconomicCalendar[]>('economic-calendar', {
      searchParams: params,
    });
  }
}
