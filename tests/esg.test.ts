import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ESGResource } from '../src/resources/esg.js';
import type { FMPClient } from '../src/client.js';
import type { ESGData, ESGRating, ESGBenchmark } from '../src/types/index.js';
import {
  FMPAPIError,
  FMPAPIError,
  FMPAPIError,
} from '../src/errors/index.js';

describe('ESGResource', () => {
  let mockClient: FMPClient;
  let esgResource: ESGResource;

  beforeEach(() => {
    // Create a mock client with a get method
    mockClient = {
      get: vi.fn(),
    } as unknown as FMPClient;

    esgResource = new ESGResource(mockClient);
  });

  describe('getESGData', () => {
    it('should fetch ESG data for a valid symbol', async () => {
      const mockResponse: ESGData[] = [
        {
          symbol: 'AAPL',
          cik: '0000320193',
          companyName: 'Apple Inc.',
          formType: '10-K',
          filingDate: '2024-01-15',
          acceptanceDate: '2024-01-15T16:30:00.000Z',
          date: '2024-01-15',
          environmentalScore: 85.5,
          socialScore: 78.3,
          governanceScore: 92.1,
          ESGScore: 85.3,
          url: 'https://www.sec.gov/cgi-bin/browse-edgar',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      const result = await esgResource.getESGData('AAPL');

      expect(mockClient.get).toHaveBeenCalledWith(
        'v4/esg-environmental-social-governance-data',
        { searchParams: {   symbol: 'AAPL' }, }

      );
      expect(result).toEqual(mockResponse);
    });

    it('should normalize lowercase symbol to uppercase', async () => {
      const mockResponse: ESGData[] = [
        {
          symbol: 'TSLA',
          cik: '0001318605',
          companyName: 'Tesla, Inc.',
          formType: '10-K',
          filingDate: '2024-02-10',
          acceptanceDate: '2024-02-10T18:00:00.000Z',
          date: '2024-02-10',
          environmentalScore: 72.8,
          socialScore: 65.4,
          governanceScore: 58.9,
          ESGScore: 65.7,
          url: 'https://www.sec.gov/cgi-bin/browse-edgar',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      await esgResource.getESGData('tsla');

      expect(mockClient.get).toHaveBeenCalledWith(
        'v4/esg-environmental-social-governance-data',
        { searchParams: {   symbol: 'TSLA' }, }

      );
    });

    it('should normalize mixed case symbol to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await esgResource.getESGData('MsFt');

      expect(mockClient.get).toHaveBeenCalledWith(
        'v4/esg-environmental-social-governance-data',
        { searchParams: {   symbol: 'MSFT' }, }

      );
    });

    it('should handle empty response', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      const result = await esgResource.getESGData('INVALID');

      expect(result).toEqual([]);
    });

    it('should handle API errors', async () => {
      const apiError = new FMPAPIError('API Error', 500, 'Internal Server Error');
      vi.mocked(mockClient.get).mockRejectedValue(apiError);

      await expect(esgResource.getESGData('AAPL')).rejects.toThrow(FMPAPIError);
      await expect(esgResource.getESGData('AAPL')).rejects.toThrow('API Error');
    });

    it('should handle authentication errors', async () => {
      const authError = new FMPAPIError('Invalid API key');
      vi.mocked(mockClient.get).mockRejectedValue(authError);

      await expect(esgResource.getESGData('AAPL')).rejects.toThrow(
        FMPAPIError
      );
    });

    it('should handle rate limit errors', async () => {
      const rateLimitError = new FMPAPIError('Rate limit exceeded');
      vi.mocked(mockClient.get).mockRejectedValue(rateLimitError);

      await expect(esgResource.getESGData('AAPL')).rejects.toThrow(
        FMPAPIError
      );
    });

    it('should return multiple ESG data entries', async () => {
      const mockResponse: ESGData[] = [
        {
          symbol: 'GOOGL',
          cik: '0001652044',
          companyName: 'Alphabet Inc.',
          formType: '10-K',
          filingDate: '2024-01-20',
          acceptanceDate: '2024-01-20T17:00:00.000Z',
          date: '2024-01-20',
          environmentalScore: 88.2,
          socialScore: 82.5,
          governanceScore: 89.7,
          ESGScore: 86.8,
          url: 'https://www.sec.gov/cgi-bin/browse-edgar',
        },
        {
          symbol: 'GOOGL',
          cik: '0001652044',
          companyName: 'Alphabet Inc.',
          formType: '10-K',
          filingDate: '2023-01-15',
          acceptanceDate: '2023-01-15T17:00:00.000Z',
          date: '2023-01-15',
          environmentalScore: 86.5,
          socialScore: 80.3,
          governanceScore: 88.1,
          ESGScore: 85.0,
          url: 'https://www.sec.gov/cgi-bin/browse-edgar',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      const result = await esgResource.getESGData('GOOGL');

      expect(result).toHaveLength(2);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getESGRatings', () => {
    it('should fetch ESG ratings for a valid symbol', async () => {
      const mockResponse: ESGRating[] = [
        {
          symbol: 'AAPL',
          cik: '0000320193',
          companyName: 'Apple Inc.',
          formType: '10-K',
          filingDate: '2024-01-15',
          acceptanceDate: '2024-01-15T16:30:00.000Z',
          date: '2024-01-15',
          ESGRiskRating: 'Low',
          industryRank: '15 out of 250',
          url: 'https://www.sec.gov/cgi-bin/browse-edgar',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      const result = await esgResource.getESGRatings('AAPL');

      expect(mockClient.get).toHaveBeenCalledWith(
        'v4/esg-environmental-social-governance-data-ratings',
        { searchParams: {   symbol: 'AAPL' }, }

      );
      expect(result).toEqual(mockResponse);
    });

    it('should normalize lowercase symbol to uppercase', async () => {
      const mockResponse: ESGRating[] = [
        {
          symbol: 'MSFT',
          cik: '0000789019',
          companyName: 'Microsoft Corporation',
          formType: '10-K',
          filingDate: '2024-02-01',
          acceptanceDate: '2024-02-01T17:30:00.000Z',
          date: '2024-02-01',
          ESGRiskRating: 'Low',
          industryRank: '8 out of 250',
          url: 'https://www.sec.gov/cgi-bin/browse-edgar',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      await esgResource.getESGRatings('msft');

      expect(mockClient.get).toHaveBeenCalledWith(
        'v4/esg-environmental-social-governance-data-ratings',
        { searchParams: {   symbol: 'MSFT' }, }

      );
    });

    it('should normalize mixed case symbol to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await esgResource.getESGRatings('GoOgL');

      expect(mockClient.get).toHaveBeenCalledWith(
        'v4/esg-environmental-social-governance-data-ratings',
        { searchParams: {   symbol: 'GOOGL' }, }

      );
    });

    it('should handle empty response', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      const result = await esgResource.getESGRatings('INVALID');

      expect(result).toEqual([]);
    });

    it('should handle API errors', async () => {
      const apiError = new FMPAPIError('Service unavailable', 503, 'Service Unavailable');
      vi.mocked(mockClient.get).mockRejectedValue(apiError);

      await expect(esgResource.getESGRatings('AAPL')).rejects.toThrow(FMPAPIError);
      await expect(esgResource.getESGRatings('AAPL')).rejects.toThrow(
        'Service unavailable'
      );
    });

    it('should handle authentication errors', async () => {
      const authError = new FMPAPIError('Invalid API key or unauthorized access');
      vi.mocked(mockClient.get).mockRejectedValue(authError);

      await expect(esgResource.getESGRatings('AAPL')).rejects.toThrow(
        FMPAPIError
      );
    });

    it('should handle rate limit errors', async () => {
      const rateLimitError = new FMPAPIError('Rate limit exceeded. Please try again later.');
      vi.mocked(mockClient.get).mockRejectedValue(rateLimitError);

      await expect(esgResource.getESGRatings('AAPL')).rejects.toThrow(
        FMPAPIError
      );
    });

    it('should return multiple ESG rating entries', async () => {
      const mockResponse: ESGRating[] = [
        {
          symbol: 'NVDA',
          cik: '0001045810',
          companyName: 'NVIDIA Corporation',
          formType: '10-K',
          filingDate: '2024-03-01',
          acceptanceDate: '2024-03-01T16:00:00.000Z',
          date: '2024-03-01',
          ESGRiskRating: 'Medium',
          industryRank: '45 out of 150',
          url: 'https://www.sec.gov/cgi-bin/browse-edgar',
        },
        {
          symbol: 'NVDA',
          cik: '0001045810',
          companyName: 'NVIDIA Corporation',
          formType: '10-K',
          filingDate: '2023-03-01',
          acceptanceDate: '2023-03-01T16:00:00.000Z',
          date: '2023-03-01',
          ESGRiskRating: 'Medium',
          industryRank: '52 out of 150',
          url: 'https://www.sec.gov/cgi-bin/browse-edgar',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      const result = await esgResource.getESGRatings('NVDA');

      expect(result).toHaveLength(2);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getESGBenchmark', () => {
    it('should fetch ESG benchmark data for a valid year', async () => {
      const mockResponse: ESGBenchmark[] = [
        {
          year: 2024,
          sector: 'Technology',
          environmentalScore: 82.5,
          socialScore: 75.8,
          governanceScore: 88.2,
          ESGScore: 82.2,
        },
        {
          year: 2024,
          sector: 'Healthcare',
          environmentalScore: 78.3,
          socialScore: 80.5,
          governanceScore: 85.7,
          ESGScore: 81.5,
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      const result = await esgResource.getESGBenchmark(2024);

      expect(mockClient.get).toHaveBeenCalledWith(
        'v4/esg-environmental-social-governance-sector-benchmark',
        { searchParams: {   year: 2024 }, }

      );
      expect(result).toEqual(mockResponse);
    });

    it('should fetch benchmark data for different years', async () => {
      const mockResponse2023: ESGBenchmark[] = [
        {
          year: 2023,
          sector: 'Technology',
          environmentalScore: 80.2,
          socialScore: 73.5,
          governanceScore: 86.8,
          ESGScore: 80.2,
        },
      ];

      const mockResponse2022: ESGBenchmark[] = [
        {
          year: 2022,
          sector: 'Technology',
          environmentalScore: 78.5,
          socialScore: 71.2,
          governanceScore: 84.5,
          ESGScore: 78.1,
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValueOnce(mockResponse2023);

      const result2023 = await esgResource.getESGBenchmark(2023);
      expect(mockClient.get).toHaveBeenCalledWith(
        'v4/esg-environmental-social-governance-sector-benchmark',
        { searchParams: {   year: 2023 }, }

      );
      expect(result2023).toEqual(mockResponse2023);

      vi.mocked(mockClient.get).mockResolvedValueOnce(mockResponse2022);

      const result2022 = await esgResource.getESGBenchmark(2022);
      expect(mockClient.get).toHaveBeenCalledWith(
        'v4/esg-environmental-social-governance-sector-benchmark',
        { searchParams: {   year: 2022 }, }

      );
      expect(result2022).toEqual(mockResponse2022);
    });

    it('should pass year parameter as number', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await esgResource.getESGBenchmark(2021);

      expect(mockClient.get).toHaveBeenCalledWith(
        'v4/esg-environmental-social-governance-sector-benchmark',
        { searchParams: {   year: 2021 }, }

      );
      expect(mockClient.get).toHaveBeenCalledTimes(1);
      const callArgs = vi.mocked(mockClient.get).mock.calls[0];
      expect(typeof callArgs[1]?.searchParams?.year).toBe('number');
    });

    it('should handle empty response', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      const result = await esgResource.getESGBenchmark(1999);

      expect(result).toEqual([]);
    });

    it('should handle API errors', async () => {
      const apiError = new FMPAPIError('Bad request', 400, 'Bad Request');
      vi.mocked(mockClient.get).mockRejectedValue(apiError);

      await expect(esgResource.getESGBenchmark(2024)).rejects.toThrow(FMPAPIError);
      await expect(esgResource.getESGBenchmark(2024)).rejects.toThrow('Bad request');
    });

    it('should handle authentication errors', async () => {
      const authError = new FMPAPIError('API key is required');
      vi.mocked(mockClient.get).mockRejectedValue(authError);

      await expect(esgResource.getESGBenchmark(2024)).rejects.toThrow(
        FMPAPIError
      );
    });

    it('should handle rate limit errors', async () => {
      const rateLimitError = new FMPAPIError();
      vi.mocked(mockClient.get).mockRejectedValue(rateLimitError);

      await expect(esgResource.getESGBenchmark(2024)).rejects.toThrow(
        FMPAPIError
      );
    });

    it('should return multiple sector benchmarks for the same year', async () => {
      const mockResponse: ESGBenchmark[] = [
        {
          year: 2024,
          sector: 'Technology',
          environmentalScore: 82.5,
          socialScore: 75.8,
          governanceScore: 88.2,
          ESGScore: 82.2,
        },
        {
          year: 2024,
          sector: 'Healthcare',
          environmentalScore: 78.3,
          socialScore: 80.5,
          governanceScore: 85.7,
          ESGScore: 81.5,
        },
        {
          year: 2024,
          sector: 'Financial Services',
          environmentalScore: 75.8,
          socialScore: 77.2,
          governanceScore: 90.5,
          ESGScore: 81.2,
        },
        {
          year: 2024,
          sector: 'Energy',
          environmentalScore: 65.2,
          socialScore: 68.5,
          governanceScore: 82.3,
          ESGScore: 72.0,
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      const result = await esgResource.getESGBenchmark(2024);

      expect(result).toHaveLength(4);
      expect(result).toEqual(mockResponse);
      expect(result.every((benchmark) => benchmark.year === 2024)).toBe(true);
    });

    it('should handle future years', async () => {
      const mockResponse: ESGBenchmark[] = [
        {
          year: 2030,
          sector: 'Technology',
          environmentalScore: 90.0,
          socialScore: 85.0,
          governanceScore: 95.0,
          ESGScore: 90.0,
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      const result = await esgResource.getESGBenchmark(2030);

      expect(mockClient.get).toHaveBeenCalledWith(
        'v4/esg-environmental-social-governance-sector-benchmark',
        { searchParams: {   year: 2030 }, }

      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle past years', async () => {
      const mockResponse: ESGBenchmark[] = [
        {
          year: 2015,
          sector: 'Technology',
          environmentalScore: 70.5,
          socialScore: 65.2,
          governanceScore: 78.8,
          ESGScore: 71.5,
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      const result = await esgResource.getESGBenchmark(2015);

      expect(mockClient.get).toHaveBeenCalledWith(
        'v4/esg-environmental-social-governance-sector-benchmark',
        { searchParams: {   year: 2015 }, }

      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('Error handling across all methods', () => {
    it('should propagate network errors for getESGData', async () => {
      const networkError = new Error('Network timeout');
      vi.mocked(mockClient.get).mockRejectedValue(networkError);

      await expect(esgResource.getESGData('AAPL')).rejects.toThrow('Network timeout');
    });

    it('should propagate network errors for getESGRatings', async () => {
      const networkError = new Error('Connection refused');
      vi.mocked(mockClient.get).mockRejectedValue(networkError);

      await expect(esgResource.getESGRatings('AAPL')).rejects.toThrow(
        'Connection refused'
      );
    });

    it('should propagate network errors for getESGBenchmark', async () => {
      const networkError = new Error('DNS resolution failed');
      vi.mocked(mockClient.get).mockRejectedValue(networkError);

      await expect(esgResource.getESGBenchmark(2024)).rejects.toThrow(
        'DNS resolution failed'
      );
    });
  });

  describe('Symbol normalization edge cases', () => {
    it('should handle symbols with special characters', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await esgResource.getESGData('BRK.B');

      expect(mockClient.get).toHaveBeenCalledWith(
        'v4/esg-environmental-social-governance-data',
        { searchParams: {   symbol: 'BRK.B' }, }

      );
    });

    it('should handle symbols with hyphens', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await esgResource.getESGRatings('BRK-B');

      expect(mockClient.get).toHaveBeenCalledWith(
        'v4/esg-environmental-social-governance-data-ratings',
        { searchParams: {   symbol: 'BRK-B' }, }

      );
    });

    it('should normalize symbols with whitespace', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await esgResource.getESGData('  aapl  ');

      expect(mockClient.get).toHaveBeenCalledWith(
        'v4/esg-environmental-social-governance-data',
        { searchParams: {   symbol: '  AAPL  ' }, }

      );
    });

    it('should handle empty string symbols', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await esgResource.getESGData('');

      expect(mockClient.get).toHaveBeenCalledWith(
        'v4/esg-environmental-social-governance-data',
        { searchParams: {   symbol: '' }, }

      );
    });
  });

  describe('Client integration', () => {
    it('should use the provided client instance for getESGData', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await esgResource.getESGData('AAPL');

      expect(mockClient.get).toHaveBeenCalledTimes(1);
    });

    it('should use the provided client instance for getESGRatings', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await esgResource.getESGRatings('AAPL');

      expect(mockClient.get).toHaveBeenCalledTimes(1);
    });

    it('should use the provided client instance for getESGBenchmark', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await esgResource.getESGBenchmark(2024);

      expect(mockClient.get).toHaveBeenCalledTimes(1);
    });

    it('should call client methods with correct endpoint paths', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await esgResource.getESGData('AAPL');
      expect(vi.mocked(mockClient.get).mock.calls[0][0]).toBe(
        'v4/esg-environmental-social-governance-data'
      );

      await esgResource.getESGRatings('AAPL');
      expect(vi.mocked(mockClient.get).mock.calls[1][0]).toBe(
        'v4/esg-environmental-social-governance-data-ratings'
      );

      await esgResource.getESGBenchmark(2024);
      expect(vi.mocked(mockClient.get).mock.calls[2][0]).toBe(
        'v4/esg-environmental-social-governance-sector-benchmark'
      );
    });
  });
});
