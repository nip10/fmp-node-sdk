import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ValuationResource } from '../src/resources/valuation.js';
import type { FMPClient } from '../src/client.js';
import type { DCFValuation, LeveredDCF, AdvancedDCF } from '../src/types/index.js';
import { FMPAPIError, FMPAPIError, FMPAPIError } from '../src/errors/index.js';

describe('ValuationResource', () => {
  let mockClient: FMPClient;
  let valuationResource: ValuationResource;

  beforeEach(() => {
    // Create a mock client with a mocked get method
    mockClient = {
      get: vi.fn(),
    } as unknown as FMPClient;

    valuationResource = new ValuationResource(mockClient);
  });

  describe('getDCF', () => {
    const mockDCFResponse: DCFValuation[] = [
      {
        symbol: 'AAPL',
        date: '2024-01-15',
        dcf: 185.42,
        'Stock Price': 182.68,
      },
    ];

    it('should fetch DCF valuation for a symbol', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockDCFResponse);

      const result = await valuationResource.getDCF('AAPL');

      expect(mockClient.get).toHaveBeenCalledWith('discounted-cash-flow', { searchParams: { symbol: 'AAPL' } });
      expect(result).toEqual(mockDCFResponse);
    });

    it('should normalize symbol to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockDCFResponse);

      await valuationResource.getDCF('aapl');

      expect(mockClient.get).toHaveBeenCalledWith('discounted-cash-flow', { searchParams: { symbol: 'AAPL' } });
    });

    it('should handle mixed case symbols', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockDCFResponse);

      await valuationResource.getDCF('AaPl');

      expect(mockClient.get).toHaveBeenCalledWith('discounted-cash-flow', { searchParams: { symbol: 'AAPL' } });
    });

    it('should handle symbols with special characters', async () => {
      const mockResponse: DCFValuation[] = [
        {
          symbol: 'BRK.B',
          date: '2024-01-15',
          dcf: 350.25,
          'Stock Price': 345.50,
        },
      ];
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      await valuationResource.getDCF('brk.b');

      expect(mockClient.get).toHaveBeenCalledWith('discounted-cash-flow', { searchParams: { symbol: 'BRK.B' } });
    });

    it('should return empty array for invalid symbol', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      const result = await valuationResource.getDCF('INVALID');

      expect(result).toEqual([]);
    });

    it('should throw FMPAPIError on API error', async () => {
      const error = new FMPAPIError('API Error', 500, 'Internal Server Error');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(valuationResource.getDCF('AAPL')).rejects.toThrow(FMPAPIError);
      await expect(valuationResource.getDCF('AAPL')).rejects.toThrow('API Error');
    });

    it('should throw FMPAPIError on auth error', async () => {
      const error = new FMPAPIError('Invalid API key');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(valuationResource.getDCF('AAPL')).rejects.toThrow(FMPAPIError);
      await expect(valuationResource.getDCF('AAPL')).rejects.toThrow('Invalid API key');
    });

    it('should throw FMPAPIError on rate limit', async () => {
      const error = new FMPAPIError('Rate limit exceeded');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(valuationResource.getDCF('AAPL')).rejects.toThrow(FMPAPIError);
      await expect(valuationResource.getDCF('AAPL')).rejects.toThrow('Rate limit exceeded');
    });

    it('should handle network errors', async () => {
      const error = new FMPAPIError('Network error');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(valuationResource.getDCF('AAPL')).rejects.toThrow(FMPAPIError);
    });

    it('should handle empty symbol', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      const result = await valuationResource.getDCF('');

      expect(mockClient.get).toHaveBeenCalledWith('discounted-cash-flow', { searchParams: { symbol: '' } });
      expect(result).toEqual([]);
    });
  });

  describe('getLeveredDCF', () => {
    const mockLeveredDCFResponse: LeveredDCF[] = [
      {
        symbol: 'MSFT',
        date: '2024-01-15',
        dcf: 412.35,
        'Stock Price': 405.22,
      },
    ];

    it('should fetch levered DCF valuation for a symbol', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockLeveredDCFResponse);

      const result = await valuationResource.getLeveredDCF('MSFT');

      expect(mockClient.get).toHaveBeenCalledWith(
        'levered-discounted-cash-flow',
        { searchParams: { symbol: 'MSFT' } }
      );
      expect(result).toEqual(mockLeveredDCFResponse);
    });

    it('should normalize symbol to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockLeveredDCFResponse);

      await valuationResource.getLeveredDCF('msft');

      expect(mockClient.get).toHaveBeenCalledWith(
        'levered-discounted-cash-flow',
        { searchParams: { symbol: 'MSFT' } }
      );
    });

    it('should handle mixed case symbols', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockLeveredDCFResponse);

      await valuationResource.getLeveredDCF('MsFt');

      expect(mockClient.get).toHaveBeenCalledWith(
        'levered-discounted-cash-flow',
        { searchParams: { symbol: 'MSFT' } }
      );
    });

    it('should handle symbols with hyphens', async () => {
      const mockResponse: LeveredDCF[] = [
        {
          symbol: 'SPY-L',
          date: '2024-01-15',
          dcf: 450.00,
          'Stock Price': 448.20,
        },
      ];
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      await valuationResource.getLeveredDCF('spy-l');

      expect(mockClient.get).toHaveBeenCalledWith(
        'levered-discounted-cash-flow',
        { searchParams: { symbol: 'SPY-L' } }
      );
    });

    it('should return empty array for invalid symbol', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      const result = await valuationResource.getLeveredDCF('INVALID');

      expect(result).toEqual([]);
    });

    it('should throw FMPAPIError on API error', async () => {
      const error = new FMPAPIError('Server error', 503, 'Service Unavailable');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(valuationResource.getLeveredDCF('MSFT')).rejects.toThrow(FMPAPIError);
      await expect(valuationResource.getLeveredDCF('MSFT')).rejects.toThrow('Server error');
    });

    it('should throw FMPAPIError on auth error', async () => {
      const error = new FMPAPIError('Unauthorized');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(valuationResource.getLeveredDCF('MSFT')).rejects.toThrow(
        FMPAPIError
      );
    });

    it('should throw FMPAPIError on rate limit', async () => {
      const error = new FMPAPIError();
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(valuationResource.getLeveredDCF('MSFT')).rejects.toThrow(FMPAPIError);
    });

    it('should handle empty symbol', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      const result = await valuationResource.getLeveredDCF('');

      expect(mockClient.get).toHaveBeenCalledWith(
        'levered-discounted-cash-flow',
        { searchParams: { symbol: '' } }
      );
      expect(result).toEqual([]);
    });

    it('should handle whitespace in symbol', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockLeveredDCFResponse);

      await valuationResource.getLeveredDCF('  msft  ');

      expect(mockClient.get).toHaveBeenCalledWith(
        'levered-discounted-cash-flow',
        { searchParams: { symbol: '  MSFT  ' } }
      );
    });
  });

  describe('getAdvancedDCF', () => {
    const mockAdvancedDCFResponse: AdvancedDCF[] = [
      {
        symbol: 'GOOGL',
        date: '2024-01-15',
        stockPrice: 140.25,
        dcf: 145.50,
        wacc: 0.085,
        revenues: 282836000000,
        revenueGrowthRate: 0.13,
        operatingCashFlow: 91495000000,
        operatingExpense: 53873000000,
        capitalExpenditure: 31485000000,
        netIncome: 59972000000,
        freeCashFlow: 60010000000,
        operatingCashFlowGrowthRate: 0.12,
        freeCashFlowGrowthRate: 0.11,
        longTermDebt: 14817000000,
        totalDebt: 14817000000,
        cashAndCashEquivalents: 21879000000,
        shareholdersEquity: 256144000000,
        marketCapitalization: 1750000000000,
        riskFreeRate: 0.045,
        beta: 1.08,
      },
    ];

    it('should fetch advanced DCF valuation for a symbol', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockAdvancedDCFResponse);

      const result = await valuationResource.getAdvancedDCF('GOOGL');

      expect(mockClient.get).toHaveBeenCalledWith('custom-discounted-cash-flow', {
        searchParams: { symbol: 'GOOGL' }
      });
      expect(result).toEqual(mockAdvancedDCFResponse);
    });

    it('should normalize symbol to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockAdvancedDCFResponse);

      await valuationResource.getAdvancedDCF('googl');

      expect(mockClient.get).toHaveBeenCalledWith('custom-discounted-cash-flow', {
        searchParams: { symbol: 'GOOGL' }
      });
    });

    it('should handle mixed case symbols', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockAdvancedDCFResponse);

      await valuationResource.getAdvancedDCF('GoOgL');

      expect(mockClient.get).toHaveBeenCalledWith('custom-discounted-cash-flow', {
        searchParams: { symbol: 'GOOGL' }
      });
    });

    it('should handle international symbols', async () => {
      const mockResponse: AdvancedDCF[] = [
        {
          symbol: '0700.HK',
          date: '2024-01-15',
          stockPrice: 350.00,
          dcf: 365.00,
          wacc: 0.09,
          revenues: 500000000000,
          revenueGrowthRate: 0.15,
          operatingCashFlow: 150000000000,
          operatingExpense: 100000000000,
          capitalExpenditure: 50000000000,
          netIncome: 100000000000,
          freeCashFlow: 100000000000,
          operatingCashFlowGrowthRate: 0.14,
          freeCashFlowGrowthRate: 0.13,
          longTermDebt: 50000000000,
          totalDebt: 50000000000,
          cashAndCashEquivalents: 100000000000,
          shareholdersEquity: 400000000000,
          marketCapitalization: 3500000000000,
          riskFreeRate: 0.04,
          beta: 1.15,
        },
      ];
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      await valuationResource.getAdvancedDCF('0700.hk');

      expect(mockClient.get).toHaveBeenCalledWith('custom-discounted-cash-flow', {
        searchParams: { symbol: '0700.HK' }
      });
    });

    it('should return empty array for invalid symbol', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      const result = await valuationResource.getAdvancedDCF('INVALID');

      expect(result).toEqual([]);
    });

    it('should throw FMPAPIError on API error', async () => {
      const error = new FMPAPIError('Bad request', 400, 'Bad Request');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(valuationResource.getAdvancedDCF('GOOGL')).rejects.toThrow(FMPAPIError);
      await expect(valuationResource.getAdvancedDCF('GOOGL')).rejects.toThrow('Bad request');
    });

    it('should throw FMPAPIError on auth error', async () => {
      const error = new FMPAPIError('API key expired');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(valuationResource.getAdvancedDCF('GOOGL')).rejects.toThrow(
        FMPAPIError
      );
      await expect(valuationResource.getAdvancedDCF('GOOGL')).rejects.toThrow('API key expired');
    });

    it('should throw FMPAPIError on rate limit', async () => {
      const error = new FMPAPIError('Too many requests');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(valuationResource.getAdvancedDCF('GOOGL')).rejects.toThrow(FMPAPIError);
      await expect(valuationResource.getAdvancedDCF('GOOGL')).rejects.toThrow(
        'Too many requests'
      );
    });

    it('should handle timeout errors', async () => {
      const error = new FMPAPIError('Request timeout');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(valuationResource.getAdvancedDCF('GOOGL')).rejects.toThrow(FMPAPIError);
      await expect(valuationResource.getAdvancedDCF('GOOGL')).rejects.toThrow('Request timeout');
    });

    it('should handle empty symbol', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      const result = await valuationResource.getAdvancedDCF('');

      expect(mockClient.get).toHaveBeenCalledWith('custom-discounted-cash-flow', {
        searchParams: { symbol: '' }
      });
      expect(result).toEqual([]);
    });

    it('should verify response structure', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockAdvancedDCFResponse);

      const result = await valuationResource.getAdvancedDCF('GOOGL');

      expect(result[0]).toHaveProperty('symbol');
      expect(result[0]).toHaveProperty('date');
      expect(result[0]).toHaveProperty('stockPrice');
      expect(result[0]).toHaveProperty('dcf');
      expect(result[0]).toHaveProperty('wacc');
      expect(result[0]).toHaveProperty('revenues');
      expect(result[0]).toHaveProperty('revenueGrowthRate');
      expect(result[0]).toHaveProperty('operatingCashFlow');
      expect(result[0]).toHaveProperty('freeCashFlow');
      expect(result[0]).toHaveProperty('beta');
    });
  });

  describe('getHistoricalDailyDCF', () => {
    const mockHistoricalDailyDCFResponse: DCFValuation[] = [
      {
        symbol: 'TSLA',
        date: '2024-01-15',
        dcf: 245.50,
        'Stock Price': 240.25,
      },
      {
        symbol: 'TSLA',
        date: '2024-01-14',
        dcf: 243.20,
        'Stock Price': 238.75,
      },
    ];

    it('should fetch historical daily DCF without limit', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockHistoricalDailyDCFResponse);

      const result = await valuationResource.getHistoricalDailyDCF('TSLA');

      expect(mockClient.get).toHaveBeenCalledWith(
        'historical-daily-discounted-cash-flow',
        { searchParams: { symbol: 'TSLA' } }
      );
      expect(result).toEqual(mockHistoricalDailyDCFResponse);
    });

    it('should fetch historical daily DCF with limit', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockHistoricalDailyDCFResponse);

      const result = await valuationResource.getHistoricalDailyDCF('TSLA', 10);

      expect(mockClient.get).toHaveBeenCalledWith(
        'historical-daily-discounted-cash-flow',
        { searchParams: { symbol: 'TSLA', limit: 10 } }
      );
      expect(result).toEqual(mockHistoricalDailyDCFResponse);
    });

    it('should normalize symbol to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockHistoricalDailyDCFResponse);

      await valuationResource.getHistoricalDailyDCF('tsla', 5);

      expect(mockClient.get).toHaveBeenCalledWith(
        'historical-daily-discounted-cash-flow',
        { searchParams: { symbol: 'TSLA', limit: 5 } }
      );
    });

    it('should handle limit of 1', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([mockHistoricalDailyDCFResponse[0]]);

      const result = await valuationResource.getHistoricalDailyDCF('TSLA', 1);

      expect(mockClient.get).toHaveBeenCalledWith(
        'historical-daily-discounted-cash-flow',
        { searchParams: { symbol: 'TSLA', limit: 1 } }
      );
      expect(result).toHaveLength(1);
    });

    it('should handle large limit values', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockHistoricalDailyDCFResponse);

      await valuationResource.getHistoricalDailyDCF('TSLA', 1000);

      expect(mockClient.get).toHaveBeenCalledWith(
        'historical-daily-discounted-cash-flow',
        { searchParams: { symbol: 'TSLA', limit: 1000 } }
      );
    });

    it('should not include limit parameter when undefined', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockHistoricalDailyDCFResponse);

      await valuationResource.getHistoricalDailyDCF('TSLA', undefined);

      expect(mockClient.get).toHaveBeenCalledWith(
        'historical-daily-discounted-cash-flow',
        { searchParams: { symbol: 'TSLA' } }
      );
    });

    it('should throw FMPAPIError on API error', async () => {
      const error = new FMPAPIError('Not found', 404, 'Not Found');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(valuationResource.getHistoricalDailyDCF('TSLA')).rejects.toThrow(FMPAPIError);
    });
  });

  describe('getHistoricalDCF', () => {
    const mockHistoricalDCFResponse: DCFValuation[] = [
      {
        symbol: 'NVDA',
        date: '2023-12-31',
        dcf: 520.00,
        'Stock Price': 495.00,
      },
      {
        symbol: 'NVDA',
        date: '2022-12-31',
        dcf: 350.00,
        'Stock Price': 330.00,
      },
    ];

    it('should fetch annual historical DCF by default', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockHistoricalDCFResponse);

      const result = await valuationResource.getHistoricalDCF('NVDA');

      expect(mockClient.get).toHaveBeenCalledWith(
        'historical-discounted-cash-flow-statement',
        { searchParams: { symbol: 'NVDA', period: 'annual' } }
      );
      expect(result).toEqual(mockHistoricalDCFResponse);
    });

    it('should fetch quarterly historical DCF', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockHistoricalDCFResponse);

      const result = await valuationResource.getHistoricalDCF('NVDA', 'quarter');

      expect(mockClient.get).toHaveBeenCalledWith(
        'historical-discounted-cash-flow-statement',
        { searchParams: { symbol: 'NVDA', period: 'quarter' } }
      );
      expect(result).toEqual(mockHistoricalDCFResponse);
    });

    it('should fetch annual historical DCF with limit', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockHistoricalDCFResponse);

      const result = await valuationResource.getHistoricalDCF('NVDA', 'annual', 5);

      expect(mockClient.get).toHaveBeenCalledWith(
        'historical-discounted-cash-flow-statement',
        { searchParams: { symbol: 'NVDA', period: 'annual', limit: 5 } }
      );
      expect(result).toEqual(mockHistoricalDCFResponse);
    });

    it('should fetch quarterly historical DCF with limit', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockHistoricalDCFResponse);

      const result = await valuationResource.getHistoricalDCF('NVDA', 'quarter', 10);

      expect(mockClient.get).toHaveBeenCalledWith(
        'historical-discounted-cash-flow-statement',
        { searchParams: { symbol: 'NVDA', period: 'quarter', limit: 10 } }
      );
      expect(result).toEqual(mockHistoricalDCFResponse);
    });

    it('should normalize symbol to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockHistoricalDCFResponse);

      await valuationResource.getHistoricalDCF('nvda', 'quarter', 3);

      expect(mockClient.get).toHaveBeenCalledWith(
        'historical-discounted-cash-flow-statement',
        { searchParams: { symbol: 'NVDA', period: 'quarter', limit: 3 } }
      );
    });

    it('should not include limit parameter when undefined', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockHistoricalDCFResponse);

      await valuationResource.getHistoricalDCF('NVDA', 'annual', undefined);

      expect(mockClient.get).toHaveBeenCalledWith(
        'historical-discounted-cash-flow-statement',
        { searchParams: { symbol: 'NVDA', period: 'annual' } }
      );
    });

    it('should handle limit of 1', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([mockHistoricalDCFResponse[0]]);

      const result = await valuationResource.getHistoricalDCF('NVDA', 'annual', 1);

      expect(result).toHaveLength(1);
    });

    it('should throw FMPAPIError on API error', async () => {
      const error = new FMPAPIError('Invalid period', 400, 'Bad Request');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(valuationResource.getHistoricalDCF('NVDA', 'annual')).rejects.toThrow(
        FMPAPIError
      );
    });

    it('should throw FMPAPIError on auth error', async () => {
      const error = new FMPAPIError();
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(valuationResource.getHistoricalDCF('NVDA')).rejects.toThrow(
        FMPAPIError
      );
    });

    it('should return empty array for invalid symbol', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      const result = await valuationResource.getHistoricalDCF('INVALID');

      expect(result).toEqual([]);
    });
  });

  describe('Symbol Normalization Edge Cases', () => {
    it('should handle symbols with trailing spaces in getDCF', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await valuationResource.getDCF('AAPL  ');

      expect(mockClient.get).toHaveBeenCalledWith('discounted-cash-flow', { searchParams: { symbol: 'AAPL  ' } });
    });

    it('should handle symbols with leading spaces in getLeveredDCF', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await valuationResource.getLeveredDCF('  MSFT');

      expect(mockClient.get).toHaveBeenCalledWith('levered-discounted-cash-flow', {
        searchParams: { symbol: '  MSFT' }
      });
    });

    it('should handle numeric symbols', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await valuationResource.getAdvancedDCF('0700');

      expect(mockClient.get).toHaveBeenCalledWith('custom-discounted-cash-flow', {
        searchParams: { symbol: '0700' }
      });
    });

    it('should handle very long symbols', async () => {
      const longSymbol = 'A'.repeat(50);
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await valuationResource.getDCF(longSymbol.toLowerCase());

      expect(mockClient.get).toHaveBeenCalledWith(
        'discounted-cash-flow',
        { searchParams: { symbol: longSymbol.toUpperCase() } }
      );
    });
  });

  describe('Error Handling Consistency', () => {
    it('should propagate errors consistently across all methods', async () => {
      const error = new FMPAPIError('Consistent error');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(valuationResource.getDCF('AAPL')).rejects.toThrow('Consistent error');
      await expect(valuationResource.getLeveredDCF('AAPL')).rejects.toThrow('Consistent error');
      await expect(valuationResource.getAdvancedDCF('AAPL')).rejects.toThrow('Consistent error');
      await expect(valuationResource.getHistoricalDailyDCF('AAPL')).rejects.toThrow(
        'Consistent error'
      );
      await expect(valuationResource.getHistoricalDCF('AAPL')).rejects.toThrow(
        'Consistent error'
      );
    });

    it('should handle rate limit errors consistently', async () => {
      const error = new FMPAPIError();
      vi.mocked(mockClient.get).mockRejectedValue(error);

      const methods = [
        () => valuationResource.getDCF('AAPL'),
        () => valuationResource.getLeveredDCF('AAPL'),
        () => valuationResource.getAdvancedDCF('AAPL'),
        () => valuationResource.getHistoricalDailyDCF('AAPL'),
        () => valuationResource.getHistoricalDCF('AAPL'),
      ];

      for (const method of methods) {
        await expect(method()).rejects.toThrow(FMPAPIError);
      }
    });

    it('should handle authentication errors consistently', async () => {
      const error = new FMPAPIError('Invalid API key');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      const methods = [
        () => valuationResource.getDCF('AAPL'),
        () => valuationResource.getLeveredDCF('AAPL'),
        () => valuationResource.getAdvancedDCF('AAPL'),
        () => valuationResource.getHistoricalDailyDCF('AAPL'),
        () => valuationResource.getHistoricalDCF('AAPL'),
      ];

      for (const method of methods) {
        await expect(method()).rejects.toThrow(FMPAPIError);
        await expect(method()).rejects.toThrow('Invalid API key');
      }
    });
  });

  describe('Response Type Validation', () => {
    it('should return correct type for getDCF', async () => {
      const mockResponse: DCFValuation[] = [
        {
          symbol: 'AAPL',
          date: '2024-01-15',
          dcf: 185.42,
          'Stock Price': 182.68,
        },
      ];
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      const result = await valuationResource.getDCF('AAPL');

      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toHaveProperty('symbol');
      expect(result[0]).toHaveProperty('date');
      expect(result[0]).toHaveProperty('dcf');
      expect(result[0]).toHaveProperty('Stock Price');
    });

    it('should return correct type for getLeveredDCF', async () => {
      const mockResponse: LeveredDCF[] = [
        {
          symbol: 'MSFT',
          date: '2024-01-15',
          dcf: 412.35,
          'Stock Price': 405.22,
        },
      ];
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      const result = await valuationResource.getLeveredDCF('MSFT');

      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toHaveProperty('symbol');
      expect(result[0]).toHaveProperty('date');
      expect(result[0]).toHaveProperty('dcf');
      expect(result[0]).toHaveProperty('Stock Price');
    });

    it('should return correct type for getAdvancedDCF', async () => {
      const mockResponse: AdvancedDCF[] = [
        {
          symbol: 'GOOGL',
          date: '2024-01-15',
          stockPrice: 140.25,
          dcf: 145.50,
          wacc: 0.085,
          revenues: 282836000000,
          revenueGrowthRate: 0.13,
          operatingCashFlow: 91495000000,
          operatingExpense: 53873000000,
          capitalExpenditure: 31485000000,
          netIncome: 59972000000,
          freeCashFlow: 60010000000,
          operatingCashFlowGrowthRate: 0.12,
          freeCashFlowGrowthRate: 0.11,
          longTermDebt: 14817000000,
          totalDebt: 14817000000,
          cashAndCashEquivalents: 21879000000,
          shareholdersEquity: 256144000000,
          marketCapitalization: 1750000000000,
          riskFreeRate: 0.045,
          beta: 1.08,
        },
      ];
      vi.mocked(mockClient.get).mockResolvedValue(mockResponse);

      const result = await valuationResource.getAdvancedDCF('GOOGL');

      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toHaveProperty('symbol');
      expect(result[0]).toHaveProperty('stockPrice');
      expect(result[0]).toHaveProperty('wacc');
      expect(result[0]).toHaveProperty('beta');
    });
  });

  describe('Multiple Method Calls', () => {
    it('should handle multiple sequential calls', async () => {
      const mockDCF: DCFValuation[] = [
        { symbol: 'AAPL', date: '2024-01-15', dcf: 185.42, 'Stock Price': 182.68 },
      ];
      const mockLevered: LeveredDCF[] = [
        { symbol: 'MSFT', date: '2024-01-15', dcf: 412.35, 'Stock Price': 405.22 },
      ];

      vi.mocked(mockClient.get)
        .mockResolvedValueOnce(mockDCF)
        .mockResolvedValueOnce(mockLevered);

      const result1 = await valuationResource.getDCF('AAPL');
      const result2 = await valuationResource.getLeveredDCF('MSFT');

      expect(result1).toEqual(mockDCF);
      expect(result2).toEqual(mockLevered);
      expect(mockClient.get).toHaveBeenCalledTimes(2);
    });

    it('should reset mock between tests', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await valuationResource.getDCF('AAPL');

      expect(mockClient.get).toHaveBeenCalledTimes(1);
    });
  });
});
