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
  QuoteShort,
  AftermarketTrade,
  AftermarketQuote,
  PriceChange,
  FundListItem,
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
    return this.client.get<CompanyProfile[]>('profile', {
      searchParams: { symbol: symbol.toUpperCase() },
    });
  }

  /**
   * Get real-time quote for a symbol
   * @param symbol - Stock symbol (e.g., "AAPL")
   */
  async getQuote(symbol: string): Promise<Quote[]> {
    return this.client.get<Quote[]>('quote', {
      searchParams: { symbol: symbol.toUpperCase() },
    });
  }

  /**
   * Get quotes for multiple symbols
   * @param symbols - Array of stock symbols
   */
  async getQuotes(symbols: string[]): Promise<Quote[]> {
    const symbolsParam = symbols.map(s => s.toUpperCase()).join(',');
    return this.client.get<Quote[]>('batch-quote', {
      searchParams: { symbols: symbolsParam },
    });
  }

  /**
   * Get all available trading symbols
   */
  async getSymbolsList(): Promise<SymbolsList[]> {
    return this.client.get<SymbolsList[]>('stock-list');
  }

  /**
   * Get available symbols for a specific exchange
   * @param exchange - Exchange name (e.g., "NASDAQ", "NYSE")
   */
  async getExchangeSymbols(exchange: string): Promise<SymbolsList[]> {
    return this.client.get<SymbolsList[]>('stock-list', {
      searchParams: { exchange: exchange.toUpperCase() },
    });
  }

  /**
   * Search for companies by symbol query
   * @param query - Search query
   * @param limit - Maximum number of results
   * @param exchange - Filter by exchange (optional)
   */
  async searchSymbol(query: string, limit = 10, exchange?: string): Promise<SymbolsList[]> {
    const params: Record<string, string | number> = {
      query,
      limit,
    };

    if (exchange) {
      params.exchange = exchange;
    }

    return this.client.get<SymbolsList[]>('search-symbol', { searchParams: params });
  }

  /**
   * Search for companies by name query
   * @param query - Search query
   * @param limit - Maximum number of results
   * @param exchange - Filter by exchange (optional)
   */
  async searchName(query: string, limit = 10, exchange?: string): Promise<SymbolsList[]> {
    const params: Record<string, string | number> = {
      query,
      limit,
    };

    if (exchange) {
      params.exchange = exchange;
    }

    return this.client.get<SymbolsList[]>('search-name', { searchParams: params });
  }

  /**
   * Search for companies by query (alias for searchSymbol)
   * @param query - Search query
   * @param limit - Maximum number of results
   * @param exchange - Filter by exchange (optional)
   * @deprecated Use searchSymbol or searchName instead
   */
  async search(query: string, limit = 10, exchange?: string): Promise<SymbolsList[]> {
    return this.searchSymbol(query, limit, exchange);
  }

  /**
   * Get company profile by CIK
   * @param cik - Central Index Key
   */
  async getProfileByCIK(cik: string): Promise<CompanyProfile[]> {
    return this.client.get<CompanyProfile[]>('profile-cik', {
      searchParams: { cik },
    });
  }

  /**
   * Get company notes
   * @param symbol - Stock symbol
   */
  async getCompanyNotes(symbol: string): Promise<CompanyNotes[]> {
    return this.client.get<CompanyNotes[]>('company-notes', {
      searchParams: { symbol: symbol.toUpperCase() },
    });
  }

  /**
   * Get stock peers
   * @param symbol - Stock symbol
   */
  async getStockPeers(symbol: string): Promise<StockPeer[]> {
    return this.client.get<StockPeer[]>('stock-peers', {
      searchParams: { symbol: symbol.toUpperCase() },
    });
  }

  /**
   * Get delisted companies
   * @param page - Page number
   * @param limit - Maximum number of results
   */
  async getDelistedCompanies(page = 0, limit = 100): Promise<DelistedCompany[]> {
    return this.client.get<DelistedCompany[]>('delisted-companies', {
      searchParams: { page, limit },
    });
  }

  /**
   * Get employee count for a company
   * @param symbol - Stock symbol
   */
  async getEmployeeCount(symbol: string): Promise<EmployeeCount[]> {
    return this.client.get<EmployeeCount[]>('employee-count', {
      searchParams: { symbol: symbol.toUpperCase() },
    });
  }

  /**
   * Get historical employee count
   * @param symbol - Stock symbol
   */
  async getHistoricalEmployeeCount(symbol: string): Promise<HistoricalEmployeeCount[]> {
    return this.client.get<HistoricalEmployeeCount[]>('historical-employee-count', {
      searchParams: { symbol: symbol.toUpperCase() },
    });
  }

  /**
   * Get market capitalization
   * @param symbol - Stock symbol
   */
  async getMarketCap(symbol: string): Promise<MarketCap[]> {
    return this.client.get<MarketCap[]>('market-capitalization', {
      searchParams: { symbol: symbol.toUpperCase() },
    });
  }

  /**
   * Get batch market capitalization for multiple symbols
   * @param symbols - Array of stock symbols
   */
  async getBatchMarketCap(symbols: string[]): Promise<MarketCap[]> {
    const symbolsParam = symbols.map(s => s.toUpperCase()).join(',');
    return this.client.get<MarketCap[]>('market-capitalization-batch', {
      searchParams: { symbols: symbolsParam },
    });
  }

  /**
   * Get historical market capitalization
   * @param symbol - Stock symbol
   * @param limit - Maximum number of results
   */
  async getHistoricalMarketCap(symbol: string, limit?: number): Promise<HistoricalMarketCap[]> {
    const params: Record<string, string | number> = { symbol: symbol.toUpperCase() };
    if (limit) params.limit = limit;
    return this.client.get<HistoricalMarketCap[]>('historical-market-capitalization', {
      searchParams: params,
    });
  }

  /**
   * Get shares float
   * @param symbol - Stock symbol
   */
  async getSharesFloat(symbol: string): Promise<SharesFloat[]> {
    return this.client.get<SharesFloat[]>('shares-float', {
      searchParams: { symbol: symbol.toUpperCase() },
    });
  }

  /**
   * Get all shares float
   * @param page - Page number
   * @param limit - Maximum number of results
   */
  async getAllSharesFloat(page = 0, limit = 1000): Promise<SharesFloat[]> {
    return this.client.get<SharesFloat[]>('shares-float-all', {
      searchParams: { page, limit },
    });
  }

  /**
   * Get latest M&A transactions
   * @param page - Page number
   * @param limit - Maximum number of results
   */
  async getMergerAcquisitions(page = 0, limit = 100): Promise<MergerAcquisition[]> {
    return this.client.get<MergerAcquisition[]>('mergers-acquisitions-latest', {
      searchParams: { page, limit },
    });
  }

  /**
   * Search M&A transactions
   * @param name - Company name
   */
  async searchMergerAcquisitions(name: string): Promise<MergerAcquisition[]> {
    return this.client.get<MergerAcquisition[]>('mergers-acquisitions-search', {
      searchParams: { name },
    });
  }

  /**
   * Get company executives
   * @param symbol - Stock symbol
   */
  async getExecutives(symbol: string): Promise<Executive[]> {
    return this.client.get<Executive[]>('key-executives', {
      searchParams: { symbol: symbol.toUpperCase() },
    });
  }

  /**
   * Get executive compensation
   * @param symbol - Stock symbol
   */
  async getExecutiveCompensation(symbol: string): Promise<ExecutiveCompensation[]> {
    return this.client.get<ExecutiveCompensation[]>('governance-executive-compensation', {
      searchParams: { symbol: symbol.toUpperCase() },
    });
  }

  /**
   * Get compensation benchmark by industry
   * @param year - Year (optional)
   */
  async getCompensationBenchmark(year?: number): Promise<CompensationBenchmark[]> {
    const params: Record<string, number> = {};
    if (year) params.year = year;
    return this.client.get<CompensationBenchmark[]>('executive-compensation-benchmark', {
      searchParams: params,
    });
  }

  /**
   * Get symbols with financial statements
   */
  async getFinancialStatementSymbols(): Promise<SymbolsList[]> {
    return this.client.get<SymbolsList[]>('financial-statement-symbol-list');
  }

  /**
   * Get CIK list
   * @param page - Page number
   * @param limit - Maximum number of results
   */
  async getCIKList(page = 0, limit = 1000): Promise<CIKMapping[]> {
    return this.client.get<CIKMapping[]>('cik-list', {
      searchParams: { page, limit },
    });
  }

  /**
   * Get symbol changes
   */
  async getSymbolChanges(): Promise<SymbolChange[]> {
    return this.client.get<SymbolChange[]>('symbol-change');
  }

  /**
   * Get ETF symbols
   */
  async getETFSymbols(): Promise<SymbolsList[]> {
    return this.client.get<SymbolsList[]>('etf-list');
  }

  /**
   * Get actively trading symbols
   */
  async getActivelyTrading(): Promise<TradableSymbol[]> {
    return this.client.get<TradableSymbol[]>('actively-trading-list');
  }

  /**
   * Get list of available exchanges
   */
  async getExchanges(): Promise<ExchangeInfo[]> {
    return this.client.get<ExchangeInfo[]>('available-exchanges');
  }

  /**
   * Get list of available sectors
   */
  async getSectors(): Promise<SectorIndustry[]> {
    return this.client.get<SectorIndustry[]>('available-sectors');
  }

  /**
   * Get list of available industries
   */
  async getIndustries(): Promise<SectorIndustry[]> {
    return this.client.get<SectorIndustry[]>('available-industries');
  }

  /**
   * Get list of available countries
   */
  async getCountries(): Promise<string[]> {
    return this.client.get<string[]>('available-countries');
  }

  /**
   * Get short quote (simplified quote data)
   * @param symbol - Stock symbol
   */
  async getQuoteShort(symbol: string): Promise<QuoteShort[]> {
    return this.client.get<QuoteShort[]>('quote-short', {
      searchParams: { symbol: symbol.toUpperCase() },
    });
  }

  /**
   * Get aftermarket trade price
   * @param symbol - Stock symbol
   */
  async getAftermarketTrade(symbol: string): Promise<AftermarketTrade[]> {
    return this.client.get<AftermarketTrade[]>('aftermarket-trade', {
      searchParams: { symbol: symbol.toUpperCase() },
    });
  }

  /**
   * Get aftermarket quote
   * @param symbol - Stock symbol
   */
  async getAftermarketQuote(symbol: string): Promise<AftermarketQuote[]> {
    return this.client.get<AftermarketQuote[]>('aftermarket-quote', {
      searchParams: { symbol: symbol.toUpperCase() },
    });
  }

  /**
   * Get price change
   * @param symbol - Stock symbol
   */
  async getPriceChange(symbol: string): Promise<PriceChange[]> {
    return this.client.get<PriceChange[]>('stock-price-change', {
      searchParams: { symbol: symbol.toUpperCase() },
    });
  }

  /**
   * Get batch short quotes
   * @param symbols - Array of stock symbols
   */
  async getBatchQuotesShort(symbols: string[]): Promise<QuoteShort[]> {
    const symbolsParam = symbols.map(s => s.toUpperCase()).join(',');
    return this.client.get<QuoteShort[]>('quote-short', {
      searchParams: { symbol: symbolsParam },
    });
  }

  /**
   * Get batch aftermarket quotes
   * @param symbols - Array of stock symbols
   */
  async getBatchAftermarketQuotes(symbols: string[]): Promise<AftermarketQuote[]> {
    const symbolsParam = symbols.map(s => s.toUpperCase()).join(',');
    return this.client.get<AftermarketQuote[]>('batch-aftermarket-quote', {
      searchParams: { symbols: symbolsParam },
    });
  }

  /**
   * Get mutual fund quotes
   */
  async getMutualFundQuotes(): Promise<Quote[]> {
    return this.client.get<Quote[]>('batch-mutualfund-quotes');
  }

  /**
   * Get ETF quotes
   */
  async getETFQuotes(): Promise<Quote[]> {
    return this.client.get<Quote[]>('batch-etf-quotes');
  }

  /**
   * Get commodities quotes
   */
  async getCommoditiesQuotes(): Promise<Quote[]> {
    return this.client.get<Quote[]>('batch-commodity-quotes');
  }

  /**
   * Get index quotes
   */
  async getIndexQuotes(): Promise<Quote[]> {
    return this.client.get<Quote[]>('batch-index-quotes');
  }

  /**
   * Get batch aftermarket trades for multiple symbols
   * @param symbols - Array of stock symbols
   */
  async getBatchAftermarketTrades(symbols: string[]): Promise<AftermarketTrade[]> {
    const symbolsParam = symbols.map(s => s.toUpperCase()).join(',');
    return this.client.get<AftermarketTrade[]>('batch-aftermarket-trade', {
      searchParams: { symbols: symbolsParam },
    });
  }

  /**
   * Get ETF list
   */
  async getETFList(): Promise<FundListItem[]> {
    return this.client.get<FundListItem[]>('etf-list');
  }

  /**
   * Get mutual fund list
   */
  async getMutualFundList(): Promise<FundListItem[]> {
    return this.client.get<FundListItem[]>('mutual-fund-list');
  }
}
