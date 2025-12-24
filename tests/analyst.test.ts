import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AnalystResource } from '../src/resources/analyst.js';
import type { FMPClient } from '../src/client.js';
import type {
  AnalystEstimate,
  PriceTarget,
  PriceTargetSummary,
  PriceTargetConsensus,
  AnalystRecommendation,
  StockGrade,
  UpgradesDowngradesConsensus,
} from '../src/types/index.js';
import {
  FMPAPIError,
  FMPAPIError,
  FMPAPIError,
} from '../src/errors/index.js';

describe('AnalystResource', () => {
  let analyst: AnalystResource;
  let mockClient: FMPClient;

  beforeEach(() => {
    mockClient = {
      get: vi.fn(),
    } as unknown as FMPClient;
    analyst = new AnalystResource(mockClient);
  });

  describe('getEstimates', () => {
    const mockEstimates: AnalystEstimate[] = [
      {
        symbol: 'AAPL',
        date: '2024-12-31',
        estimatedRevenueLow: 100000000000,
        estimatedRevenueHigh: 120000000000,
        estimatedRevenueAvg: 110000000000,
        estimatedEbitdaLow: 30000000000,
        estimatedEbitdaHigh: 35000000000,
        estimatedEbitdaAvg: 32500000000,
        estimatedEbitLow: 28000000000,
        estimatedEbitHigh: 33000000000,
        estimatedEbitAvg: 30500000000,
        estimatedNetIncomeLow: 20000000000,
        estimatedNetIncomeHigh: 25000000000,
        estimatedNetIncomeAvg: 22500000000,
        estimatedSgaExpenseLow: 5000000000,
        estimatedSgaExpenseHigh: 6000000000,
        estimatedSgaExpenseAvg: 5500000000,
        estimatedEpsAvg: 6.5,
        estimatedEpsHigh: 7.0,
        estimatedEpsLow: 6.0,
        numberAnalystEstimatedRevenue: 35,
        numberAnalystsEstimatedEps: 38,
      },
    ];

    it('should get analyst estimates with default period', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockEstimates);

      const result = await analyst.getEstimates('AAPL');

      expect(mockClient.get).toHaveBeenCalledWith('v3/analyst-estimates', {
        searchParams: {
          symbol: 'AAPL',
        period: 'annual',
      },
      }
);
      expect(result).toEqual(mockEstimates);
    });

    it('should get analyst estimates with quarterly period', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockEstimates);

      const result = await analyst.getEstimates('AAPL', 'quarter');

      expect(mockClient.get).toHaveBeenCalledWith('v3/analyst-estimates', {
        searchParams: {
          symbol: 'AAPL',
        period: 'quarter',
      },
      }
);
      expect(result).toEqual(mockEstimates);
    });

    it('should get analyst estimates with limit', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockEstimates);

      const result = await analyst.getEstimates('AAPL', 'annual', 10);

      expect(mockClient.get).toHaveBeenCalledWith('v3/analyst-estimates', {
        searchParams: {
          symbol: 'AAPL',
        period: 'annual',
        limit: 10,
      },
      }
);
      expect(result).toEqual(mockEstimates);
    });

    it('should normalize symbol to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockEstimates);

      await analyst.getEstimates('aapl');

      expect(mockClient.get).toHaveBeenCalledWith('v3/analyst-estimates', {
        searchParams: {
          symbol: 'AAPL',
        period: 'annual',
      },
      }
);
    });

    it('should not include limit parameter when not provided', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockEstimates);

      await analyst.getEstimates('AAPL', 'annual');

      expect(mockClient.get).toHaveBeenCalledWith('v3/analyst-estimates', {
        searchParams: {
          symbol: 'AAPL',
        period: 'annual',
      },
      }
);
    });

    it('should handle API errors', async () => {
      const error = new FMPAPIError('Invalid symbol', 400, 'Bad Request');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(analyst.getEstimates('INVALID')).rejects.toThrow(FMPAPIError);
    });
  });

  describe('getPriceTargets', () => {
    const mockPriceTargets: PriceTarget[] = [
      {
        symbol: 'AAPL',
        publishedDate: '2024-12-20',
        newsURL: 'https://example.com/news',
        newsTitle: 'Apple Price Target Raised',
        analystName: 'John Doe',
        priceTarget: 200.0,
        adjPriceTarget: 200.0,
        priceWhenPosted: 180.0,
        newsPublisher: 'Example News',
        newsBaseURL: 'https://example.com',
        analystCompany: 'Example Research',
      },
    ];

    it('should get price targets', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockPriceTargets);

      const result = await analyst.getPriceTargets('AAPL');

      expect(mockClient.get).toHaveBeenCalledWith('v4/price-target', {
        searchParams: {
          symbol: 'AAPL',
      },
      }
);
      expect(result).toEqual(mockPriceTargets);
    });

    it('should normalize symbol to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockPriceTargets);

      await analyst.getPriceTargets('aapl');

      expect(mockClient.get).toHaveBeenCalledWith('v4/price-target', {
        searchParams: {
          symbol: 'AAPL',
      },
      }
);
    });

    it('should handle authentication errors', async () => {
      const error = new FMPAPIError('Invalid API key');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(analyst.getPriceTargets('AAPL')).rejects.toThrow(
        FMPAPIError
      );
    });
  });

  describe('getPriceTargetSummary', () => {
    const mockSummary: PriceTargetSummary[] = [
      {
        symbol: 'AAPL',
        lastMonth: 15,
        lastMonthAvgPriceTarget: 195.5,
        lastQuarter: 42,
        lastQuarterAvgPriceTarget: 192.3,
        lastYear: 156,
        lastYearAvgPriceTarget: 185.8,
        allTime: 523,
        allTimeAvgPriceTarget: 175.2,
        publishers: ['Morgan Stanley', 'Goldman Sachs', 'JP Morgan'],
      },
    ];

    it('should get price target summary', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockSummary);

      const result = await analyst.getPriceTargetSummary('AAPL');

      expect(mockClient.get).toHaveBeenCalledWith('v4/price-target-summary', {
        searchParams: {
          symbol: 'AAPL',
      },
      }
);
      expect(result).toEqual(mockSummary[0]);
    });

    it('should return first element from array response', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockSummary);

      const result = await analyst.getPriceTargetSummary('AAPL');

      expect(result).toBe(mockSummary[0]);
      expect(Array.isArray(result)).toBe(false);
    });

    it('should normalize symbol to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockSummary);

      await analyst.getPriceTargetSummary('tsla');

      expect(mockClient.get).toHaveBeenCalledWith('v4/price-target-summary', {
        searchParams: {
          symbol: 'TSLA',
      },
      }
);
    });
  });

  describe('getPriceTargetConsensus', () => {
    const mockConsensus: PriceTargetConsensus[] = [
      {
        symbol: 'AAPL',
        targetHigh: 220.0,
        targetLow: 150.0,
        targetConsensus: 195.0,
        targetMedian: 192.5,
      },
    ];

    it('should get price target consensus', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockConsensus);

      const result = await analyst.getPriceTargetConsensus('AAPL');

      expect(mockClient.get).toHaveBeenCalledWith('v4/price-target-consensus', {
        searchParams: {
          symbol: 'AAPL',
      },
      }
);
      expect(result).toEqual(mockConsensus[0]);
    });

    it('should return first element from array response', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockConsensus);

      const result = await analyst.getPriceTargetConsensus('AAPL');

      expect(result).toBe(mockConsensus[0]);
      expect(Array.isArray(result)).toBe(false);
    });

    it('should normalize symbol to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockConsensus);

      await analyst.getPriceTargetConsensus('msft');

      expect(mockClient.get).toHaveBeenCalledWith('v4/price-target-consensus', {
        searchParams: {
          symbol: 'MSFT',
      },
      }
);
    });

    it('should handle rate limit errors', async () => {
      const error = new FMPAPIError('Rate limit exceeded');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(analyst.getPriceTargetConsensus('AAPL')).rejects.toThrow(
        FMPAPIError
      );
    });
  });

  describe('getRecommendations', () => {
    const mockRecommendations: AnalystRecommendation[] = [
      {
        symbol: 'AAPL',
        date: '2024-12-24',
        analystRatingsbuy: 12,
        analystRatingsHold: 8,
        analystRatingsSell: 2,
        analystRatingsStrongSell: 1,
        analystRatingsStrongBuy: 15,
      },
    ];

    it('should get analyst recommendations', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockRecommendations);

      const result = await analyst.getRecommendations('AAPL');

      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/analyst-stock-recommendations/AAPL'
      );
      expect(result).toEqual(mockRecommendations);
    });

    it('should normalize symbol to uppercase in URL', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockRecommendations);

      await analyst.getRecommendations('aapl');

      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/analyst-stock-recommendations/AAPL'
      );
    });

    it('should handle mixed case symbols', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockRecommendations);

      await analyst.getRecommendations('AaPl');

      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/analyst-stock-recommendations/AAPL'
      );
    });
  });

  describe('getGrades', () => {
    const mockGrades: StockGrade[] = [
      {
        symbol: 'AAPL',
        date: '2024-12-20',
        gradingCompany: 'Morgan Stanley',
        previousGrade: 'Hold',
        newGrade: 'Buy',
      },
      {
        symbol: 'AAPL',
        date: '2024-12-15',
        gradingCompany: 'Goldman Sachs',
        previousGrade: 'Neutral',
        newGrade: 'Outperform',
      },
    ];

    it('should get stock grades without limit', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockGrades);

      const result = await analyst.getGrades('AAPL');

      expect(mockClient.get).toHaveBeenCalledWith('v3/grade', {
        searchParams: {
          symbol: 'AAPL',
      },
      }
);
      expect(result).toEqual(mockGrades);
    });

    it('should get stock grades with limit', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockGrades);

      const result = await analyst.getGrades('AAPL', 5);

      expect(mockClient.get).toHaveBeenCalledWith('v3/grade', {
        searchParams: {
          symbol: 'AAPL',
        limit: 5,
      },
      }
);
      expect(result).toEqual(mockGrades);
    });

    it('should normalize symbol to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockGrades);

      await analyst.getGrades('googl', 10);

      expect(mockClient.get).toHaveBeenCalledWith('v3/grade', {
        searchParams: {
          symbol: 'GOOGL',
        limit: 10,
      },
      }
);
    });

    it('should not include limit parameter when not provided', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockGrades);

      await analyst.getGrades('AAPL');

      const call = vi.mocked(mockClient.get).mock.calls[0];
      expect(call[1]).not.toHaveProperty('limit');
    });

    it('should handle limit of 0', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockGrades);

      await analyst.getGrades('AAPL', 0);

      expect(mockClient.get).toHaveBeenCalledWith('v3/grade', {
        searchParams: {
          symbol: 'AAPL',
      },
      }
);
    });
  });

  describe('getUpgradesDowngradesConsensus', () => {
    const mockConsensus: UpgradesDowngradesConsensus[] = [
      {
        symbol: 'AAPL',
        strongBuy: 15,
        buy: 12,
        hold: 8,
        sell: 2,
        strongSell: 1,
        consensus: 'Strong Buy',
      },
    ];

    it('should get upgrades downgrades consensus', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockConsensus);

      const result = await analyst.getUpgradesDowngradesConsensus('AAPL');

      expect(mockClient.get).toHaveBeenCalledWith(
        'v4/upgrades-downgrades-consensus',
        {
          searchParams: {
            symbol: 'AAPL',
        },
        }

      );
      expect(result).toEqual(mockConsensus[0]);
    });

    it('should return first element from array response', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockConsensus);

      const result = await analyst.getUpgradesDowngradesConsensus('AAPL');

      expect(result).toBe(mockConsensus[0]);
      expect(Array.isArray(result)).toBe(false);
    });

    it('should normalize symbol to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockConsensus);

      await analyst.getUpgradesDowngradesConsensus('nvda');

      expect(mockClient.get).toHaveBeenCalledWith(
        'v4/upgrades-downgrades-consensus',
        {
          searchParams: {
            symbol: 'NVDA',
        },
        }

      );
    });
  });

  describe('getRatingsSnapshot', () => {
    const mockRatings: AnalystRecommendation[] = [
      {
        symbol: 'AAPL',
        date: '2024-12-24',
        analystRatingsbuy: 12,
        analystRatingsHold: 8,
        analystRatingsSell: 2,
        analystRatingsStrongSell: 1,
        analystRatingsStrongBuy: 15,
      },
    ];

    it('should get ratings snapshot', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockRatings);

      const result = await analyst.getRatingsSnapshot('AAPL');

      expect(mockClient.get).toHaveBeenCalledWith('v3/rating/AAPL');
      expect(result).toEqual(mockRatings[0]);
    });

    it('should return first element from array response', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockRatings);

      const result = await analyst.getRatingsSnapshot('AAPL');

      expect(result).toBe(mockRatings[0]);
      expect(Array.isArray(result)).toBe(false);
    });

    it('should normalize symbol to uppercase in URL', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockRatings);

      await analyst.getRatingsSnapshot('meta');

      expect(mockClient.get).toHaveBeenCalledWith('v3/rating/META');
    });
  });

  describe('getHistoricalGrades', () => {
    const mockHistoricalGrades: StockGrade[] = [
      {
        symbol: 'AAPL',
        date: '2024-12-20',
        gradingCompany: 'Morgan Stanley',
        previousGrade: 'Hold',
        newGrade: 'Buy',
      },
      {
        symbol: 'AAPL',
        date: '2024-11-15',
        gradingCompany: 'Goldman Sachs',
        previousGrade: 'Sell',
        newGrade: 'Neutral',
      },
      {
        symbol: 'AAPL',
        date: '2024-10-10',
        gradingCompany: 'JP Morgan',
        previousGrade: 'Neutral',
        newGrade: 'Outperform',
      },
    ];

    it('should get historical grades without limit', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockHistoricalGrades);

      const result = await analyst.getHistoricalGrades('AAPL');

      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/historical-rating/AAPL',
        { searchParams: {} }
      );
      expect(result).toEqual(mockHistoricalGrades);
    });

    it('should get historical grades with limit', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockHistoricalGrades);

      const result = await analyst.getHistoricalGrades('AAPL', 10);

      expect(mockClient.get).toHaveBeenCalledWith('v3/historical-rating/AAPL', {
        searchParams: {
          limit: 10,
      },
      }
);
      expect(result).toEqual(mockHistoricalGrades);
    });

    it('should normalize symbol to uppercase in URL', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockHistoricalGrades);

      await analyst.getHistoricalGrades('amzn', 20);

      expect(mockClient.get).toHaveBeenCalledWith('v3/historical-rating/AMZN', {
        searchParams: {
          limit: 20,
      },
      }
);
    });

    it('should not include limit parameter when not provided', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockHistoricalGrades);

      await analyst.getHistoricalGrades('AAPL');

      const call = vi.mocked(mockClient.get).mock.calls[0];
      expect(call[1]).toEqual({ searchParams: {} });
    });

    it('should handle limit of 0', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockHistoricalGrades);

      await analyst.getHistoricalGrades('AAPL', 0);

      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/historical-rating/AAPL',
        { searchParams: {} }
      );
    });

    it('should handle large limit values', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockHistoricalGrades);

      await analyst.getHistoricalGrades('AAPL', 1000);

      expect(mockClient.get).toHaveBeenCalledWith('v3/historical-rating/AAPL', {
        searchParams: {
          limit: 1000,
      },
      }
);
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors for all methods', async () => {
      const error = new FMPAPIError('Server error', 500, 'Internal Server Error');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(analyst.getEstimates('AAPL')).rejects.toThrow(FMPAPIError);
      await expect(analyst.getPriceTargets('AAPL')).rejects.toThrow(FMPAPIError);
      await expect(analyst.getPriceTargetSummary('AAPL')).rejects.toThrow(
        FMPAPIError
      );
      await expect(analyst.getPriceTargetConsensus('AAPL')).rejects.toThrow(
        FMPAPIError
      );
      await expect(analyst.getRecommendations('AAPL')).rejects.toThrow(
        FMPAPIError
      );
      await expect(analyst.getGrades('AAPL')).rejects.toThrow(FMPAPIError);
      await expect(
        analyst.getUpgradesDowngradesConsensus('AAPL')
      ).rejects.toThrow(FMPAPIError);
      await expect(analyst.getRatingsSnapshot('AAPL')).rejects.toThrow(
        FMPAPIError
      );
      await expect(analyst.getHistoricalGrades('AAPL')).rejects.toThrow(
        FMPAPIError
      );
    });

    it('should handle network errors', async () => {
      const error = new Error('Network error');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(analyst.getEstimates('AAPL')).rejects.toThrow('Network error');
    });
  });

  describe('Symbol Normalization Edge Cases', () => {
    beforeEach(() => {
      vi.mocked(mockClient.get).mockResolvedValue([]);
    });

    it('should handle already uppercase symbols', async () => {
      await analyst.getEstimates('AAPL');
      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/analyst-estimates',
        expect.objectContaining({
          searchParams: expect.objectContaining({ symbol: 'AAPL' })
        })
      );
    });

    it('should handle lowercase symbols', async () => {
      await analyst.getEstimates('aapl');
      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/analyst-estimates',
        expect.objectContaining({
          searchParams: expect.objectContaining({ symbol: 'AAPL' })
        })
      );
    });

    it('should handle mixed case symbols', async () => {
      await analyst.getEstimates('AaPl');
      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/analyst-estimates',
        expect.objectContaining({
          searchParams: expect.objectContaining({ symbol: 'AAPL' })
        })
      );
    });

    it('should handle symbols with special characters', async () => {
      await analyst.getEstimates('BRK.B');
      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/analyst-estimates',
        expect.objectContaining({
          searchParams: expect.objectContaining({ symbol: 'BRK.B' })
        })
      );
    });

    it('should handle symbols with hyphens', async () => {
      await analyst.getEstimates('some-etf');
      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/analyst-estimates',
        expect.objectContaining({
          searchParams: expect.objectContaining({ symbol: 'SOME-ETF' })
        })
      );
    });
  });

  describe('Period Handling', () => {
    beforeEach(() => {
      vi.mocked(mockClient.get).mockResolvedValue([]);
    });

    it('should default to annual period', async () => {
      await analyst.getEstimates('AAPL');
      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/analyst-estimates',
        expect.objectContaining({
          searchParams: expect.objectContaining({ period: 'annual' })
        })
      );
    });

    it('should accept annual period explicitly', async () => {
      await analyst.getEstimates('AAPL', 'annual');
      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/analyst-estimates',
        expect.objectContaining({
          searchParams: expect.objectContaining({ period: 'annual' })
        })
      );
    });

    it('should accept quarter period', async () => {
      await analyst.getEstimates('AAPL', 'quarter');
      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/analyst-estimates',
        expect.objectContaining({
          searchParams: expect.objectContaining({ period: 'quarter' })
        })
      );
    });

    it('should combine period with limit', async () => {
      await analyst.getEstimates('AAPL', 'quarter', 5);
      expect(mockClient.get).toHaveBeenCalledWith('v3/analyst-estimates', {
        searchParams: {
          symbol: 'AAPL',
        period: 'quarter',
        limit: 5,
      },
      }
);
    });
  });

  describe('Optional Parameters', () => {
    beforeEach(() => {
      vi.mocked(mockClient.get).mockResolvedValue([]);
    });

    it('should omit limit when undefined', async () => {
      await analyst.getEstimates('AAPL', 'annual', undefined);
      const call = vi.mocked(mockClient.get).mock.calls[0];
      expect(call[1]).not.toHaveProperty('limit');
    });

    it('should omit limit when 0', async () => {
      await analyst.getGrades('AAPL', 0);
      const call = vi.mocked(mockClient.get).mock.calls[0];
      expect(call[1]).not.toHaveProperty('limit');
    });

    it('should include limit when positive number', async () => {
      await analyst.getGrades('AAPL', 10);
      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/grade',
        expect.objectContaining({
          searchParams: expect.objectContaining({ limit: 10, symbol: 'AAPL' })
        })
      );
    });

    it('should handle limit value of 1', async () => {
      await analyst.getHistoricalGrades('AAPL', 1);
      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/historical-rating/AAPL',
        expect.objectContaining({
          searchParams: expect.objectContaining({ limit: 1 })
        })
      );
    });
  });

  describe('Return Value Extraction', () => {
    it('should extract first element for getPriceTargetSummary', async () => {
      const mockData = [{ symbol: 'AAPL' }] as PriceTargetSummary[];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      const result = await analyst.getPriceTargetSummary('AAPL');

      expect(result).toEqual(mockData[0]);
      expect(result).not.toBeInstanceOf(Array);
    });

    it('should extract first element for getPriceTargetConsensus', async () => {
      const mockData = [{ symbol: 'AAPL' }] as PriceTargetConsensus[];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      const result = await analyst.getPriceTargetConsensus('AAPL');

      expect(result).toEqual(mockData[0]);
      expect(result).not.toBeInstanceOf(Array);
    });

    it('should extract first element for getUpgradesDowngradesConsensus', async () => {
      const mockData = [{ symbol: 'AAPL' }] as UpgradesDowngradesConsensus[];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      const result = await analyst.getUpgradesDowngradesConsensus('AAPL');

      expect(result).toEqual(mockData[0]);
      expect(result).not.toBeInstanceOf(Array);
    });

    it('should extract first element for getRatingsSnapshot', async () => {
      const mockData = [{ symbol: 'AAPL' }] as AnalystRecommendation[];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      const result = await analyst.getRatingsSnapshot('AAPL');

      expect(result).toEqual(mockData[0]);
      expect(result).not.toBeInstanceOf(Array);
    });

    it('should return array for getEstimates', async () => {
      const mockData = [{ symbol: 'AAPL' }] as AnalystEstimate[];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      const result = await analyst.getEstimates('AAPL');

      expect(result).toEqual(mockData);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should return array for getPriceTargets', async () => {
      const mockData = [{ symbol: 'AAPL' }] as PriceTarget[];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      const result = await analyst.getPriceTargets('AAPL');

      expect(result).toEqual(mockData);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should return array for getRecommendations', async () => {
      const mockData = [{ symbol: 'AAPL' }] as AnalystRecommendation[];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      const result = await analyst.getRecommendations('AAPL');

      expect(result).toEqual(mockData);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should return array for getGrades', async () => {
      const mockData = [{ symbol: 'AAPL' }] as StockGrade[];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      const result = await analyst.getGrades('AAPL');

      expect(result).toEqual(mockData);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should return array for getHistoricalGrades', async () => {
      const mockData = [{ symbol: 'AAPL' }] as StockGrade[];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      const result = await analyst.getHistoricalGrades('AAPL');

      expect(result).toEqual(mockData);
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
