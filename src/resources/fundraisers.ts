import type { FMPClient } from '../client.js';
import type {
  Crowdfunding,
  EquityOffering,
  CrowdfundingRSSItem,
  EquityOfferingRSSItem,
} from '../types/index.js';

/**
 * Fundraisers resource
 */
export class FundraisersResource {
  constructor(private readonly client: FMPClient) {}

  /**
   * Get latest crowdfunding offerings from RSS feed
   * @param page - Page number (default: 0)
   */
  async getLatestCrowdfunding(page = 0): Promise<CrowdfundingRSSItem[]> {
    return this.client.get<CrowdfundingRSSItem[]>('v4/crowdfunding-rss-feed', { searchParams: { page } });
  }

  /**
   * Search crowdfunding offerings
   * @param name - Company name to search for (optional)
   * @param cik - CIK number to search for (optional)
   * @param page - Page number (default: 0)
   */
  async searchCrowdfunding(name?: string, cik?: string, page = 0): Promise<Crowdfunding[]> {
    const params: Record<string, string | number> = { page };
    if (name) params.name = name;
    if (cik) params.cik = cik;

    return this.client.get<Crowdfunding[]>('v4/crowdfunding', { searchParams: params });
  }

  /**
   * Get crowdfunding offerings by CIK
   * @param cik - CIK number
   * @param page - Page number (default: 0)
   */
  async getCrowdfundingByCIK(cik: string, page = 0): Promise<Crowdfunding[]> {
    return this.client.get<Crowdfunding[]>(`v4/crowdfunding/${cik}`, { searchParams: { page } });
  }

  /**
   * Get latest equity offerings from RSS feed
   * @param page - Page number (default: 0)
   */
  async getLatestEquity(page = 0): Promise<EquityOfferingRSSItem[]> {
    return this.client.get<EquityOfferingRSSItem[]>('v4/fundraising-rss-feed', { searchParams: { page } });
  }

  /**
   * Search equity offerings
   * @param name - Company name to search for (optional)
   * @param cik - CIK number to search for (optional)
   * @param page - Page number (default: 0)
   */
  async searchEquity(name?: string, cik?: string, page = 0): Promise<EquityOffering[]> {
    const params: Record<string, string | number> = { page };
    if (name) params.name = name;
    if (cik) params.cik = cik;

    return this.client.get<EquityOffering[]>('v4/fundraising', { searchParams: params });
  }

  /**
   * Get equity offerings by CIK
   * @param cik - CIK number
   * @param page - Page number (default: 0)
   */
  async getEquityByCIK(cik: string, page = 0): Promise<EquityOffering[]> {
    return this.client.get<EquityOffering[]>(`v4/fundraising/${cik}`, { searchParams: { page } });
  }
}
