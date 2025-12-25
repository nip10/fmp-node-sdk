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
  IncomeStatementGrowth,
  BalanceSheetGrowth,
  CashFlowStatementGrowth,
} from '../types/index.js';

/**
 * Earnings surprise data
 */
export interface EarningsSurprise {
  symbol: string;
  date: string;
  actualEarningResult: number | null;
  estimatedEarning: number | null;
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
   * @param part - Part number for pagination (default: 0)
   */
  async getAllProfiles(part = 0): Promise<CompanyProfile[]> {
    return this.client.get<CompanyProfile[]>('profile-bulk', {
      searchParams: { part },
    });
  }

  /**
   * Get all analyst ratings (bulk)
   * Returns the latest rating for all symbols
   */
  async getAllRatings(): Promise<AnalystRecommendation[]> {
    return this.client.get<AnalystRecommendation[]>('rating-bulk');
  }

  /**
   * Get all DCF valuations (bulk)
   * Returns DCF valuations for all symbols
   */
  async getAllDCF(): Promise<DCFValuation[]> {
    return this.client.get<DCFValuation[]>('dcf-bulk');
  }

  /**
   * Get all financial scores (bulk)
   * Returns Altman Z-Score and Piotroski Score for all symbols
   */
  async getAllScores(): Promise<FinancialScores[]> {
    return this.client.get<FinancialScores[]>('scores-bulk');
  }

  /**
   * Get all price targets (bulk)
   * Returns price targets for all symbols
   */
  async getAllPriceTargets(): Promise<PriceTarget[]> {
    return this.client.get<PriceTarget[]>('price-target-summary-bulk');
  }

  /**
   * Get all ETF holdings (bulk)
   * Returns ETF holdings data for all ETF symbols
   * @param part - Part number for pagination (default: 1)
   */
  async getAllETFHoldings(part = 1): Promise<ETFHolding[]> {
    return this.client.get<ETFHolding[]>('etf-holder-bulk', {
      searchParams: { part },
    });
  }

  /**
   * Get all upgrades and downgrades (bulk)
   * Returns analyst upgrades and downgrades for all symbols
   */
  async getAllUpgradesDowngrades(): Promise<StockGrade[]> {
    return this.client.get<StockGrade[]>('upgrades-downgrades-consensus-bulk');
  }

  /**
   * Get all key metrics TTM (bulk)
   * Returns trailing twelve months key metrics for all symbols
   */
  async getAllKeyMetricsTTM(): Promise<KeyMetrics[]> {
    return this.client.get<KeyMetrics[]>('key-metrics-ttm-bulk');
  }

  /**
   * Get all financial ratios TTM (bulk)
   * Returns trailing twelve months financial ratios for all symbols
   */
  async getAllRatiosTTM(): Promise<FinancialRatios[]> {
    return this.client.get<FinancialRatios[]>('ratios-ttm-bulk');
  }

  /**
   * Get all stock peers (bulk)
   * Returns peer companies for all symbols
   */
  async getAllPeers(): Promise<StockPeer[]> {
    return this.client.get<StockPeer[]>('peers-bulk');
  }

  /**
   * Get all earnings surprises (bulk)
   * Returns earnings surprises (actual vs estimated) for all symbols
   */
  async getAllEarningsSurprises(): Promise<EarningsSurprise[]> {
    return this.client.get<EarningsSurprise[]>('earnings-surprises-bulk');
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
    return this.client.get<IncomeStatement[]>('income-statement-bulk', { searchParams: params });
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
    return this.client.get<IncomeStatementGrowth[]>('income-statement-growth-bulk', { searchParams: params });
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
    return this.client.get<BalanceSheet[]>('balance-sheet-statement-bulk', { searchParams: params });
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
    return this.client.get<BalanceSheetGrowth[]>('balance-sheet-statement-growth-bulk', { searchParams: params });
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
    return this.client.get<CashFlowStatement[]>('cash-flow-statement-bulk', { searchParams: params });
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
    return this.client.get<CashFlowStatementGrowth[]>('cash-flow-statement-growth-bulk', { searchParams: params });
  }

  /**
   * Get batch end of day prices (bulk)
   * Returns end of day prices for all symbols for a specific date
   * @param date - Date in YYYY-MM-DD format
   */
  async getBatchEODPrices(date: string): Promise<EODPrice[]> {
    return this.client.get<EODPrice[]>('eod-bulk', { searchParams: { date } });
  }

  /**
   * Get batch end of day prices for multiple dates
   * Returns end of day prices for all symbols across a date range
   * @param from - Start date in YYYY-MM-DD format
   * @param to - End date in YYYY-MM-DD format
   */
  async getBatchEODPricesRange(from: string, to: string): Promise<EODPrice[]> {
    return this.client.get<EODPrice[]>('eod-bulk', { searchParams: { from, to } });
  }
}
