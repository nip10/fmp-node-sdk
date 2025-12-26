import { FMPClient } from './client.js';
import type { FMPConfig } from './types/index.js';
import type { CacheProvider } from './cache/index.js';
import { CompanyResource } from './resources/company.js';
import { MarketResource } from './resources/market.js';
import { FinancialsResource } from './resources/financials.js';
import { AnalystResource } from './resources/analyst.js';
import { EventsResource } from './resources/events.js';
import { InsiderResource } from './resources/insider.js';
import { NewsResource } from './resources/news.js';
import { SECResource } from './resources/sec.js';
import { TechnicalResource } from './resources/technical.js';
import { PerformanceResource } from './resources/performance.js';
import { ETFResource } from './resources/etf.js';
import { IndexesResource } from './resources/indexes.js';
import { CommoditiesResource } from './resources/commodities.js';
import { EconomicsResource } from './resources/economics.js';
import { ValuationResource } from './resources/valuation.js';
import { ESGResource } from './resources/esg.js';
import { COTResource } from './resources/cot.js';
import { FundraisersResource } from './resources/fundraisers.js';
import { SearchResource } from './resources/search.js';
import { BulkResource } from './resources/bulk.js';

/**
 * Main FMP SDK class
 * Provides access to all Financial Modeling Prep API endpoints
 *
 * @example
 * ```typescript
 * import { FMP } from 'fmp-node-sdk';
 *
 * const fmp = new FMP({ apiKey: 'your-api-key' });
 *
 * // Get company profile
 * const profile = await fmp.company.getProfile('AAPL');
 *
 * // Get stock quote
 * const quote = await fmp.company.getQuote('AAPL');
 *
 * // Get historical prices
 * const prices = await fmp.market.getHistoricalPrices('AAPL', '2024-01-01', '2024-12-31');
 * ```
 */
export class FMP {
  private readonly client: FMPClient;

  /**
   * Company data endpoints
   */
  public readonly company: CompanyResource;

  /**
   * Market data endpoints
   */
  public readonly market: MarketResource;

  /**
   * Financial statements endpoints
   */
  public readonly financials: FinancialsResource;

  /**
   * Analyst data endpoints
   */
  public readonly analyst: AnalystResource;

  /**
   * Corporate events endpoints
   */
  public readonly events: EventsResource;

  /**
   * Insider trading endpoints
   */
  public readonly insider: InsiderResource;

  /**
   * News endpoints
   */
  public readonly news: NewsResource;

  /**
   * SEC filings endpoints
   */
  public readonly sec: SECResource;

  /**
   * Technical indicators endpoints
   */
  public readonly technical: TechnicalResource;

  /**
   * Market performance endpoints
   */
  public readonly performance: PerformanceResource;

  /**
   * ETF and mutual funds endpoints
   */
  public readonly etf: ETFResource;

  /**
   * Index endpoints
   */
  public readonly indexes: IndexesResource;

  /**
   * Commodities endpoints
   */
  public readonly commodities: CommoditiesResource;

  /**
   * Economics endpoints
   */
  public readonly economics: EconomicsResource;

  /**
   * Valuation endpoints (DCF, etc.)
   */
  public readonly valuation: ValuationResource;

  /**
   * ESG (Environmental, Social, Governance) endpoints
   */
  public readonly esg: ESGResource;

  /**
   * Commitment of Traders (COT) endpoints
   */
  public readonly cot: COTResource;

  /**
   * Fundraising and crowdfunding endpoints
   */
  public readonly fundraisers: FundraisersResource;

  /**
   * Company search endpoints
   */
  public readonly search: SearchResource;

  /**
   * Bulk data endpoints
   */
  public readonly bulk: BulkResource;

  /**
   * Create a new FMP SDK instance
   * @param config - Configuration options
   */
  constructor(config: FMPConfig) {
    this.client = new FMPClient(config);
    this.company = new CompanyResource(this.client);
    this.market = new MarketResource(this.client);
    this.financials = new FinancialsResource(this.client);
    this.analyst = new AnalystResource(this.client);
    this.events = new EventsResource(this.client);
    this.insider = new InsiderResource(this.client);
    this.news = new NewsResource(this.client);
    this.sec = new SECResource(this.client);
    this.technical = new TechnicalResource(this.client);
    this.performance = new PerformanceResource(this.client);
    this.etf = new ETFResource(this.client);
    this.indexes = new IndexesResource(this.client);
    this.commodities = new CommoditiesResource(this.client);
    this.economics = new EconomicsResource(this.client);
    this.valuation = new ValuationResource(this.client);
    this.esg = new ESGResource(this.client);
    this.cot = new COTResource(this.client);
    this.fundraisers = new FundraisersResource(this.client);
    this.search = new SearchResource(this.client);
    this.bulk = new BulkResource(this.client);
  }

  /**
   * Clear all cached responses
   *
   * @example
   * ```typescript
   * await fmp.clearCache();
   * ```
   */
  async clearCache(): Promise<void> {
    return this.client.clearCache();
  }

  /**
   * Get the cache provider instance (if caching is enabled)
   * Useful for advanced cache operations or custom cache management
   *
   * @example
   * ```typescript
   * const cache = fmp.getCacheProvider();
   * if (cache) {
   *   // Access cache directly for advanced operations
   *   const hasEntry = await cache.has('some-key');
   * }
   * ```
   */
  getCacheProvider(): CacheProvider | undefined {
    return this.client.getCacheProvider();
  }
}
