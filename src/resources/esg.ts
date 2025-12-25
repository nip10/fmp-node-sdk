import type { FMPClient } from '../client.js';
import type { ESGData, ESGRating, ESGBenchmark } from '../types/index.js';

/**
 * ESG (Environmental, Social, and Governance) data resource
 * Provides access to ESG scores, ratings, and benchmarks
 */
export class ESGResource {
  constructor(private readonly client: FMPClient) {}

  /**
   * Get ESG data for a company
   * Returns environmental, social, and governance scores
   * @param symbol - Stock symbol (e.g., "AAPL")
   */
  async getESGData(symbol: string): Promise<ESGData[]> {
    return this.client.get<ESGData[]>('esg-disclosures', {
      searchParams: { symbol: symbol.toUpperCase() },
    });
  }

  /**
   * Get ESG ratings for a company
   * Returns ESG risk rating and industry rank
   * @param symbol - Stock symbol (e.g., "AAPL")
   */
  async getESGRatings(symbol: string): Promise<ESGRating[]> {
    return this.client.get<ESGRating[]>('esg-ratings', {
      searchParams: { symbol: symbol.toUpperCase() },
    });
  }

  /**
   * Get ESG sector benchmarks
   * Returns average ESG scores by sector
   * @param year - Year for benchmark data
   */
  async getESGBenchmark(year: number): Promise<ESGBenchmark[]> {
    return this.client.get<ESGBenchmark[]>('esg-benchmark', {
      searchParams: { year },
    });
  }
}
