import type { FMPClient } from '../client.js';
import { Period } from '../types/index.js';
import type {
  CompanyProfile,
  AnalystRecommendation,
  DCFValuation,
  FinancialScores,
  PriceTarget,
  ETFHolding,
  StockGrade,
  KeyMetrics,
  FinancialRatios,
  StockPeer,
  IncomeStatement,
  BalanceSheet,
  CashFlowStatement,
} from '../types/index.js';

/**
 * Earnings surprise data
 */
export interface EarningsSurprise {
  symbol: string;
  date: string;
  actualEarningResult: number;
  estimatedEarning: number;
}

/**
 * Income statement growth
 */
export interface IncomeStatementGrowth {
  date: string;
  symbol: string;
  period: string;
  growthRevenue: number;
  growthCostOfRevenue: number;
  growthGrossProfit: number;
  growthGrossProfitRatio: number;
  growthResearchAndDevelopmentExpenses: number;
  growthGeneralAndAdministrativeExpenses: number;
  growthSellingAndMarketingExpenses: number;
  growthOtherExpenses: number;
  growthOperatingExpenses: number;
  growthCostAndExpenses: number;
  growthInterestExpense: number;
  growthDepreciationAndAmortization: number;
  growthEBITDA: number;
  growthEBITDARatio: number;
  growthOperatingIncome: number;
  growthOperatingIncomeRatio: number;
  growthTotalOtherIncomeExpensesNet: number;
  growthIncomeBeforeTax: number;
  growthIncomeBeforeTaxRatio: number;
  growthIncomeTaxExpense: number;
  growthNetIncome: number;
  growthNetIncomeRatio: number;
  growthEPS: number;
  growthEPSDiluted: number;
  growthWeightedAverageShsOut: number;
  growthWeightedAverageShsOutDil: number;
}

/**
 * Balance sheet growth
 */
export interface BalanceSheetGrowth {
  date: string;
  symbol: string;
  period: string;
  growthCashAndCashEquivalents: number;
  growthShortTermInvestments: number;
  growthCashAndShortTermInvestments: number;
  growthNetReceivables: number;
  growthInventory: number;
  growthOtherCurrentAssets: number;
  growthTotalCurrentAssets: number;
  growthPropertyPlantEquipmentNet: number;
  growthGoodwill: number;
  growthIntangibleAssets: number;
  growthGoodwillAndIntangibleAssets: number;
  growthLongTermInvestments: number;
  growthTaxAssets: number;
  growthOtherNonCurrentAssets: number;
  growthTotalNonCurrentAssets: number;
  growthOtherAssets: number;
  growthTotalAssets: number;
  growthAccountPayables: number;
  growthShortTermDebt: number;
  growthTaxPayables: number;
  growthDeferredRevenue: number;
  growthOtherCurrentLiabilities: number;
  growthTotalCurrentLiabilities: number;
  growthLongTermDebt: number;
  growthDeferredRevenueNonCurrent: number;
  growthDeferrredTaxLiabilitiesNonCurrent: number;
  growthOtherNonCurrentLiabilities: number;
  growthTotalNonCurrentLiabilities: number;
  growthOtherLiabilities: number;
  growthTotalLiabilities: number;
  growthCommonStock: number;
  growthRetainedEarnings: number;
  growthAccumulatedOtherComprehensiveIncomeLoss: number;
  growthOthertotalStockholdersEquity: number;
  growthTotalStockholdersEquity: number;
  growthTotalLiabilitiesAndStockholdersEquity: number;
  growthTotalInvestments: number;
  growthTotalDebt: number;
  growthNetDebt: number;
}

/**
 * Cash flow statement growth
 */
export interface CashFlowStatementGrowth {
  date: string;
  symbol: string;
  period: string;
  growthNetIncome: number;
  growthDepreciationAndAmortization: number;
  growthDeferredIncomeTax: number;
  growthStockBasedCompensation: number;
  growthChangeInWorkingCapital: number;
  growthAccountsReceivables: number;
  growthInventory: number;
  growthAccountsPayables: number;
  growthOtherWorkingCapital: number;
  growthOtherNonCashItems: number;
  growthNetCashProvidedByOperatingActivites: number;
  growthInvestmentsInPropertyPlantAndEquipment: number;
  growthAcquisitionsNet: number;
  growthPurchasesOfInvestments: number;
  growthSalesMaturitiesOfInvestments: number;
  growthOtherInvestingActivites: number;
  growthNetCashUsedForInvestingActivites: number;
  growthDebtRepayment: number;
  growthCommonStockIssued: number;
  growthCommonStockRepurchased: number;
  growthDividendsPaid: number;
  growthOtherFinancingActivites: number;
  growthNetCashUsedProvidedByFinancingActivities: number;
  growthEffectOfForexChangesOnCash: number;
  growthNetChangeInCash: number;
  growthCashAtEndOfPeriod: number;
  growthCashAtBeginningOfPeriod: number;
  growthOperatingCashFlow: number;
  growthCapitalExpenditure: number;
  growthFreeCashFlow: number;
}

/**
 * EOD (End of Day) price data
 */
export interface EODPrice {
  symbol: string;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  adjClose: number;
  volume: number;
}

/**
 * Bulk API endpoints resource
 * Provides access to bulk data endpoints for retrieving data for multiple symbols at once
 */
export class BulkResource {
  constructor(private readonly client: FMPClient) {}

  /**
   * Get all company profiles (bulk)
   * Returns profiles for all available symbols
   */
  async getAllProfiles(): Promise<CompanyProfile[]> {
    return this.client.get<CompanyProfile[]>('v4/profile/all');
  }

  /**
   * Get all analyst ratings (bulk)
   * Returns the latest rating for all symbols
   */
  async getAllRatings(): Promise<AnalystRecommendation[]> {
    return this.client.get<AnalystRecommendation[]>('v4/rating');
  }

  /**
   * Get all DCF valuations (bulk)
   * Returns DCF valuations for all symbols
   */
  async getAllDCF(): Promise<DCFValuation[]> {
    return this.client.get<DCFValuation[]>('v4/dcf');
  }

  /**
   * Get all financial scores (bulk)
   * Returns Altman Z-Score and Piotroski Score for all symbols
   */
  async getAllScores(): Promise<FinancialScores[]> {
    return this.client.get<FinancialScores[]>('v4/score');
  }

  /**
   * Get all price targets (bulk)
   * Returns price targets for all symbols
   */
  async getAllPriceTargets(): Promise<PriceTarget[]> {
    return this.client.get<PriceTarget[]>('v4/price-target');
  }

  /**
   * Get all ETF holdings (bulk)
   * Returns ETF holdings data for all ETF symbols
   */
  async getAllETFHoldings(): Promise<ETFHolding[]> {
    return this.client.get<ETFHolding[]>('v4/etf-holder');
  }

  /**
   * Get all upgrades and downgrades (bulk)
   * Returns analyst upgrades and downgrades for all symbols
   */
  async getAllUpgradesDowngrades(): Promise<StockGrade[]> {
    return this.client.get<StockGrade[]>('v4/upgrades-downgrades');
  }

  /**
   * Get all key metrics TTM (bulk)
   * Returns trailing twelve months key metrics for all symbols
   */
  async getAllKeyMetricsTTM(): Promise<KeyMetrics[]> {
    return this.client.get<KeyMetrics[]>('v3/key-metrics-ttm');
  }

  /**
   * Get all financial ratios TTM (bulk)
   * Returns trailing twelve months financial ratios for all symbols
   */
  async getAllRatiosTTM(): Promise<FinancialRatios[]> {
    return this.client.get<FinancialRatios[]>('v3/ratios-ttm');
  }

  /**
   * Get all stock peers (bulk)
   * Returns peer companies for all symbols
   */
  async getAllPeers(): Promise<StockPeer[]> {
    return this.client.get<StockPeer[]>('v4/stock_peers');
  }

  /**
   * Get all earnings surprises (bulk)
   * Returns earnings surprises (actual vs estimated) for all symbols
   */
  async getAllEarningsSurprises(): Promise<EarningsSurprise[]> {
    return this.client.get<EarningsSurprise[]>('v3/earnings-surprises');
  }

  /**
   * Get all income statements (bulk)
   * Returns income statements for all symbols
   * @param period - Period type (annual or quarter)
   * @param year - Specific year (optional)
   */
  async getAllIncomeStatements(period: Period = Period.Annual, year?: number): Promise<IncomeStatement[]> {
    const params: Record<string, string | number> = { period };
    if (year) params.year = year;
    return this.client.get<IncomeStatement[]>('v3/income-statement', { searchParams: params });
  }

  /**
   * Get all income statement growth (bulk)
   * Returns income statement growth metrics for all symbols
   * @param period - Period type (annual or quarter)
   * @param year - Specific year (optional)
   */
  async getAllIncomeStatementGrowth(
    period: Period = Period.Annual,
    year?: number
  ): Promise<IncomeStatementGrowth[]> {
    const params: Record<string, string | number> = { period };
    if (year) params.year = year;
    return this.client.get<IncomeStatementGrowth[]>('v3/income-statement-growth', { searchParams: params });
  }

  /**
   * Get all balance sheets (bulk)
   * Returns balance sheet statements for all symbols
   * @param period - Period type (annual or quarter)
   * @param year - Specific year (optional)
   */
  async getAllBalanceSheets(period: Period = Period.Annual, year?: number): Promise<BalanceSheet[]> {
    const params: Record<string, string | number> = { period };
    if (year) params.year = year;
    return this.client.get<BalanceSheet[]>('v3/balance-sheet-statement', { searchParams: params });
  }

  /**
   * Get all balance sheet growth (bulk)
   * Returns balance sheet growth metrics for all symbols
   * @param period - Period type (annual or quarter)
   * @param year - Specific year (optional)
   */
  async getAllBalanceSheetGrowth(
    period: Period = Period.Annual,
    year?: number
  ): Promise<BalanceSheetGrowth[]> {
    const params: Record<string, string | number> = { period };
    if (year) params.year = year;
    return this.client.get<BalanceSheetGrowth[]>('v3/balance-sheet-statement-growth', { searchParams: params });
  }

  /**
   * Get all cash flow statements (bulk)
   * Returns cash flow statements for all symbols
   * @param period - Period type (annual or quarter)
   * @param year - Specific year (optional)
   */
  async getAllCashFlowStatements(period: Period = Period.Annual, year?: number): Promise<CashFlowStatement[]> {
    const params: Record<string, string | number> = { period };
    if (year) params.year = year;
    return this.client.get<CashFlowStatement[]>('v3/cash-flow-statement', { searchParams: params });
  }

  /**
   * Get all cash flow statement growth (bulk)
   * Returns cash flow statement growth metrics for all symbols
   * @param period - Period type (annual or quarter)
   * @param year - Specific year (optional)
   */
  async getAllCashFlowStatementGrowth(
    period: Period = Period.Annual,
    year?: number
  ): Promise<CashFlowStatementGrowth[]> {
    const params: Record<string, string | number> = { period };
    if (year) params.year = year;
    return this.client.get<CashFlowStatementGrowth[]>('v3/cash-flow-statement-growth', { searchParams: params });
  }

  /**
   * Get batch end of day prices (bulk)
   * Returns end of day prices for all symbols for a specific date
   * @param date - Date in YYYY-MM-DD format
   */
  async getBatchEODPrices(date: string): Promise<EODPrice[]> {
    return this.client.get<EODPrice[]>('v4/batch-request-end-of-day-prices', { searchParams: { date } });
  }

  /**
   * Get batch end of day prices for multiple dates
   * Returns end of day prices for all symbols across a date range
   * @param from - Start date in YYYY-MM-DD format
   * @param to - End date in YYYY-MM-DD format
   */
  async getBatchEODPricesRange(from: string, to: string): Promise<EODPrice[]> {
    return this.client.get<EODPrice[]>('v4/batch-request-end-of-day-prices', { searchParams: { from, to } });
  }
}
