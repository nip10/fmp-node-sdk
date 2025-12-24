import type { FMPClient } from '../client.js';
import type {
  CompanyProfile,
  Quote,
  SymbolsList,
  CompanyNotes,
  StockPeer,
  DelistedCompany,
  EmployeeCount,
  HistoricalEmployeeCount,
  MarketCap,
  HistoricalMarketCap,
  SharesFloat,
  MergerAcquisition,
  Executive,
  ExecutiveCompensation,
  CompensationBenchmark,
  CIKMapping,
  SymbolChange,
  ExchangeInfo,
  SectorIndustry,
  TradableSymbol,
} from '../types/index.js';

/**
 * Company data resource
 * Provides access to company profiles, quotes, and symbols
 */
export class CompanyResource {
  constructor(private readonly client: FMPClient) {}

  /**
   * Get company profile information
   * @param symbol - Stock symbol (e.g., "AAPL")
   */
  async getProfile(symbol: string): Promise<CompanyProfile[]> {
    return this.client.get<CompanyProfile[]>(`v3/profile/${symbol.toUpperCase()}`);
  }

  /**
   * Get real-time quote for a symbol
   * @param symbol - Stock symbol (e.g., "AAPL")
   */
  async getQuote(symbol: string): Promise<Quote[]> {
    return this.client.get<Quote[]>(`v3/quote/${symbol.toUpperCase()}`);
  }

  /**
   * Get quotes for multiple symbols
   * @param symbols - Array of stock symbols
   */
  async getQuotes(symbols: string[]): Promise<Quote[]> {
    const symbolsParam = symbols.map(s => s.toUpperCase()).join(',');
    return this.client.get<Quote[]>(`v3/quote/${symbolsParam}`);
  }

  /**
   * Get all available trading symbols
   */
  async getSymbolsList(): Promise<SymbolsList[]> {
    return this.client.get<SymbolsList[]>('v3/stock/list');
  }

  /**
   * Get available symbols for a specific exchange
   * @param exchange - Exchange name (e.g., "NASDAQ", "NYSE")
   */
  async getExchangeSymbols(exchange: string): Promise<SymbolsList[]> {
    return this.client.get<SymbolsList[]>(`v3/symbol/${exchange.toUpperCase()}`);
  }

  /**
   * Search for companies by query
   * @param query - Search query
   * @param limit - Maximum number of results
   * @param exchange - Filter by exchange (optional)
   */
  async search(query: string, limit = 10, exchange?: string): Promise<SymbolsList[]> {
    const params: Record<string, string | number> = {
      query,
      limit,
    };

    if (exchange) {
      params.exchange = exchange;
    }

    return this.client.get<SymbolsList[]>('v3/search', { searchParams: params });
  }

  /**
   * Get company profile by CIK
   * @param cik - Central Index Key
   */
  async getProfileByCIK(cik: string): Promise<CompanyProfile[]> {
    return this.client.get<CompanyProfile[]>(`v3/profile/${cik}`);
  }

  /**
   * Get company notes
   * @param symbol - Stock symbol
   */
  async getCompanyNotes(symbol: string): Promise<CompanyNotes[]> {
    return this.client.get<CompanyNotes[]>(`v4/company-notes`, { searchParams: { symbol: symbol.toUpperCase() } });
  }

  /**
   * Get stock peers
   * @param symbol - Stock symbol
   */
  async getStockPeers(symbol: string): Promise<StockPeer[]> {
    return this.client.get<StockPeer[]>(`v4/stock_peers`, { searchParams: { symbol: symbol.toUpperCase() } });
  }

  /**
   * Get delisted companies
   * @param limit - Maximum number of results
   */
  async getDelistedCompanies(limit?: number): Promise<DelistedCompany[]> {
    const params: Record<string, number> = {};
    if (limit) params.limit = limit;
    return this.client.get<DelistedCompany[]>('v3/delisted-companies', { searchParams: params });
  }

  /**
   * Get employee count for a company
   * @param symbol - Stock symbol
   */
  async getEmployeeCount(symbol: string): Promise<EmployeeCount[]> {
    return this.client.get<EmployeeCount[]>(`v4/employee_count`, { searchParams: { symbol: symbol.toUpperCase() } });
  }

  /**
   * Get historical employee count
   * @param symbol - Stock symbol
   */
  async getHistoricalEmployeeCount(symbol: string): Promise<HistoricalEmployeeCount[]> {
    return this.client.get<HistoricalEmployeeCount[]>(
      `v4/historical/employee_count`,
      { searchParams: { symbol: symbol.toUpperCase() } }
    );
  }

  /**
   * Get market capitalization
   * @param symbol - Stock symbol
   */
  async getMarketCap(symbol: string): Promise<MarketCap[]> {
    return this.client.get<MarketCap[]>(`v3/market-capitalization/${symbol.toUpperCase()}`);
  }

  /**
   * Get batch market capitalization for multiple symbols
   * @param symbols - Array of stock symbols
   */
  async getBatchMarketCap(symbols: string[]): Promise<MarketCap[]> {
    const symbolsParam = symbols.map(s => s.toUpperCase()).join(',');
    return this.client.get<MarketCap[]>(`v3/market-capitalization/${symbolsParam}`);
  }

  /**
   * Get historical market capitalization
   * @param symbol - Stock symbol
   * @param limit - Maximum number of results
   */
  async getHistoricalMarketCap(symbol: string, limit?: number): Promise<HistoricalMarketCap[]> {
    const params: Record<string, string | number> = { symbol: symbol.toUpperCase() };
    if (limit) params.limit = limit;
    return this.client.get<HistoricalMarketCap[]>(`v3/historical-market-capitalization/${symbol.toUpperCase()}`, { searchParams: params });
  }

  /**
   * Get shares float
   * @param symbol - Stock symbol
   */
  async getSharesFloat(symbol: string): Promise<SharesFloat[]> {
    return this.client.get<SharesFloat[]>(`v4/shares_float`, { searchParams: { symbol: symbol.toUpperCase() } });
  }

  /**
   * Get all shares float
   */
  async getAllSharesFloat(): Promise<SharesFloat[]> {
    return this.client.get<SharesFloat[]>('v4/shares_float/all');
  }

  /**
   * Get latest M&A transactions
   */
  async getMergerAcquisitions(): Promise<MergerAcquisition[]> {
    return this.client.get<MergerAcquisition[]>('v4/mergers-acquisitions-rss-feed');
  }

  /**
   * Search M&A transactions
   * @param name - Company name
   */
  async searchMergerAcquisitions(name: string): Promise<MergerAcquisition[]> {
    return this.client.get<MergerAcquisition[]>('v4/mergers-acquisitions/search', { searchParams: { name } });
  }

  /**
   * Get company executives
   * @param symbol - Stock symbol
   */
  async getExecutives(symbol: string): Promise<Executive[]> {
    return this.client.get<Executive[]>(`v3/key-executives/${symbol.toUpperCase()}`);
  }

  /**
   * Get executive compensation
   * @param symbol - Stock symbol
   */
  async getExecutiveCompensation(symbol: string): Promise<ExecutiveCompensation[]> {
    return this.client.get<ExecutiveCompensation[]>(`v4/governance/executive_compensation`, {
      searchParams: { symbol: symbol.toUpperCase() },
    });
  }

  /**
   * Get compensation benchmark by industry
   * @param year - Year
   */
  async getCompensationBenchmark(year: number): Promise<CompensationBenchmark[]> {
    return this.client.get<CompensationBenchmark[]>('v4/executive-compensation-benchmark', { searchParams: { year } });
  }

  /**
   * Get symbols with financial statements
   */
  async getFinancialStatementSymbols(): Promise<SymbolsList[]> {
    return this.client.get<SymbolsList[]>('v3/financial-statement-symbol-lists');
  }

  /**
   * Get CIK list
   */
  async getCIKList(): Promise<CIKMapping[]> {
    return this.client.get<CIKMapping[]>('v3/cik_list');
  }

  /**
   * Get symbol changes
   */
  async getSymbolChanges(): Promise<SymbolChange[]> {
    return this.client.get<SymbolChange[]>('v4/symbol_change');
  }

  /**
   * Get ETF symbols
   */
  async getETFSymbols(): Promise<SymbolsList[]> {
    return this.client.get<SymbolsList[]>('v3/etf/list');
  }

  /**
   * Get actively trading symbols
   */
  async getActivelyTrading(): Promise<TradableSymbol[]> {
    return this.client.get<TradableSymbol[]>('v3/available-traded/list');
  }

  /**
   * Get available earnings transcripts symbols
   */
  async getEarningsTranscriptsSymbols(): Promise<SymbolsList[]> {
    return this.client.get<SymbolsList[]>('v4/earning_call_transcript');
  }

  /**
   * Get list of available exchanges
   */
  async getExchanges(): Promise<ExchangeInfo[]> {
    return this.client.get<ExchangeInfo[]>('v3/exchanges-list');
  }

  /**
   * Get list of available sectors
   */
  async getSectors(): Promise<SectorIndustry[]> {
    return this.client.get<SectorIndustry[]>('v3/sector-list');
  }

  /**
   * Get list of available industries
   */
  async getIndustries(): Promise<SectorIndustry[]> {
    return this.client.get<SectorIndustry[]>('v3/industry-list');
  }

  /**
   * Get list of available countries
   */
  async getCountries(): Promise<string[]> {
    return this.client.get<string[]>('v3/get-all-countries');
  }

  /**
   * Get short quote (simplified quote data)
   * @param symbol - Stock symbol
   */
  async getQuoteShort(symbol: string): Promise<Record<string, unknown>[]> {
    return this.client.get<Record<string, unknown>[]>(`v3/quote-short/${symbol.toUpperCase()}`);
  }

  /**
   * Get aftermarket trade price
   * @param symbol - Stock symbol
   */
  async getAftermarketTrade(symbol: string): Promise<Record<string, unknown>[]> {
    return this.client.get<Record<string, unknown>[]>(`v4/pre-post-market-trade/${symbol.toUpperCase()}`);
  }

  /**
   * Get aftermarket quote
   * @param symbol - Stock symbol
   */
  async getAftermarketQuote(symbol: string): Promise<Record<string, unknown>[]> {
    return this.client.get<Record<string, unknown>[]>(`v4/pre-post-market/${symbol.toUpperCase()}`);
  }

  /**
   * Get price change
   * @param symbol - Stock symbol
   */
  async getPriceChange(symbol: string): Promise<Record<string, unknown>[]> {
    return this.client.get<Record<string, unknown>[]>(`v3/stock-price-change/${symbol.toUpperCase()}`);
  }

  /**
   * Get batch short quotes
   * @param symbols - Array of stock symbols
   */
  async getBatchQuotesShort(symbols: string[]): Promise<Record<string, unknown>[]> {
    const symbolsParam = symbols.map(s => s.toUpperCase()).join(',');
    return this.client.get<Record<string, unknown>[]>(`v3/quote-short/${symbolsParam}`);
  }

  /**
   * Get batch aftermarket trades
   * @param symbols - Array of stock symbols
   */
  async getBatchAftermarketTrades(symbols: string[]): Promise<Record<string, unknown>[]> {
    const symbolsParam = symbols.map(s => s.toUpperCase()).join(',');
    return this.client.get<Record<string, unknown>[]>(`v4/pre-post-market-trade/${symbolsParam}`);
  }

  /**
   * Get batch aftermarket quotes
   * @param symbols - Array of stock symbols
   */
  async getBatchAftermarketQuotes(symbols: string[]): Promise<Record<string, unknown>[]> {
    const symbolsParam = symbols.map(s => s.toUpperCase()).join(',');
    return this.client.get<Record<string, unknown>[]>(`v4/pre-post-market/${symbolsParam}`);
  }

  /**
   * Get mutual fund quotes
   */
  async getMutualFundQuotes(): Promise<Record<string, unknown>[]> {
    return this.client.get<Record<string, unknown>[]>('v3/quotes/mutual_fund');
  }

  /**
   * Get ETF quotes
   */
  async getETFQuotes(): Promise<Record<string, unknown>[]> {
    return this.client.get<Record<string, unknown>[]>('v3/quotes/etf');
  }

  /**
   * Get commodities quotes
   */
  async getCommoditiesQuotes(): Promise<Record<string, unknown>[]> {
    return this.client.get<Record<string, unknown>[]>('v3/quotes/commodity');
  }

  /**
   * Get index quotes
   */
  async getIndexQuotes(): Promise<Record<string, unknown>[]> {
    return this.client.get<Record<string, unknown>[]>('v3/quotes/index');
  }
}
