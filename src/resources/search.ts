import type { FMPClient } from '../client.js';
import type {
  SymbolSearchResult,
  NameSearchResult,
  CIKSearchResult,
  CUSIPSearchResult,
  ISINSearchResult,
  StockScreenerParams,
  StockScreenerResult,
  ExchangeSymbol,
} from '../types/index.js';

/**
 * Search resource
 * Provides access to company search endpoints
 */
export class SearchResource {
  constructor(private readonly client: FMPClient) {}

  /**
   * Search companies by ticker symbol
   * @param query - Ticker symbol to search for
   * @param limit - Maximum number of results (default: 10)
   * @param exchange - Filter by exchange (optional)
   * @returns Array of matching symbols
   *
   * @example
   * ```typescript
   * // Search for Apple
   * const results = await fmp.search.searchBySymbol('AAPL');
   *
   * // Search with limit and exchange filter
   * const results = await fmp.search.searchBySymbol('AA', 20, 'NASDAQ');
   * ```
   */
  async searchBySymbol(
    query: string,
    limit = 10,
    exchange?: string
  ): Promise<SymbolSearchResult[]> {
    const params: Record<string, string | number> = {
      query: query.toUpperCase(),
      limit,
    };

    if (exchange) {
      params.exchange = exchange.toUpperCase();
    }

    return this.client.get<SymbolSearchResult[]>('search-symbol', { searchParams: params });
  }

  /**
   * Search companies by name
   * @param query - Company name to search for
   * @param limit - Maximum number of results (default: 10)
   * @param exchange - Filter by exchange (optional)
   * @returns Array of matching companies
   *
   * @example
   * ```typescript
   * // Search for companies with 'Apple' in the name
   * const results = await fmp.search.searchByName('Apple');
   *
   * // Search with limit and exchange filter
   * const results = await fmp.search.searchByName('Tech', 20, 'NASDAQ');
   * ```
   */
  async searchByName(
    query: string,
    limit = 10,
    exchange?: string
  ): Promise<NameSearchResult[]> {
    const params: Record<string, string | number> = {
      query,
      limit,
    };

    if (exchange) {
      params.exchange = exchange.toUpperCase();
    }

    return this.client.get<NameSearchResult[]>('search-name', { searchParams: params });
  }

  /**
   * Search company by CIK (Central Index Key)
   * @param cik - CIK number to search for
   * @returns Array of matching companies
   *
   * @example
   * ```typescript
   * // Search by CIK
   * const results = await fmp.search.searchByCIK('0000320193');
   * ```
   */
  async searchByCIK(cik: string): Promise<CIKSearchResult[]> {
    return this.client.get<CIKSearchResult[]>('search-cik', {
      searchParams: { cik },
    });
  }

  /**
   * Search company by CUSIP
   * @param cusip - CUSIP number to search for
   * @returns Array of matching companies
   *
   * @example
   * ```typescript
   * // Search by CUSIP
   * const results = await fmp.search.searchByCUSIP('037833100');
   * ```
   */
  async searchByCUSIP(cusip: string): Promise<CUSIPSearchResult[]> {
    return this.client.get<CUSIPSearchResult[]>('search-cusip', {
      searchParams: { cusip },
    });
  }

  /**
   * Search company by ISIN (International Securities Identification Number)
   * @param isin - ISIN to search for
   * @returns Array of matching companies
   *
   * @example
   * ```typescript
   * // Search by ISIN
   * const results = await fmp.search.searchByISIN('US0378331005');
   * ```
   */
  async searchByISIN(isin: string): Promise<ISINSearchResult[]> {
    return this.client.get<ISINSearchResult[]>('search-isin', { searchParams: { isin } });
  }

  /**
   * Screen stocks based on multiple criteria
   * @param params - Screening parameters
   * @returns Array of stocks matching the criteria
   *
   * @example
   * ```typescript
   * // Find large-cap tech stocks
   * const results = await fmp.search.screenStocks({
   *   marketCapMoreThan: 100000000000,
   *   sector: 'Technology',
   *   isActivelyTrading: true,
   *   limit: 50
   * });
   *
   * // Find dividend stocks
   * const results = await fmp.search.screenStocks({
   *   dividendMoreThan: 2,
   *   priceMoreThan: 10,
   *   volumeMoreThan: 1000000
   * });
   * ```
   */
  async screenStocks(params: StockScreenerParams = {}): Promise<StockScreenerResult[]> {
    const queryParams: Record<string, string | number | boolean> = {};

    // Market cap filters
    if (params.marketCapMoreThan !== undefined) {
      queryParams.marketCapMoreThan = params.marketCapMoreThan;
    }
    if (params.marketCapLowerThan !== undefined) {
      queryParams.marketCapLowerThan = params.marketCapLowerThan;
    }

    // Price filters
    if (params.priceMoreThan !== undefined) {
      queryParams.priceMoreThan = params.priceMoreThan;
    }
    if (params.priceLowerThan !== undefined) {
      queryParams.priceLowerThan = params.priceLowerThan;
    }

    // Beta filters
    if (params.betaMoreThan !== undefined) {
      queryParams.betaMoreThan = params.betaMoreThan;
    }
    if (params.betaLowerThan !== undefined) {
      queryParams.betaLowerThan = params.betaLowerThan;
    }

    // Volume filters
    if (params.volumeMoreThan !== undefined) {
      queryParams.volumeMoreThan = params.volumeMoreThan;
    }
    if (params.volumeLowerThan !== undefined) {
      queryParams.volumeLowerThan = params.volumeLowerThan;
    }

    // Dividend filters
    if (params.dividendMoreThan !== undefined) {
      queryParams.dividendMoreThan = params.dividendMoreThan;
    }
    if (params.dividendLowerThan !== undefined) {
      queryParams.dividendLowerThan = params.dividendLowerThan;
    }

    // Boolean filters
    if (params.isEtf !== undefined) {
      queryParams.isEtf = params.isEtf;
    }
    if (params.isActivelyTrading !== undefined) {
      queryParams.isActivelyTrading = params.isActivelyTrading;
    }

    // Category filters
    if (params.sector) {
      queryParams.sector = params.sector;
    }
    if (params.industry) {
      queryParams.industry = params.industry;
    }
    if (params.country) {
      queryParams.country = params.country;
    }
    if (params.exchange) {
      queryParams.exchange = params.exchange.toUpperCase();
    }

    // Limit
    if (params.limit !== undefined) {
      queryParams.limit = params.limit;
    }

    return this.client.get<StockScreenerResult[]>('company-screener', { searchParams: queryParams });
  }

  /**
   * Get all symbols listed on a specific exchange
   * @param exchange - Exchange code (e.g., 'NASDAQ', 'NYSE', 'AMEX', 'ETF', 'MUTUAL_FUND', 'COMMODITY', 'INDEX', 'CRYPTO', 'FOREX', 'TSX', 'EURONEXT')
   * @returns Array of symbols on the exchange
   *
   * @example
   * ```typescript
   * // Get all NASDAQ symbols
   * const nasdaqSymbols = await fmp.search.getExchangeSymbols('NASDAQ');
   *
   * // Get all NYSE symbols
   * const nyseSymbols = await fmp.search.getExchangeSymbols('NYSE');
   *
   * // Get all ETFs
   * const etfs = await fmp.search.getExchangeSymbols('ETF');
   * ```
   */
  async getExchangeSymbols(exchange: string): Promise<ExchangeSymbol[]> {
    return this.client.get<ExchangeSymbol[]>('exchange-symbols', {
      searchParams: { exchange: exchange.toUpperCase() },
    });
  }
}
