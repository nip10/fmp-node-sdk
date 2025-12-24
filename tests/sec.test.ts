import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SECResource } from '../src/resources/sec.js';
import type { FMPClient } from '../src/client.js';
import type {
  SECFiling,
  SECRSSFeed,
  SICCode,
  CompanyCIKSearch,
  SECFullProfile,
} from '../src/types/index.js';

describe('SECResource', () => {
  let mockClient: FMPClient;
  let secResource: SECResource;

  beforeEach(() => {
    mockClient = {
      get: vi.fn(),
    } as unknown as FMPClient;
    secResource = new SECResource(mockClient);
  });

  describe('getFilings', () => {
    const mockFilings: SECFiling[] = [
      {
        symbol: 'AAPL',
        cik: '0000320193',
        title: '10-K - Annual Report',
        date: '2024-01-15',
        type: '10-K',
        link: 'https://www.sec.gov/filing1',
        finalLink: 'https://www.sec.gov/final1',
      },
      {
        symbol: 'AAPL',
        cik: '0000320193',
        title: '10-Q - Quarterly Report',
        date: '2024-02-01',
        type: '10-Q',
        link: 'https://www.sec.gov/filing2',
        finalLink: 'https://www.sec.gov/final2',
      },
    ];

    it('should get filings for a symbol', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockFilings);

      const result = await secResource.getFilings('AAPL');

      expect(mockClient.get).toHaveBeenCalledWith('v3/sec_filings/AAPL', { searchParams: {} });
      expect(result).toEqual(mockFilings);
    });

    it('should normalize symbol to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockFilings);

      await secResource.getFilings('aapl');

      expect(mockClient.get).toHaveBeenCalledWith('v3/sec_filings/AAPL', { searchParams: {} });
    });

    it('should get filings with type filter', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([mockFilings[0]]);

      const result = await secResource.getFilings('AAPL', '10-K');

      expect(mockClient.get).toHaveBeenCalledWith('v3/sec_filings/AAPL', {
        searchParams: {
          type: '10-K',
      },
      }
);
      expect(result).toEqual([mockFilings[0]]);
    });

    it('should get filings with limit', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockFilings.slice(0, 1));

      const result = await secResource.getFilings('AAPL', undefined, 1);

      expect(mockClient.get).toHaveBeenCalledWith('v3/sec_filings/AAPL', {
        searchParams: {
          limit: 1,
      },
      }
);
      expect(result).toHaveLength(1);
    });

    it('should get filings with both type and limit', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([mockFilings[0]]);

      await secResource.getFilings('AAPL', '10-K', 5);

      expect(mockClient.get).toHaveBeenCalledWith('v3/sec_filings/AAPL', {
        searchParams: {
          type: '10-K',
        limit: 5,
      },
      }
);
    });

    it('should handle various filing types', async () => {
      const filingTypes = ['10-K', '10-Q', '8-K', '13F', 'DEF 14A', 'S-1'];

      for (const type of filingTypes) {
        vi.mocked(mockClient.get).mockResolvedValue([]);
        await secResource.getFilings('AAPL', type);

        expect(mockClient.get).toHaveBeenCalledWith('v3/sec_filings/AAPL', {
          searchParams: {
            type,
        },
        }
);
      }
    });

    it('should return empty array when no filings found', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      const result = await secResource.getFilings('INVALID');

      expect(result).toEqual([]);
    });
  });

  describe('getRSSFeed', () => {
    const mockRSSFeed: SECRSSFeed[] = [
      {
        title: 'AAPL 8-K Filing',
        date: '2024-01-15',
        link: 'https://www.sec.gov/rss1',
        cik: '0000320193',
        formType: '8-K',
        acceptanceDateTime: '2024-01-15T16:30:00.000Z',
        filingDate: '2024-01-15',
        reportDate: '2024-01-14',
        accessionNumber: '0000320193-24-000001',
        fileNumber: '001-36743',
        filmNumber: '24567890',
        items: 'Item 2.02, Item 9.01',
        size: '1024KB',
      },
    ];

    it('should get RSS feed without filters', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockRSSFeed);

      const result = await secResource.getRSSFeed();

      expect(mockClient.get).toHaveBeenCalledWith('v4/rss_feed', { searchParams: {} });
      expect(result).toEqual(mockRSSFeed);
    });

    it('should get RSS feed with type filter', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockRSSFeed);

      await secResource.getRSSFeed('8-K');

      expect(mockClient.get).toHaveBeenCalledWith('v4/rss_feed', {
        searchParams: {
          type: '8-K',
      },
      }
);
    });

    it('should get RSS feed with date range', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockRSSFeed);

      await secResource.getRSSFeed(undefined, '2024-01-01', '2024-01-31');

      expect(mockClient.get).toHaveBeenCalledWith('v4/rss_feed', {
        searchParams: {
          from: '2024-01-01',
        to: '2024-01-31',
      },
      }
);
    });

    it('should get RSS feed with all parameters', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockRSSFeed);

      await secResource.getRSSFeed('10-K', '2024-01-01', '2024-12-31', 100);

      expect(mockClient.get).toHaveBeenCalledWith('v4/rss_feed', {
        searchParams: {
          type: '10-K',
        from: '2024-01-01',
        to: '2024-12-31',
        limit: 100,
      },
      }
);
    });

    it('should handle date range with only from date', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockRSSFeed);

      await secResource.getRSSFeed(undefined, '2024-01-01');

      expect(mockClient.get).toHaveBeenCalledWith('v4/rss_feed', {
        searchParams: {
          from: '2024-01-01',
      },
      }
);
    });

    it('should handle date range with only to date', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockRSSFeed);

      await secResource.getRSSFeed(undefined, undefined, '2024-12-31');

      expect(mockClient.get).toHaveBeenCalledWith('v4/rss_feed', {
        searchParams: {
          to: '2024-12-31',
      },
      }
);
    });
  });

  describe('searchByFormType', () => {
    const mockRSSFeed: SECRSSFeed[] = [
      {
        title: 'Test Filing',
        date: '2024-01-15',
        link: 'https://www.sec.gov/test',
        cik: '0000000001',
        formType: '10-K',
        acceptanceDateTime: '2024-01-15T16:30:00.000Z',
        filingDate: '2024-01-15',
        reportDate: '2024-01-14',
        accessionNumber: '0000000001-24-000001',
        fileNumber: '001-12345',
        filmNumber: '24567890',
        items: '',
        size: '512KB',
      },
    ];

    it('should search by form type', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockRSSFeed);

      const result = await secResource.searchByFormType('10-K');

      expect(mockClient.get).toHaveBeenCalledWith('v4/rss_feed', {
        searchParams: {
          type: '10-K',
      },
      }
);
      expect(result).toEqual(mockRSSFeed);
    });

    it('should search by form type with date range', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockRSSFeed);

      await secResource.searchByFormType('10-Q', '2024-01-01', '2024-03-31');

      expect(mockClient.get).toHaveBeenCalledWith('v4/rss_feed', {
        searchParams: {
          type: '10-Q',
        from: '2024-01-01',
        to: '2024-03-31',
      },
      }
);
    });

    it('should search by form type with limit', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockRSSFeed);

      await secResource.searchByFormType('8-K', undefined, undefined, 50);

      expect(mockClient.get).toHaveBeenCalledWith('v4/rss_feed', {
        searchParams: {
          type: '8-K',
        limit: 50,
      },
      }
);
    });

    it('should handle various form types', async () => {
      const formTypes = ['10-K', '10-Q', '8-K', '13F-HR', 'DEF 14A', 'S-1', '4'];

      for (const formType of formTypes) {
        vi.mocked(mockClient.get).mockResolvedValue(mockRSSFeed);
        await secResource.searchByFormType(formType);

        expect(mockClient.get).toHaveBeenCalledWith('v4/rss_feed', {
          searchParams: {
            type: formType,
        },
        }
);
      }
    });
  });

  describe('get8KFilings', () => {
    const mock8KFilings: SECRSSFeed[] = [
      {
        title: 'AAPL 8-K',
        date: '2024-01-15',
        link: 'https://www.sec.gov/8k',
        cik: '0000320193',
        formType: '8-K',
        acceptanceDateTime: '2024-01-15T16:30:00.000Z',
        filingDate: '2024-01-15',
        reportDate: '2024-01-14',
        accessionNumber: '0000320193-24-000001',
        fileNumber: '001-36743',
        filmNumber: '24567890',
        items: 'Item 2.02',
        size: '256KB',
      },
    ];

    it('should get 8-K filings without parameters', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mock8KFilings);

      const result = await secResource.get8KFilings();

      expect(mockClient.get).toHaveBeenCalledWith('v4/rss_feed', {
        searchParams: {
          type: '8-K',
      },
      }
);
      expect(result).toEqual(mock8KFilings);
    });

    it('should get 8-K filings with date range', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mock8KFilings);

      await secResource.get8KFilings('2024-01-01', '2024-01-31');

      expect(mockClient.get).toHaveBeenCalledWith('v4/rss_feed', {
        searchParams: {
          type: '8-K',
        from: '2024-01-01',
        to: '2024-01-31',
      },
      }
);
    });

    it('should get 8-K filings with limit', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mock8KFilings);

      await secResource.get8KFilings(undefined, undefined, 25);

      expect(mockClient.get).toHaveBeenCalledWith('v4/rss_feed', {
        searchParams: {
          type: '8-K',
        limit: 25,
      },
      }
);
    });

    it('should get 8-K filings with all parameters', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mock8KFilings);

      await secResource.get8KFilings('2024-01-01', '2024-12-31', 100);

      expect(mockClient.get).toHaveBeenCalledWith('v4/rss_feed', {
        searchParams: {
          type: '8-K',
        from: '2024-01-01',
        to: '2024-12-31',
        limit: 100,
      },
      }
);
    });
  });

  describe('getFilingsByCIK', () => {
    const mockFilings: SECFiling[] = [
      {
        symbol: 'AAPL',
        cik: '0000320193',
        title: '10-K Filing',
        date: '2024-01-15',
        type: '10-K',
        link: 'https://www.sec.gov/filing',
        finalLink: 'https://www.sec.gov/final',
      },
    ];

    it('should get filings by CIK', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockFilings);

      const result = await secResource.getFilingsByCIK('0000320193');

      expect(mockClient.get).toHaveBeenCalledWith('v3/sec_filings/0000320193', { searchParams: {} });
      expect(result).toEqual(mockFilings);
    });

    it('should get filings by CIK with type filter', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockFilings);

      await secResource.getFilingsByCIK('0000320193', '10-K');

      expect(mockClient.get).toHaveBeenCalledWith('v3/sec_filings/0000320193', {
        searchParams: {
          type: '10-K',
      },
      }
);
    });

    it('should get filings by CIK with limit', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockFilings);

      await secResource.getFilingsByCIK('0000320193', undefined, 10);

      expect(mockClient.get).toHaveBeenCalledWith('v3/sec_filings/0000320193', {
        searchParams: {
          limit: 10,
      },
      }
);
    });

    it('should handle CIK without leading zeros', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockFilings);

      await secResource.getFilingsByCIK('320193');

      expect(mockClient.get).toHaveBeenCalledWith('v3/sec_filings/320193', { searchParams: {} });
    });

    it('should handle CIK with all parameters', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockFilings);

      await secResource.getFilingsByCIK('0000320193', '8-K', 50);

      expect(mockClient.get).toHaveBeenCalledWith('v3/sec_filings/0000320193', {
        searchParams: {
          type: '8-K',
        limit: 50,
      },
      }
);
    });
  });

  describe('getFilingsByName', () => {
    const mockFilings: SECFiling[] = [
      {
        symbol: 'AAPL',
        cik: '0000320193',
        title: 'Apple Inc. 10-K',
        date: '2024-01-15',
        type: '10-K',
        link: 'https://www.sec.gov/filing',
        finalLink: 'https://www.sec.gov/final',
      },
    ];

    it('should get filings by company name', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockFilings);

      const result = await secResource.getFilingsByName('Apple Inc.');

      expect(mockClient.get).toHaveBeenCalledWith('v3/sec_filings', {
        searchParams: {
          name: 'Apple Inc.',
      },
      }
);
      expect(result).toEqual(mockFilings);
    });

    it('should get filings by name with type filter', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockFilings);

      await secResource.getFilingsByName('Apple Inc.', '10-Q');

      expect(mockClient.get).toHaveBeenCalledWith('v3/sec_filings', {
        searchParams: {
          name: 'Apple Inc.',
        type: '10-Q',
      },
      }
);
    });

    it('should get filings by name with limit', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockFilings);

      await secResource.getFilingsByName('Apple Inc.', undefined, 20);

      expect(mockClient.get).toHaveBeenCalledWith('v3/sec_filings', {
        searchParams: {
          name: 'Apple Inc.',
        limit: 20,
      },
      }
);
    });

    it('should handle company names with special characters', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockFilings);

      await secResource.getFilingsByName('AT&T Inc.');

      expect(mockClient.get).toHaveBeenCalledWith('v3/sec_filings', {
        searchParams: {
          name: 'AT&T Inc.',
      },
      }
);
    });

    it('should get filings by name with all parameters', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockFilings);

      await secResource.getFilingsByName('Microsoft Corporation', '8-K', 30);

      expect(mockClient.get).toHaveBeenCalledWith('v3/sec_filings', {
        searchParams: {
          name: 'Microsoft Corporation',
        type: '8-K',
        limit: 30,
      },
      }
);
    });
  });

  describe('searchCompanyBySymbol', () => {
    const mockCIKSearch: CompanyCIKSearch[] = [
      {
        cik: '0000320193',
        name: 'Apple Inc.',
      },
    ];

    it('should search company by symbol', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockCIKSearch);

      const result = await secResource.searchCompanyBySymbol('AAPL');

      expect(mockClient.get).toHaveBeenCalledWith('v3/cik-search/AAPL');
      expect(result).toEqual(mockCIKSearch);
    });

    it('should normalize symbol to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockCIKSearch);

      await secResource.searchCompanyBySymbol('aapl');

      expect(mockClient.get).toHaveBeenCalledWith('v3/cik-search/AAPL');
    });

    it('should handle mixed case symbols', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockCIKSearch);

      await secResource.searchCompanyBySymbol('MsFt');

      expect(mockClient.get).toHaveBeenCalledWith('v3/cik-search/MSFT');
    });

    it('should return empty array for invalid symbol', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      const result = await secResource.searchCompanyBySymbol('INVALID');

      expect(result).toEqual([]);
    });
  });

  describe('searchCompanyByCIK', () => {
    const mockCIKSearch: CompanyCIKSearch[] = [
      {
        cik: '0000320193',
        name: 'Apple Inc.',
      },
    ];

    it('should search company by CIK', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockCIKSearch);

      const result = await secResource.searchCompanyByCIK('0000320193');

      expect(mockClient.get).toHaveBeenCalledWith('v3/cik/0000320193');
      expect(result).toEqual(mockCIKSearch);
    });

    it('should handle CIK without leading zeros', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockCIKSearch);

      await secResource.searchCompanyByCIK('320193');

      expect(mockClient.get).toHaveBeenCalledWith('v3/cik/320193');
    });

    it('should handle long CIK numbers', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockCIKSearch);

      await secResource.searchCompanyByCIK('0001234567890');

      expect(mockClient.get).toHaveBeenCalledWith('v3/cik/0001234567890');
    });

    it('should return empty array for invalid CIK', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      const result = await secResource.searchCompanyByCIK('9999999999');

      expect(result).toEqual([]);
    });
  });

  describe('getLatestFilings', () => {
    const mockLatestFilings: SECRSSFeed[] = [
      {
        title: 'Latest 8-K',
        date: '2024-01-15',
        link: 'https://www.sec.gov/latest',
        cik: '0000000001',
        formType: '8-K',
        acceptanceDateTime: '2024-01-15T16:30:00.000Z',
        filingDate: '2024-01-15',
        reportDate: '2024-01-14',
        accessionNumber: '0000000001-24-000001',
        fileNumber: '001-12345',
        filmNumber: '24567890',
        items: 'Item 8.01',
        size: '128KB',
      },
    ];

    it('should get latest filings without limit', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockLatestFilings);

      const result = await secResource.getLatestFilings();

      expect(mockClient.get).toHaveBeenCalledWith('v4/rss_feed_8k', { searchParams: {} });
      expect(result).toEqual(mockLatestFilings);
    });

    it('should get latest filings with limit', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockLatestFilings);

      await secResource.getLatestFilings(10);

      expect(mockClient.get).toHaveBeenCalledWith('v4/rss_feed_8k', {
        searchParams: {
          limit: 10,
      },
      }
);
    });

    it('should handle various limit values', async () => {
      const limits = [1, 5, 10, 25, 50, 100];

      for (const limit of limits) {
        vi.mocked(mockClient.get).mockResolvedValue(mockLatestFilings);
        await secResource.getLatestFilings(limit);

        expect(mockClient.get).toHaveBeenCalledWith('v4/rss_feed_8k', {
          searchParams: {
            limit,
        },
        }
);
      }
    });
  });

  describe('getAllSICCodes', () => {
    const mockSICCodes: SICCode[] = [
      {
        sicCode: '7370',
        industry: 'Services-Computer Programming, Data Processing, Etc.',
        office: 'Office of Technology',
      },
      {
        sicCode: '2834',
        industry: 'Pharmaceutical Preparations',
        office: 'Office of Life Sciences',
      },
      {
        sicCode: '3674',
        industry: 'Semiconductors & Related Devices',
        office: 'Office of Technology',
      },
    ];

    it('should get all SIC codes', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockSICCodes);

      const result = await secResource.getAllSICCodes();

      expect(mockClient.get).toHaveBeenCalledWith(
        'v4/standard_industrial_classification/all'
      );
      expect(result).toEqual(mockSICCodes);
      expect(result).toHaveLength(3);
    });

    it('should return empty array when no SIC codes available', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      const result = await secResource.getAllSICCodes();

      expect(result).toEqual([]);
    });
  });

  describe('getSICByCode', () => {
    const mockSICCode: SICCode[] = [
      {
        sicCode: '7370',
        industry: 'Services-Computer Programming, Data Processing, Etc.',
        office: 'Office of Technology',
      },
    ];

    it('should get SIC by code', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockSICCode);

      const result = await secResource.getSICByCode('7370');

      expect(mockClient.get).toHaveBeenCalledWith(
        'v4/standard_industrial_classification',
        { searchParams: {   sicCode: '7370' }, }

      );
      expect(result).toEqual(mockSICCode);
    });

    it('should handle 4-digit SIC codes', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockSICCode);

      await secResource.getSICByCode('2834');

      expect(mockClient.get).toHaveBeenCalledWith(
        'v4/standard_industrial_classification',
        { searchParams: {   sicCode: '2834' }, }

      );
    });

    it('should handle 3-digit SIC codes', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockSICCode);

      await secResource.getSICByCode('367');

      expect(mockClient.get).toHaveBeenCalledWith(
        'v4/standard_industrial_classification',
        { searchParams: {   sicCode: '367' }, }

      );
    });

    it('should return empty array for invalid SIC code', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      const result = await secResource.getSICByCode('9999');

      expect(result).toEqual([]);
    });

    it('should handle multiple SIC codes with same prefix', async () => {
      const multipleCodes: SICCode[] = [
        {
          sicCode: '7370',
          industry: 'Services-Computer Programming',
          office: 'Office of Technology',
        },
        {
          sicCode: '7371',
          industry: 'Computer Programming Services',
          office: 'Office of Technology',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(multipleCodes);

      const result = await secResource.getSICByCode('737');

      expect(result).toHaveLength(2);
    });
  });

  describe('searchSIC', () => {
    const mockSICResults: SICCode[] = [
      {
        sicCode: '7370',
        industry: 'Services-Computer Programming, Data Processing, Etc.',
        office: 'Office of Technology',
      },
      {
        sicCode: '7371',
        industry: 'Computer Programming Services',
        office: 'Office of Technology',
      },
    ];

    it('should search SIC by industry name', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockSICResults);

      const result = await secResource.searchSIC('Computer');

      expect(mockClient.get).toHaveBeenCalledWith(
        'v4/standard_industrial_classification',
        { searchParams: {   industry: 'Computer' }, }

      );
      expect(result).toEqual(mockSICResults);
    });

    it('should handle case-sensitive searches', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockSICResults);

      await secResource.searchSIC('computer');

      expect(mockClient.get).toHaveBeenCalledWith(
        'v4/standard_industrial_classification',
        { searchParams: {   industry: 'computer' }, }

      );
    });

    it('should search with partial industry names', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockSICResults);

      await secResource.searchSIC('Programming');

      expect(mockClient.get).toHaveBeenCalledWith(
        'v4/standard_industrial_classification',
        { searchParams: {   industry: 'Programming' }, }

      );
    });

    it('should return empty array when no matches found', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      const result = await secResource.searchSIC('NonexistentIndustry');

      expect(result).toEqual([]);
    });

    it('should handle industry names with special characters', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockSICResults);

      await secResource.searchSIC('Services-Computer');

      expect(mockClient.get).toHaveBeenCalledWith(
        'v4/standard_industrial_classification',
        { searchParams: {   industry: 'Services-Computer' }, }

      );
    });

    it('should handle industry names with spaces', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([
        {
          sicCode: '2834',
          industry: 'Pharmaceutical Preparations',
          office: 'Office of Life Sciences',
        },
      ]);

      await secResource.searchSIC('Pharmaceutical Preparations');

      expect(mockClient.get).toHaveBeenCalledWith(
        'v4/standard_industrial_classification',
        { searchParams: {   industry: 'Pharmaceutical Preparations' }, }

      );
    });
  });

  describe('getFullProfile', () => {
    const mockFullProfile: SECFullProfile = {
      profile: {
        symbol: 'AAPL',
        price: 175.50,
        beta: 1.20,
        volAvg: 50000000,
        mktCap: 2800000000000,
        lastDiv: 0.96,
        range: '150.00-200.00',
        changes: 2.50,
        companyName: 'Apple Inc.',
        currency: 'USD',
        cik: '0000320193',
        isin: 'US0378331005',
        cusip: '037833100',
        exchange: 'NASDAQ Global Select',
        exchangeShortName: 'NASDAQ',
        industry: 'Consumer Electronics',
        website: 'https://www.apple.com',
        description: 'Apple Inc. designs, manufactures, and markets smartphones...',
        ceo: 'Tim Cook',
        sector: 'Technology',
        country: 'US',
        fullTimeEmployees: '164000',
        phone: '408-996-1010',
        address: 'One Apple Park Way',
        city: 'Cupertino',
        state: 'CA',
        zip: '95014',
        dcfDiff: 5.25,
        dcf: 180.75,
        image: 'https://financialmodelingprep.com/image-stock/AAPL.png',
        ipoDate: '1980-12-12',
        defaultImage: false,
        isEtf: false,
        isActivelyTrading: true,
        isAdr: false,
        isFund: false,
      },
      metrics: {
        dividendYielTTM: 0.55,
        volume: 52000000,
        yearHigh: 200.00,
        yearLow: 150.00,
      },
      ratios: [
        {
          symbol: 'AAPL',
          date: '2023-09-30',
          calendarYear: '2023',
          period: 'FY',
          currentRatio: 0.99,
          quickRatio: 0.85,
          cashRatio: 0.25,
          daysOfSalesOutstanding: 54.32,
          daysOfInventoryOutstanding: 10.23,
          operatingCycle: 64.55,
          daysOfPayablesOutstanding: 122.45,
          cashConversionCycle: -57.90,
          grossProfitMargin: 0.44,
          operatingProfitMargin: 0.30,
          pretaxProfitMargin: 0.30,
          netProfitMargin: 0.25,
          effectiveTaxRate: 0.15,
          returnOnAssets: 0.28,
          returnOnEquity: 1.60,
          returnOnCapitalEmployed: 0.54,
          netIncomePerEBT: 0.85,
          ebtPerEbit: 1.00,
          ebitPerRevenue: 0.30,
          debtRatio: 0.32,
          debtEquityRatio: 1.96,
          longTermDebtToCapitalization: 0.63,
          totalDebtToCapitalization: 0.66,
          interestCoverage: 40.00,
          cashFlowToDebtRatio: 0.65,
          companyEquityMultiplier: 6.95,
          receivablesTurnover: 6.72,
          payablesTurnover: 2.98,
          inventoryTurnover: 35.68,
          fixedAssetTurnover: 8.44,
          assetTurnover: 1.11,
          operatingCashFlowPerShare: 6.89,
          freeCashFlowPerShare: 6.15,
          cashPerShare: 3.80,
          payoutRatio: 0.15,
          operatingCashFlowSalesRatio: 0.28,
          freeCashFlowOperatingCashFlowRatio: 0.89,
          cashFlowCoverageRatios: 0.65,
          shortTermCoverageRatios: 4.22,
          capitalExpenditureCoverageRatio: 9.54,
          dividendPaidAndCapexCoverageRatio: 4.88,
          priceBookValueRatio: 46.21,
          priceToBookRatio: 46.21,
          priceToSalesRatio: 7.50,
          priceEarningsRatio: 29.85,
          priceToFreeCashFlowsRatio: 28.54,
          priceToOperatingCashFlowsRatio: 25.47,
          priceCashFlowRatio: 25.47,
          priceEarningsToGrowthRatio: 3.20,
          priceSalesRatio: 7.50,
          dividendYield: 0.0055,
          enterpriseValueMultiple: 24.32,
          priceFairValue: 1.03,
        },
      ],
      insiderTrading: [
        {
          symbol: 'AAPL',
          filingDate: '2024-01-15',
          transactionDate: '2024-01-12',
          reportingCik: '0001234567',
          transactionType: 'S-Sale',
          securitiesOwned: 50000,
          companyCik: '0000320193',
          reportingName: 'John Doe',
          typeOfOwner: 'officer',
          acquistionOrDisposition: 'D',
          formType: '4',
          securitiesTransacted: 5000,
          price: 175.50,
          securityName: 'Common Stock',
          link: 'https://www.sec.gov/insider',
        },
      ],
      keyExecutives: [
        {
          title: 'CEO',
          name: 'Tim Cook',
          pay: 63209845,
          currencyPay: 'USD',
          gender: 'male',
          yearBorn: 1960,
          titleSince: 2011,
        },
      ],
      splitsHistory: [
        {
          date: '2020-08-31',
          label: 'August 31, 20',
          symbol: 'AAPL',
          numerator: 4,
          denominator: 1,
        },
      ],
      stockDividend: [
        {
          date: '2024-02-09',
          label: 'February 09, 24',
          adjDividend: 0.24,
          symbol: 'AAPL',
          dividend: 0.24,
          recordDate: '2024-02-12',
          paymentDate: '2024-02-16',
          declarationDate: '2024-02-01',
        },
      ],
      stockNews: [
        {
          symbol: 'AAPL',
          publishedDate: '2024-01-15T10:30:00.000Z',
          title: 'Apple Announces New Product Launch',
          image: 'https://example.com/news.jpg',
          site: 'TechNews',
          text: 'Apple Inc. announced today...',
          url: 'https://example.com/article',
        },
      ],
      rating: [
        {
          symbol: 'AAPL',
          date: '2024-01-15',
          rating: 'A',
          ratingScore: 4.5,
          ratingRecommendation: 'Strong Buy',
          ratingDetailsDCFScore: 5,
          ratingDetailsDCFRecommendation: 'Strong Buy',
          ratingDetailsROEScore: 4,
          ratingDetailsROERecommendation: 'Buy',
          ratingDetailsROAScore: 5,
          ratingDetailsROARecommendation: 'Strong Buy',
          ratingDetailsDEScore: 3,
          ratingDetailsDERecommendation: 'Neutral',
          ratingDetailsPEScore: 4,
          ratingDetailsPERecommendation: 'Buy',
          ratingDetailsPBScore: 3,
          ratingDetailsPBRecommendation: 'Neutral',
        },
      ],
      financialsAnnual: {
        income: [],
        balance: [],
        cash: [],
      },
      financialsQuarter: {
        income: [],
        balance: [],
        cash: [],
      },
    };

    it('should get full profile for a symbol', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockFullProfile);

      const result = await secResource.getFullProfile('AAPL');

      expect(mockClient.get).toHaveBeenCalledWith('v4/company-outlook', {
        searchParams: {
          symbol: 'AAPL',
      },
      }
);
      expect(result).toEqual(mockFullProfile);
    });

    it('should normalize symbol to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockFullProfile);

      await secResource.getFullProfile('aapl');

      expect(mockClient.get).toHaveBeenCalledWith('v4/company-outlook', {
        searchParams: {
          symbol: 'AAPL',
      },
      }
);
    });

    it('should handle mixed case symbols', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockFullProfile);

      await secResource.getFullProfile('MsFt');

      expect(mockClient.get).toHaveBeenCalledWith('v4/company-outlook', {
        searchParams: {
          symbol: 'MSFT',
      },
      }
);
    });

    it('should return comprehensive profile data', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockFullProfile);

      const result = await secResource.getFullProfile('AAPL');

      expect(result.profile).toBeDefined();
      expect(result.profile.symbol).toBe('AAPL');
      expect(result.profile.cik).toBe('0000320193');
      expect(result.metrics).toBeDefined();
      expect(result.ratios).toBeDefined();
      expect(result.insiderTrading).toBeDefined();
      expect(result.keyExecutives).toBeDefined();
      expect(result.splitsHistory).toBeDefined();
      expect(result.stockDividend).toBeDefined();
      expect(result.stockNews).toBeDefined();
      expect(result.rating).toBeDefined();
      expect(result.financialsAnnual).toBeDefined();
      expect(result.financialsQuarter).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors in getFilings', async () => {
      const error = new Error('API Error');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(secResource.getFilings('AAPL')).rejects.toThrow('API Error');
    });

    it('should handle API errors in getRSSFeed', async () => {
      const error = new Error('Network Error');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(secResource.getRSSFeed()).rejects.toThrow('Network Error');
    });

    it('should handle API errors in searchCompanyBySymbol', async () => {
      const error = new Error('Not Found');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(secResource.searchCompanyBySymbol('INVALID')).rejects.toThrow(
        'Not Found'
      );
    });

    it('should handle API errors in getAllSICCodes', async () => {
      const error = new Error('Service Unavailable');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(secResource.getAllSICCodes()).rejects.toThrow(
        'Service Unavailable'
      );
    });

    it('should handle API errors in getFullProfile', async () => {
      const error = new Error('Timeout');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(secResource.getFullProfile('AAPL')).rejects.toThrow('Timeout');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string symbol', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await secResource.getFilings('');

      expect(mockClient.get).toHaveBeenCalledWith('v3/sec_filings/', { searchParams: {} });
    });

    it('should handle symbols with special characters', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await secResource.getFilings('BRK.B');

      expect(mockClient.get).toHaveBeenCalledWith('v3/sec_filings/BRK.B', { searchParams: {} });
    });

    it('should handle very large limit values', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await secResource.getFilings('AAPL', undefined, 10000);

      expect(mockClient.get).toHaveBeenCalledWith('v3/sec_filings/AAPL', {
        searchParams: {
          limit: 10000,
      },
      }
);
    });

    it('should handle limit value of 0', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await secResource.getFilings('AAPL', undefined, 0);

      // Limit of 0 should not be included in params
      expect(mockClient.get).toHaveBeenCalledWith('v3/sec_filings/AAPL', { searchParams: {} });
    });

    it('should handle empty type string', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await secResource.getFilings('AAPL', '');

      // Empty string is falsy, should not be included
      expect(mockClient.get).toHaveBeenCalledWith('v3/sec_filings/AAPL', { searchParams: {} });
    });

    it('should handle date ranges in wrong order', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      // API should handle validation, we just pass the params
      await secResource.getRSSFeed(undefined, '2024-12-31', '2024-01-01');

      expect(mockClient.get).toHaveBeenCalledWith('v4/rss_feed', {
        searchParams: {
          from: '2024-12-31',
        to: '2024-01-01',
      },
      }
);
    });

    it('should handle various date formats', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await secResource.getRSSFeed(undefined, '2024-01-01', '2024-01-31');

      expect(mockClient.get).toHaveBeenCalledWith('v4/rss_feed', {
        searchParams: {
          from: '2024-01-01',
        to: '2024-01-31',
      },
      }
);
    });
  });

  describe('Parameter Combinations', () => {
    it('should handle all optional parameters as undefined', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await secResource.getFilings('AAPL', undefined, undefined);

      expect(mockClient.get).toHaveBeenCalledWith('v3/sec_filings/AAPL', { searchParams: {} });
    });

    it('should handle mixed defined and undefined parameters', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await secResource.getRSSFeed('10-K', undefined, '2024-12-31', undefined);

      expect(mockClient.get).toHaveBeenCalledWith('v4/rss_feed', {
        searchParams: {
          type: '10-K',
        to: '2024-12-31',
      },
      }
);
    });

    it('should properly construct params with all options', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await secResource.getFilingsByName('Apple Inc.', '10-K', 50);

      expect(mockClient.get).toHaveBeenCalledWith('v3/sec_filings', {
        searchParams: {
          name: 'Apple Inc.',
        type: '10-K',
        limit: 50,
      },
      }
);
    });
  });

  describe('Symbol Normalization', () => {
    it('should normalize lowercase symbols', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await secResource.getFilings('tsla');

      expect(mockClient.get).toHaveBeenCalledWith('v3/sec_filings/TSLA', { searchParams: {} });
    });

    it('should preserve already uppercase symbols', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await secResource.searchCompanyBySymbol('GOOGL');

      expect(mockClient.get).toHaveBeenCalledWith('v3/cik-search/GOOGL');
    });

    it('should normalize mixed case symbols', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await secResource.getFullProfile('AmZn');

      expect(mockClient.get).toHaveBeenCalledWith('v4/company-outlook', {
        searchParams: {
          symbol: 'AMZN',
      },
      }
);
    });

    it('should handle symbols with numbers', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await secResource.getFilings('BRK.B');

      expect(mockClient.get).toHaveBeenCalledWith('v3/sec_filings/BRK.B', { searchParams: {} });
    });
  });
});
