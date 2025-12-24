import type { FMPClient } from '../client.js';
import type {
  ETFHolding,
  ETFInfo,
  ETFSectorWeighting,
  ETFCountryWeighting,
  ETFStockExposure,
  MutualFundHolder,
} from '../types/index.js';

/**
 * ETF and Mutual Funds resource
 * Provides access to ETF holdings, sector weightings, and fund data
 */
export class ETFResource {
  constructor(private readonly client: FMPClient) {}

  /**
   * Get ETF holdings
   * @param symbol - ETF symbol
   */
  async getHoldings(symbol: string): Promise<ETFHolding[]> {
    return this.client.get<ETFHolding[]>(`v3/etf-holder/${symbol.toUpperCase()}`);
  }

  /**
   * Get ETF information
   * @param symbol - ETF symbol
   */
  async getInfo(symbol: string): Promise<ETFInfo[]> {
    return this.client.get<ETFInfo[]>(`v4/etf-info`, {
      searchParams: {
        symbol: symbol.toUpperCase(),
      },
    });
  }

  /**
   * Get ETF sector weightings
   * @param symbol - ETF symbol
   */
  async getSectorWeightings(symbol: string): Promise<ETFSectorWeighting[]> {
    return this.client.get<ETFSectorWeighting[]>(
      `v3/etf-sector-weightings/${symbol.toUpperCase()}`
    );
  }

  /**
   * Get ETF country weightings
   * @param symbol - ETF symbol
   */
  async getCountryWeightings(symbol: string): Promise<ETFCountryWeighting[]> {
    return this.client.get<ETFCountryWeighting[]>(
      `v3/etf-country-weightings/${symbol.toUpperCase()}`
    );
  }

  /**
   * Get stock exposure to ETFs (which ETFs hold this stock)
   * @param symbol - Stock symbol
   */
  async getStockExposure(symbol: string): Promise<ETFStockExposure[]> {
    return this.client.get<ETFStockExposure[]>(
      `v3/etf-stock-exposure/${symbol.toUpperCase()}`
    );
  }

  /**
   * Get mutual fund holders for a stock
   * @param symbol - Stock symbol
   */
  async getMutualFundHolders(symbol: string): Promise<MutualFundHolder[]> {
    return this.client.get<MutualFundHolder[]>(
      `v3/mutual-fund-holder/${symbol.toUpperCase()}`
    );
  }

  /**
   * Get ETF list
   */
  async getETFList(): Promise<Record<string, unknown>[]> {
    return this.client.get<Record<string, unknown>[]>('v3/etf/list');
  }

  /**
   * Get available mutual funds
   */
  async getAvailableMutualFunds(): Promise<Record<string, unknown>[]> {
    return this.client.get<Record<string, unknown>[]>('v3/symbol/available-mutual-funds');
  }

  /**
   * Get latest ETF holdings disclosure dates
   * Returns the most recent portfolio dates for all ETFs
   */
  async getLatestDisclosures(): Promise<Array<{ symbol: string; date: string }>> {
    return this.client.get<Array<{ symbol: string; date: string }>>('v4/etf-holdings/portfolio-date');
  }
}
