import type { FMPClient } from '../client.js';
import { Period } from '../types/index.js';
import type {
  IncomeStatement,
  BalanceSheet,
  CashFlowStatement,
  FinancialRatios,
  KeyMetrics,
  FinancialScores,
  OwnerEarnings,
  FinancialGrowth,
  ReportDate,
  LatestFinancialStatement,
  FinancialReportDownload,
} from '../types/index.js';

/**
 * Financial statements resource
 * Provides access to income statements, balance sheets, cash flow, ratios, and key metrics
 */
export class FinancialsResource {
  constructor(private readonly client: FMPClient) {}

  /**
   * Get income statement
   * @param symbol - Stock symbol
   * @param period - Period type (annual or quarter)
   * @param limit - Number of results
   */
  async getIncomeStatement(
    symbol: string,
    period: Period = Period.Annual,
    limit?: number
  ): Promise<IncomeStatement[]> {
    const params: Record<string, string | number> = { period };
    if (limit) params.limit = limit;

    return this.client.get<IncomeStatement[]>(
      `v3/income-statement/${symbol.toUpperCase()}`,
      { searchParams: params }
    );
  }

  /**
   * Get balance sheet statement
   * @param symbol - Stock symbol
   * @param period - Period type (annual or quarter)
   * @param limit - Number of results
   */
  async getBalanceSheet(
    symbol: string,
    period: Period = Period.Annual,
    limit?: number
  ): Promise<BalanceSheet[]> {
    const params: Record<string, string | number> = { period };
    if (limit) params.limit = limit;

    return this.client.get<BalanceSheet[]>(
      `v3/balance-sheet-statement/${symbol.toUpperCase()}`,
      { searchParams: params }
    );
  }

  /**
   * Get cash flow statement
   * @param symbol - Stock symbol
   * @param period - Period type (annual or quarter)
   * @param limit - Number of results
   */
  async getCashFlowStatement(
    symbol: string,
    period: Period = Period.Annual,
    limit?: number
  ): Promise<CashFlowStatement[]> {
    const params: Record<string, string | number> = { period };
    if (limit) params.limit = limit;

    return this.client.get<CashFlowStatement[]>(
      `v3/cash-flow-statement/${symbol.toUpperCase()}`,
      { searchParams: params }
    );
  }

  /**
   * Get income statement (TTM - Trailing Twelve Months)
   * @param symbol - Stock symbol
   */
  async getIncomeStatementTTM(symbol: string): Promise<IncomeStatement[]> {
    return this.client.get<IncomeStatement[]>(`v3/income-statement/${symbol.toUpperCase()}`, {
      searchParams: { period: 'ttm' },
    });
  }

  /**
   * Get balance sheet (TTM)
   * @param symbol - Stock symbol
   */
  async getBalanceSheetTTM(symbol: string): Promise<BalanceSheet[]> {
    return this.client.get<BalanceSheet[]>(`v3/balance-sheet-statement/${symbol.toUpperCase()}`, {
      searchParams: { period: 'ttm' },
    });
  }

  /**
   * Get cash flow statement (TTM)
   * @param symbol - Stock symbol
   */
  async getCashFlowStatementTTM(symbol: string): Promise<CashFlowStatement[]> {
    return this.client.get<CashFlowStatement[]>(
      `v3/cash-flow-statement/${symbol.toUpperCase()}`,
      { searchParams: { period: 'ttm' } }
    );
  }

  /**
   * Get financial ratios
   * @param symbol - Stock symbol
   * @param period - Period type
   * @param limit - Number of results
   */
  async getRatios(
    symbol: string,
    period: Period = Period.Annual,
    limit?: number
  ): Promise<FinancialRatios[]> {
    const params: Record<string, string | number> = { period };
    if (limit) params.limit = limit;

    return this.client.get<FinancialRatios[]>(`v3/ratios/${symbol.toUpperCase()}`, { searchParams: params });
  }

  /**
   * Get financial ratios (TTM)
   * @param symbol - Stock symbol
   */
  async getRatiosTTM(symbol: string): Promise<FinancialRatios[]> {
    return this.client.get<FinancialRatios[]>(`v3/ratios-ttm/${symbol.toUpperCase()}`);
  }

  /**
   * Get key metrics
   * @param symbol - Stock symbol
   * @param period - Period type
   * @param limit - Number of results
   */
  async getKeyMetrics(
    symbol: string,
    period: Period = Period.Annual,
    limit?: number
  ): Promise<KeyMetrics[]> {
    const params: Record<string, string | number> = { period };
    if (limit) params.limit = limit;

    return this.client.get<KeyMetrics[]>(`v3/key-metrics/${symbol.toUpperCase()}`, { searchParams: params });
  }

  /**
   * Get key metrics (TTM)
   * @param symbol - Stock symbol
   */
  async getKeyMetricsTTM(symbol: string): Promise<KeyMetrics[]> {
    return this.client.get<KeyMetrics[]>(`v3/key-metrics-ttm/${symbol.toUpperCase()}`);
  }

  /**
   * Get enterprise values
   * @param symbol - Stock symbol
   * @param period - Period type
   * @param limit - Number of results
   */
  async getEnterpriseValues(
    symbol: string,
    period: Period = Period.Annual,
    limit?: number
  ): Promise<Record<string, unknown>[]> {
    const params: Record<string, string | number> = { period };
    if (limit) params.limit = limit;

    return this.client.get<Record<string, unknown>[]>(`v3/enterprise-values/${symbol.toUpperCase()}`, { searchParams: params });
  }

  /**
   * Get income statement growth
   * @param symbol - Stock symbol
   * @param period - Period type
   * @param limit - Number of results
   */
  async getIncomeStatementGrowth(
    symbol: string,
    period: Period = Period.Annual,
    limit?: number
  ): Promise<Record<string, unknown>[]> {
    const params: Record<string, string | number> = { period };
    if (limit) params.limit = limit;

    return this.client.get<Record<string, unknown>[]>(
      `v3/income-statement-growth/${symbol.toUpperCase()}`,
      { searchParams: params }
    );
  }

  /**
   * Get balance sheet growth
   * @param symbol - Stock symbol
   * @param period - Period type
   * @param limit - Number of results
   */
  async getBalanceSheetGrowth(
    symbol: string,
    period: Period = Period.Annual,
    limit?: number
  ): Promise<Record<string, unknown>[]> {
    const params: Record<string, string | number> = { period };
    if (limit) params.limit = limit;

    return this.client.get<Record<string, unknown>[]>(
      `v3/balance-sheet-statement-growth/${symbol.toUpperCase()}`,
      { searchParams: params }
    );
  }

  /**
   * Get cash flow statement growth
   * @param symbol - Stock symbol
   * @param period - Period type
   * @param limit - Number of results
   */
  async getCashFlowStatementGrowth(
    symbol: string,
    period: Period = Period.Annual,
    limit?: number
  ): Promise<Record<string, unknown>[]> {
    const params: Record<string, string | number> = { period };
    if (limit) params.limit = limit;

    return this.client.get<Record<string, unknown>[]>(
      `v3/cash-flow-statement-growth/${symbol.toUpperCase()}`,
      { searchParams: params }
    );
  }

  /**
   * Get revenue by product segment
   * @param symbol - Stock symbol
   * @param period - Period type
   */
  async getRevenueByProduct(symbol: string, period: Period = Period.Annual): Promise<Record<string, unknown>[]> {
    return this.client.get<Record<string, unknown>[]>(`v4/revenue-product-segmentation`, {
      searchParams: {
        symbol: symbol.toUpperCase(),
        period,
        structure: 'flat',
      },
    });
  }

  /**
   * Get revenue by geographic segment
   * @param symbol - Stock symbol
   * @param period - Period type
   */
  async getRevenueByGeography(symbol: string, period: Period = Period.Annual): Promise<Record<string, unknown>[]> {
    return this.client.get<Record<string, unknown>[]>(`v4/revenue-geographic-segmentation`, {
      searchParams: {
        symbol: symbol.toUpperCase(),
        period,
        structure: 'flat',
      },
    });
  }

  /**
   * Get financial scores (Altman Z-Score, Piotroski Score)
   * @param symbol - Stock symbol
   */
  async getFinancialScores(symbol: string): Promise<FinancialScores[]> {
    return this.client.get<FinancialScores[]>(`v4/score`, { searchParams: { symbol: symbol.toUpperCase() } });
  }

  /**
   * Get owner earnings
   * @param symbol - Stock symbol
   * @param limit - Number of results
   */
  async getOwnerEarnings(symbol: string, limit?: number): Promise<OwnerEarnings[]> {
    const params: Record<string, string | number> = { symbol: symbol.toUpperCase() };
    if (limit) params.limit = limit;
    return this.client.get<OwnerEarnings[]>('v4/owner_earnings', { searchParams: params });
  }

  /**
   * Get comprehensive financial growth metrics
   * @param symbol - Stock symbol
   * @param period - Period type
   * @param limit - Number of results
   */
  async getFinancialGrowth(
    symbol: string,
    period: Period = Period.Annual,
    limit?: number
  ): Promise<FinancialGrowth[]> {
    const params: Record<string, string | number> = { period };
    if (limit) params.limit = limit;
    return this.client.get<FinancialGrowth[]>(
      `v3/financial-growth/${symbol.toUpperCase()}`,
      { searchParams: params }
    );
  }

  /**
   * Get available reporting dates for financial statements
   * @param symbol - Stock symbol
   */
  async getReportDates(symbol: string): Promise<ReportDate[]> {
    return this.client.get<ReportDate[]>('v4/financial-reports-dates', {
      searchParams: { symbol: symbol.toUpperCase() },
    });
  }

  /**
   * Get as-reported income statement
   * @param symbol - Stock symbol
   * @param period - Period type
   * @param limit - Number of results
   */
  async getAsReportedIncomeStatement(
    symbol: string,
    period: Period = Period.Annual,
    limit?: number
  ): Promise<Record<string, unknown>[]> {
    const params: Record<string, string | number> = { period };
    if (limit) params.limit = limit;
    return this.client.get<Record<string, unknown>[]>(`v3/income-statement-as-reported/${symbol.toUpperCase()}`, { searchParams: params });
  }

  /**
   * Get as-reported balance sheet
   * @param symbol - Stock symbol
   * @param period - Period type
   * @param limit - Number of results
   */
  async getAsReportedBalanceSheet(
    symbol: string,
    period: Period = Period.Annual,
    limit?: number
  ): Promise<Record<string, unknown>[]> {
    const params: Record<string, string | number> = { period };
    if (limit) params.limit = limit;
    return this.client.get<Record<string, unknown>[]>(`v3/balance-sheet-statement-as-reported/${symbol.toUpperCase()}`, { searchParams: params });
  }

  /**
   * Get as-reported cash flow statement
   * @param symbol - Stock symbol
   * @param period - Period type
   * @param limit - Number of results
   */
  async getAsReportedCashFlow(
    symbol: string,
    period: Period = Period.Annual,
    limit?: number
  ): Promise<Record<string, unknown>[]> {
    const params: Record<string, string | number> = { period };
    if (limit) params.limit = limit;
    return this.client.get<Record<string, unknown>[]>(`v3/cash-flow-statement-as-reported/${symbol.toUpperCase()}`, { searchParams: params });
  }

  /**
   * Get full as-reported financials (v3 endpoint)
   * @param symbol - Stock symbol
   * @param period - Period type
   */
  async getAsReportedFull(symbol: string, period: Period = Period.Annual): Promise<Record<string, unknown>> {
    return this.client.get<Record<string, unknown>>(`v3/financial-statement-full-as-reported/${symbol.toUpperCase()}`, {
      searchParams: { period },
    });
  }

  /**
   * Get latest full as-reported financial statements (v4 endpoint)
   * Returns the most recent complete financial statement as reported to the SEC
   * @param symbol - Stock symbol
   * @param period - Period type (FY for annual, Q1-Q4 for quarterly)
   */
  async getLatestFinancialStatement(
    symbol: string,
    period: Period = Period.Annual
  ): Promise<LatestFinancialStatement[]> {
    return this.client.get<LatestFinancialStatement[]>(
      `v4/financial-statement-full-as-reported/${symbol.toUpperCase()}`,
      { searchParams: { period } }
    );
  }

  /**
   * Get financial report in JSON format (10-K/10-Q)
   * @param symbol - Stock symbol
   * @param year - Year of the report
   * @param period - Period (FY for 10-K, Q1-Q4 for 10-Q)
   */
  async getFinancialReportJSON(
    symbol: string,
    year: number,
    period: string
  ): Promise<Record<string, unknown>> {
    return this.client.get<Record<string, unknown>>('v4/financial-reports-json', {
      searchParams: {
        symbol: symbol.toUpperCase(),
        year,
        period,
      },
    });
  }

  /**
   * Get financial report download URL in XLSX format (10-K/10-Q)
   * @param symbol - Stock symbol
   * @param year - Year of the report
   * @param period - Period (FY for 10-K, Q1-Q4 for 10-Q)
   * @returns Download URL for the XLSX file
   */
  async getFinancialReportXLSX(
    symbol: string,
    year: number,
    period: string
  ): Promise<FinancialReportDownload> {
    return this.client.get<FinancialReportDownload>('v4/financial-reports-xlsx', {
      searchParams: {
        symbol: symbol.toUpperCase(),
        year,
        period,
      },
    });
  }
}
