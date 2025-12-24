/**
 * Valuation-related types
 */

/**
 * DCF (Discounted Cash Flow) valuation
 */
export interface DCFValuation {
  symbol: string;
  date: string;
  dcf: number;
  'Stock Price': number;
}

/**
 * Levered DCF valuation
 */
export interface LeveredDCF {
  symbol: string;
  date: string;
  dcf: number;
  'Stock Price': number;
}

/**
 * Advanced DCF result
 */
export interface AdvancedDCF {
  symbol: string;
  date: string;
  stockPrice: number;
  dcf: number;
  wacc: number;
  revenues: number;
  revenueGrowthRate: number;
  operatingCashFlow: number;
  operatingExpense: number;
  capitalExpenditure: number;
  netIncome: number;
  freeCashFlow: number;
  operatingCashFlowGrowthRate: number;
  freeCashFlowGrowthRate: number;
  longTermDebt: number;
  totalDebt: number;
  cashAndCashEquivalents: number;
  shareholdersEquity: number;
  marketCapitalization: number;
  riskFreeRate: number;
  beta: number;
}
