import type { FMPClient } from '../client.js';
import type {
  FMPArticle,
  StockNews,
  PressRelease,
  EarningsTranscript,
} from '../types/index.js';

/**
 * News and press releases resource
 */
export class NewsResource {
  constructor(private readonly client: FMPClient) {}

  /**
   * Get FMP articles
   * @param page - Page number
   * @param limit - Results per page
   */
  async getFMPArticles(page = 0, limit = 50): Promise<FMPArticle[]> {
    return this.client.get<FMPArticle[]>('fmp-articles', {
      searchParams: { page, size: limit },
    });
  }

  /**
   * Get general news
   * @param page - Page number
   */
  async getGeneralNews(page = 0): Promise<StockNews[]> {
    return this.client.get<StockNews[]>('general-news', {
      searchParams: { page },
    });
  }

  /**
   * Get stock news
   * @param tickers - Comma-separated stock symbols (optional)
   * @param limit - Number of results
   */
  async getStockNews(tickers?: string, limit = 50): Promise<StockNews[]> {
    const params: Record<string, string | number> = { limit };
    if (tickers) params.tickers = tickers;

    return this.client.get<StockNews[]>('stock-news', {
      searchParams: params,
    });
  }

  /**
   * Get crypto news
   * @param page - Page number
   * @param limit - Results per page
   */
  async getCryptoNews(page = 0, limit = 50): Promise<StockNews[]> {
    return this.client.get<StockNews[]>('crypto-news', {
      searchParams: { page, limit },
    });
  }

  /**
   * Get forex news
   * @param page - Page number
   * @param limit - Results per page
   */
  async getForexNews(page = 0, limit = 50): Promise<StockNews[]> {
    return this.client.get<StockNews[]>('forex-news', {
      searchParams: { page, limit },
    });
  }

  /**
   * Get press releases
   * @param symbol - Stock symbol
   * @param page - Page number
   */
  async getPressReleases(symbol: string, page = 0): Promise<PressRelease[]> {
    return this.client.get<PressRelease[]>('press-releases', {
      searchParams: { symbol: symbol.toUpperCase(), page },
    });
  }

  /**
   * Get latest press releases for a symbol
   * @param symbol - Stock symbol
   * @param limit - Number of results (default: 50)
   */
  async getLatestPressReleases(symbol: string, limit = 50): Promise<PressRelease[]> {
    return this.client.get<PressRelease[]>('press-releases', {
      searchParams: { symbol: symbol.toUpperCase(), limit },
    });
  }

  /**
   * Get earnings call transcripts
   * @param symbol - Stock symbol
   * @param year - Year
   * @param quarter - Quarter (1-4)
   */
  async getEarningsTranscript(
    symbol: string,
    year: number,
    quarter: number
  ): Promise<EarningsTranscript[]> {
    return this.client.get<EarningsTranscript[]>('earning-call-transcript', {
      searchParams: {
        symbol: symbol.toUpperCase(),
        year,
        quarter,
      },
    });
  }

  /**
   * Get available earnings transcript dates
   * @param symbol - Stock symbol
   */
  async getEarningsTranscriptDates(symbol: string): Promise<Array<{ year: number; quarter: number }>> {
    return this.client.get<Array<{ year: number; quarter: number }>>(
      'earning-call-transcript-dates', {
        searchParams: { symbol: symbol.toUpperCase() },
      }
    );
  }

  /**
   * Get batch earnings call transcripts (all available transcripts for a symbol)
   * @param symbol - Stock symbol
   */
  async getBatchEarningsTranscripts(symbol: string): Promise<EarningsTranscript[]> {
    return this.client.get<EarningsTranscript[]>('batch-earning-call-transcript', {
      searchParams: { symbol: symbol.toUpperCase() },
    });
  }

  /**
   * Get list of symbols with available earnings transcripts
   */
  async getAvailableTranscriptSymbols(): Promise<Array<{ symbol: string }>> {
    return this.client.get<Array<{ symbol: string }>>('earning-call-transcript-available-symbols');
  }

  /**
   * Search press releases
   * @param query - Search query
   * @param limit - Number of results
   */
  async searchPressReleases(query: string, limit = 50): Promise<PressRelease[]> {
    return this.client.get<PressRelease[]>('press-releases-search', {
      searchParams: { query, limit },
    });
  }

  /**
   * Search stock news
   * @param query - Search query
   * @param limit - Number of results
   */
  async searchStockNews(query: string, limit = 50): Promise<StockNews[]> {
    return this.client.get<StockNews[]>('stock-news-search', {
      searchParams: { query, limit },
    });
  }

  /**
   * Search crypto news
   * @param query - Search query
   * @param limit - Number of results
   */
  async searchCryptoNews(query: string, limit = 50): Promise<StockNews[]> {
    return this.client.get<StockNews[]>('crypto-news-search', {
      searchParams: { query, limit },
    });
  }

  /**
   * Search forex news
   * @param query - Search query
   * @param limit - Number of results
   */
  async searchForexNews(query: string, limit = 50): Promise<StockNews[]> {
    return this.client.get<StockNews[]>('forex-news-search', {
      searchParams: { query, limit },
    });
  }
}
