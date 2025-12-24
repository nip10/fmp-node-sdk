import type { FMPClient } from '../client.js';
import { Period } from '../types/index.js';
import type {
  AnalystEstimate,
  PriceTarget,
  PriceTargetSummary,
  PriceTargetConsensus,
  AnalystRecommendation,
  StockGrade,
  UpgradesDowngradesConsensus,
} from '../types/index.js';

/**
 * Analyst data resource
 * Provides access to analyst estimates, price targets, ratings, and upgrades/downgrades
 */
export class AnalystResource {
  constructor(private readonly client: FMPClient) {}

  /**
   * Get analyst estimates
   * @param symbol - Stock symbol
   * @param period - Period type
   * @param limit - Number of results
   */
  async getEstimates(
    symbol: string,
    period: Period = Period.Annual,
    limit?: number
  ): Promise<AnalystEstimate[]> {
    const params: Record<string, string | number> = { symbol: symbol.toUpperCase(), period };
    if (limit) params.limit = limit;

    return this.client.get<AnalystEstimate[]>('v3/analyst-estimates', { searchParams: params });
  }

  /**
   * Get price targets
   * @param symbol - Stock symbol
   */
  async getPriceTargets(symbol: string): Promise<PriceTarget[]> {
    return this.client.get<PriceTarget[]>(`v4/price-target`, {
      searchParams: { symbol: symbol.toUpperCase() },
    });
  }

  /**
   * Get price target summary
   * @param symbol - Stock symbol
   */
  async getPriceTargetSummary(symbol: string): Promise<PriceTargetSummary> {
    const result = await this.client.get<PriceTargetSummary[]>(
      `v4/price-target-summary`,
      { searchParams: { symbol: symbol.toUpperCase() } }
    );
    return result[0]!;
  }

  /**
   * Get price target consensus
   * @param symbol - Stock symbol
   */
  async getPriceTargetConsensus(symbol: string): Promise<PriceTargetConsensus> {
    const result = await this.client.get<PriceTargetConsensus[]>(
      `v4/price-target-consensus`,
      { searchParams: { symbol: symbol.toUpperCase() } }
    );
    return result[0]!;
  }

  /**
   * Get analyst recommendations (ratings)
   * @param symbol - Stock symbol
   */
  async getRecommendations(symbol: string): Promise<AnalystRecommendation[]> {
    return this.client.get<AnalystRecommendation[]>(`v3/analyst-stock-recommendations/${symbol.toUpperCase()}`);
  }

  /**
   * Get stock grades (upgrades/downgrades)
   * @param symbol - Stock symbol
   * @param limit - Number of results
   */
  async getGrades(symbol: string, limit?: number): Promise<StockGrade[]> {
    const params: Record<string, string | number> = { symbol: symbol.toUpperCase() };
    if (limit) params.limit = limit;

    return this.client.get<StockGrade[]>('v3/grade', { searchParams: params });
  }

  /**
   * Get upgrades and downgrades consensus
   * @param symbol - Stock symbol
   */
  async getUpgradesDowngradesConsensus(symbol: string): Promise<UpgradesDowngradesConsensus> {
    const result = await this.client.get<UpgradesDowngradesConsensus[]>(
      `v4/upgrades-downgrades-consensus`,
      { searchParams: { symbol: symbol.toUpperCase() } }
    );
    return result[0]!;
  }

  /**
   * Get analyst ratings snapshot
   * @param symbol - Stock symbol
   */
  async getRatingsSnapshot(symbol: string): Promise<AnalystRecommendation> {
    const result = await this.client.get<AnalystRecommendation[]>(
      `v3/rating/${symbol.toUpperCase()}`
    );
    return result[0]!;
  }

  /**
   * Get historical stock grades
   * @param symbol - Stock symbol
   * @param limit - Number of results
   */
  async getHistoricalGrades(symbol: string, limit?: number): Promise<StockGrade[]> {
    const params: Record<string, string | number> = {};
    if (limit) params.limit = limit;
    return this.client.get<StockGrade[]>(`v3/historical-rating/${symbol.toUpperCase()}`, { searchParams: params });
  }
}
