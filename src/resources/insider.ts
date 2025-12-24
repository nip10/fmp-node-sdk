import type { FMPClient } from '../client.js';
import type {
  InsiderTrade,
  InsiderTradingStatistics,
  InsiderRoster,
  InstitutionalHolder,
  Form13F,
  CongressionalTrade,
  Form13FPortfolioDate,
  Form13FWithAnalytics,
  PortfolioHoldingsSummary,
  IndustryPortfolioHoldingsSummary,
  SymbolOwnership,
  IndustryInstitutionalOwnership,
} from '../types/index.js';

/**
 * Insider trading and institutional ownership resource
 */
export class InsiderResource {
  constructor(private readonly client: FMPClient) {}

  /**
   * Get insider trading transactions
   * @param symbol - Stock symbol
   * @param limit - Number of results
   */
  async getInsiderTrades(symbol: string, limit?: number): Promise<InsiderTrade[]> {
    const params: Record<string, string | number> = { symbol: symbol.toUpperCase() };
    if (limit) params.limit = limit;

    return this.client.get<InsiderTrade[]>('v4/insider-trading', { searchParams: params });
  }

  /**
   * Get insider trading statistics
   * @param symbol - Stock symbol
   */
  async getInsiderStatistics(symbol: string): Promise<InsiderTradingStatistics[]> {
    return this.client.get<InsiderTradingStatistics[]>(`v4/insider-roaster-statistic`, {
      searchParams: { symbol: symbol.toUpperCase() },
    });
  }

  /**
   * Get insider roster
   * @param symbol - Stock symbol
   */
  async getInsiderRoster(symbol: string): Promise<InsiderRoster[]> {
    return this.client.get<InsiderRoster[]>(`v4/insider-roaster`, {
      searchParams: { symbol: symbol.toUpperCase() },
    });
  }

  /**
   * Get institutional holders
   * @param symbol - Stock symbol
   */
  async getInstitutionalHolders(symbol: string): Promise<InstitutionalHolder[]> {
    return this.client.get<InstitutionalHolder[]>(`v3/institutional-holder/${symbol.toUpperCase()}`);
  }

  /**
   * Get Form 13F filings
   * @param cik - CIK number
   * @param date - Filing date (YYYY-MM-DD)
   */
  async get13F(cik: string, date?: string): Promise<Form13F[]> {
    const params: Record<string, string> = {};
    if (date) params.date = date;

    return this.client.get<Form13F[]>(`v3/form-thirteen/${cik}`, { searchParams: params });
  }

  /**
   * Get Senate trading disclosures
   * @param symbol - Stock symbol (optional)
   */
  async getSenateTrades(symbol?: string): Promise<CongressionalTrade[]> {
    const params: Record<string, string> = {};
    if (symbol) params.symbol = symbol.toUpperCase();

    return this.client.get<CongressionalTrade[]>('v4/senate-trading', { searchParams: params });
  }

  /**
   * Get House of Representatives trading disclosures
   * @param symbol - Stock symbol (optional)
   */
  async getHouseTrades(symbol?: string): Promise<CongressionalTrade[]> {
    const params: Record<string, string> = {};
    if (symbol) params.symbol = symbol.toUpperCase();

    return this.client.get<CongressionalTrade[]>('v4/senate-disclosure', { searchParams: params });
  }

  /**
   * Get latest Senate trading disclosures from RSS feed
   */
  async getLatestSenateTrades(): Promise<CongressionalTrade[]> {
    return this.client.get<CongressionalTrade[]>('v4/senate-trading-rss-feed');
  }

  /**
   * Get latest House of Representatives trading disclosures from RSS feed
   */
  async getLatestHouseTrades(): Promise<CongressionalTrade[]> {
    return this.client.get<CongressionalTrade[]>('v4/senate-disclosure-rss-feed');
  }

  /**
   * Get Senate trading disclosures by senator name
   * @param name - Senator name
   */
  async getSenateTradingByName(name: string): Promise<CongressionalTrade[]> {
    return this.client.get<CongressionalTrade[]>('v4/senate-trading', {
      searchParams: { name },
    });
  }

  /**
   * Get House of Representatives trading disclosures by representative name
   * @param name - Representative name
   */
  async getHouseTradingByName(name: string): Promise<CongressionalTrade[]> {
    return this.client.get<CongressionalTrade[]>('v4/senate-disclosure', {
      searchParams: { name },
    });
  }

  /**
   * Get latest insider trades
   * @param limit - Number of results
   */
  async getLatestInsiderTrades(limit?: number): Promise<InsiderTrade[]> {
    const params: Record<string, number> = {};
    if (limit) params.limit = limit;
    return this.client.get<InsiderTrade[]>('v4/insider-trading', { searchParams: params });
  }

  /**
   * Get insider trades by reporting person name
   * @param name - Reporting person name
   * @param limit - Number of results
   */
  async getInsiderTradesByName(name: string, limit?: number): Promise<InsiderTrade[]> {
    const params: Record<string, string | number> = { reportingName: name };
    if (limit) params.limit = limit;
    return this.client.get<InsiderTrade[]>('v4/insider-trading', { searchParams: params });
  }

  /**
   * Get insider transaction types
   */
  async getInsiderTransactionTypes(): Promise<{ transactionType: string }[]> {
    return this.client.get<{ transactionType: string }[]>('v4/insider-trading-transaction-type');
  }

  /**
   * Get Form 4 ownership data
   * @param symbol - Stock symbol
   * @param limit - Number of results
   */
  async getForm4Ownership(symbol: string, limit?: number): Promise<Record<string, unknown>[]> {
    const params: Record<string, string | number> = { symbol: symbol.toUpperCase() };
    if (limit) params.limit = limit;
    return this.client.get<Record<string, unknown>[]>('v4/form-four', { searchParams: params });
  }

  /**
   * Get latest Form 13F filing dates for institutional investors
   * @param cik - CIK number (optional)
   * @param page - Page number for pagination (optional)
   */
  async getLatest13FFilings(cik?: string, page?: number): Promise<Form13FPortfolioDate[]> {
    const params: Record<string, string | number> = {};
    if (cik) params.cik = cik;
    if (page) params.page = page;

    return this.client.get<Form13FPortfolioDate[]>('v4/institutional-ownership/portfolio-date', { searchParams: params });
  }

  /**
   * Get Form 13F filing dates for a specific institutional investor
   * @param cik - CIK number
   */
  async get13FFilingDates(cik: string): Promise<Form13FPortfolioDate[]> {
    return this.client.get<Form13FPortfolioDate[]>('v4/institutional-ownership/portfolio-date', {
      searchParams: { cik },
    });
  }

  /**
   * Get Form 13F extract with analytics (changes and percentages)
   * @param cik - CIK number
   * @param date - Filing date (YYYY-MM-DD, optional)
   * @param page - Page number for pagination (optional)
   */
  async get13FWithAnalytics(cik: string, date?: string, page?: number): Promise<Form13FWithAnalytics[]> {
    const params: Record<string, string | number> = {};
    if (date) params.date = date;
    if (page) params.page = page;

    return this.client.get<Form13FWithAnalytics[]>(`v4/form-thirteen/${cik}`, { searchParams: params });
  }

  /**
   * Get portfolio holdings performance summary
   * @param cik - CIK number
   * @param date - Filing date (YYYY-MM-DD, optional)
   * @param page - Page number for pagination (optional)
   */
  async getPortfolioHoldingsSummary(cik: string, date?: string, page?: number): Promise<PortfolioHoldingsSummary[]> {
    const params: Record<string, string | number> = { cik };
    if (date) params.date = date;
    if (page) params.page = page;

    return this.client.get<PortfolioHoldingsSummary[]>('v4/institutional-ownership/portfolio-holdings-summary', { searchParams: params });
  }

  /**
   * Get industry breakdown of portfolio holdings
   * @param cik - CIK number
   * @param date - Filing date (YYYY-MM-DD, optional)
   * @param page - Page number for pagination (optional)
   */
  async getIndustryPortfolioBreakdown(cik: string, date?: string, page?: number): Promise<IndustryPortfolioHoldingsSummary[]> {
    const params: Record<string, string | number> = { cik };
    if (date) params.date = date;
    if (page) params.page = page;

    return this.client.get<IndustryPortfolioHoldingsSummary[]>('v4/institutional-ownership/industry/portfolio-holdings-summary', { searchParams: params });
  }

  /**
   * Get institutional ownership positions summary for a symbol
   * @param symbol - Stock symbol
   * @param includeCurrentQuarter - Whether to include current quarter data (optional)
   * @param page - Page number for pagination (optional)
   */
  async getSymbolOwnershipPositions(symbol: string, includeCurrentQuarter?: boolean, page?: number): Promise<SymbolOwnership[]> {
    const params: Record<string, string | number | boolean> = { symbol: symbol.toUpperCase() };
    if (includeCurrentQuarter !== undefined) params.includeCurrentQuarter = includeCurrentQuarter;
    if (page) params.page = page;

    return this.client.get<SymbolOwnership[]>('v4/institutional-ownership/symbol-ownership', { searchParams: params });
  }

  /**
   * Get industry summary of institutional ownership by symbol
   * @param symbol - Stock symbol
   * @param page - Page number for pagination (optional)
   */
  async getIndustryInstitutionalOwnership(symbol: string, page?: number): Promise<IndustryInstitutionalOwnership[]> {
    const params: Record<string, string | number> = { symbol: symbol.toUpperCase() };
    if (page) params.page = page;

    return this.client.get<IndustryInstitutionalOwnership[]>('v4/institutional-ownership/institutional-holders/symbol-ownership-percent', { searchParams: params });
  }
}
