/**
 * Economics data types
 */

/**
 * Treasury rate
 */
export interface TreasuryRate {
  date: string;
  month1: string;
  month2: string;
  month3: string;
  month6: string;
  year1: string;
  year2: string;
  year3: string;
  year5: string;
  year7: string;
  year10: string;
  year20: string;
  year30: string;
}

/**
 * Economic indicator
 */
export interface EconomicIndicator {
  date: string;
  value: number;
}

/**
 * Market risk premium
 */
export interface MarketRiskPremium {
  country: string;
  continent: string;
  totalEquityRiskPremium: number;
  countryRiskPremium: number;
}
