import { describe, it, expect, vi, beforeEach } from 'vitest';
import { InsiderResource } from '../src/resources/insider.js';
import type { FMPClient } from '../src/client.js';
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
} from '../src/types/index.js';

describe('InsiderResource', () => {
  let mockClient: FMPClient;
  let insiderResource: InsiderResource;

  beforeEach(() => {
    mockClient = {
      get: vi.fn(),
    } as unknown as FMPClient;
    insiderResource = new InsiderResource(mockClient);
  });

  describe('getInsiderTrades', () => {
    it('should fetch insider trades for a symbol', async () => {
      const mockResponse: InsiderTrade[] = [
        {
          symbol: 'AAPL',
          filingDate: '2024-01-15',
          transactionDate: '2024-01-10',
          reportingCik: '0001234567',
          transactionType: 'P-Purchase',
          securitiesOwned: 10000,
          companyCik: '0000320193',
          reportingName: 'John Doe',
          typeOfOwner: 'director',
          acquistionOrDisposition: 'A',
          formType: '4',
          securitiesTransacted: 1000,
          price: 185.50,
          securityName: 'Common Stock',
          link: 'https://www.sec.gov/...',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      const result = await insiderResource.getInsiderTrades('aapl');

      expect(mockClient.get).toHaveBeenCalledWith('insider-trading', {
        searchParams: {
          symbol: 'AAPL',
      },
      }
);
      expect(result).toEqual(mockResponse);
    });

    it('should handle symbol case normalization', async () => {
      const mockResponse: InsiderTrade[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      await insiderResource.getInsiderTrades('tsla');

      expect(mockClient.get).toHaveBeenCalledWith('insider-trading', {
        searchParams: {
          symbol: 'TSLA',
      },
      }
);
    });

    it('should include limit parameter when provided', async () => {
      const mockResponse: InsiderTrade[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      await insiderResource.getInsiderTrades('AAPL', 50);

      expect(mockClient.get).toHaveBeenCalledWith('insider-trading', {
        searchParams: {
          symbol: 'AAPL',
        limit: 50,
      },
      }
);
    });

    it('should not include limit parameter when not provided', async () => {
      const mockResponse: InsiderTrade[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      await insiderResource.getInsiderTrades('AAPL');

      expect(mockClient.get).toHaveBeenCalledWith('insider-trading', {
        searchParams: {
          symbol: 'AAPL',
      },
      }
);
    });

    it('should handle API errors', async () => {
      const error = new Error('API Error');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(insiderResource.getInsiderTrades('AAPL')).rejects.toThrow(
        'API Error'
      );
    });
  });

  describe('getInsiderStatistics', () => {
    it('should fetch insider trading statistics for a symbol', async () => {
      const mockResponse: InsiderTradingStatistics[] = [
        {
          symbol: 'AAPL',
          cik: '0000320193',
          year: 2024,
          quarter: 1,
          purchases: 15,
          sales: 8,
          pPurchases: 12000,
          sSales: 5000,
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      const result = await insiderResource.getInsiderStatistics('aapl');

      expect(mockClient.get).toHaveBeenCalledWith('insider-roaster-statistic', {
        searchParams: {
          symbol: 'AAPL',
      },
      }
);
      expect(result).toEqual(mockResponse);
    });

    it('should normalize symbol to uppercase', async () => {
      const mockResponse: InsiderTradingStatistics[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      await insiderResource.getInsiderStatistics('msft');

      expect(mockClient.get).toHaveBeenCalledWith('insider-roaster-statistic', {
        searchParams: {
          symbol: 'MSFT',
      },
      }
);
    });
  });

  describe('getInsiderRoster', () => {
    it('should fetch insider roster for a symbol', async () => {
      const mockResponse: InsiderRoster[] = [
        {
          symbol: 'AAPL',
          name: 'Tim Cook',
          title: 'CEO',
          cik: '0001234567',
        },
        {
          symbol: 'AAPL',
          name: 'Luca Maestri',
          title: 'CFO',
          cik: '0001234568',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      const result = await insiderResource.getInsiderRoster('AAPL');

      expect(mockClient.get).toHaveBeenCalledWith('insider-roaster', {
        searchParams: {
          symbol: 'AAPL',
      },
      }
);
      expect(result).toEqual(mockResponse);
    });

    it('should normalize symbol to uppercase', async () => {
      const mockResponse: InsiderRoster[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      await insiderResource.getInsiderRoster('googl');

      expect(mockClient.get).toHaveBeenCalledWith('insider-roaster', {
        searchParams: {
          symbol: 'GOOGL',
      },
      }
);
    });
  });

  describe('getInstitutionalHolders', () => {
    it('should fetch institutional holders for a symbol', async () => {
      const mockResponse: InstitutionalHolder[] = [
        {
          holder: 'Vanguard Group Inc',
          cik: '0000102909',
          shares: 1000000000,
          dateReported: '2024-03-31',
          change: 5000000,
        },
        {
          holder: 'BlackRock Inc',
          cik: '0001364742',
          shares: 900000000,
          dateReported: '2024-03-31',
          change: -2000000,
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      const result = await insiderResource.getInstitutionalHolders('AAPL');

      expect(mockClient.get).toHaveBeenCalledWith('institutional-holder', {
        searchParams: { symbol: 'AAPL' },
      });
      expect(result).toEqual(mockResponse);
    });

    it('should normalize symbol to uppercase in URL path', async () => {
      const mockResponse: InstitutionalHolder[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      await insiderResource.getInstitutionalHolders('nvda');

      expect(mockClient.get).toHaveBeenCalledWith('institutional-holder', {
        searchParams: { symbol: 'NVDA' },
      });
    });
  });

  describe('get13F', () => {
    it('should fetch Form 13F filings for a CIK', async () => {
      const mockResponse: Form13F[] = [
        {
          fillingDate: '2024-02-14',
          acceptedDate: '2024-02-14 16:30:00',
          cik: '0001067983',
          cusip: '037833100',
          tickercusip: 'AAPL',
          nameOfIssuer: 'APPLE INC',
          shares: 100000000,
          titleOfClass: 'COM',
          value: 18500000000,
          link: 'https://www.sec.gov/...',
          finalLink: 'https://www.sec.gov/...',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      const result = await insiderResource.get13F('0001067983');

      expect(mockClient.get).toHaveBeenCalledWith('form-thirteen', {
        searchParams: { cik: '0001067983' },
      });
      expect(result).toEqual(mockResponse);
    });

    it('should include date parameter when provided', async () => {
      const mockResponse: Form13F[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      await insiderResource.get13F('0001067983', '2024-03-31');

      expect(mockClient.get).toHaveBeenCalledWith('form-thirteen', {
        searchParams: {
          cik: '0001067983',
          date: '2024-03-31',
        },
      });
    });

    it('should not include date parameter when not provided', async () => {
      const mockResponse: Form13F[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      await insiderResource.get13F('0001067983');

      expect(mockClient.get).toHaveBeenCalledWith('form-thirteen', {
        searchParams: { cik: '0001067983' },
      });
    });

    it('should handle different CIK formats', async () => {
      const mockResponse: Form13F[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      await insiderResource.get13F('1067983');

      expect(mockClient.get).toHaveBeenCalledWith('form-thirteen', {
        searchParams: { cik: '1067983' },
      });
    });
  });

  describe('getSenateTrades', () => {
    it('should fetch all Senate trades when no symbol provided', async () => {
      const mockResponse: CongressionalTrade[] = [
        {
          firstName: 'Nancy',
          lastName: 'Pelosi',
          office: 'House of Representatives',
          link: 'https://disclosures-clerk.house.gov/...',
          dateRecieved: '2024-01-15',
          transactionDate: '2024-01-10',
          owner: 'spouse',
          assetDescription: 'Apple Inc.',
          assetType: 'Stock',
          type: 'Purchase',
          amount: '$100,001 - $250,000',
          representative: 'Nancy Pelosi',
          district: 'CA-11',
          ptr_link: 'https://disclosures-clerk.house.gov/...',
          cap_gains_over_200_usd: false,
          symbol: 'AAPL',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      const result = await insiderResource.getSenateTrades();

      expect(mockClient.get).toHaveBeenCalledWith('senate-trading', { searchParams: {} });
      expect(result).toEqual(mockResponse);
    });

    it('should fetch Senate trades filtered by symbol', async () => {
      const mockResponse: CongressionalTrade[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      await insiderResource.getSenateTrades('TSLA');

      expect(mockClient.get).toHaveBeenCalledWith('senate-trading', {
        searchParams: {
          symbol: 'TSLA',
      },
      }
);
    });

    it('should normalize symbol to uppercase', async () => {
      const mockResponse: CongressionalTrade[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      await insiderResource.getSenateTrades('nvda');

      expect(mockClient.get).toHaveBeenCalledWith('senate-trading', {
        searchParams: {
          symbol: 'NVDA',
      },
      }
);
    });
  });

  describe('getHouseTrades', () => {
    it('should fetch all House trades when no symbol provided', async () => {
      const mockResponse: CongressionalTrade[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      const result = await insiderResource.getHouseTrades();

      expect(mockClient.get).toHaveBeenCalledWith('house-disclosure', { searchParams: {} });
      expect(result).toEqual(mockResponse);
    });

    it('should fetch House trades filtered by symbol', async () => {
      const mockResponse: CongressionalTrade[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      await insiderResource.getHouseTrades('MSFT');

      expect(mockClient.get).toHaveBeenCalledWith('house-disclosure', {
        searchParams: {
          symbol: 'MSFT',
      },
      }
);
    });

    it('should normalize symbol to uppercase', async () => {
      const mockResponse: CongressionalTrade[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      await insiderResource.getHouseTrades('meta');

      expect(mockClient.get).toHaveBeenCalledWith('house-disclosure', {
        searchParams: {
          symbol: 'META',
      },
      }
);
    });
  });

  describe('getLatestSenateTrades', () => {
    it('should fetch latest Senate trades from RSS feed', async () => {
      const mockResponse: CongressionalTrade[] = [
        {
          firstName: 'John',
          lastName: 'Doe',
          office: 'Senate',
          link: 'https://efdsearch.senate.gov/...',
          dateRecieved: '2024-01-20',
          transactionDate: '2024-01-18',
          owner: 'self',
          assetDescription: 'Microsoft Corp',
          assetType: 'Stock',
          type: 'Sale',
          amount: '$50,001 - $100,000',
          representative: 'John Doe',
          district: 'N/A',
          ptr_link: 'https://efdsearch.senate.gov/...',
          cap_gains_over_200_usd: true,
          symbol: 'MSFT',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      const result = await insiderResource.getLatestSenateTrades();

      expect(mockClient.get).toHaveBeenCalledWith('senate-trading-rss-feed');
      expect(result).toEqual(mockResponse);
    });

    it('should not accept any parameters', async () => {
      const mockResponse: CongressionalTrade[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      await insiderResource.getLatestSenateTrades();

      expect(mockClient.get).toHaveBeenCalledWith('senate-trading-rss-feed');
      expect(mockClient.get).toHaveBeenCalledTimes(1);
    });
  });

  describe('getLatestHouseTrades', () => {
    it('should fetch latest House trades from RSS feed', async () => {
      const mockResponse: CongressionalTrade[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      const result = await insiderResource.getLatestHouseTrades();

      expect(mockClient.get).toHaveBeenCalledWith('house-disclosure-rss-feed');
      expect(result).toEqual(mockResponse);
    });

    it('should not accept any parameters', async () => {
      const mockResponse: CongressionalTrade[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      await insiderResource.getLatestHouseTrades();

      expect(mockClient.get).toHaveBeenCalledWith('house-disclosure-rss-feed');
      expect(mockClient.get).toHaveBeenCalledTimes(1);
    });
  });

  describe('getSenateTradingByName', () => {
    it('should fetch Senate trades by senator name', async () => {
      const mockResponse: CongressionalTrade[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      await insiderResource.getSenateTradingByName('Nancy Pelosi');

      expect(mockClient.get).toHaveBeenCalledWith('senate-trading', {
        searchParams: {
          name: 'Nancy Pelosi',
      },
      }
);
    });

    it('should handle names with special characters', async () => {
      const mockResponse: CongressionalTrade[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      await insiderResource.getSenateTradingByName("Dan O'Brien");

      expect(mockClient.get).toHaveBeenCalledWith('senate-trading', {
        searchParams: {
          name: "Dan O'Brien",
      },
      }
);
    });

    it('should handle partial names', async () => {
      const mockResponse: CongressionalTrade[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      await insiderResource.getSenateTradingByName('Pelosi');

      expect(mockClient.get).toHaveBeenCalledWith('senate-trading', {
        searchParams: {
          name: 'Pelosi',
      },
      }
);
    });
  });

  describe('getHouseTradingByName', () => {
    it('should fetch House trades by representative name', async () => {
      const mockResponse: CongressionalTrade[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      await insiderResource.getHouseTradingByName('Alexandria Ocasio-Cortez');

      expect(mockClient.get).toHaveBeenCalledWith('house-disclosure', {
        searchParams: {
          name: 'Alexandria Ocasio-Cortez',
      },
      }
);
    });

    it('should handle names with hyphens', async () => {
      const mockResponse: CongressionalTrade[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      await insiderResource.getHouseTradingByName('Smith-Jones');

      expect(mockClient.get).toHaveBeenCalledWith('house-disclosure', {
        searchParams: {
          name: 'Smith-Jones',
      },
      }
);
    });
  });

  describe('getLatestInsiderTrades', () => {
    it('should fetch latest insider trades without limit', async () => {
      const mockResponse: InsiderTrade[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      const result = await insiderResource.getLatestInsiderTrades();

      expect(mockClient.get).toHaveBeenCalledWith('insider-trading', { searchParams: {} });
      expect(result).toEqual(mockResponse);
    });

    it('should fetch latest insider trades with limit', async () => {
      const mockResponse: InsiderTrade[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      await insiderResource.getLatestInsiderTrades(100);

      expect(mockClient.get).toHaveBeenCalledWith('insider-trading', {
        searchParams: {
          limit: 100,
      },
      }
);
    });

    it('should handle limit of 0', async () => {
      const mockResponse: InsiderTrade[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      await insiderResource.getLatestInsiderTrades(0);

      expect(mockClient.get).toHaveBeenCalledWith('insider-trading', { searchParams: {} });
    });
  });

  describe('getInsiderTradesByName', () => {
    it('should fetch insider trades by reporting person name', async () => {
      const mockResponse: InsiderTrade[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      await insiderResource.getInsiderTradesByName('Tim Cook');

      expect(mockClient.get).toHaveBeenCalledWith('insider-trading', {
        searchParams: {
          reportingName: 'Tim Cook',
      },
      }
);
    });

    it('should include limit parameter when provided', async () => {
      const mockResponse: InsiderTrade[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      await insiderResource.getInsiderTradesByName('Tim Cook', 25);

      expect(mockClient.get).toHaveBeenCalledWith('insider-trading', {
        searchParams: {
          reportingName: 'Tim Cook',
        limit: 25,
      },
      }
);
    });

    it('should handle complex names', async () => {
      const mockResponse: InsiderTrade[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      await insiderResource.getInsiderTradesByName('Mary-Anne O\'Connor Jr.');

      expect(mockClient.get).toHaveBeenCalledWith('insider-trading', {
        searchParams: {
          reportingName: 'Mary-Anne O\'Connor Jr.',
      },
      }
);
    });

    it('should not include limit when set to 0', async () => {
      const mockResponse: InsiderTrade[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      await insiderResource.getInsiderTradesByName('Tim Cook', 0);

      expect(mockClient.get).toHaveBeenCalledWith('insider-trading', {
        searchParams: {
          reportingName: 'Tim Cook',
      },
      }
);
    });
  });

  describe('getInsiderTransactionTypes', () => {
    it('should fetch all insider transaction types', async () => {
      const mockResponse = [
        { transactionType: 'P-Purchase' },
        { transactionType: 'S-Sale' },
        { transactionType: 'A-Award' },
        { transactionType: 'M-Exempt' },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      const result = await insiderResource.getInsiderTransactionTypes();

      expect(mockClient.get).toHaveBeenCalledWith(
        'insider-trading-transaction-type'
      );
      expect(result).toEqual(mockResponse);
    });

    it('should not accept any parameters', async () => {
      const mockResponse = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      await insiderResource.getInsiderTransactionTypes();

      expect(mockClient.get).toHaveBeenCalledWith(
        'insider-trading-transaction-type'
      );
      expect(mockClient.get).toHaveBeenCalledTimes(1);
    });
  });

  describe('getForm4Ownership', () => {
    it('should fetch Form 4 ownership data for a symbol', async () => {
      const mockResponse: Record<string, unknown>[] = [
        {
          symbol: 'AAPL',
          cik: '0000320193',
          filingDate: '2024-01-15',
          transactionDate: '2024-01-10',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      const result = await insiderResource.getForm4Ownership('AAPL');

      expect(mockClient.get).toHaveBeenCalledWith('form-four', {
        searchParams: {
          symbol: 'AAPL',
      },
      }
);
      expect(result).toEqual(mockResponse);
    });

    it('should normalize symbol to uppercase', async () => {
      const mockResponse: Record<string, unknown>[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      await insiderResource.getForm4Ownership('googl');

      expect(mockClient.get).toHaveBeenCalledWith('form-four', {
        searchParams: {
          symbol: 'GOOGL',
      },
      }
);
    });

    it('should include limit parameter when provided', async () => {
      const mockResponse: Record<string, unknown>[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      await insiderResource.getForm4Ownership('AAPL', 50);

      expect(mockClient.get).toHaveBeenCalledWith('form-four', {
        searchParams: {
          symbol: 'AAPL',
        limit: 50,
      },
      }
);
    });

    it('should not include limit parameter when not provided', async () => {
      const mockResponse: Record<string, unknown>[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      await insiderResource.getForm4Ownership('AAPL');

      expect(mockClient.get).toHaveBeenCalledWith('form-four', {
        searchParams: {
          symbol: 'AAPL',
      },
      }
);
    });
  });

  describe('getLatest13FFilings', () => {
    it('should fetch all latest 13F filings without filters', async () => {
      const mockResponse: Form13FPortfolioDate[] = [
        { cik: '0001067983', date: '2024-03-31' },
        { cik: '0001364742', date: '2024-03-31' },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      const result = await insiderResource.getLatest13FFilings();

      expect(mockClient.get).toHaveBeenCalledWith(
        'institutional-ownership-portfolio-date',
        { searchParams: {} }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should filter by CIK when provided', async () => {
      const mockResponse: Form13FPortfolioDate[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      await insiderResource.getLatest13FFilings('0001067983');

      expect(mockClient.get).toHaveBeenCalledWith(
        'institutional-ownership-portfolio-date',
        { searchParams: {   cik: '0001067983' }, }

      );
    });

    it('should include page parameter for pagination', async () => {
      const mockResponse: Form13FPortfolioDate[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      await insiderResource.getLatest13FFilings(undefined, 2);

      expect(mockClient.get).toHaveBeenCalledWith(
        'institutional-ownership-portfolio-date',
        { searchParams: {   page: 2 }, }

      );
    });

    it('should include both CIK and page parameters', async () => {
      const mockResponse: Form13FPortfolioDate[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      await insiderResource.getLatest13FFilings('0001067983', 3);

      expect(mockClient.get).toHaveBeenCalledWith(
        'institutional-ownership-portfolio-date',
        { searchParams: {   cik: '0001067983', page: 3 }, }

      );
    });

    it('should not include page 0 in parameters', async () => {
      const mockResponse: Form13FPortfolioDate[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      await insiderResource.getLatest13FFilings('0001067983', 0);

      expect(mockClient.get).toHaveBeenCalledWith(
        'institutional-ownership-portfolio-date',
        { searchParams: {   cik: '0001067983' }, }

      );
    });
  });

  describe('get13FFilingDates', () => {
    it('should fetch 13F filing dates for a specific CIK', async () => {
      const mockResponse: Form13FPortfolioDate[] = [
        { cik: '0001067983', date: '2024-03-31' },
        { cik: '0001067983', date: '2023-12-31' },
        { cik: '0001067983', date: '2023-09-30' },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      const result = await insiderResource.get13FFilingDates('0001067983');

      expect(mockClient.get).toHaveBeenCalledWith(
        'institutional-ownership-portfolio-date',
        { searchParams: {   cik: '0001067983' }, }

      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle different CIK formats', async () => {
      const mockResponse: Form13FPortfolioDate[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      await insiderResource.get13FFilingDates('1067983');

      expect(mockClient.get).toHaveBeenCalledWith(
        'institutional-ownership-portfolio-date',
        { searchParams: {   cik: '1067983' }, }

      );
    });
  });

  describe('get13FWithAnalytics', () => {
    it('should fetch 13F with analytics for a CIK', async () => {
      const mockResponse: Form13FWithAnalytics[] = [
        {
          date: '2024-03-31',
          fillingDate: '2024-02-14',
          acceptedDate: '2024-02-14 16:30:00',
          cik: '0001067983',
          cusip: '037833100',
          tickercusip: 'AAPL',
          nameOfIssuer: 'APPLE INC',
          shares: 100000000,
          titleOfClass: 'COM',
          value: 18500000000,
          change: 5000000,
          changeP: 5.26,
          link: 'https://www.sec.gov/...',
          finalLink: 'https://www.sec.gov/...',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      const result = await insiderResource.get13FWithAnalytics('0001067983');

      expect(mockClient.get).toHaveBeenCalledWith('form-thirteen', {
        searchParams: { cik: '0001067983' },
      });
      expect(result).toEqual(mockResponse);
    });

    it('should include date parameter when provided', async () => {
      const mockResponse: Form13FWithAnalytics[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      await insiderResource.get13FWithAnalytics('0001067983', '2024-03-31');

      expect(mockClient.get).toHaveBeenCalledWith('form-thirteen', {
        searchParams: {
          cik: '0001067983',
          date: '2024-03-31',
        },
      });
    });

    it('should include page parameter for pagination', async () => {
      const mockResponse: Form13FWithAnalytics[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      await insiderResource.get13FWithAnalytics('0001067983', undefined, 2);

      expect(mockClient.get).toHaveBeenCalledWith('form-thirteen', {
        searchParams: {
          cik: '0001067983',
          page: 2,
        },
      });
    });

    it('should include both date and page parameters', async () => {
      const mockResponse: Form13FWithAnalytics[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      await insiderResource.get13FWithAnalytics('0001067983', '2024-03-31', 1);

      expect(mockClient.get).toHaveBeenCalledWith('form-thirteen', {
        searchParams: {
          cik: '0001067983',
          date: '2024-03-31',
          page: 1,
        },
      });
    });

    it('should handle different date formats', async () => {
      const mockResponse: Form13FWithAnalytics[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      await insiderResource.get13FWithAnalytics('0001067983', '2024-12-31');

      expect(mockClient.get).toHaveBeenCalledWith('form-thirteen', {
        searchParams: {
          cik: '0001067983',
          date: '2024-12-31',
        },
      });
    });
  });

  describe('getPortfolioHoldingsSummary', () => {
    it('should fetch portfolio holdings summary for a CIK', async () => {
      const mockResponse: PortfolioHoldingsSummary[] = [
        {
          cik: '0001067983',
          date: '2024-03-31',
          symbol: 'AAPL',
          name: 'Apple Inc.',
          shares: 100000000,
          value: 18500000000,
          weightPercentage: 8.5,
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      const result = await insiderResource.getPortfolioHoldingsSummary('0001067983');

      expect(mockClient.get).toHaveBeenCalledWith(
        'institutional-ownership-portfolio-holdings-summary',
        { searchParams: {   cik: '0001067983' }, }

      );
      expect(result).toEqual(mockResponse);
    });

    it('should include date parameter when provided', async () => {
      const mockResponse: PortfolioHoldingsSummary[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      await insiderResource.getPortfolioHoldingsSummary('0001067983', '2024-03-31');

      expect(mockClient.get).toHaveBeenCalledWith(
        'institutional-ownership-portfolio-holdings-summary',
        { searchParams: {   cik: '0001067983', date: '2024-03-31' }, }

      );
    });

    it('should include page parameter for pagination', async () => {
      const mockResponse: PortfolioHoldingsSummary[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      await insiderResource.getPortfolioHoldingsSummary('0001067983', undefined, 2);

      expect(mockClient.get).toHaveBeenCalledWith(
        'institutional-ownership-portfolio-holdings-summary',
        { searchParams: {   cik: '0001067983', page: 2 }, }

      );
    });

    it('should include both date and page parameters', async () => {
      const mockResponse: PortfolioHoldingsSummary[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      await insiderResource.getPortfolioHoldingsSummary(
        '0001067983',
        '2023-12-31',
        3
      );

      expect(mockClient.get).toHaveBeenCalledWith(
        'institutional-ownership-portfolio-holdings-summary',
        { searchParams: {   cik: '0001067983', date: '2023-12-31', page: 3 }, }

      );
    });

    it('should not include page 0 in parameters', async () => {
      const mockResponse: PortfolioHoldingsSummary[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      await insiderResource.getPortfolioHoldingsSummary('0001067983', undefined, 0);

      expect(mockClient.get).toHaveBeenCalledWith(
        'institutional-ownership-portfolio-holdings-summary',
        { searchParams: {   cik: '0001067983' }, }

      );
    });
  });

  describe('getIndustryPortfolioBreakdown', () => {
    it('should fetch industry portfolio breakdown for a CIK', async () => {
      const mockResponse: IndustryPortfolioHoldingsSummary[] = [
        {
          cik: '0001067983',
          date: '2024-03-31',
          industry: 'Technology',
          totalValue: 50000000000,
          totalShares: 500000000,
          numberOfHoldings: 25,
          weightPercentage: 45.5,
        },
        {
          cik: '0001067983',
          date: '2024-03-31',
          industry: 'Healthcare',
          totalValue: 30000000000,
          totalShares: 300000000,
          numberOfHoldings: 15,
          weightPercentage: 27.3,
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      const result = await insiderResource.getIndustryPortfolioBreakdown('0001067983');

      expect(mockClient.get).toHaveBeenCalledWith(
        'institutional-ownership-industry-portfolio-holdings-summary',
        { searchParams: {   cik: '0001067983' }, }

      );
      expect(result).toEqual(mockResponse);
    });

    it('should include date parameter when provided', async () => {
      const mockResponse: IndustryPortfolioHoldingsSummary[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      await insiderResource.getIndustryPortfolioBreakdown('0001067983', '2024-03-31');

      expect(mockClient.get).toHaveBeenCalledWith(
        'institutional-ownership-industry-portfolio-holdings-summary',
        { searchParams: {   cik: '0001067983', date: '2024-03-31' }, }

      );
    });

    it('should include page parameter for pagination', async () => {
      const mockResponse: IndustryPortfolioHoldingsSummary[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      await insiderResource.getIndustryPortfolioBreakdown('0001067983', undefined, 2);

      expect(mockClient.get).toHaveBeenCalledWith(
        'institutional-ownership-industry-portfolio-holdings-summary',
        { searchParams: {   cik: '0001067983', page: 2 }, }

      );
    });

    it('should include both date and page parameters', async () => {
      const mockResponse: IndustryPortfolioHoldingsSummary[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      await insiderResource.getIndustryPortfolioBreakdown(
        '0001067983',
        '2023-09-30',
        1
      );

      expect(mockClient.get).toHaveBeenCalledWith(
        'institutional-ownership-industry-portfolio-holdings-summary',
        { searchParams: {   cik: '0001067983', date: '2023-09-30', page: 1 }, }

      );
    });
  });

  describe('getSymbolOwnershipPositions', () => {
    it('should fetch symbol ownership positions', async () => {
      const mockResponse: SymbolOwnership[] = [
        {
          symbol: 'AAPL',
          cik: '0001067983',
          name: 'BERKSHIRE HATHAWAY INC',
          date: '2024-03-31',
          shares: 915560382,
          value: 153500000000,
          change: 10000000,
          changeP: 1.1,
          weightPercentage: 42.8,
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      const result = await insiderResource.getSymbolOwnershipPositions('AAPL');

      expect(mockClient.get).toHaveBeenCalledWith(
        'institutional-ownership-symbol-ownership',
        { searchParams: {   symbol: 'AAPL' }, }

      );
      expect(result).toEqual(mockResponse);
    });

    it('should normalize symbol to uppercase', async () => {
      const mockResponse: SymbolOwnership[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      await insiderResource.getSymbolOwnershipPositions('msft');

      expect(mockClient.get).toHaveBeenCalledWith(
        'institutional-ownership-symbol-ownership',
        { searchParams: {   symbol: 'MSFT' }, }

      );
    });

    it('should include includeCurrentQuarter parameter when true', async () => {
      const mockResponse: SymbolOwnership[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      await insiderResource.getSymbolOwnershipPositions('AAPL', true);

      expect(mockClient.get).toHaveBeenCalledWith(
        'institutional-ownership-symbol-ownership',
        { searchParams: {   symbol: 'AAPL', includeCurrentQuarter: true }, }

      );
    });

    it('should include includeCurrentQuarter parameter when false', async () => {
      const mockResponse: SymbolOwnership[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      await insiderResource.getSymbolOwnershipPositions('AAPL', false);

      expect(mockClient.get).toHaveBeenCalledWith(
        'institutional-ownership-symbol-ownership',
        { searchParams: {   symbol: 'AAPL', includeCurrentQuarter: false }, }

      );
    });

    it('should not include includeCurrentQuarter when undefined', async () => {
      const mockResponse: SymbolOwnership[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      await insiderResource.getSymbolOwnershipPositions('AAPL', undefined);

      expect(mockClient.get).toHaveBeenCalledWith(
        'institutional-ownership-symbol-ownership',
        { searchParams: {   symbol: 'AAPL' }, }

      );
    });

    it('should include page parameter for pagination', async () => {
      const mockResponse: SymbolOwnership[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      await insiderResource.getSymbolOwnershipPositions('AAPL', undefined, 2);

      expect(mockClient.get).toHaveBeenCalledWith(
        'institutional-ownership-symbol-ownership',
        { searchParams: {   symbol: 'AAPL', page: 2 }, }

      );
    });

    it('should include both includeCurrentQuarter and page parameters', async () => {
      const mockResponse: SymbolOwnership[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      await insiderResource.getSymbolOwnershipPositions('AAPL', true, 3);

      expect(mockClient.get).toHaveBeenCalledWith(
        'institutional-ownership-symbol-ownership',
        { searchParams: {   symbol: 'AAPL', includeCurrentQuarter: true, page: 3 }, }

      );
    });

    it('should not include page 0 in parameters', async () => {
      const mockResponse: SymbolOwnership[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      await insiderResource.getSymbolOwnershipPositions('AAPL', false, 0);

      expect(mockClient.get).toHaveBeenCalledWith(
        'institutional-ownership-symbol-ownership',
        { searchParams: {   symbol: 'AAPL', includeCurrentQuarter: false }, }

      );
    });
  });

  describe('getIndustryInstitutionalOwnership', () => {
    it('should fetch industry institutional ownership for a symbol', async () => {
      const mockResponse: IndustryInstitutionalOwnership[] = [
        {
          symbol: 'AAPL',
          industry: 'Technology Hardware, Storage & Peripherals',
          numberOfInstitutions: 4250,
          totalShares: 8500000000,
          totalValue: 1575000000000,
          percentageOwned: 55.2,
          date: '2024-03-31',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      const result = await insiderResource.getIndustryInstitutionalOwnership('AAPL');

      expect(mockClient.get).toHaveBeenCalledWith(
        'institutional-ownership-symbol-ownership-percent',
        { searchParams: {   symbol: 'AAPL' }, }

      );
      expect(result).toEqual(mockResponse);
    });

    it('should normalize symbol to uppercase', async () => {
      const mockResponse: IndustryInstitutionalOwnership[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      await insiderResource.getIndustryInstitutionalOwnership('tsla');

      expect(mockClient.get).toHaveBeenCalledWith(
        'institutional-ownership-symbol-ownership-percent',
        { searchParams: {   symbol: 'TSLA' }, }

      );
    });

    it('should include page parameter for pagination', async () => {
      const mockResponse: IndustryInstitutionalOwnership[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      await insiderResource.getIndustryInstitutionalOwnership('AAPL', 2);

      expect(mockClient.get).toHaveBeenCalledWith(
        'institutional-ownership-symbol-ownership-percent',
        { searchParams: {   symbol: 'AAPL', page: 2 }, }

      );
    });

    it('should not include page 0 in parameters', async () => {
      const mockResponse: IndustryInstitutionalOwnership[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      await insiderResource.getIndustryInstitutionalOwnership('AAPL', 0);

      expect(mockClient.get).toHaveBeenCalledWith(
        'institutional-ownership-symbol-ownership-percent',
        { searchParams: {   symbol: 'AAPL' }, }

      );
    });
  });

  describe('Error Handling', () => {
    it('should propagate API errors from client', async () => {
      const apiError = new Error('API request failed');
      vi.mocked(mockClient.get).mockRejectedValue(apiError);

      await expect(insiderResource.getInsiderTrades('AAPL')).rejects.toThrow(
        'API request failed'
      );
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network timeout');
      vi.mocked(mockClient.get).mockRejectedValue(networkError);

      await expect(insiderResource.get13F('0001067983')).rejects.toThrow(
        'Network timeout'
      );
    });

    it('should handle empty responses', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      const result = await insiderResource.getInsiderTrades('AAPL');

      expect(result).toEqual([]);
    });
  });

  describe('Parameter Edge Cases', () => {
    it('should handle empty string symbol gracefully', async () => {
      const mockResponse: InsiderTrade[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      await insiderResource.getInsiderTrades('');

      expect(mockClient.get).toHaveBeenCalledWith('insider-trading', {
        searchParams: {
          symbol: '',
      },
      }
);
    });

    it('should handle very long CIK numbers', async () => {
      const mockResponse: Form13F[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      await insiderResource.get13F('00000000001067983');

      expect(mockClient.get).toHaveBeenCalledWith('form-thirteen', {
        searchParams: { cik: '00000000001067983' },
      });
    });

    it('should handle special characters in names', async () => {
      const mockResponse: CongressionalTrade[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      await insiderResource.getSenateTradingByName('José María García-López');

      expect(mockClient.get).toHaveBeenCalledWith('senate-trading', {
        searchParams: {
          name: 'José María García-López',
      },
      }
);
    });

    it('should handle date strings with various formats', async () => {
      const mockResponse: Form13F[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      await insiderResource.get13F('0001067983', '2024-01-01');

      expect(mockClient.get).toHaveBeenCalledWith('form-thirteen', {
        searchParams: {
          cik: '0001067983',
          date: '2024-01-01',
        },
      });
    });

    it('should handle very large page numbers', async () => {
      const mockResponse: Form13FPortfolioDate[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      await insiderResource.getLatest13FFilings('0001067983', 9999);

      expect(mockClient.get).toHaveBeenCalledWith(
        'institutional-ownership-portfolio-date',
        { searchParams: {   cik: '0001067983', page: 9999 }, }

      );
    });

    it('should handle very large limit numbers', async () => {
      const mockResponse: InsiderTrade[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      await insiderResource.getInsiderTrades('AAPL', 10000);

      expect(mockClient.get).toHaveBeenCalledWith('insider-trading', {
        searchParams: {
          symbol: 'AAPL',
        limit: 10000,
      },
      }
);
    });

    it('should handle symbols with special characters', async () => {
      const mockResponse: InsiderTrade[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      await insiderResource.getInsiderTrades('BRK.B');

      expect(mockClient.get).toHaveBeenCalledWith('insider-trading', {
        searchParams: {
          symbol: 'BRK.B',
      },
      }
);
    });
  });
});
