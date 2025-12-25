import type { FMPClient } from '../client.js';
import type { DCFValuation, LeveredDCF, AdvancedDCF } from '../types/index.js';

/**
 * Valuation resource
 * Provides access to DCF and other valuation metrics
 */
export class ValuationResource {
  constructor(private readonly client: FMPClient) {}

  /**
   * Get DCF (Discounted Cash Flow) valuation
   * @param symbol - Stock symbol
   */
  async getDCF(symbol: string): Promise<DCFValuation[]> {
    return this.client.get<DCFValuation[]>('discounted-cash-flow', {
      searchParams: { symbol: symbol.toUpperCase() },
    });
  }

  /**
   * Get levered DCF valuation
   * @param symbol - Stock symbol
   */
  async getLeveredDCF(symbol: string): Promise<LeveredDCF[]> {
    return this.client.get<LeveredDCF[]>('levered-discounted-cash-flow', {
      searchParams: { symbol: symbol.toUpperCase() },
    });
  }

  /**
   * Get advanced DCF with detailed breakdown
   * @param symbol - Stock symbol
   */
  async getAdvancedDCF(symbol: string): Promise<AdvancedDCF[]> {
    return this.client.get<AdvancedDCF[]>('custom-discounted-cash-flow', {
      searchParams: { symbol: symbol.toUpperCase() },
    });
  }

  /**
   * Get historical daily DCF
   * @param symbol - Stock symbol
   * @param limit - Maximum number of results
   */
  async getHistoricalDailyDCF(symbol: string, limit?: number): Promise<DCFValuation[]> {
    const params: Record<string, string | number> = { symbol: symbol.toUpperCase() };
    if (limit) params.limit = limit;
    return this.client.get<DCFValuation[]>('historical-daily-discounted-cash-flow', {
      searchParams: params,
    });
  }

  /**
   * Get historical DCF
   * @param symbol - Stock symbol
   * @param period - Period (annual or quarter)
   * @param limit - Maximum number of results
   */
  async getHistoricalDCF(
    symbol: string,
    period: 'annual' | 'quarter' = 'annual',
    limit?: number
  ): Promise<DCFValuation[]> {
    const params: Record<string, string | number> = { symbol: symbol.toUpperCase(), period };
    if (limit) params.limit = limit;
    return this.client.get<DCFValuation[]>('historical-discounted-cash-flow-statement', {
      searchParams: params,
    });
  }

  /**
   * Get custom levered DCF valuation
   * @param symbol - Stock symbol
   */
  async getCustomLeveredDCF(symbol: string): Promise<LeveredDCF[]> {
    return this.client.get<LeveredDCF[]>('custom-levered-discounted-cash-flow', {
      searchParams: { symbol: symbol.toUpperCase() },
    });
  }
}
