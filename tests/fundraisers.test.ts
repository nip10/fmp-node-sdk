import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FundraisersResource } from '../src/resources/fundraisers.js';
import type { FMPClient } from '../src/client.js';
import {
  FMPAPIError,
  FMPAPIError,
  FMPAPIError,
} from '../src/errors/index.js';
import type {
  Crowdfunding,
  EquityOffering,
  CrowdfundingRSSItem,
  EquityOfferingRSSItem,
} from '../src/types/index.js';

describe('FundraisersResource', () => {
  let fundraisers: FundraisersResource;
  let mockClient: FMPClient;

  beforeEach(() => {
    // Create a mock client with a mocked get method
    mockClient = {
      get: vi.fn(),
    } as unknown as FMPClient;

    fundraisers = new FundraisersResource(mockClient);
  });

  describe('getLatestCrowdfunding', () => {
    it('should fetch latest crowdfunding offerings from RSS feed with default page', async () => {
      const mockData: CrowdfundingRSSItem[] = [
        {
          cik: '0001234567',
          title: 'Tech Startup Inc. - Crowdfunding Offering',
          date: '2024-01-15',
          link: 'https://www.sec.gov/cgi-bin/browse-edgar?CIK=0001234567',
        },
        {
          cik: '0009876543',
          title: 'Green Energy Co. - Crowdfunding Campaign',
          date: '2024-01-14',
          link: 'https://www.sec.gov/cgi-bin/browse-edgar?CIK=0009876543',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      const result = await fundraisers.getLatestCrowdfunding();

      expect(mockClient.get).toHaveBeenCalledWith('crowdfunding-offerings-latest', { searchParams: {   page: 0 }, }
);
      expect(result).toEqual(mockData);
      expect(result).toHaveLength(2);
      expect(result[0].cik).toBe('0001234567');
    });

    it('should fetch latest crowdfunding offerings with custom page', async () => {
      const mockData: CrowdfundingRSSItem[] = [
        {
          cik: '0001111111',
          title: 'Another Company - Crowdfunding',
          date: '2024-01-10',
          link: 'https://www.sec.gov/cgi-bin/browse-edgar?CIK=0001111111',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      const result = await fundraisers.getLatestCrowdfunding(2);

      expect(mockClient.get).toHaveBeenCalledWith('crowdfunding-offerings-latest', { searchParams: {   page: 2 }, }
);
      expect(result).toEqual(mockData);
    });

    it('should return empty array when no crowdfunding offerings available', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      const result = await fundraisers.getLatestCrowdfunding();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should handle API errors', async () => {
      const error = new FMPAPIError('Service unavailable', 503, 'Service Unavailable');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(fundraisers.getLatestCrowdfunding()).rejects.toThrow(FMPAPIError);
      await expect(fundraisers.getLatestCrowdfunding()).rejects.toThrow('Service unavailable');
    });

    it('should handle rate limit errors', async () => {
      const error = new FMPAPIError('Rate limit exceeded');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(fundraisers.getLatestCrowdfunding()).rejects.toThrow(FMPAPIError);
    });

    it('should handle authentication errors', async () => {
      const error = new FMPAPIError('Invalid API key');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(fundraisers.getLatestCrowdfunding()).rejects.toThrow(FMPAPIError);
    });
  });

  describe('searchCrowdfunding', () => {
    it('should search crowdfunding offerings by name', async () => {
      const mockData: Crowdfunding[] = [
        {
          cik: '0001234567',
          name: 'Tech Startup Inc.',
          date: '2024-01-15',
          acceptedDate: '2024-01-15T10:30:00.000Z',
          company_name: 'Tech Startup Inc.',
          amount: 500000,
          security_type: 'Equity',
          form_type: 'C',
          link: 'https://www.sec.gov/cgi-bin/browse-edgar?CIK=0001234567',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      const result = await fundraisers.searchCrowdfunding('Tech Startup');

      expect(mockClient.get).toHaveBeenCalledWith('crowdfunding-offerings-search', {
        searchParams: {
          page: 0,
        name: 'Tech Startup',
      },
      }
);
      expect(result).toEqual(mockData);
      expect(result[0].company_name).toBe('Tech Startup Inc.');
    });

    it('should search crowdfunding offerings by CIK', async () => {
      const mockData: Crowdfunding[] = [
        {
          cik: '0001234567',
          name: 'Tech Startup Inc.',
          date: '2024-01-15',
          acceptedDate: '2024-01-15T10:30:00.000Z',
          company_name: 'Tech Startup Inc.',
          amount: 500000,
          security_type: 'Equity',
          form_type: 'C',
          link: 'https://www.sec.gov/cgi-bin/browse-edgar?CIK=0001234567',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      const result = await fundraisers.searchCrowdfunding(undefined, '0001234567');

      expect(mockClient.get).toHaveBeenCalledWith('crowdfunding-offerings-search', {
        searchParams: {
          page: 0,
        cik: '0001234567',
      },
      }
);
      expect(result).toEqual(mockData);
    });

    it('should search crowdfunding offerings by both name and CIK', async () => {
      const mockData: Crowdfunding[] = [
        {
          cik: '0001234567',
          name: 'Tech Startup Inc.',
          date: '2024-01-15',
          acceptedDate: '2024-01-15T10:30:00.000Z',
          company_name: 'Tech Startup Inc.',
          amount: 500000,
          security_type: 'Equity',
          form_type: 'C',
          link: 'https://www.sec.gov/cgi-bin/browse-edgar?CIK=0001234567',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      const result = await fundraisers.searchCrowdfunding('Tech Startup', '0001234567');

      expect(mockClient.get).toHaveBeenCalledWith('crowdfunding-offerings-search', {
        searchParams: {
          page: 0,
        name: 'Tech Startup',
        cik: '0001234567',
      },
      }
);
      expect(result).toEqual(mockData);
    });

    it('should search without optional parameters', async () => {
      const mockData: Crowdfunding[] = [];

      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      const result = await fundraisers.searchCrowdfunding();

      expect(mockClient.get).toHaveBeenCalledWith('crowdfunding-offerings-search', { searchParams: {   page: 0 }, }
);
      expect(result).toEqual([]);
    });

    it('should search with custom page number', async () => {
      const mockData: Crowdfunding[] = [];

      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      const result = await fundraisers.searchCrowdfunding('Company', undefined, 3);

      expect(mockClient.get).toHaveBeenCalledWith('crowdfunding-offerings-search', {
        searchParams: {
          page: 3,
        name: 'Company',
      },
      }
);
      expect(result).toEqual([]);
    });

    it('should handle search with no results', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      const result = await fundraisers.searchCrowdfunding('NonexistentCompany');

      expect(result).toEqual([]);
    });

    it('should handle API errors during search', async () => {
      const error = new FMPAPIError('Bad request', 400, 'Bad Request');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(fundraisers.searchCrowdfunding('Test')).rejects.toThrow(FMPAPIError);
    });
  });

  describe('getCrowdfundingByCIK', () => {
    it('should fetch crowdfunding offerings by CIK', async () => {
      const mockData: Crowdfunding[] = [
        {
          cik: '0001234567',
          name: 'Tech Startup Inc.',
          date: '2024-01-15',
          acceptedDate: '2024-01-15T10:30:00.000Z',
          company_name: 'Tech Startup Inc.',
          amount: 500000,
          security_type: 'Equity',
          form_type: 'C',
          link: 'https://www.sec.gov/cgi-bin/browse-edgar?CIK=0001234567',
        },
        {
          cik: '0001234567',
          name: 'Tech Startup Inc.',
          date: '2024-01-10',
          acceptedDate: '2024-01-10T14:20:00.000Z',
          company_name: 'Tech Startup Inc.',
          amount: 250000,
          security_type: 'Debt',
          form_type: 'C',
          link: 'https://www.sec.gov/cgi-bin/browse-edgar?CIK=0001234567',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      const result = await fundraisers.getCrowdfundingByCIK('0001234567');

      expect(mockClient.get).toHaveBeenCalledWith('crowdfunding-offerings', { searchParams: { cik: '0001234567', page: 0 } });
      expect(result).toEqual(mockData);
      expect(result).toHaveLength(2);
      expect(result[0].cik).toBe('0001234567');
    });

    it('should fetch crowdfunding by CIK with custom page', async () => {
      const mockData: Crowdfunding[] = [];

      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      const result = await fundraisers.getCrowdfundingByCIK('0001234567', 1);

      expect(mockClient.get).toHaveBeenCalledWith('crowdfunding-offerings', { searchParams: { cik: '0001234567', page: 1 } });
      expect(result).toEqual([]);
    });

    it('should return empty array for CIK with no offerings', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      const result = await fundraisers.getCrowdfundingByCIK('0009999999');

      expect(result).toEqual([]);
    });

    it('should handle API errors when fetching by CIK', async () => {
      const error = new FMPAPIError('Not found', 404, 'Not Found');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(fundraisers.getCrowdfundingByCIK('invalid')).rejects.toThrow(FMPAPIError);
    });
  });

  describe('getLatestEquity', () => {
    it('should fetch latest equity offerings from RSS feed with default page', async () => {
      const mockData: EquityOfferingRSSItem[] = [
        {
          cik: '0001234567',
          title: 'BigCorp Inc. - Equity Offering',
          date: '2024-01-15',
          link: 'https://www.sec.gov/cgi-bin/browse-edgar?CIK=0001234567',
        },
        {
          cik: '0009876543',
          title: 'MegaTech Co. - Public Offering',
          date: '2024-01-14',
          link: 'https://www.sec.gov/cgi-bin/browse-edgar?CIK=0009876543',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      const result = await fundraisers.getLatestEquity();

      expect(mockClient.get).toHaveBeenCalledWith('fundraising-latest', { searchParams: {   page: 0 }, }
);
      expect(result).toEqual(mockData);
      expect(result).toHaveLength(2);
      expect(result[0].cik).toBe('0001234567');
    });

    it('should fetch latest equity offerings with custom page', async () => {
      const mockData: EquityOfferingRSSItem[] = [
        {
          cik: '0001111111',
          title: 'Another Corp - Equity Offering',
          date: '2024-01-10',
          link: 'https://www.sec.gov/cgi-bin/browse-edgar?CIK=0001111111',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      const result = await fundraisers.getLatestEquity(5);

      expect(mockClient.get).toHaveBeenCalledWith('fundraising-latest', { searchParams: {   page: 5 }, }
);
      expect(result).toEqual(mockData);
    });

    it('should return empty array when no equity offerings available', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      const result = await fundraisers.getLatestEquity();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should handle API errors for equity RSS feed', async () => {
      const error = new FMPAPIError('Internal server error', 500, 'Internal Server Error');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(fundraisers.getLatestEquity()).rejects.toThrow(FMPAPIError);
      await expect(fundraisers.getLatestEquity()).rejects.toThrow('Internal server error');
    });

    it('should handle rate limit errors for equity RSS feed', async () => {
      const error = new FMPAPIError();
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(fundraisers.getLatestEquity()).rejects.toThrow(FMPAPIError);
    });

    it('should handle authentication errors for equity RSS feed', async () => {
      const error = new FMPAPIError();
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(fundraisers.getLatestEquity()).rejects.toThrow(FMPAPIError);
    });
  });

  describe('searchEquity', () => {
    it('should search equity offerings by name', async () => {
      const mockData: EquityOffering[] = [
        {
          cik: '0001234567',
          name: 'BigCorp Inc.',
          date: '2024-01-15',
          acceptedDate: '2024-01-15T10:30:00.000Z',
          company_name: 'BigCorp Inc.',
          amount: 50000000,
          security_type: 'Common Stock',
          form_type: 'S-1',
          link: 'https://www.sec.gov/cgi-bin/browse-edgar?CIK=0001234567',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      const result = await fundraisers.searchEquity('BigCorp');

      expect(mockClient.get).toHaveBeenCalledWith('fundraising-search', {
        searchParams: {
          page: 0,
        name: 'BigCorp',
      },
      }
);
      expect(result).toEqual(mockData);
      expect(result[0].company_name).toBe('BigCorp Inc.');
      expect(result[0].amount).toBe(50000000);
    });

    it('should search equity offerings by CIK', async () => {
      const mockData: EquityOffering[] = [
        {
          cik: '0009876543',
          name: 'MegaTech Co.',
          date: '2024-01-12',
          acceptedDate: '2024-01-12T09:15:00.000Z',
          company_name: 'MegaTech Co.',
          amount: 75000000,
          security_type: 'Preferred Stock',
          form_type: 'S-3',
          link: 'https://www.sec.gov/cgi-bin/browse-edgar?CIK=0009876543',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      const result = await fundraisers.searchEquity(undefined, '0009876543');

      expect(mockClient.get).toHaveBeenCalledWith('fundraising-search', {
        searchParams: {
          page: 0,
        cik: '0009876543',
      },
      }
);
      expect(result).toEqual(mockData);
      expect(result[0].security_type).toBe('Preferred Stock');
    });

    it('should search equity offerings by both name and CIK', async () => {
      const mockData: EquityOffering[] = [
        {
          cik: '0001234567',
          name: 'BigCorp Inc.',
          date: '2024-01-15',
          acceptedDate: '2024-01-15T10:30:00.000Z',
          company_name: 'BigCorp Inc.',
          amount: 50000000,
          security_type: 'Common Stock',
          form_type: 'S-1',
          link: 'https://www.sec.gov/cgi-bin/browse-edgar?CIK=0001234567',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      const result = await fundraisers.searchEquity('BigCorp', '0001234567');

      expect(mockClient.get).toHaveBeenCalledWith('fundraising-search', {
        searchParams: {
          page: 0,
        name: 'BigCorp',
        cik: '0001234567',
      },
      }
);
      expect(result).toEqual(mockData);
    });

    it('should search without optional parameters', async () => {
      const mockData: EquityOffering[] = [];

      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      const result = await fundraisers.searchEquity();

      expect(mockClient.get).toHaveBeenCalledWith('fundraising-search', { searchParams: {   page: 0 }, }
);
      expect(result).toEqual([]);
    });

    it('should search with custom page number', async () => {
      const mockData: EquityOffering[] = [];

      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      const result = await fundraisers.searchEquity('Test', undefined, 2);

      expect(mockClient.get).toHaveBeenCalledWith('fundraising-search', {
        searchParams: {
          page: 2,
        name: 'Test',
      },
      }
);
      expect(result).toEqual([]);
    });

    it('should handle search with no results', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      const result = await fundraisers.searchEquity('NonexistentCorporation');

      expect(result).toEqual([]);
    });

    it('should handle API errors during equity search', async () => {
      const error = new FMPAPIError('Bad request', 400, 'Bad Request');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(fundraisers.searchEquity('Test')).rejects.toThrow(FMPAPIError);
      await expect(fundraisers.searchEquity('Test')).rejects.toThrow('Bad request');
    });
  });

  describe('getEquityByCIK', () => {
    it('should fetch equity offerings by CIK', async () => {
      const mockData: EquityOffering[] = [
        {
          cik: '0001234567',
          name: 'BigCorp Inc.',
          date: '2024-01-15',
          acceptedDate: '2024-01-15T10:30:00.000Z',
          company_name: 'BigCorp Inc.',
          amount: 50000000,
          security_type: 'Common Stock',
          form_type: 'S-1',
          link: 'https://www.sec.gov/cgi-bin/browse-edgar?CIK=0001234567',
        },
        {
          cik: '0001234567',
          name: 'BigCorp Inc.',
          date: '2024-01-10',
          acceptedDate: '2024-01-10T14:20:00.000Z',
          company_name: 'BigCorp Inc.',
          amount: 25000000,
          security_type: 'Preferred Stock',
          form_type: 'S-3',
          link: 'https://www.sec.gov/cgi-bin/browse-edgar?CIK=0001234567',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      const result = await fundraisers.getEquityByCIK('0001234567');

      expect(mockClient.get).toHaveBeenCalledWith('fundraising', { searchParams: { cik: '0001234567', page: 0 } });
      expect(result).toEqual(mockData);
      expect(result).toHaveLength(2);
      expect(result[0].cik).toBe('0001234567');
      expect(result[1].security_type).toBe('Preferred Stock');
    });

    it('should fetch equity by CIK with custom page', async () => {
      const mockData: EquityOffering[] = [];

      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      const result = await fundraisers.getEquityByCIK('0001234567', 3);

      expect(mockClient.get).toHaveBeenCalledWith('fundraising', { searchParams: { cik: '0001234567', page: 3 } });
      expect(result).toEqual([]);
    });

    it('should return empty array for CIK with no equity offerings', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      const result = await fundraisers.getEquityByCIK('0009999999');

      expect(result).toEqual([]);
    });

    it('should handle API errors when fetching equity by CIK', async () => {
      const error = new FMPAPIError('Not found', 404, 'Not Found');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(fundraisers.getEquityByCIK('invalid')).rejects.toThrow(FMPAPIError);
      await expect(fundraisers.getEquityByCIK('invalid')).rejects.toThrow('Not found');
    });

    it('should handle network errors when fetching equity by CIK', async () => {
      const error = new FMPAPIError('Network error');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(fundraisers.getEquityByCIK('0001234567')).rejects.toThrow(FMPAPIError);
    });
  });

  describe('Integration scenarios', () => {
    it('should handle multiple consecutive RSS feed requests', async () => {
      const crowdfundingData: CrowdfundingRSSItem[] = [
        {
          cik: '0001111111',
          title: 'Crowdfunding Item 1',
          date: '2024-01-15',
          link: 'https://example.com/1',
        },
      ];

      const equityData: EquityOfferingRSSItem[] = [
        {
          cik: '0002222222',
          title: 'Equity Item 1',
          date: '2024-01-15',
          link: 'https://example.com/2',
        },
      ];

      vi.mocked(mockClient.get)
        .mockResolvedValueOnce(crowdfundingData)
        .mockResolvedValueOnce(equityData);

      const crowdfundingResult = await fundraisers.getLatestCrowdfunding();
      const equityResult = await fundraisers.getLatestEquity();

      expect(crowdfundingResult).toEqual(crowdfundingData);
      expect(equityResult).toEqual(equityData);
      expect(mockClient.get).toHaveBeenCalledTimes(2);
    });

    it('should handle pagination across multiple pages', async () => {
      const page0Data: Crowdfunding[] = [
        {
          cik: '0001234567',
          name: 'Company A',
          date: '2024-01-15',
          acceptedDate: '2024-01-15T10:30:00.000Z',
          company_name: 'Company A',
          amount: 500000,
          security_type: 'Equity',
          form_type: 'C',
          link: 'https://example.com/1',
        },
      ];

      const page1Data: Crowdfunding[] = [
        {
          cik: '0009876543',
          name: 'Company B',
          date: '2024-01-14',
          acceptedDate: '2024-01-14T10:30:00.000Z',
          company_name: 'Company B',
          amount: 750000,
          security_type: 'Debt',
          form_type: 'C',
          link: 'https://example.com/2',
        },
      ];

      vi.mocked(mockClient.get)
        .mockResolvedValueOnce(page0Data)
        .mockResolvedValueOnce(page1Data);

      const results0 = await fundraisers.searchCrowdfunding('Company', undefined, 0);
      const results1 = await fundraisers.searchCrowdfunding('Company', undefined, 1);

      expect(results0).toEqual(page0Data);
      expect(results1).toEqual(page1Data);
      expect(mockClient.get).toHaveBeenCalledWith('crowdfunding-offerings-search', {
        searchParams: {
          page: 0,
        name: 'Company',
      },
      }
);
      expect(mockClient.get).toHaveBeenCalledWith('crowdfunding-offerings-search', {
        searchParams: {
          page: 1,
        name: 'Company',
      },
      }
);
    });

    it('should handle mixed success and error responses', async () => {
      const successData: CrowdfundingRSSItem[] = [
        {
          cik: '0001234567',
          title: 'Success Item',
          date: '2024-01-15',
          link: 'https://example.com/success',
        },
      ];

      vi.mocked(mockClient.get)
        .mockResolvedValueOnce(successData)
        .mockRejectedValueOnce(new FMPAPIError('Error occurred', 500, 'Internal Server Error'));

      const successResult = await fundraisers.getLatestCrowdfunding();
      expect(successResult).toEqual(successData);

      await expect(fundraisers.getLatestEquity()).rejects.toThrow(FMPAPIError);
    });

    it('should properly format parameters for different search combinations', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await fundraisers.searchCrowdfunding('Test Company', '0001234567', 2);
      expect(mockClient.get).toHaveBeenLastCalledWith('crowdfunding-offerings-search', {
        searchParams: {
          page: 2,
          name: 'Test Company',
          cik: '0001234567',
        }
      });

      await fundraisers.searchEquity(undefined, '0009876543', 0);
      expect(mockClient.get).toHaveBeenLastCalledWith('fundraising-search', {
        searchParams: {
          page: 0,
          cik: '0009876543',
        }
      });

      await fundraisers.searchCrowdfunding('Only Name');
      expect(mockClient.get).toHaveBeenLastCalledWith('crowdfunding-offerings-search', {
        searchParams: {
          page: 0,
          name: 'Only Name',
        }
      });
    });
  });

  describe('Error handling', () => {
    it('should propagate FMPAPIError with correct properties', async () => {
      const error = new FMPAPIError('Custom error message', 422, 'Unprocessable Entity');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      try {
        await fundraisers.getLatestCrowdfunding();
        expect.fail('Should have thrown an error');
      } catch (e) {
        expect(e).toBeInstanceOf(FMPAPIError);
        if (e instanceof FMPAPIError) {
          expect(e.message).toBe('Custom error message');
          expect(e.status).toBe(422);
          expect(e.statusText).toBe('Unprocessable Entity');
        }
      }
    });

    it('should handle timeout errors', async () => {
      const timeoutError = new FMPAPIError('Request timeout', 408, 'Request Timeout');
      vi.mocked(mockClient.get).mockRejectedValue(timeoutError);

      await expect(fundraisers.getCrowdfundingByCIK('0001234567')).rejects.toThrow('Request timeout');
    });

    it('should handle malformed response errors', async () => {
      const malformedError = new FMPAPIError('Invalid JSON response');
      vi.mocked(mockClient.get).mockRejectedValue(malformedError);

      await expect(fundraisers.searchEquity('Test')).rejects.toThrow('Invalid JSON response');
    });
  });

  describe('Type safety', () => {
    it('should return properly typed CrowdfundingRSSItem array', async () => {
      const mockData: CrowdfundingRSSItem[] = [
        {
          cik: '0001234567',
          title: 'Test Crowdfunding',
          date: '2024-01-15',
          link: 'https://example.com',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      const result = await fundraisers.getLatestCrowdfunding();

      // Type assertions to ensure proper typing
      expect(result[0]).toHaveProperty('cik');
      expect(result[0]).toHaveProperty('title');
      expect(result[0]).toHaveProperty('date');
      expect(result[0]).toHaveProperty('link');
      expect(typeof result[0].cik).toBe('string');
      expect(typeof result[0].title).toBe('string');
    });

    it('should return properly typed Crowdfunding array', async () => {
      const mockData: Crowdfunding[] = [
        {
          cik: '0001234567',
          name: 'Test Company',
          date: '2024-01-15',
          acceptedDate: '2024-01-15T10:30:00.000Z',
          company_name: 'Test Company',
          amount: 500000,
          security_type: 'Equity',
          form_type: 'C',
          link: 'https://example.com',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      const result = await fundraisers.searchCrowdfunding('Test');

      expect(result[0]).toHaveProperty('cik');
      expect(result[0]).toHaveProperty('amount');
      expect(result[0]).toHaveProperty('security_type');
      expect(result[0]).toHaveProperty('form_type');
      expect(typeof result[0].amount).toBe('number');
    });

    it('should return properly typed EquityOfferingRSSItem array', async () => {
      const mockData: EquityOfferingRSSItem[] = [
        {
          cik: '0001234567',
          title: 'Test Equity',
          date: '2024-01-15',
          link: 'https://example.com',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      const result = await fundraisers.getLatestEquity();

      expect(result[0]).toHaveProperty('cik');
      expect(result[0]).toHaveProperty('title');
      expect(result[0]).toHaveProperty('date');
      expect(result[0]).toHaveProperty('link');
    });

    it('should return properly typed EquityOffering array', async () => {
      const mockData: EquityOffering[] = [
        {
          cik: '0001234567',
          name: 'Test Corp',
          date: '2024-01-15',
          acceptedDate: '2024-01-15T10:30:00.000Z',
          company_name: 'Test Corp',
          amount: 50000000,
          security_type: 'Common Stock',
          form_type: 'S-1',
          link: 'https://example.com',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      const result = await fundraisers.searchEquity('Test');

      expect(result[0]).toHaveProperty('cik');
      expect(result[0]).toHaveProperty('amount');
      expect(result[0]).toHaveProperty('security_type');
      expect(result[0]).toHaveProperty('form_type');
      expect(typeof result[0].amount).toBe('number');
    });
  });
});
