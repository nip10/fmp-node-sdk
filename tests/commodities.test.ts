import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CommoditiesResource } from '../src/resources/commodities.js';
import type { FMPClient } from '../src/client.js';
import type {
  CommodityList,
  CommodityQuote,
  HistoricalPrice,
  IntradayChart,
} from '../src/types/index.js';

describe('CommoditiesResource', () => {
  let mockClient: FMPClient;
  let commodities: CommoditiesResource;

  beforeEach(() => {
    // Create a mock client with a get method
    mockClient = {
      get: vi.fn(),
    } as unknown as FMPClient;

    commodities = new CommoditiesResource(mockClient);
  });

  describe('getList', () => {
    it('should fetch commodities list', async () => {
      const mockData: CommodityList[] = [
        {
          symbol: 'GCUSD',
          name: 'Gold',
          currency: 'USD',
          stockExchange: 'COMMODITY',
          exchangeShortName: 'COMMODITY',
        },
        {
          symbol: 'SIUSD',
          name: 'Silver',
          currency: 'USD',
          stockExchange: 'COMMODITY',
          exchangeShortName: 'COMMODITY',
        },
        {
          symbol: 'CLUSD',
          name: 'Crude Oil',
          currency: 'USD',
          stockExchange: 'COMMODITY',
          exchangeShortName: 'COMMODITY',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      const result = await commodities.getList();

      expect(mockClient.get).toHaveBeenCalledWith('commodities-list');
      expect(result).toEqual(mockData);
      expect(result).toHaveLength(3);
    });

    it('should return empty array when no commodities available', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      const result = await commodities.getList();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });

  describe('getQuote', () => {
    const mockQuote: CommodityQuote[] = [
      {
        symbol: 'GCUSD',
        name: 'Gold',
        price: 1950.50,
        changesPercentage: 1.25,
        change: 24.10,
        dayLow: 1930.00,
        dayHigh: 1955.00,
        yearHigh: 2050.00,
        yearLow: 1800.00,
        marketCap: null,
        priceAvg50: 1920.00,
        priceAvg200: 1880.00,
        volume: 150000,
        avgVolume: 120000,
        exchange: 'COMMODITY',
        open: 1940.00,
        previousClose: 1926.40,
        eps: null,
        pe: null,
        earningsAnnouncement: null,
        sharesOutstanding: null,
        timestamp: 1699564800,
      },
    ];

    it('should fetch commodity quote with uppercase symbol', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockQuote);

      const result = await commodities.getQuote('GCUSD');

      expect(mockClient.get).toHaveBeenCalledWith('quote', { searchParams: { symbol: 'GCUSD' } });
      expect(result).toEqual(mockQuote);
    });

    it('should convert lowercase symbol to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockQuote);

      const result = await commodities.getQuote('gcusd');

      expect(mockClient.get).toHaveBeenCalledWith('quote', { searchParams: { symbol: 'GCUSD' } });
      expect(result).toEqual(mockQuote);
    });

    it('should handle mixed case symbols', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockQuote);

      const result = await commodities.getQuote('GcUsD');

      expect(mockClient.get).toHaveBeenCalledWith('quote', { searchParams: { symbol: 'GCUSD' } });
      expect(result).toEqual(mockQuote);
    });

    it('should fetch quote for different commodity symbols', async () => {
      const silverQuote: CommodityQuote[] = [
        {
          symbol: 'SIUSD',
          name: 'Silver',
          price: 23.45,
          changesPercentage: -0.85,
          change: -0.20,
          dayLow: 23.30,
          dayHigh: 23.60,
          yearHigh: 26.00,
          yearLow: 20.50,
          marketCap: null,
          priceAvg50: 23.80,
          priceAvg200: 23.20,
          volume: 85000,
          avgVolume: 90000,
          exchange: 'COMMODITY',
          open: 23.50,
          previousClose: 23.65,
          eps: null,
          pe: null,
          earningsAnnouncement: null,
          sharesOutstanding: null,
          timestamp: 1699564800,
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(silverQuote);

      const result = await commodities.getQuote('SIUSD');

      expect(mockClient.get).toHaveBeenCalledWith('quote', { searchParams: { symbol: 'SIUSD' } });
      expect(result).toEqual(silverQuote);
      expect(result[0].symbol).toBe('SIUSD');
    });

    it('should return empty array for invalid symbol', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      const result = await commodities.getQuote('INVALID');

      expect(mockClient.get).toHaveBeenCalledWith('quote', { searchParams: { symbol: 'INVALID' } });
      expect(result).toEqual([]);
    });
  });

  describe('getQuoteShort', () => {
    it('should fetch short quote data', async () => {
      const mockShortQuote = [
        {
          symbol: 'GCUSD',
          price: 1950.50,
          volume: 150000,
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockShortQuote);

      const result = await commodities.getQuoteShort('GCUSD');

      expect(mockClient.get).toHaveBeenCalledWith('quote-short', { searchParams: { symbol: 'GCUSD' } });
      expect(result).toEqual(mockShortQuote);
    });

    it('should convert symbol to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await commodities.getQuoteShort('clusd');

      expect(mockClient.get).toHaveBeenCalledWith('quote-short', { searchParams: { symbol: 'CLUSD' } });
    });

    it('should handle empty response', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      const result = await commodities.getQuoteShort('INVALID');

      expect(result).toEqual([]);
    });
  });

  describe('getAllQuotes', () => {
    it('should fetch all commodity quotes', async () => {
      const mockAllQuotes: CommodityQuote[] = [
        {
          symbol: 'GCUSD',
          name: 'Gold',
          price: 1950.50,
          changesPercentage: 1.25,
          change: 24.10,
          dayLow: 1930.00,
          dayHigh: 1955.00,
          yearHigh: 2050.00,
          yearLow: 1800.00,
          marketCap: null,
          priceAvg50: 1920.00,
          priceAvg200: 1880.00,
          volume: 150000,
          avgVolume: 120000,
          exchange: 'COMMODITY',
          open: 1940.00,
          previousClose: 1926.40,
          eps: null,
          pe: null,
          earningsAnnouncement: null,
          sharesOutstanding: null,
          timestamp: 1699564800,
        },
        {
          symbol: 'SIUSD',
          name: 'Silver',
          price: 23.45,
          changesPercentage: -0.85,
          change: -0.20,
          dayLow: 23.30,
          dayHigh: 23.60,
          yearHigh: 26.00,
          yearLow: 20.50,
          marketCap: null,
          priceAvg50: 23.80,
          priceAvg200: 23.20,
          volume: 85000,
          avgVolume: 90000,
          exchange: 'COMMODITY',
          open: 23.50,
          previousClose: 23.65,
          eps: null,
          pe: null,
          earningsAnnouncement: null,
          sharesOutstanding: null,
          timestamp: 1699564800,
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockAllQuotes);

      const result = await commodities.getAllQuotes();

      expect(mockClient.get).toHaveBeenCalledWith('batch-commodity-quotes');
      expect(result).toEqual(mockAllQuotes);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no quotes available', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      const result = await commodities.getAllQuotes();

      expect(result).toEqual([]);
    });
  });

  describe('getHistoricalPrices', () => {
    const mockHistoricalData = {
      historical: [
        {
          date: '2024-01-15',
          open: 1940.00,
          high: 1955.00,
          low: 1930.00,
          close: 1950.50,
          adjClose: 1950.50,
          volume: 150000,
          unadjustedVolume: 150000,
          change: 10.50,
          changePercent: 0.54,
          vwap: 1945.00,
          label: 'January 15, 24',
          changeOverTime: 0.0054,
        },
        {
          date: '2024-01-14',
          open: 1935.00,
          high: 1945.00,
          low: 1925.00,
          close: 1940.00,
          adjClose: 1940.00,
          volume: 140000,
          unadjustedVolume: 140000,
          change: 5.00,
          changePercent: 0.26,
          vwap: 1936.00,
          label: 'January 14, 24',
          changeOverTime: 0.0026,
        },
      ] as HistoricalPrice[],
    };

    it('should fetch historical prices without date range', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockHistoricalData);

      const result = await commodities.getHistoricalPrices('GCUSD');

      expect(mockClient.get).toHaveBeenCalledWith(
        'historical-price-eod/full',
        { searchParams: { symbol: 'GCUSD' } }
      );
      expect(result).toEqual(mockHistoricalData);
      expect(result.historical).toHaveLength(2);
    });

    it('should fetch historical prices with from date only', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockHistoricalData);

      const result = await commodities.getHistoricalPrices('GCUSD', '2024-01-01');

      expect(mockClient.get).toHaveBeenCalledWith(
        'historical-price-eod/full',
        { searchParams: { symbol: 'GCUSD', from: '2024-01-01' } }
      );
      expect(result).toEqual(mockHistoricalData);
    });

    it('should fetch historical prices with to date only', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockHistoricalData);

      const result = await commodities.getHistoricalPrices('GCUSD', undefined, '2024-01-31');

      expect(mockClient.get).toHaveBeenCalledWith(
        'historical-price-eod/full',
        { searchParams: { symbol: 'GCUSD', to: '2024-01-31' } }
      );
      expect(result).toEqual(mockHistoricalData);
    });

    it('should fetch historical prices with both from and to dates', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockHistoricalData);

      const result = await commodities.getHistoricalPrices(
        'GCUSD',
        '2024-01-01',
        '2024-01-31'
      );

      expect(mockClient.get).toHaveBeenCalledWith(
        'historical-price-eod/full',
        { searchParams: { symbol: 'GCUSD', from: '2024-01-01', to: '2024-01-31' } }
      );
      expect(result).toEqual(mockHistoricalData);
    });

    it('should convert symbol to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockHistoricalData);

      await commodities.getHistoricalPrices('siusd', '2024-01-01', '2024-01-31');

      expect(mockClient.get).toHaveBeenCalledWith(
        'historical-price-eod/full',
        { searchParams: { symbol: 'SIUSD', from: '2024-01-01', to: '2024-01-31' } }
      );
    });

    it('should handle different date formats', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockHistoricalData);

      await commodities.getHistoricalPrices('GCUSD', '2024-12-01', '2024-12-31');

      expect(mockClient.get).toHaveBeenCalledWith(
        'historical-price-eod/full',
        { searchParams: { symbol: 'GCUSD', from: '2024-12-01', to: '2024-12-31' } }
      );
    });

    it('should return empty historical array when no data available', async () => {
      vi.mocked(mockClient.get).mockResolvedValue({ historical: [] });

      const result = await commodities.getHistoricalPrices('GCUSD', '2030-01-01');

      expect(result.historical).toEqual([]);
    });

    it('should handle single day date range', async () => {
      const singleDayData = {
        historical: [mockHistoricalData.historical[0]],
      };

      vi.mocked(mockClient.get).mockResolvedValue(singleDayData);

      const result = await commodities.getHistoricalPrices(
        'GCUSD',
        '2024-01-15',
        '2024-01-15'
      );

      expect(result.historical).toHaveLength(1);
    });
  });

  describe('getLightChart', () => {
    const mockLightChartData = [
      { date: '2024-01-15', close: 1950.50 },
      { date: '2024-01-14', close: 1940.00 },
      { date: '2024-01-13', close: 1935.00 },
    ];

    it('should fetch light chart data without date range', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockLightChartData);

      const result = await commodities.getLightChart('GCUSD');

      expect(mockClient.get).toHaveBeenCalledWith(
        'historical-price-eod/light',
        { searchParams: { symbol: 'GCUSD' } }
      );
      expect(result).toEqual(mockLightChartData);
      expect(result).toHaveLength(3);
      expect(result[0]).toHaveProperty('date');
      expect(result[0]).toHaveProperty('close');
    });

    it('should fetch light chart data with from date only', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockLightChartData);

      const result = await commodities.getLightChart('GCUSD', '2024-01-01');

      expect(mockClient.get).toHaveBeenCalledWith(
        'historical-price-eod/light',
        { searchParams: { symbol: 'GCUSD', from: '2024-01-01' } }
      );
      expect(result).toEqual(mockLightChartData);
    });

    it('should fetch light chart data with to date only', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockLightChartData);

      const result = await commodities.getLightChart('GCUSD', undefined, '2024-01-31');

      expect(mockClient.get).toHaveBeenCalledWith(
        'historical-price-eod/light',
        { searchParams: { symbol: 'GCUSD', to: '2024-01-31' } }
      );
      expect(result).toEqual(mockLightChartData);
    });

    it('should fetch light chart data with both from and to dates', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockLightChartData);

      const result = await commodities.getLightChart(
        'GCUSD',
        '2024-01-01',
        '2024-01-31'
      );

      expect(mockClient.get).toHaveBeenCalledWith(
        'historical-price-eod/light',
        { searchParams: { symbol: 'GCUSD', from: '2024-01-01', to: '2024-01-31' } }
      );
      expect(result).toEqual(mockLightChartData);
    });

    it('should convert symbol to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockLightChartData);

      await commodities.getLightChart('clusd', '2024-01-01', '2024-01-31');

      expect(mockClient.get).toHaveBeenCalledWith(
        'historical-price-eod/light',
        { searchParams: { symbol: 'CLUSD', from: '2024-01-01', to: '2024-01-31' } }
      );
    });

    it('should return empty array when no data available', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      const result = await commodities.getLightChart('GCUSD', '2030-01-01');

      expect(result).toEqual([]);
    });
  });

  describe('getIntradayChart', () => {
    const mockIntradayData: IntradayChart[] = [
      {
        date: '2024-01-15 10:00:00',
        open: 1940.00,
        low: 1938.00,
        high: 1945.00,
        close: 1943.50,
        volume: 15000,
      },
      {
        date: '2024-01-15 09:00:00',
        open: 1935.00,
        low: 1934.00,
        high: 1941.00,
        close: 1940.00,
        volume: 18000,
      },
    ];

    it('should fetch intraday chart with default interval (1hour)', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockIntradayData);

      const result = await commodities.getIntradayChart('GCUSD');

      expect(mockClient.get).toHaveBeenCalledWith(
        'historical-chart/1hour',
        { searchParams: { symbol: 'GCUSD' } }
      );
      expect(result).toEqual(mockIntradayData);
    });

    it('should fetch intraday chart with 1min interval', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockIntradayData);

      const result = await commodities.getIntradayChart('GCUSD', '1min');

      expect(mockClient.get).toHaveBeenCalledWith(
        'historical-chart/1min',
        { searchParams: { symbol: 'GCUSD' } }
      );
      expect(result).toEqual(mockIntradayData);
    });

    it('should fetch intraday chart with 5min interval', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockIntradayData);

      const result = await commodities.getIntradayChart('GCUSD', '5min');

      expect(mockClient.get).toHaveBeenCalledWith(
        'historical-chart/5min',
        { searchParams: { symbol: 'GCUSD' } }
      );
      expect(result).toEqual(mockIntradayData);
    });

    it('should fetch intraday chart with 15min interval', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockIntradayData);

      const result = await commodities.getIntradayChart('GCUSD', '15min');

      expect(mockClient.get).toHaveBeenCalledWith(
        'historical-chart/15min',
        { searchParams: { symbol: 'GCUSD' } }
      );
      expect(result).toEqual(mockIntradayData);
    });

    it('should fetch intraday chart with 30min interval', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockIntradayData);

      const result = await commodities.getIntradayChart('GCUSD', '30min');

      expect(mockClient.get).toHaveBeenCalledWith(
        'historical-chart/30min',
        { searchParams: { symbol: 'GCUSD' } }
      );
      expect(result).toEqual(mockIntradayData);
    });

    it('should fetch intraday chart with 4hour interval', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockIntradayData);

      const result = await commodities.getIntradayChart('GCUSD', '4hour');

      expect(mockClient.get).toHaveBeenCalledWith(
        'historical-chart/4hour',
        { searchParams: { symbol: 'GCUSD' } }
      );
      expect(result).toEqual(mockIntradayData);
    });

    it('should fetch intraday chart with from date', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockIntradayData);

      const result = await commodities.getIntradayChart(
        'GCUSD',
        '1hour',
        '2024-01-01'
      );

      expect(mockClient.get).toHaveBeenCalledWith(
        'historical-chart/1hour',
        { searchParams: { symbol: 'GCUSD', from: '2024-01-01' } }
      );
      expect(result).toEqual(mockIntradayData);
    });

    it('should fetch intraday chart with to date', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockIntradayData);

      const result = await commodities.getIntradayChart(
        'GCUSD',
        '1hour',
        undefined,
        '2024-01-31'
      );

      expect(mockClient.get).toHaveBeenCalledWith(
        'historical-chart/1hour',
        { searchParams: { symbol: 'GCUSD', to: '2024-01-31' } }
      );
      expect(result).toEqual(mockIntradayData);
    });

    it('should fetch intraday chart with both from and to dates', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockIntradayData);

      const result = await commodities.getIntradayChart(
        'GCUSD',
        '1hour',
        '2024-01-01',
        '2024-01-31'
      );

      expect(mockClient.get).toHaveBeenCalledWith(
        'historical-chart/1hour',
        { searchParams: { symbol: 'GCUSD', from: '2024-01-01', to: '2024-01-31' } }
      );
      expect(result).toEqual(mockIntradayData);
    });

    it('should convert symbol to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockIntradayData);

      await commodities.getIntradayChart('siusd', '15min', '2024-01-01', '2024-01-31');

      expect(mockClient.get).toHaveBeenCalledWith(
        'historical-chart/15min',
        { searchParams: { symbol: 'SIUSD', from: '2024-01-01', to: '2024-01-31' } }
      );
    });

    it('should return empty array when no data available', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      const result = await commodities.getIntradayChart('GCUSD', '1hour', '2030-01-01');

      expect(result).toEqual([]);
    });
  });

  describe('Error handling', () => {
    it('should propagate client errors for getList', async () => {
      const error = new Error('Network error');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(commodities.getList()).rejects.toThrow('Network error');
    });

    it('should propagate client errors for getQuote', async () => {
      const error = new Error('API error');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(commodities.getQuote('GCUSD')).rejects.toThrow('API error');
    });

    it('should propagate client errors for getHistoricalPrices', async () => {
      const error = new Error('Timeout error');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(
        commodities.getHistoricalPrices('GCUSD', '2024-01-01')
      ).rejects.toThrow('Timeout error');
    });

    it('should propagate client errors for getLightChart', async () => {
      const error = new Error('Invalid date range');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(
        commodities.getLightChart('GCUSD', '2024-01-31', '2024-01-01')
      ).rejects.toThrow('Invalid date range');
    });

    it('should propagate client errors for getIntradayChart', async () => {
      const error = new Error('Rate limit exceeded');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(
        commodities.getIntradayChart('GCUSD', '1min')
      ).rejects.toThrow('Rate limit exceeded');
    });
  });

  describe('Symbol handling edge cases', () => {
    it('should handle symbols with special characters', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await commodities.getQuote('GC=F');

      expect(mockClient.get).toHaveBeenCalledWith('quote', { searchParams: { symbol: 'GC=F' } });
    });

    it('should handle empty string symbol', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await commodities.getQuote('');

      expect(mockClient.get).toHaveBeenCalledWith('quote', { searchParams: { symbol: '' } });
    });

    it('should handle symbols with whitespace', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await commodities.getQuote(' GCUSD ');

      expect(mockClient.get).toHaveBeenCalledWith('quote', { searchParams: { symbol: ' GCUSD ' } });
    });
  });

  describe('Date range validation scenarios', () => {
    it('should handle reversed date ranges in getHistoricalPrices', async () => {
      vi.mocked(mockClient.get).mockResolvedValue({ historical: [] });

      // API might handle this differently, but we should pass through
      await commodities.getHistoricalPrices('GCUSD', '2024-12-31', '2024-01-01');

      expect(mockClient.get).toHaveBeenCalledWith(
        'historical-price-eod/full',
        { searchParams: { symbol: 'GCUSD', from: '2024-12-31', to: '2024-01-01' } }
      );
    });

    it('should handle same from and to dates', async () => {
      vi.mocked(mockClient.get).mockResolvedValue({ historical: [] });

      await commodities.getHistoricalPrices('GCUSD', '2024-01-15', '2024-01-15');

      expect(mockClient.get).toHaveBeenCalledWith(
        'historical-price-eod/full',
        { searchParams: { symbol: 'GCUSD', from: '2024-01-15', to: '2024-01-15' } }
      );
    });

    it('should handle undefined dates explicitly', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await commodities.getLightChart('GCUSD', undefined, undefined);

      expect(mockClient.get).toHaveBeenCalledWith(
        'historical-price-eod/light',
        { searchParams: { symbol: 'GCUSD' } }
      );
    });
  });

  describe('Response data integrity', () => {
    it('should preserve all quote fields', async () => {
      const fullQuote: CommodityQuote[] = [
        {
          symbol: 'GCUSD',
          name: 'Gold',
          price: 1950.50,
          changesPercentage: 1.25,
          change: 24.10,
          dayLow: 1930.00,
          dayHigh: 1955.00,
          yearHigh: 2050.00,
          yearLow: 1800.00,
          marketCap: null,
          priceAvg50: 1920.00,
          priceAvg200: 1880.00,
          volume: 150000,
          avgVolume: 120000,
          exchange: 'COMMODITY',
          open: 1940.00,
          previousClose: 1926.40,
          eps: null,
          pe: null,
          earningsAnnouncement: null,
          sharesOutstanding: null,
          timestamp: 1699564800,
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(fullQuote);

      const result = await commodities.getQuote('GCUSD');

      expect(result[0]).toHaveProperty('symbol');
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('price');
      expect(result[0]).toHaveProperty('changesPercentage');
      expect(result[0]).toHaveProperty('change');
      expect(result[0]).toHaveProperty('dayLow');
      expect(result[0]).toHaveProperty('dayHigh');
      expect(result[0]).toHaveProperty('yearHigh');
      expect(result[0]).toHaveProperty('yearLow');
      expect(result[0]).toHaveProperty('marketCap');
      expect(result[0]).toHaveProperty('timestamp');
    });

    it('should preserve all historical price fields', async () => {
      const fullHistorical = {
        historical: [
          {
            date: '2024-01-15',
            open: 1940.00,
            high: 1955.00,
            low: 1930.00,
            close: 1950.50,
            adjClose: 1950.50,
            volume: 150000,
            unadjustedVolume: 150000,
            change: 10.50,
            changePercent: 0.54,
            vwap: 1945.00,
            label: 'January 15, 24',
            changeOverTime: 0.0054,
          } as HistoricalPrice,
        ],
      };

      vi.mocked(mockClient.get).mockResolvedValue(fullHistorical);

      const result = await commodities.getHistoricalPrices('GCUSD');

      expect(result.historical[0]).toHaveProperty('date');
      expect(result.historical[0]).toHaveProperty('open');
      expect(result.historical[0]).toHaveProperty('high');
      expect(result.historical[0]).toHaveProperty('low');
      expect(result.historical[0]).toHaveProperty('close');
      expect(result.historical[0]).toHaveProperty('volume');
      expect(result.historical[0]).toHaveProperty('vwap');
    });
  });
});
