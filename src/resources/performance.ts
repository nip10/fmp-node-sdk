import type { FMPClient } from '../client.js';
import type {
  StockMover,
  SectorPerformance,
  SectorPE,
  HistoricalSectorPerformance,
} from '../types/index.js';

/**
 * Market performance resource
 * Provides access to gainers, losers, most active, and sector performance
 */
export class PerformanceResource {
  constructor(private readonly client: FMPClient) {}

  /**
   * Get biggest gainers
   */
  async getGainers(): Promise<StockMover[]> {
    return this.client.get<StockMover[]>('stock-market-gainers');
  }

  /**
   * Get biggest losers
   */
  async getLosers(): Promise<StockMover[]> {
    return this.client.get<StockMover[]>('stock-market-losers');
  }

  /**
   * Get most active stocks
   */
  async getMostActive(): Promise<StockMover[]> {
    return this.client.get<StockMover[]>('stock-market-actives');
  }

  /**
   * Get sector performance
   * @param limit - Number of results
   */
  async getSectorPerformance(limit?: number): Promise<SectorPerformance[]> {
    const params: Record<string, number> = {};
    if (limit) params.limit = limit;

    return this.client.get<SectorPerformance[]>('sector-performance', {
      searchParams: params,
    });
  }

  /**
   * Get historical sector performance
   * @param sector - Sector name
   * @param limit - Number of results
   */
  async getHistoricalSectorPerformance(
    sector: string,
    limit?: number
  ): Promise<HistoricalSectorPerformance[]> {
    const params: Record<string, string | number> = { sector };
    if (limit) params.limit = limit;

    return this.client.get<HistoricalSectorPerformance[]>('historical-sector-performance', {
      searchParams: params,
    });
  }

  /**
   * Get sector PE ratios
   * @param date - Date (YYYY-MM-DD)
   * @param exchange - Exchange (optional)
   */
  async getSectorPE(date: string, exchange?: string): Promise<SectorPE[]> {
    const params: Record<string, string> = { date };
    if (exchange) params.exchange = exchange;

    return this.client.get<SectorPE[]>('sector-price-earning-ratio', {
      searchParams: params,
    });
  }

  /**
   * Get industry PE ratios
   * @param date - Date (YYYY-MM-DD)
   * @param exchange - Exchange (optional)
   */
  async getIndustryPE(date: string, exchange?: string): Promise<Record<string, unknown>[]> {
    const params: Record<string, string> = { date };
    if (exchange) params.exchange = exchange;

    return this.client.get<Record<string, unknown>[]>('industry-price-earning-ratio', {
      searchParams: params,
    });
  }

  /**
   * Get historical sector PE
   * @param sector - Sector name
   */
  async getHistoricalSectorPE(sector: string): Promise<SectorPE[]> {
    return this.client.get<SectorPE[]>('historical-sector-pe', {
      searchParams: { sector },
    });
  }

  /**
   * Get historical industry PE
   * @param industry - Industry name
   */
  async getHistoricalIndustryPE(industry: string): Promise<Record<string, unknown>[]> {
    return this.client.get<Record<string, unknown>[]>('historical-industry-pe', {
      searchParams: { industry },
    });
  }
}
