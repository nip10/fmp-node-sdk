import type { FMPClient } from '../client.js';
import type {
  SECFiling,
  SECRSSFeed,
  SICCode,
  CompanyCIKSearch,
  SECFullProfile,
} from '../types/index.js';

/**
 * SEC filings resource
 */
export class SECResource {
  constructor(private readonly client: FMPClient) {}

  /**
   * Get SEC filings for a company
   * @param symbol - Stock symbol
   * @param type - Filing type (e.g., "10-K", "10-Q", "8-K")
   * @param limit - Number of results
   */
  async getFilings(symbol: string, type?: string, limit?: number): Promise<SECFiling[]> {
    const params: Record<string, string | number> = {};
    if (type) params.type = type;
    if (limit) params.limit = limit;

    return this.client.get<SECFiling[]>(`v3/sec_filings/${symbol.toUpperCase()}`, { searchParams: params });
  }

  /**
   * Get SEC RSS feed
   * @param type - Filing type
   * @param from - Start date (YYYY-MM-DD)
   * @param to - End date (YYYY-MM-DD)
   * @param limit - Number of results
   */
  async getRSSFeed(type?: string, from?: string, to?: string, limit?: number): Promise<SECRSSFeed[]> {
    const params: Record<string, string | number> = {};
    if (type) params.type = type;
    if (from) params.from = from;
    if (to) params.to = to;
    if (limit) params.limit = limit;

    return this.client.get<SECRSSFeed[]>('v4/rss_feed', { searchParams: params });
  }

  /**
   * Search SEC filings by form type
   * @param formType - Form type (e.g., "10-K")
   * @param from - Start date
   * @param to - End date
   * @param limit - Number of results
   */
  async searchByFormType(
    formType: string,
    from?: string,
    to?: string,
    limit?: number
  ): Promise<SECRSSFeed[]> {
    const params: Record<string, string | number> = { type: formType };
    if (from) params.from = from;
    if (to) params.to = to;
    if (limit) params.limit = limit;

    return this.client.get<SECRSSFeed[]>('v4/rss_feed', { searchParams: params });
  }

  /**
   * Get 8-K filings
   * @param from - Start date
   * @param to - End date
   * @param limit - Number of results
   */
  async get8KFilings(from?: string, to?: string, limit?: number): Promise<SECRSSFeed[]> {
    return this.searchByFormType('8-K', from, to, limit);
  }

  /**
   * Get filings by CIK
   * @param cik - Central Index Key
   * @param type - Filing type
   * @param limit - Number of results
   */
  async getFilingsByCIK(cik: string, type?: string, limit?: number): Promise<SECFiling[]> {
    const params: Record<string, string | number> = {};
    if (type) params.type = type;
    if (limit) params.limit = limit;
    return this.client.get<SECFiling[]>(`v3/sec_filings/${cik}`, { searchParams: params });
  }

  /**
   * Get filings by company name
   * @param name - Company name
   * @param type - Filing type
   * @param limit - Number of results
   */
  async getFilingsByName(name: string, type?: string, limit?: number): Promise<SECFiling[]> {
    const params: Record<string, string | number> = { name };
    if (type) params.type = type;
    if (limit) params.limit = limit;
    return this.client.get<SECFiling[]>('v3/sec_filings', { searchParams: params });
  }

  /**
   * Search company by symbol for CIK
   * @param symbol - Stock symbol
   */
  async searchCompanyBySymbol(symbol: string): Promise<CompanyCIKSearch[]> {
    return this.client.get<CompanyCIKSearch[]>(`v3/cik-search/${symbol.toUpperCase()}`);
  }

  /**
   * Search company by CIK
   * @param cik - Central Index Key
   */
  async searchCompanyByCIK(cik: string): Promise<CompanyCIKSearch[]> {
    return this.client.get<CompanyCIKSearch[]>(`v3/cik/${cik}`);
  }

  /**
   * Get latest SEC filings
   * @param limit - Number of results
   */
  async getLatestFilings(limit?: number): Promise<SECRSSFeed[]> {
    const params: Record<string, number> = {};
    if (limit) params.limit = limit;
    return this.client.get<SECRSSFeed[]>('v4/rss_feed_8k', { searchParams: params });
  }

  /**
   * Get list of all SIC codes
   */
  async getAllSICCodes(): Promise<SICCode[]> {
    return this.client.get<SICCode[]>('v4/standard_industrial_classification/all');
  }

  /**
   * Get SIC codes by code
   * @param sicCode - SIC code
   */
  async getSICByCode(sicCode: string): Promise<SICCode[]> {
    return this.client.get<SICCode[]>(`v4/standard_industrial_classification`, { searchParams: { sicCode } });
  }

  /**
   * Search SIC codes by industry
   * @param industry - Industry name
   */
  async searchSIC(industry: string): Promise<SICCode[]> {
    return this.client.get<SICCode[]>('v4/standard_industrial_classification', { searchParams: { industry } });
  }

  /**
   * Get comprehensive company outlook/profile
   * Includes profile, financials, ratios, insider trading, executives, and more
   * @param symbol - Stock symbol
   */
  async getFullProfile(symbol: string): Promise<SECFullProfile> {
    return this.client.get<SECFullProfile>(`v4/company-outlook`, { searchParams: { symbol: symbol.toUpperCase() } });
  }
}
