import type { FMPClient } from '../client.js';
import type {
  TreasuryRate,
  EconomicIndicator,
  MarketRiskPremium,
} from '../types/index.js';

/**
 * Economic indicator names
 */
export type EconomicIndicatorName =
  | 'GDP'
  | 'realGDP'
  | 'nominalPotentialGDP'
  | 'realGDPPerCapita'
  | 'federalFunds'
  | 'CPI'
  | 'inflationRate'
  | 'inflation'
  | 'retailSales'
  | 'consumerSentiment'
  | 'durableGoods'
  | 'unemploymentRate'
  | 'totalNonfarmPayroll'
  | 'initialClaims'
  | 'industrialProductionTotalIndex'
  | 'newPrivatelyOwnedHousingUnitsStartedTotalUnits'
  | 'totalVehicleSales'
  | 'retailMoneyFunds'
  | 'smoothedUSRecessionProbabilities'
  | 'businessInventories'
  | 'housingInventory'
  | 'nonresidentialInvestment'
  | 'federalSurplusDeficit';

/**
 * Economics resource
 * Provides access to treasury rates, economic indicators, and market risk premium
 */
export class EconomicsResource {
  constructor(private readonly client: FMPClient) {}

  /**
   * Get treasury rates
   * @param from - Start date (YYYY-MM-DD)
   * @param to - End date (YYYY-MM-DD)
   */
  async getTreasuryRates(from?: string, to?: string): Promise<TreasuryRate[]> {
    const params: Record<string, string> = {};
    if (from) params.from = from;
    if (to) params.to = to;

    return this.client.get<TreasuryRate[]>('v4/treasury', { searchParams: params });
  }

  /**
   * Get economic indicator
   * @param name - Indicator name
   * @param from - Start date (YYYY-MM-DD)
   * @param to - End date (YYYY-MM-DD)
   */
  async getIndicator(
    name: EconomicIndicatorName,
    from?: string,
    to?: string
  ): Promise<EconomicIndicator[]> {
    const params: Record<string, string> = { name };
    if (from) params.from = from;
    if (to) params.to = to;

    return this.client.get<EconomicIndicator[]>('v4/economic', { searchParams: params });
  }

  /**
   * Get GDP data
   * @param from - Start date
   * @param to - End date
   */
  async getGDP(from?: string, to?: string): Promise<EconomicIndicator[]> {
    return this.getIndicator('GDP', from, to);
  }

  /**
   * Get CPI (Consumer Price Index) data
   * @param from - Start date
   * @param to - End date
   */
  async getCPI(from?: string, to?: string): Promise<EconomicIndicator[]> {
    return this.getIndicator('CPI', from, to);
  }

  /**
   * Get inflation rate data
   * @param from - Start date
   * @param to - End date
   */
  async getInflationRate(from?: string, to?: string): Promise<EconomicIndicator[]> {
    return this.getIndicator('inflationRate', from, to);
  }

  /**
   * Get unemployment rate data
   * @param from - Start date
   * @param to - End date
   */
  async getUnemploymentRate(from?: string, to?: string): Promise<EconomicIndicator[]> {
    return this.getIndicator('unemploymentRate', from, to);
  }

  /**
   * Get federal funds rate data
   * @param from - Start date
   * @param to - End date
   */
  async getFederalFundsRate(from?: string, to?: string): Promise<EconomicIndicator[]> {
    return this.getIndicator('federalFunds', from, to);
  }

  /**
   * Get market risk premium
   */
  async getMarketRiskPremium(): Promise<MarketRiskPremium[]> {
    return this.client.get<MarketRiskPremium[]>('v4/market_risk_premium');
  }
}
