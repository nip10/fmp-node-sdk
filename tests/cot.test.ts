import { describe, it, expect, vi, beforeEach } from 'vitest';
import { COTResource } from '../src/resources/cot.js';
import type { FMPClient } from '../src/client.js';
import type { COTReport, COTAnalysis, COTSymbol } from '../src/types/index.js';
import { FMPAPIError, FMPAPIError, FMPAPIError } from '../src/errors/index.js';

describe('COTResource', () => {
  let mockClient: FMPClient;
  let cotResource: COTResource;

  beforeEach(() => {
    // Create a mock FMPClient with a mocked get method
    mockClient = {
      get: vi.fn(),
    } as unknown as FMPClient;

    cotResource = new COTResource(mockClient);
  });

  describe('getReport', () => {
    const mockReportData: COTReport[] = [
      {
        symbol: 'GC',
        name: 'GOLD - COMMODITY EXCHANGE INC.',
        date: '2024-01-02',
        short_name: 'GOLD',
        exchange: 'COMEX',
        current_long_marketmaker: 123456,
        current_short_marketmaker: 98765,
        current_long_otherreportables: 234567,
        current_short_otherreportables: 187654,
        current_long_nonreportables: 345678,
        current_short_nonreportables: 276543,
        change_long_marketmaker: 1234,
        change_short_marketmaker: -987,
        change_long_otherreportables: 2345,
        change_short_otherreportables: -1876,
        change_long_nonreportables: 3456,
        change_short_nonreportables: -2765,
        pct_long_marketmaker: 15.5,
        pct_short_marketmaker: 12.3,
        pct_long_otherreportables: 29.4,
        pct_short_otherreportables: 23.5,
        pct_long_nonreportables: 43.3,
        pct_short_nonreportables: 34.6,
      },
    ];

    it('should fetch COT report for a symbol', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockReportData);

      const result = await cotResource.getReport('GC');

      expect(mockClient.get).toHaveBeenCalledWith('v4/commitment_of_traders_report', {
        searchParams: {
          symbol: 'GC',
      },
      }
);
      expect(result).toEqual(mockReportData);
    });

    it('should uppercase the symbol', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockReportData);

      await cotResource.getReport('gc');

      expect(mockClient.get).toHaveBeenCalledWith('v4/commitment_of_traders_report', {
        searchParams: {
          symbol: 'GC',
      },
      }
);
    });

    it('should fetch COT report with from date', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockReportData);

      const result = await cotResource.getReport('GC', '2024-01-01');

      expect(mockClient.get).toHaveBeenCalledWith('v4/commitment_of_traders_report', {
        searchParams: {
          symbol: 'GC',
        from: '2024-01-01',
      },
      }
);
      expect(result).toEqual(mockReportData);
    });

    it('should fetch COT report with to date', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockReportData);

      const result = await cotResource.getReport('GC', undefined, '2024-12-31');

      expect(mockClient.get).toHaveBeenCalledWith('v4/commitment_of_traders_report', {
        searchParams: {
          symbol: 'GC',
        to: '2024-12-31',
      },
      }
);
      expect(result).toEqual(mockReportData);
    });

    it('should fetch COT report with date range', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockReportData);

      const result = await cotResource.getReport('GC', '2024-01-01', '2024-12-31');

      expect(mockClient.get).toHaveBeenCalledWith('v4/commitment_of_traders_report', {
        searchParams: {
          symbol: 'GC',
        from: '2024-01-01',
        to: '2024-12-31',
      },
      }
);
      expect(result).toEqual(mockReportData);
    });

    it('should return empty array when no data is available', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      const result = await cotResource.getReport('INVALID');

      expect(result).toEqual([]);
    });

    it('should handle multiple reports in response', async () => {
      const multipleReports: COTReport[] = [
        { ...mockReportData[0], date: '2024-01-02' },
        { ...mockReportData[0], date: '2024-01-09' },
        { ...mockReportData[0], date: '2024-01-16' },
      ];
      vi.mocked(mockClient.get).mockResolvedValue(multipleReports);

      const result = await cotResource.getReport('GC', '2024-01-01', '2024-01-31');

      expect(result).toHaveLength(3);
      expect(result).toEqual(multipleReports);
    });

    it('should throw FMPAPIError on API error', async () => {
      const apiError = new FMPAPIError('Internal Server Error', 500, 'Internal Server Error');
      vi.mocked(mockClient.get).mockRejectedValue(apiError);

      await expect(cotResource.getReport('GC')).rejects.toThrow(FMPAPIError);
      await expect(cotResource.getReport('GC')).rejects.toThrow('Internal Server Error');
    });

    it('should throw FMPAPIError on auth error', async () => {
      const authError = new FMPAPIError('Invalid API key');
      vi.mocked(mockClient.get).mockRejectedValue(authError);

      await expect(cotResource.getReport('GC')).rejects.toThrow(FMPAPIError);
      await expect(cotResource.getReport('GC')).rejects.toThrow('Invalid API key');
    });

    it('should throw FMPAPIError on rate limit', async () => {
      const rateLimitError = new FMPAPIError('Rate limit exceeded');
      vi.mocked(mockClient.get).mockRejectedValue(rateLimitError);

      await expect(cotResource.getReport('GC')).rejects.toThrow(FMPAPIError);
      await expect(cotResource.getReport('GC')).rejects.toThrow('Rate limit exceeded');
    });
  });

  describe('getAnalysis', () => {
    const mockAnalysisData: COTAnalysis[] = [
      {
        symbol: 'CL',
        name: 'CRUDE OIL - NEW YORK MERCANTILE EXCHANGE',
        date: '2024-01-02',
        short_name: 'CRUDE OIL',
        exchange: 'NYMEX',
        netposition_marketmaker: 25000,
        netposition_otherreportables: 47000,
        netposition_nonreportables: 69000,
        change_netposition_marketmaker: 2500,
        change_netposition_otherreportables: 4700,
        change_netposition_nonreportables: 6900,
        pct_netposition_marketmaker: 17.7,
        pct_netposition_otherreportables: 33.3,
        pct_netposition_nonreportables: 48.9,
      },
    ];

    it('should fetch COT analysis for a symbol', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockAnalysisData);

      const result = await cotResource.getAnalysis('CL');

      expect(mockClient.get).toHaveBeenCalledWith('v4/commitment_of_traders_report_analysis', {
        searchParams: {
          symbol: 'CL',
      },
      }
);
      expect(result).toEqual(mockAnalysisData);
    });

    it('should uppercase the symbol', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockAnalysisData);

      await cotResource.getAnalysis('cl');

      expect(mockClient.get).toHaveBeenCalledWith('v4/commitment_of_traders_report_analysis', {
        searchParams: {
          symbol: 'CL',
      },
      }
);
    });

    it('should fetch COT analysis with from date', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockAnalysisData);

      const result = await cotResource.getAnalysis('CL', '2024-01-01');

      expect(mockClient.get).toHaveBeenCalledWith('v4/commitment_of_traders_report_analysis', {
        searchParams: {
          symbol: 'CL',
        from: '2024-01-01',
      },
      }
);
      expect(result).toEqual(mockAnalysisData);
    });

    it('should fetch COT analysis with to date', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockAnalysisData);

      const result = await cotResource.getAnalysis('CL', undefined, '2024-12-31');

      expect(mockClient.get).toHaveBeenCalledWith('v4/commitment_of_traders_report_analysis', {
        searchParams: {
          symbol: 'CL',
        to: '2024-12-31',
      },
      }
);
      expect(result).toEqual(mockAnalysisData);
    });

    it('should fetch COT analysis with date range', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockAnalysisData);

      const result = await cotResource.getAnalysis('CL', '2024-01-01', '2024-12-31');

      expect(mockClient.get).toHaveBeenCalledWith('v4/commitment_of_traders_report_analysis', {
        searchParams: {
          symbol: 'CL',
        from: '2024-01-01',
        to: '2024-12-31',
      },
      }
);
      expect(result).toEqual(mockAnalysisData);
    });

    it('should return empty array when no data is available', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      const result = await cotResource.getAnalysis('INVALID');

      expect(result).toEqual([]);
    });

    it('should handle multiple analysis records in response', async () => {
      const multipleAnalysis: COTAnalysis[] = [
        { ...mockAnalysisData[0], date: '2024-01-02' },
        { ...mockAnalysisData[0], date: '2024-01-09' },
        { ...mockAnalysisData[0], date: '2024-01-16' },
      ];
      vi.mocked(mockClient.get).mockResolvedValue(multipleAnalysis);

      const result = await cotResource.getAnalysis('CL', '2024-01-01', '2024-01-31');

      expect(result).toHaveLength(3);
      expect(result).toEqual(multipleAnalysis);
    });

    it('should throw FMPAPIError on API error', async () => {
      const apiError = new FMPAPIError('Bad Request', 400, 'Bad Request');
      vi.mocked(mockClient.get).mockRejectedValue(apiError);

      await expect(cotResource.getAnalysis('CL')).rejects.toThrow(FMPAPIError);
      await expect(cotResource.getAnalysis('CL')).rejects.toThrow('Bad Request');
    });

    it('should throw FMPAPIError on auth error', async () => {
      const authError = new FMPAPIError('Unauthorized access');
      vi.mocked(mockClient.get).mockRejectedValue(authError);

      await expect(cotResource.getAnalysis('CL')).rejects.toThrow(FMPAPIError);
      await expect(cotResource.getAnalysis('CL')).rejects.toThrow('Unauthorized access');
    });

    it('should throw FMPAPIError on rate limit', async () => {
      const rateLimitError = new FMPAPIError('Too many requests');
      vi.mocked(mockClient.get).mockRejectedValue(rateLimitError);

      await expect(cotResource.getAnalysis('CL')).rejects.toThrow(FMPAPIError);
      await expect(cotResource.getAnalysis('CL')).rejects.toThrow('Too many requests');
    });
  });

  describe('getSymbols', () => {
    const mockSymbolsData: COTSymbol[] = [
      {
        symbol: 'GC',
        name: 'GOLD - COMMODITY EXCHANGE INC.',
        trading_symbol: 'GC',
      },
      {
        symbol: 'CL',
        name: 'CRUDE OIL - NEW YORK MERCANTILE EXCHANGE',
        trading_symbol: 'CL',
      },
      {
        symbol: 'SI',
        name: 'SILVER - COMMODITY EXCHANGE INC.',
        trading_symbol: 'SI',
      },
      {
        symbol: 'NG',
        name: 'NATURAL GAS - NEW YORK MERCANTILE EXCHANGE',
        trading_symbol: 'NG',
      },
    ];

    it('should fetch list of available COT symbols', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockSymbolsData);

      const result = await cotResource.getSymbols();

      expect(mockClient.get).toHaveBeenCalledWith('v4/commitment_of_traders_report/list');
      expect(result).toEqual(mockSymbolsData);
    });

    it('should return all symbols without parameters', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockSymbolsData);

      const result = await cotResource.getSymbols();

      expect(mockClient.get).toHaveBeenCalledTimes(1);
      expect(mockClient.get).toHaveBeenCalledWith('v4/commitment_of_traders_report/list');
      expect(result).toHaveLength(4);
    });

    it('should return empty array when no symbols are available', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      const result = await cotResource.getSymbols();

      expect(result).toEqual([]);
    });

    it('should return symbols with correct structure', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockSymbolsData);

      const result = await cotResource.getSymbols();

      expect(result).toBeInstanceOf(Array);
      result.forEach((symbol) => {
        expect(symbol).toHaveProperty('symbol');
        expect(symbol).toHaveProperty('name');
        expect(symbol).toHaveProperty('trading_symbol');
        expect(typeof symbol.symbol).toBe('string');
        expect(typeof symbol.name).toBe('string');
        expect(typeof symbol.trading_symbol).toBe('string');
      });
    });

    it('should handle single symbol in response', async () => {
      const singleSymbol: COTSymbol[] = [
        {
          symbol: 'GC',
          name: 'GOLD - COMMODITY EXCHANGE INC.',
          trading_symbol: 'GC',
        },
      ];
      vi.mocked(mockClient.get).mockResolvedValue(singleSymbol);

      const result = await cotResource.getSymbols();

      expect(result).toHaveLength(1);
      expect(result[0].symbol).toBe('GC');
    });

    it('should throw FMPAPIError on API error', async () => {
      const apiError = new FMPAPIError('Service Unavailable', 503, 'Service Unavailable');
      vi.mocked(mockClient.get).mockRejectedValue(apiError);

      await expect(cotResource.getSymbols()).rejects.toThrow(FMPAPIError);
      await expect(cotResource.getSymbols()).rejects.toThrow('Service Unavailable');
    });

    it('should throw FMPAPIError on auth error', async () => {
      const authError = new FMPAPIError('API key required');
      vi.mocked(mockClient.get).mockRejectedValue(authError);

      await expect(cotResource.getSymbols()).rejects.toThrow(FMPAPIError);
      await expect(cotResource.getSymbols()).rejects.toThrow('API key required');
    });

    it('should throw FMPAPIError on rate limit', async () => {
      const rateLimitError = new FMPAPIError('Rate limit exceeded. Please try again later.');
      vi.mocked(mockClient.get).mockRejectedValue(rateLimitError);

      await expect(cotResource.getSymbols()).rejects.toThrow(FMPAPIError);
      await expect(cotResource.getSymbols()).rejects.toThrow('Rate limit exceeded. Please try again later.');
    });
  });

  describe('Edge cases and data validation', () => {
    it('should handle symbols with special characters', async () => {
      const mockData: COTReport[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await cotResource.getReport('ES_F');

      expect(mockClient.get).toHaveBeenCalledWith('v4/commitment_of_traders_report', {
        searchParams: {
          symbol: 'ES_F',
      },
      }
);
    });

    it('should handle mixed case symbols correctly', async () => {
      const mockData: COTReport[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await cotResource.getReport('GcEuR');

      expect(mockClient.get).toHaveBeenCalledWith('v4/commitment_of_traders_report', {
        searchParams: {
          symbol: 'GCEUR',
      },
      }
);
    });

    it('should not modify date format when passed', async () => {
      const mockData: COTReport[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await cotResource.getReport('GC', '2024-01-01', '2024-12-31');

      expect(mockClient.get).toHaveBeenCalledWith('v4/commitment_of_traders_report', {
        searchParams: {
          symbol: 'GC',
        from: '2024-01-01',
        to: '2024-12-31',
      },
      }
);
    });

    it('should handle only from date without to date', async () => {
      const mockData: COTAnalysis[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await cotResource.getAnalysis('CL', '2024-01-01');

      expect(mockClient.get).toHaveBeenCalledWith('v4/commitment_of_traders_report_analysis', {
        searchParams: {
          symbol: 'CL',
        from: '2024-01-01',
      },
      }
);
      expect(mockClient.get).toHaveBeenCalledTimes(1);
    });

    it('should handle only to date without from date', async () => {
      const mockData: COTAnalysis[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await cotResource.getAnalysis('CL', undefined, '2024-12-31');

      expect(mockClient.get).toHaveBeenCalledWith('v4/commitment_of_traders_report_analysis', {
        searchParams: {
          symbol: 'CL',
        to: '2024-12-31',
      },
      }
);
      expect(mockClient.get).toHaveBeenCalledTimes(1);
    });
  });

  describe('Resource instantiation', () => {
    it('should create COTResource with FMPClient', () => {
      const resource = new COTResource(mockClient);
      expect(resource).toBeInstanceOf(COTResource);
      expect(resource).toHaveProperty('getReport');
      expect(resource).toHaveProperty('getAnalysis');
      expect(resource).toHaveProperty('getSymbols');
    });

    it('should have all required methods', () => {
      expect(typeof cotResource.getReport).toBe('function');
      expect(typeof cotResource.getAnalysis).toBe('function');
      expect(typeof cotResource.getSymbols).toBe('function');
    });
  });

  describe('API endpoint verification', () => {
    it('should call correct endpoint for getReport', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await cotResource.getReport('GC');

      const [[endpoint]] = vi.mocked(mockClient.get).mock.calls;
      expect(endpoint).toBe('v4/commitment_of_traders_report');
    });

    it('should call correct endpoint for getAnalysis', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await cotResource.getAnalysis('CL');

      const [[endpoint]] = vi.mocked(mockClient.get).mock.calls;
      expect(endpoint).toBe('v4/commitment_of_traders_report_analysis');
    });

    it('should call correct endpoint for getSymbols', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await cotResource.getSymbols();

      const [[endpoint]] = vi.mocked(mockClient.get).mock.calls;
      expect(endpoint).toBe('v4/commitment_of_traders_report/list');
    });
  });
});
