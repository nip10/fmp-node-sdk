import type { FMPClient } from '../client.js';
import type {
  ETFHolding,
  ETFInfo,
  ETFSectorWeighting,
  ETFCountryWeighting,
  ETFStockExposure,
  MutualFundHolder,
  FundListItem,
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
    return this.client.get<ETFHolding[]>('etf/holdings', {
      searchParams: { symbol: symbol.toUpperCase() },
    });
  }

  /**
   * Get ETF information
   * @param symbol - ETF symbol
   */
  async getInfo(symbol: string): Promise<ETFInfo[]> {
    return this.client.get<ETFInfo[]>('etf/info', {
      searchParams: { symbol: symbol.toUpperCase() },
    });
  }

  /**
   * Get ETF sector weightings
   * @param symbol - ETF symbol
   */
  async getSectorWeightings(symbol: string): Promise<ETFSectorWeighting[]> {
    return this.client.get<ETFSectorWeighting[]>('etf/sector-weightings', {
      searchParams: { symbol: symbol.toUpperCase() },
    });
  }

  /**
   * Get ETF country weightings
   * @param symbol - ETF symbol
   */
  async getCountryWeightings(symbol: string): Promise<ETFCountryWeighting[]> {
    return this.client.get<ETFCountryWeighting[]>('etf/country-weightings', {
      searchParams: { symbol: symbol.toUpperCase() },
    });
  }

  /**
   * Get stock exposure to ETFs (which ETFs hold this stock)
   * @param symbol - Stock symbol
   */
  async getStockExposure(symbol: string): Promise<ETFStockExposure[]> {
    return this.client.get<ETFStockExposure[]>('etf/asset-exposure', {
      searchParams: { symbol: symbol.toUpperCase() },
    });
  }

  /**
   * Get mutual fund holders for a stock
   * @param symbol - Stock symbol
   */
  async getMutualFundHolders(symbol: string): Promise<MutualFundHolder[]> {
    return this.client.get<MutualFundHolder[]>('funds/disclosure-holders-latest', {
      searchParams: { symbol: symbol.toUpperCase() },
    });
  }

  /**
   * Get ETF list
   */
  async getETFList(): Promise<FundListItem[]> {
    return this.client.get<FundListItem[]>('etf-list');
  }

  /**
   * Get available mutual funds
   */
  async getAvailableMutualFunds(): Promise<FundListItem[]> {
    return this.client.get<FundListItem[]>('mutual-fund-list');
  }

  /**
   * Get latest ETF holdings disclosure dates
   * Returns the most recent portfolio dates for all ETFs
   */
  async getLatestDisclosures(): Promise<Array<{ symbol: string; date: string }>> {
    return this.client.get<Array<{ symbol: string; date: string }>>('funds/disclosure-dates');
  }
}
