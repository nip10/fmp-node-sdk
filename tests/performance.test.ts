import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PerformanceResource } from '../src/resources/performance.js';
import { FMPClient } from '../src/client.js';
import {
  FMPAPIError,
  FMPAPIError,
  FMPAPIError,
} from '../src/errors/index.js';
import type {
  StockMover,
  SectorPerformance,
  SectorPE,
  HistoricalSectorPerformance,
} from '../src/types/index.js';

describe('PerformanceResource', () => {
  let performanceResource: PerformanceResource;
  let mockClient: FMPClient;

  beforeEach(() => {
    // Create a mock client with a mocked get method
    mockClient = {
      get: vi.fn(),
    } as unknown as FMPClient;

    performanceResource = new PerformanceResource(mockClient);
  });

  describe('getGainers', () => {
    const mockGainersData: StockMover[] = [
      {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        change: 5.25,
        price: 175.5,
        changesPercentage: 3.08,
      },
      {
        symbol: 'MSFT',
        name: 'Microsoft Corporation',
        change: 8.75,
        price: 350.25,
        changesPercentage: 2.56,
      },
      {
        symbol: 'GOOGL',
        name: 'Alphabet Inc.',
        change: 3.15,
        price: 140.8,
        changesPercentage: 2.29,
      },
    ];

    it('should fetch gainers successfully', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockGainersData);

      const result = await performanceResource.getGainers();

      expect(mockClient.get).toHaveBeenCalledWith('v3/stock_market/gainers');
      expect(mockClient.get).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockGainersData);
      expect(result).toHaveLength(3);
    });

    it('should return empty array when no gainers available', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      const result = await performanceResource.getGainers();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should handle API errors', async () => {
      const apiError = new FMPAPIError('Server error', 500, 'Internal Server Error');
      vi.mocked(mockClient.get).mockRejectedValue(apiError);

      await expect(performanceResource.getGainers()).rejects.toThrow(FMPAPIError);
      await expect(performanceResource.getGainers()).rejects.toThrow('Server error');
    });

    it('should handle authentication errors', async () => {
      const authError = new FMPAPIError('Invalid API key');
      vi.mocked(mockClient.get).mockRejectedValue(authError);

      await expect(performanceResource.getGainers()).rejects.toThrow(FMPAPIError);
      await expect(performanceResource.getGainers()).rejects.toThrow('Invalid API key');
    });

    it('should handle rate limit errors', async () => {
      const rateLimitError = new FMPAPIError();
      vi.mocked(mockClient.get).mockRejectedValue(rateLimitError);

      await expect(performanceResource.getGainers()).rejects.toThrow(FMPAPIError);
    });
  });

  describe('getLosers', () => {
    const mockLosersData: StockMover[] = [
      {
        symbol: 'TSLA',
        name: 'Tesla, Inc.',
        change: -12.5,
        price: 238.75,
        changesPercentage: -4.98,
      },
      {
        symbol: 'NFLX',
        name: 'Netflix, Inc.',
        change: -8.3,
        price: 425.2,
        changesPercentage: -1.91,
      },
    ];

    it('should fetch losers successfully', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockLosersData);

      const result = await performanceResource.getLosers();

      expect(mockClient.get).toHaveBeenCalledWith('v3/stock_market/losers');
      expect(mockClient.get).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockLosersData);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no losers available', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      const result = await performanceResource.getLosers();

      expect(result).toEqual([]);
    });

    it('should handle network errors', async () => {
      const networkError = new FMPAPIError('Network timeout');
      vi.mocked(mockClient.get).mockRejectedValue(networkError);

      await expect(performanceResource.getLosers()).rejects.toThrow(FMPAPIError);
    });
  });

  describe('getMostActive', () => {
    const mockMostActiveData: StockMover[] = [
      {
        symbol: 'SPY',
        name: 'SPDR S&P 500 ETF Trust',
        change: 2.15,
        price: 445.8,
        changesPercentage: 0.48,
      },
      {
        symbol: 'QQQ',
        name: 'Invesco QQQ Trust',
        change: 1.75,
        price: 380.25,
        changesPercentage: 0.46,
      },
    ];

    it('should fetch most active stocks successfully', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockMostActiveData);

      const result = await performanceResource.getMostActive();

      expect(mockClient.get).toHaveBeenCalledWith('v3/stock_market/actives');
      expect(mockClient.get).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockMostActiveData);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no active stocks available', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      const result = await performanceResource.getMostActive();

      expect(result).toEqual([]);
    });

    it('should handle API errors', async () => {
      const apiError = new FMPAPIError('Bad request', 400, 'Bad Request');
      vi.mocked(mockClient.get).mockRejectedValue(apiError);

      await expect(performanceResource.getMostActive()).rejects.toThrow(FMPAPIError);
      await expect(performanceResource.getMostActive()).rejects.toThrow('Bad request');
    });
  });

  describe('getSectorPerformance', () => {
    const mockSectorPerformanceData: SectorPerformance[] = [
      {
        sector: 'Technology',
        changesPercentage: '2.45',
      },
      {
        sector: 'Healthcare',
        changesPercentage: '1.23',
      },
      {
        sector: 'Financial Services',
        changesPercentage: '-0.87',
      },
      {
        sector: 'Energy',
        changesPercentage: '-1.45',
      },
    ];

    it('should fetch sector performance without limit', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockSectorPerformanceData);

      const result = await performanceResource.getSectorPerformance();

      expect(mockClient.get).toHaveBeenCalledWith('v3/sector-performance', { searchParams: {} });
      expect(mockClient.get).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockSectorPerformanceData);
      expect(result).toHaveLength(4);
    });

    it('should fetch sector performance with limit parameter', async () => {
      const limitedData = mockSectorPerformanceData.slice(0, 2);
      vi.mocked(mockClient.get).mockResolvedValue(limitedData);

      const result = await performanceResource.getSectorPerformance(2);

      expect(mockClient.get).toHaveBeenCalledWith('v3/sector-performance', { searchParams: {   limit: 2 }, }
);
      expect(mockClient.get).toHaveBeenCalledTimes(1);
      expect(result).toHaveLength(2);
    });

    it('should fetch sector performance with limit of 1', async () => {
      const limitedData = [mockSectorPerformanceData[0]];
      vi.mocked(mockClient.get).mockResolvedValue(limitedData);

      const result = await performanceResource.getSectorPerformance(1);

      expect(mockClient.get).toHaveBeenCalledWith('v3/sector-performance', { searchParams: {   limit: 1 }, }
);
      expect(result).toHaveLength(1);
      expect(result[0].sector).toBe('Technology');
    });

    it('should fetch sector performance with large limit', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockSectorPerformanceData);

      const result = await performanceResource.getSectorPerformance(100);

      expect(mockClient.get).toHaveBeenCalledWith('v3/sector-performance', { searchParams: {   limit: 100 }, }
);
      expect(result).toEqual(mockSectorPerformanceData);
    });

    it('should not include limit parameter when undefined', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockSectorPerformanceData);

      await performanceResource.getSectorPerformance(undefined);

      expect(mockClient.get).toHaveBeenCalledWith('v3/sector-performance', { searchParams: {} });
    });

    it('should return empty array when no sectors available', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      const result = await performanceResource.getSectorPerformance(5);

      expect(result).toEqual([]);
    });

    it('should handle API errors with limit parameter', async () => {
      const apiError = new FMPAPIError('Invalid limit', 400, 'Bad Request');
      vi.mocked(mockClient.get).mockRejectedValue(apiError);

      await expect(performanceResource.getSectorPerformance(10)).rejects.toThrow(FMPAPIError);
    });
  });

  describe('getHistoricalSectorPerformance', () => {
    const mockHistoricalData: HistoricalSectorPerformance[] = [
      {
        date: '2024-01-15',
        'Technology': '2.45',
        'Healthcare': '1.23',
        'Financial Services': '-0.87',
        'Energy': '-1.45',
      },
      {
        date: '2024-01-14',
        'Technology': '1.89',
        'Healthcare': '0.95',
        'Financial Services': '0.23',
        'Energy': '-0.67',
      },
      {
        date: '2024-01-13',
        'Technology': '0.56',
        'Healthcare': '-0.32',
        'Financial Services': '1.45',
        'Energy': '2.34',
      },
    ];

    it('should fetch historical sector performance without limit', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockHistoricalData);

      const result = await performanceResource.getHistoricalSectorPerformance('Technology');

      expect(mockClient.get).toHaveBeenCalledWith('v3/historical-sector-performance', {
        searchParams: {
          sector: 'Technology',
      },
      }
);
      expect(mockClient.get).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockHistoricalData);
      expect(result).toHaveLength(3);
    });

    it('should fetch historical sector performance with limit', async () => {
      const limitedData = mockHistoricalData.slice(0, 2);
      vi.mocked(mockClient.get).mockResolvedValue(limitedData);

      const result = await performanceResource.getHistoricalSectorPerformance('Healthcare', 2);

      expect(mockClient.get).toHaveBeenCalledWith('v3/historical-sector-performance', {
        searchParams: {
          sector: 'Healthcare',
        limit: 2,
      },
      }
);
      expect(result).toHaveLength(2);
    });

    it('should fetch historical data for different sectors', async () => {
      const sectors = ['Technology', 'Healthcare', 'Energy', 'Financial Services'];

      for (const sector of sectors) {
        vi.mocked(mockClient.get).mockResolvedValue(mockHistoricalData);

        const result = await performanceResource.getHistoricalSectorPerformance(sector);

        expect(mockClient.get).toHaveBeenCalledWith('v3/historical-sector-performance', {
          searchParams: {
            sector,
        },
        }
);
        expect(result).toEqual(mockHistoricalData);
      }

      expect(mockClient.get).toHaveBeenCalledTimes(sectors.length);
    });

    it('should handle sector names with spaces', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockHistoricalData);

      await performanceResource.getHistoricalSectorPerformance('Financial Services', 5);

      expect(mockClient.get).toHaveBeenCalledWith('v3/historical-sector-performance', {
        searchParams: {
          sector: 'Financial Services',
        limit: 5,
      },
      }
);
    });

    it('should fetch historical data with limit of 1', async () => {
      const limitedData = [mockHistoricalData[0]];
      vi.mocked(mockClient.get).mockResolvedValue(limitedData);

      const result = await performanceResource.getHistoricalSectorPerformance('Technology', 1);

      expect(mockClient.get).toHaveBeenCalledWith('v3/historical-sector-performance', {
        searchParams: {
          sector: 'Technology',
        limit: 1,
      },
      }
);
      expect(result).toHaveLength(1);
      expect(result[0].date).toBe('2024-01-15');
    });

    it('should fetch historical data with large limit', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockHistoricalData);

      const result = await performanceResource.getHistoricalSectorPerformance('Energy', 365);

      expect(mockClient.get).toHaveBeenCalledWith('v3/historical-sector-performance', {
        searchParams: {
          sector: 'Energy',
        limit: 365,
      },
      }
);
      expect(result).toEqual(mockHistoricalData);
    });

    it('should not include limit parameter when undefined', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockHistoricalData);

      await performanceResource.getHistoricalSectorPerformance('Technology', undefined);

      expect(mockClient.get).toHaveBeenCalledWith('v3/historical-sector-performance', {
        searchParams: {
          sector: 'Technology',
      },
      }
);
    });

    it('should return empty array when no historical data available', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      const result = await performanceResource.getHistoricalSectorPerformance('Technology');

      expect(result).toEqual([]);
    });

    it('should handle API errors', async () => {
      const apiError = new FMPAPIError('Invalid sector', 400, 'Bad Request');
      vi.mocked(mockClient.get).mockRejectedValue(apiError);

      await expect(
        performanceResource.getHistoricalSectorPerformance('InvalidSector')
      ).rejects.toThrow(FMPAPIError);
    });

    it('should handle rate limit errors', async () => {
      const rateLimitError = new FMPAPIError('Rate limit exceeded. Please try again later.');
      vi.mocked(mockClient.get).mockRejectedValue(rateLimitError);

      await expect(
        performanceResource.getHistoricalSectorPerformance('Technology', 10)
      ).rejects.toThrow(FMPAPIError);
    });
  });

  describe('getSectorPE', () => {
    const mockSectorPEData: SectorPE[] = [
      {
        date: '2024-01-15',
        sector: 'Technology',
        pe: '28.5',
      },
      {
        date: '2024-01-15',
        sector: 'Healthcare',
        pe: '22.3',
      },
      {
        date: '2024-01-15',
        sector: 'Energy',
        pe: '12.7',
      },
    ];

    it('should fetch sector PE without exchange parameter', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockSectorPEData);

      const result = await performanceResource.getSectorPE('2024-01-15');

      expect(mockClient.get).toHaveBeenCalledWith('v4/sector_price_earning_ratio', {
        searchParams: {
          date: '2024-01-15',
      },
      }
);
      expect(mockClient.get).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockSectorPEData);
      expect(result).toHaveLength(3);
    });

    it('should fetch sector PE with exchange parameter', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockSectorPEData);

      const result = await performanceResource.getSectorPE('2024-01-15', 'NYSE');

      expect(mockClient.get).toHaveBeenCalledWith('v4/sector_price_earning_ratio', {
        searchParams: {
          date: '2024-01-15',
        exchange: 'NYSE',
      },
      }
);
      expect(result).toEqual(mockSectorPEData);
    });

    it('should fetch sector PE for different exchanges', async () => {
      const exchanges = ['NYSE', 'NASDAQ', 'AMEX', 'LSE'];

      for (const exchange of exchanges) {
        vi.mocked(mockClient.get).mockResolvedValue(mockSectorPEData);

        await performanceResource.getSectorPE('2024-01-15', exchange);

        expect(mockClient.get).toHaveBeenCalledWith('v4/sector_price_earning_ratio', {
          searchParams: {
            date: '2024-01-15',
          exchange,
        },
        }
);
      }
    });

    it('should fetch sector PE for different date formats', async () => {
      const dates = ['2024-01-15', '2023-12-31', '2024-06-30'];

      for (const date of dates) {
        vi.mocked(mockClient.get).mockResolvedValue(mockSectorPEData);

        await performanceResource.getSectorPE(date);

        expect(mockClient.get).toHaveBeenCalledWith('v4/sector_price_earning_ratio', {
          searchParams: {
            date,
        },
        }
);
      }
    });

    it('should not include exchange parameter when undefined', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockSectorPEData);

      await performanceResource.getSectorPE('2024-01-15', undefined);

      expect(mockClient.get).toHaveBeenCalledWith('v4/sector_price_earning_ratio', {
        searchParams: {
          date: '2024-01-15',
      },
      }
);
    });

    it('should return empty array when no PE data available', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      const result = await performanceResource.getSectorPE('2024-01-15');

      expect(result).toEqual([]);
    });

    it('should handle API errors for invalid date', async () => {
      const apiError = new FMPAPIError('Invalid date format', 400, 'Bad Request');
      vi.mocked(mockClient.get).mockRejectedValue(apiError);

      await expect(performanceResource.getSectorPE('invalid-date')).rejects.toThrow(FMPAPIError);
    });

    it('should handle API errors for invalid exchange', async () => {
      const apiError = new FMPAPIError('Invalid exchange', 400, 'Bad Request');
      vi.mocked(mockClient.get).mockRejectedValue(apiError);

      await expect(performanceResource.getSectorPE('2024-01-15', 'INVALID')).rejects.toThrow(
        FMPAPIError
      );
    });

    it('should handle authentication errors', async () => {
      const authError = new FMPAPIError('Invalid API key or unauthorized access');
      vi.mocked(mockClient.get).mockRejectedValue(authError);

      await expect(performanceResource.getSectorPE('2024-01-15')).rejects.toThrow(
        FMPAPIError
      );
    });
  });

  describe('Additional methods', () => {
    it('should have getIndustryPE method', () => {
      expect(typeof performanceResource.getIndustryPE).toBe('function');
    });

    it('should have getHistoricalSectorPE method', () => {
      expect(typeof performanceResource.getHistoricalSectorPE).toBe('function');
    });

    it('should have getHistoricalIndustryPE method', () => {
      expect(typeof performanceResource.getHistoricalIndustryPE).toBe('function');
    });
  });

  describe('getIndustryPE', () => {
    const mockIndustryPEData = [
      {
        date: '2024-01-15',
        industry: 'Software',
        pe: '35.2',
      },
      {
        date: '2024-01-15',
        industry: 'Semiconductors',
        pe: '28.7',
      },
    ];

    it('should fetch industry PE without exchange parameter', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockIndustryPEData);

      const result = await performanceResource.getIndustryPE('2024-01-15');

      expect(mockClient.get).toHaveBeenCalledWith('v4/industry_price_earning_ratio', {
        searchParams: {
          date: '2024-01-15',
      },
      }
);
      expect(result).toEqual(mockIndustryPEData);
    });

    it('should fetch industry PE with exchange parameter', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockIndustryPEData);

      const result = await performanceResource.getIndustryPE('2024-01-15', 'NASDAQ');

      expect(mockClient.get).toHaveBeenCalledWith('v4/industry_price_earning_ratio', {
        searchParams: {
          date: '2024-01-15',
        exchange: 'NASDAQ',
      },
      }
);
      expect(result).toEqual(mockIndustryPEData);
    });

    it('should handle API errors', async () => {
      const apiError = new FMPAPIError('Server error', 500, 'Internal Server Error');
      vi.mocked(mockClient.get).mockRejectedValue(apiError);

      await expect(performanceResource.getIndustryPE('2024-01-15')).rejects.toThrow(FMPAPIError);
    });
  });

  describe('getHistoricalSectorPE', () => {
    const mockHistoricalSectorPEData: SectorPE[] = [
      {
        date: '2024-01-15',
        sector: 'Technology',
        pe: '28.5',
      },
      {
        date: '2024-01-14',
        sector: 'Technology',
        pe: '28.3',
      },
      {
        date: '2024-01-13',
        sector: 'Technology',
        pe: '27.9',
      },
    ];

    it('should fetch historical sector PE', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockHistoricalSectorPEData);

      const result = await performanceResource.getHistoricalSectorPE('Technology');

      expect(mockClient.get).toHaveBeenCalledWith('v4/historical-sector-pe', {
        searchParams: {
          sector: 'Technology',
      },
      }
);
      expect(result).toEqual(mockHistoricalSectorPEData);
      expect(result).toHaveLength(3);
    });

    it('should handle different sector names', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockHistoricalSectorPEData);

      await performanceResource.getHistoricalSectorPE('Financial Services');

      expect(mockClient.get).toHaveBeenCalledWith('v4/historical-sector-pe', {
        searchParams: {
          sector: 'Financial Services',
      },
      }
);
    });

    it('should return empty array when no data available', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      const result = await performanceResource.getHistoricalSectorPE('Technology');

      expect(result).toEqual([]);
    });

    it('should handle API errors', async () => {
      const apiError = new FMPAPIError('Invalid sector', 400, 'Bad Request');
      vi.mocked(mockClient.get).mockRejectedValue(apiError);

      await expect(performanceResource.getHistoricalSectorPE('InvalidSector')).rejects.toThrow(
        FMPAPIError
      );
    });
  });

  describe('getHistoricalIndustryPE', () => {
    const mockHistoricalIndustryPEData = [
      {
        date: '2024-01-15',
        industry: 'Software',
        pe: '35.2',
      },
      {
        date: '2024-01-14',
        industry: 'Software',
        pe: '35.0',
      },
    ];

    it('should fetch historical industry PE', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockHistoricalIndustryPEData);

      const result = await performanceResource.getHistoricalIndustryPE('Software');

      expect(mockClient.get).toHaveBeenCalledWith('v4/historical-industry-pe', {
        searchParams: {
          industry: 'Software',
      },
      }
);
      expect(result).toEqual(mockHistoricalIndustryPEData);
      expect(result).toHaveLength(2);
    });

    it('should handle different industry names', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockHistoricalIndustryPEData);

      await performanceResource.getHistoricalIndustryPE('Semiconductors');

      expect(mockClient.get).toHaveBeenCalledWith('v4/historical-industry-pe', {
        searchParams: {
          industry: 'Semiconductors',
      },
      }
);
    });

    it('should return empty array when no data available', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      const result = await performanceResource.getHistoricalIndustryPE('Software');

      expect(result).toEqual([]);
    });

    it('should handle API errors', async () => {
      const apiError = new FMPAPIError('Invalid industry', 400, 'Bad Request');
      vi.mocked(mockClient.get).mockRejectedValue(apiError);

      await expect(performanceResource.getHistoricalIndustryPE('InvalidIndustry')).rejects.toThrow(
        FMPAPIError
      );
    });

    it('should handle rate limit errors', async () => {
      const rateLimitError = new FMPAPIError();
      vi.mocked(mockClient.get).mockRejectedValue(rateLimitError);

      await expect(performanceResource.getHistoricalIndustryPE('Software')).rejects.toThrow(
        FMPAPIError
      );
    });
  });

  describe('Error handling consistency', () => {
    it('should properly propagate all error types for all methods', async () => {
      const errors = [
        new FMPAPIError('API error', 500),
        new FMPAPIError('Auth error'),
        new FMPAPIError('Rate limit error'),
      ];

      const methods = [
        { name: 'getGainers', args: [] },
        { name: 'getLosers', args: [] },
        { name: 'getMostActive', args: [] },
        { name: 'getSectorPerformance', args: [10] },
        { name: 'getHistoricalSectorPerformance', args: ['Technology', 5] },
        { name: 'getSectorPE', args: ['2024-01-15', 'NYSE'] },
        { name: 'getIndustryPE', args: ['2024-01-15', 'NASDAQ'] },
        { name: 'getHistoricalSectorPE', args: ['Technology'] },
        { name: 'getHistoricalIndustryPE', args: ['Software'] },
      ];

      for (const error of errors) {
        for (const method of methods) {
          vi.mocked(mockClient.get).mockRejectedValue(error);

          await expect(
            // @ts-expect-error - Dynamic method call for testing
            performanceResource[method.name](...method.args)
          ).rejects.toThrow(error.constructor);
        }
      }
    });
  });

  describe('Parameter validation edge cases', () => {
    it('should handle zero limit for getSectorPerformance', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await performanceResource.getSectorPerformance(0);

      // Note: limit of 0 is falsy, so it should not be included
      expect(mockClient.get).toHaveBeenCalledWith('v3/sector-performance', { searchParams: {} });
    });

    it('should handle zero limit for getHistoricalSectorPerformance', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await performanceResource.getHistoricalSectorPerformance('Technology', 0);

      // Note: limit of 0 is falsy, so it should not be included
      expect(mockClient.get).toHaveBeenCalledWith('v3/historical-sector-performance', {
        searchParams: {
          sector: 'Technology',
      },
      }
);
    });

    it('should handle empty string for sector name', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await performanceResource.getHistoricalSectorPerformance('');

      expect(mockClient.get).toHaveBeenCalledWith('v3/historical-sector-performance', {
        searchParams: {
          sector: '',
      },
      }
);
    });

    it('should handle empty string for exchange', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await performanceResource.getSectorPE('2024-01-15', '');

      // Note: empty string is falsy, so exchange parameter should not be included
      expect(mockClient.get).toHaveBeenCalledWith('v4/sector_price_earning_ratio', {
        searchParams: {
          date: '2024-01-15',
      },
      }
);
    });

    it('should handle special characters in sector name', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await performanceResource.getHistoricalSectorPerformance('Real Estate & Construction');

      expect(mockClient.get).toHaveBeenCalledWith('v3/historical-sector-performance', {
        searchParams: {
          sector: 'Real Estate & Construction',
      },
      }
);
    });
  });
});
