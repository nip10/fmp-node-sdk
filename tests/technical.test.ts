import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TechnicalResource } from '../src/resources/technical.js';
import type { FMPClient } from '../src/client.js';
import type {
  SMA,
  EMA,
  RSI,
  ADX,
  Williams,
  StandardDeviation,
  WMA,
  DEMA,
  TEMA,
} from '../src/types/index.js';

describe('TechnicalResource', () => {
  let mockClient: FMPClient;
  let technical: TechnicalResource;

  beforeEach(() => {
    // Create a mock client with a mocked get method
    mockClient = {
      get: vi.fn(),
    } as unknown as FMPClient;

    technical = new TechnicalResource(mockClient);
  });

  describe('getSMA', () => {
    it('should fetch SMA with default parameters', async () => {
      const mockData: SMA[] = [
        {
          date: '2024-01-01',
          open: 150.0,
          high: 152.0,
          low: 149.0,
          close: 151.0,
          volume: 1000000,
          sma: 150.5,
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      const result = await technical.getSMA('AAPL');

      expect(mockClient.get).toHaveBeenCalledWith('technical-indicator/1day', {
        searchParams: {
          symbol: 'AAPL',
          type: 'sma',
          period: 10,
        },
      });
      expect(result).toEqual(mockData);
    });

    it('should fetch SMA with custom period', async () => {
      const mockData: SMA[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await technical.getSMA('AAPL', 20);

      expect(mockClient.get).toHaveBeenCalledWith('technical-indicator/1day', {
        searchParams: {
          symbol: 'AAPL',
          type: 'sma',
          period: 20,
        },
      });
    });

    it('should fetch SMA with 1min timeframe', async () => {
      const mockData: SMA[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await technical.getSMA('AAPL', 10, '1min');

      expect(mockClient.get).toHaveBeenCalledWith('technical-indicator/1min', {
        searchParams: {
          symbol: 'AAPL',
          type: 'sma',
          period: 10,
        },
      });
    });

    it('should fetch SMA with 5min timeframe', async () => {
      const mockData: SMA[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await technical.getSMA('AAPL', 10, '5min');

      expect(mockClient.get).toHaveBeenCalledWith('technical-indicator/5min', {
        searchParams: {
          symbol: 'AAPL',
          type: 'sma',
          period: 10,
        },
      });
    });

    it('should fetch SMA with 15min timeframe', async () => {
      const mockData: SMA[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await technical.getSMA('AAPL', 10, '15min');

      expect(mockClient.get).toHaveBeenCalledWith('technical-indicator/15min', {
        searchParams: {
          symbol: 'AAPL',
          type: 'sma',
          period: 10,
        },
      });
    });

    it('should fetch SMA with 30min timeframe', async () => {
      const mockData: SMA[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await technical.getSMA('AAPL', 10, '30min');

      expect(mockClient.get).toHaveBeenCalledWith('technical-indicator/30min', {
        searchParams: {
          symbol: 'AAPL',
          type: 'sma',
          period: 10,
        },
      });
    });

    it('should fetch SMA with 1hour timeframe', async () => {
      const mockData: SMA[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await technical.getSMA('AAPL', 10, '1hour');

      expect(mockClient.get).toHaveBeenCalledWith('technical-indicator/1hour', {
        searchParams: {
          symbol: 'AAPL',
          type: 'sma',
          period: 10,
        },
      });
    });

    it('should fetch SMA with 4hour timeframe', async () => {
      const mockData: SMA[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await technical.getSMA('AAPL', 10, '4hour');

      expect(mockClient.get).toHaveBeenCalledWith('technical-indicator/4hour', {
        searchParams: {
          symbol: 'AAPL',
          type: 'sma',
          period: 10,
        },
      });
    });

    it('should fetch SMA with 1day timeframe', async () => {
      const mockData: SMA[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await technical.getSMA('AAPL', 10, '1day');

      expect(mockClient.get).toHaveBeenCalledWith('technical-indicator/1day', {
        searchParams: {
          symbol: 'AAPL',
          type: 'sma',
          period: 10,
        },
      });
    });

    it('should normalize symbol to uppercase', async () => {
      const mockData: SMA[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await technical.getSMA('aapl');

      expect(mockClient.get).toHaveBeenCalledWith('technical-indicator/1day', {
        searchParams: {
          symbol: 'AAPL',
          type: 'sma',
          period: 10,
        },
      });
    });

    it('should handle client errors', async () => {
      const error = new Error('Network error');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(technical.getSMA('AAPL')).rejects.toThrow('Network error');
    });
  });

  describe('getEMA', () => {
    it('should fetch EMA with default parameters', async () => {
      const mockData: EMA[] = [
        {
          date: '2024-01-01',
          open: 150.0,
          high: 152.0,
          low: 149.0,
          close: 151.0,
          volume: 1000000,
          ema: 150.75,
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      const result = await technical.getEMA('AAPL');

      expect(mockClient.get).toHaveBeenCalledWith('technical-indicator/1day', {
        searchParams: {
          symbol: 'AAPL',
          type: 'ema',
          period: 10,
        },
      });
      expect(result).toEqual(mockData);
    });

    it('should fetch EMA with custom period', async () => {
      const mockData: EMA[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await technical.getEMA('AAPL', 50);

      expect(mockClient.get).toHaveBeenCalledWith('technical-indicator/1day', {
        searchParams: {
          symbol: 'AAPL',
          type: 'ema',
          period: 50,
        },
      });
    });

    it('should fetch EMA with different timeframes', async () => {
      const mockData: EMA[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await technical.getEMA('MSFT', 20, '1hour');

      expect(mockClient.get).toHaveBeenCalledWith('technical-indicator/1hour', {
        searchParams: {
          symbol: 'MSFT',
          type: 'ema',
          period: 20,
        },
      });
    });

    it('should normalize symbol to uppercase', async () => {
      const mockData: EMA[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await technical.getEMA('tsla');

      expect(mockClient.get).toHaveBeenCalledWith('technical-indicator/1day', {
        searchParams: {
          symbol: 'TSLA',
          type: 'ema',
          period: 10,
        },
      });
    });

    it('should handle client errors', async () => {
      const error = new Error('API error');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(technical.getEMA('AAPL')).rejects.toThrow('API error');
    });
  });

  describe('getRSI', () => {
    it('should fetch RSI with default parameters', async () => {
      const mockData: RSI[] = [
        {
          date: '2024-01-01',
          open: 150.0,
          high: 152.0,
          low: 149.0,
          close: 151.0,
          volume: 1000000,
          rsi: 65.5,
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      const result = await technical.getRSI('AAPL');

      expect(mockClient.get).toHaveBeenCalledWith('technical-indicator/1day', {
        searchParams: {
          symbol: 'AAPL',
          type: 'rsi',
          period: 14,
        },
      });
      expect(result).toEqual(mockData);
    });

    it('should fetch RSI with custom period', async () => {
      const mockData: RSI[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await technical.getRSI('AAPL', 21);

      expect(mockClient.get).toHaveBeenCalledWith('technical-indicator/1day', {
        searchParams: {
          symbol: 'AAPL',
          type: 'rsi',
          period: 21,
        },
      });
    });

    it('should fetch RSI with different timeframes', async () => {
      const mockData: RSI[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await technical.getRSI('GOOGL', 14, '15min');

      expect(mockClient.get).toHaveBeenCalledWith('technical-indicator/15min', {
        searchParams: {
          symbol: 'GOOGL',
          type: 'rsi',
          period: 14,
        },
      });
    });

    it('should normalize symbol to uppercase', async () => {
      const mockData: RSI[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await technical.getRSI('nvda');

      expect(mockClient.get).toHaveBeenCalledWith('technical-indicator/1day', {
        searchParams: {
          symbol: 'NVDA',
          type: 'rsi',
          period: 14,
        },
      });
    });

    it('should handle client errors', async () => {
      const error = new Error('Timeout error');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(technical.getRSI('AAPL')).rejects.toThrow('Timeout error');
    });
  });

  describe('getADX', () => {
    it('should fetch ADX with default parameters', async () => {
      const mockData: ADX[] = [
        {
          date: '2024-01-01',
          open: 150.0,
          high: 152.0,
          low: 149.0,
          close: 151.0,
          volume: 1000000,
          adx: 25.5,
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      const result = await technical.getADX('AAPL');

      expect(mockClient.get).toHaveBeenCalledWith('technical-indicator/1day', {
        searchParams: {
          symbol: 'AAPL',
          type: 'adx',
          period: 14,
        },
      });
      expect(result).toEqual(mockData);
    });

    it('should fetch ADX with custom period', async () => {
      const mockData: ADX[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await technical.getADX('AAPL', 20);

      expect(mockClient.get).toHaveBeenCalledWith('technical-indicator/1day', {
        searchParams: {
          symbol: 'AAPL',
          type: 'adx',
          period: 20,
        },
      });
    });

    it('should fetch ADX with different timeframes', async () => {
      const mockData: ADX[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await technical.getADX('AMZN', 14, '30min');

      expect(mockClient.get).toHaveBeenCalledWith('technical-indicator/30min', {
        searchParams: {
          symbol: 'AMZN',
          type: 'adx',
          period: 14,
        },
      });
    });

    it('should normalize symbol to uppercase', async () => {
      const mockData: ADX[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await technical.getADX('meta');

      expect(mockClient.get).toHaveBeenCalledWith('technical-indicator/1day', {
        searchParams: {
          symbol: 'META',
          type: 'adx',
          period: 14,
        },
      });
    });

    it('should handle client errors', async () => {
      const error = new Error('Rate limit exceeded');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(technical.getADX('AAPL')).rejects.toThrow('Rate limit exceeded');
    });
  });

  describe('getWilliams', () => {
    it('should fetch Williams %R with default parameters', async () => {
      const mockData: Williams[] = [
        {
          date: '2024-01-01',
          open: 150.0,
          high: 152.0,
          low: 149.0,
          close: 151.0,
          volume: 1000000,
          williams: -35.5,
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      const result = await technical.getWilliams('AAPL');

      expect(mockClient.get).toHaveBeenCalledWith('technical-indicator/1day', {
        searchParams: {
          symbol: 'AAPL',
          type: 'williams',
          period: 14,
        },
      });
      expect(result).toEqual(mockData);
    });

    it('should fetch Williams %R with custom period', async () => {
      const mockData: Williams[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await technical.getWilliams('AAPL', 10);

      expect(mockClient.get).toHaveBeenCalledWith('technical-indicator/1day', {
        searchParams: {
          symbol: 'AAPL',
          type: 'williams',
          period: 10,
        },
      });
    });

    it('should fetch Williams %R with different timeframes', async () => {
      const mockData: Williams[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await technical.getWilliams('NFLX', 14, '4hour');

      expect(mockClient.get).toHaveBeenCalledWith('technical-indicator/4hour', {
        searchParams: {
          symbol: 'NFLX',
          type: 'williams',
          period: 14,
        },
      });
    });

    it('should normalize symbol to uppercase', async () => {
      const mockData: Williams[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await technical.getWilliams('dis');

      expect(mockClient.get).toHaveBeenCalledWith('technical-indicator/1day', {
        searchParams: {
          symbol: 'DIS',
          type: 'williams',
          period: 14,
        },
      });
    });

    it('should handle client errors', async () => {
      const error = new Error('Invalid symbol');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(technical.getWilliams('AAPL')).rejects.toThrow('Invalid symbol');
    });
  });

  describe('getStandardDeviation', () => {
    it('should fetch Standard Deviation with default parameters', async () => {
      const mockData: StandardDeviation[] = [
        {
          date: '2024-01-01',
          open: 150.0,
          high: 152.0,
          low: 149.0,
          close: 151.0,
          volume: 1000000,
          standardDeviation: 2.5,
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      const result = await technical.getStandardDeviation('AAPL');

      expect(mockClient.get).toHaveBeenCalledWith('technical-indicator/1day', {
        searchParams: {
          symbol: 'AAPL',
          type: 'standardDeviation',
          period: 10,
        },
      });
      expect(result).toEqual(mockData);
    });

    it('should fetch Standard Deviation with custom period', async () => {
      const mockData: StandardDeviation[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await technical.getStandardDeviation('AAPL', 20);

      expect(mockClient.get).toHaveBeenCalledWith('technical-indicator/1day', {
        searchParams: {
          symbol: 'AAPL',
          type: 'standardDeviation',
          period: 20,
        },
      });
    });

    it('should fetch Standard Deviation with different timeframes', async () => {
      const mockData: StandardDeviation[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await technical.getStandardDeviation('AMD', 10, '1min');

      expect(mockClient.get).toHaveBeenCalledWith('technical-indicator/1min', {
        searchParams: {
          symbol: 'AMD',
          type: 'standardDeviation',
          period: 10,
        },
      });
    });

    it('should normalize symbol to uppercase', async () => {
      const mockData: StandardDeviation[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await technical.getStandardDeviation('intc');

      expect(mockClient.get).toHaveBeenCalledWith('technical-indicator/1day', {
        searchParams: {
          symbol: 'INTC',
          type: 'standardDeviation',
          period: 10,
        },
      });
    });

    it('should handle client errors', async () => {
      const error = new Error('Service unavailable');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(technical.getStandardDeviation('AAPL')).rejects.toThrow('Service unavailable');
    });
  });

  describe('getWMA', () => {
    it('should fetch WMA with default parameters', async () => {
      const mockData: WMA[] = [
        {
          date: '2024-01-01',
          open: 150.0,
          high: 152.0,
          low: 149.0,
          close: 151.0,
          volume: 1000000,
          wma: 150.6,
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      const result = await technical.getWMA('AAPL');

      expect(mockClient.get).toHaveBeenCalledWith('technical-indicator/1day', {
        searchParams: {
          symbol: 'AAPL',
          type: 'wma',
          period: 10,
        },
      });
      expect(result).toEqual(mockData);
    });

    it('should fetch WMA with custom period', async () => {
      const mockData: WMA[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await technical.getWMA('AAPL', 25);

      expect(mockClient.get).toHaveBeenCalledWith('technical-indicator/1day', {
        searchParams: {
          symbol: 'AAPL',
          type: 'wma',
          period: 25,
        },
      });
    });

    it('should fetch WMA with different timeframes', async () => {
      const mockData: WMA[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await technical.getWMA('IBM', 10, '5min');

      expect(mockClient.get).toHaveBeenCalledWith('technical-indicator/5min', {
        searchParams: {
          symbol: 'IBM',
          type: 'wma',
          period: 10,
        },
      });
    });

    it('should normalize symbol to uppercase', async () => {
      const mockData: WMA[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await technical.getWMA('ba');

      expect(mockClient.get).toHaveBeenCalledWith('technical-indicator/1day', {
        searchParams: {
          symbol: 'BA',
          type: 'wma',
          period: 10,
        },
      });
    });

    it('should handle client errors', async () => {
      const error = new Error('Connection timeout');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(technical.getWMA('AAPL')).rejects.toThrow('Connection timeout');
    });
  });

  describe('getDEMA', () => {
    it('should fetch DEMA with default parameters', async () => {
      const mockData: DEMA[] = [
        {
          date: '2024-01-01',
          open: 150.0,
          high: 152.0,
          low: 149.0,
          close: 151.0,
          volume: 1000000,
          dema: 150.8,
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      const result = await technical.getDEMA('AAPL');

      expect(mockClient.get).toHaveBeenCalledWith('technical-indicator/1day', {
        searchParams: {
          symbol: 'AAPL',
          type: 'dema',
          period: 10,
        },
      });
      expect(result).toEqual(mockData);
    });

    it('should fetch DEMA with custom period', async () => {
      const mockData: DEMA[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await technical.getDEMA('AAPL', 30);

      expect(mockClient.get).toHaveBeenCalledWith('technical-indicator/1day', {
        searchParams: {
          symbol: 'AAPL',
          type: 'dema',
          period: 30,
        },
      });
    });

    it('should fetch DEMA with different timeframes', async () => {
      const mockData: DEMA[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await technical.getDEMA('JPM', 10, '15min');

      expect(mockClient.get).toHaveBeenCalledWith('technical-indicator/15min', {
        searchParams: {
          symbol: 'JPM',
          type: 'dema',
          period: 10,
        },
      });
    });

    it('should normalize symbol to uppercase', async () => {
      const mockData: DEMA[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await technical.getDEMA('v');

      expect(mockClient.get).toHaveBeenCalledWith('technical-indicator/1day', {
        searchParams: {
          symbol: 'V',
          type: 'dema',
          period: 10,
        },
      });
    });

    it('should handle client errors', async () => {
      const error = new Error('Authentication failed');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(technical.getDEMA('AAPL')).rejects.toThrow('Authentication failed');
    });
  });

  describe('getTEMA', () => {
    it('should fetch TEMA with default parameters', async () => {
      const mockData: TEMA[] = [
        {
          date: '2024-01-01',
          open: 150.0,
          high: 152.0,
          low: 149.0,
          close: 151.0,
          volume: 1000000,
          tema: 150.9,
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      const result = await technical.getTEMA('AAPL');

      expect(mockClient.get).toHaveBeenCalledWith('technical-indicator/1day', {
        searchParams: {
          symbol: 'AAPL',
          type: 'tema',
          period: 10,
        },
      });
      expect(result).toEqual(mockData);
    });

    it('should fetch TEMA with custom period', async () => {
      const mockData: TEMA[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await technical.getTEMA('AAPL', 15);

      expect(mockClient.get).toHaveBeenCalledWith('technical-indicator/1day', {
        searchParams: {
          symbol: 'AAPL',
          type: 'tema',
          period: 15,
        },
      });
    });

    it('should fetch TEMA with different timeframes', async () => {
      const mockData: TEMA[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await technical.getTEMA('WMT', 10, '30min');

      expect(mockClient.get).toHaveBeenCalledWith('technical-indicator/30min', {
        searchParams: {
          symbol: 'WMT',
          type: 'tema',
          period: 10,
        },
      });
    });

    it('should normalize symbol to uppercase', async () => {
      const mockData: TEMA[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await technical.getTEMA('pg');

      expect(mockClient.get).toHaveBeenCalledWith('technical-indicator/1day', {
        searchParams: {
          symbol: 'PG',
          type: 'tema',
          period: 10,
        },
      });
    });

    it('should handle client errors', async () => {
      const error = new Error('Server error');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(technical.getTEMA('AAPL')).rejects.toThrow('Server error');
    });
  });

  describe('Symbol normalization', () => {
    it('should handle lowercase symbols', async () => {
      const mockData: SMA[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await technical.getSMA('aapl');
      expect(mockClient.get).toHaveBeenCalledWith('technical-indicator/1day', expect.objectContaining({
        searchParams: expect.objectContaining({ symbol: 'AAPL' })
      }));
    });

    it('should handle mixed case symbols', async () => {
      const mockData: SMA[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await technical.getSMA('AaPl');
      expect(mockClient.get).toHaveBeenCalledWith('technical-indicator/1day', expect.objectContaining({
        searchParams: expect.objectContaining({ symbol: 'AAPL' })
      }));
    });

    it('should handle already uppercase symbols', async () => {
      const mockData: SMA[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await technical.getSMA('AAPL');
      expect(mockClient.get).toHaveBeenCalledWith('technical-indicator/1day', expect.objectContaining({
        searchParams: expect.objectContaining({ symbol: 'AAPL' })
      }));
    });
  });

  describe('Period parameter validation', () => {
    it('should accept various period values for SMA', async () => {
      const mockData: SMA[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await technical.getSMA('AAPL', 5);
      expect(mockClient.get).toHaveBeenLastCalledWith(
        'technical-indicator/1day',
        expect.objectContaining({
          searchParams: expect.objectContaining({ period: 5 })
        })
      );

      await technical.getSMA('AAPL', 50);
      expect(mockClient.get).toHaveBeenLastCalledWith(
        'technical-indicator/1day',
        expect.objectContaining({
          searchParams: expect.objectContaining({ period: 50 })
        })
      );

      await technical.getSMA('AAPL', 200);
      expect(mockClient.get).toHaveBeenLastCalledWith(
        'technical-indicator/1day',
        expect.objectContaining({
          searchParams: expect.objectContaining({ period: 200 })
        })
      );
    });

    it('should accept various period values for RSI', async () => {
      const mockData: RSI[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await technical.getRSI('AAPL', 9);
      expect(mockClient.get).toHaveBeenLastCalledWith(
        'technical-indicator/1day',
        expect.objectContaining({
          searchParams: expect.objectContaining({ period: 9 })
        })
      );

      await technical.getRSI('AAPL', 14);
      expect(mockClient.get).toHaveBeenLastCalledWith(
        'technical-indicator/1day',
        expect.objectContaining({
          searchParams: expect.objectContaining({ period: 14 })
        })
      );

      await technical.getRSI('AAPL', 25);
      expect(mockClient.get).toHaveBeenLastCalledWith(
        'technical-indicator/1day',
        expect.objectContaining({
          searchParams: expect.objectContaining({ period: 25 })
        })
      );
    });
  });

  describe('All timeframe values', () => {
    const timeframes = ['1min', '5min', '15min', '30min', '1hour', '4hour', '1day'] as const;

    timeframes.forEach((timeframe) => {
      it(`should support ${timeframe} timeframe for all indicators`, async () => {
        const mockData = [];
        vi.mocked(mockClient.get).mockResolvedValue(mockData);

        await technical.getSMA('AAPL', 10, timeframe);
        expect(mockClient.get).toHaveBeenLastCalledWith(
          `technical-indicator/${timeframe}`,
          expect.any(Object)
        );

        await technical.getEMA('AAPL', 10, timeframe);
        expect(mockClient.get).toHaveBeenLastCalledWith(
          `technical-indicator/${timeframe}`,
          expect.any(Object)
        );

        await technical.getRSI('AAPL', 14, timeframe);
        expect(mockClient.get).toHaveBeenLastCalledWith(
          `technical-indicator/${timeframe}`,
          expect.any(Object)
        );

        await technical.getADX('AAPL', 14, timeframe);
        expect(mockClient.get).toHaveBeenLastCalledWith(
          `technical-indicator/${timeframe}`,
          expect.any(Object)
        );

        await technical.getWilliams('AAPL', 14, timeframe);
        expect(mockClient.get).toHaveBeenLastCalledWith(
          `technical-indicator/${timeframe}`,
          expect.any(Object)
        );

        await technical.getStandardDeviation('AAPL', 10, timeframe);
        expect(mockClient.get).toHaveBeenLastCalledWith(
          `technical-indicator/${timeframe}`,
          expect.any(Object)
        );

        await technical.getWMA('AAPL', 10, timeframe);
        expect(mockClient.get).toHaveBeenLastCalledWith(
          `technical-indicator/${timeframe}`,
          expect.any(Object)
        );

        await technical.getDEMA('AAPL', 10, timeframe);
        expect(mockClient.get).toHaveBeenLastCalledWith(
          `technical-indicator/${timeframe}`,
          expect.any(Object)
        );

        await technical.getTEMA('AAPL', 10, timeframe);
        expect(mockClient.get).toHaveBeenLastCalledWith(
          `technical-indicator/${timeframe}`,
          expect.any(Object)
        );
      });
    });
  });

  describe('Error handling', () => {
    it('should propagate network errors', async () => {
      const networkError = new Error('Network failure');
      vi.mocked(mockClient.get).mockRejectedValue(networkError);

      await expect(technical.getSMA('AAPL')).rejects.toThrow('Network failure');
      await expect(technical.getEMA('AAPL')).rejects.toThrow('Network failure');
      await expect(technical.getRSI('AAPL')).rejects.toThrow('Network failure');
      await expect(technical.getADX('AAPL')).rejects.toThrow('Network failure');
      await expect(technical.getWilliams('AAPL')).rejects.toThrow('Network failure');
      await expect(technical.getStandardDeviation('AAPL')).rejects.toThrow('Network failure');
      await expect(technical.getWMA('AAPL')).rejects.toThrow('Network failure');
      await expect(technical.getDEMA('AAPL')).rejects.toThrow('Network failure');
      await expect(technical.getTEMA('AAPL')).rejects.toThrow('Network failure');
    });

    it('should handle API errors', async () => {
      const apiError = new Error('Invalid API key');
      vi.mocked(mockClient.get).mockRejectedValue(apiError);

      await expect(technical.getSMA('AAPL')).rejects.toThrow('Invalid API key');
    });

    it('should handle rate limit errors', async () => {
      const rateLimitError = new Error('Rate limit exceeded');
      vi.mocked(mockClient.get).mockRejectedValue(rateLimitError);

      await expect(technical.getRSI('AAPL')).rejects.toThrow('Rate limit exceeded');
    });

    it('should handle invalid symbol errors', async () => {
      const invalidSymbolError = new Error('Symbol not found');
      vi.mocked(mockClient.get).mockRejectedValue(invalidSymbolError);

      await expect(technical.getEMA('INVALID')).rejects.toThrow('Symbol not found');
    });
  });

  describe('Return type validation', () => {
    it('should return array of SMA objects', async () => {
      const mockData: SMA[] = [
        {
          date: '2024-01-01',
          open: 150.0,
          high: 152.0,
          low: 149.0,
          close: 151.0,
          volume: 1000000,
          sma: 150.5,
        },
        {
          date: '2024-01-02',
          open: 151.0,
          high: 153.0,
          low: 150.0,
          close: 152.0,
          volume: 1100000,
          sma: 151.0,
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      const result = await technical.getSMA('AAPL');
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('sma');
      expect(result[0]).toHaveProperty('date');
      expect(result[0]).toHaveProperty('close');
    });

    it('should return array of RSI objects', async () => {
      const mockData: RSI[] = [
        {
          date: '2024-01-01',
          open: 150.0,
          high: 152.0,
          low: 149.0,
          close: 151.0,
          volume: 1000000,
          rsi: 65.5,
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      const result = await technical.getRSI('AAPL');
      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toHaveProperty('rsi');
    });

    it('should return empty array when no data', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      const result = await technical.getSMA('AAPL');
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(0);
    });
  });

  describe('Complex scenarios', () => {
    it('should handle multiple concurrent requests', async () => {
      const mockSMAData: SMA[] = [{ date: '2024-01-01', open: 150, high: 152, low: 149, close: 151, volume: 1000000, sma: 150.5 }];
      const mockEMAData: EMA[] = [{ date: '2024-01-01', open: 150, high: 152, low: 149, close: 151, volume: 1000000, ema: 150.75 }];
      const mockRSIData: RSI[] = [{ date: '2024-01-01', open: 150, high: 152, low: 149, close: 151, volume: 1000000, rsi: 65.5 }];

      vi.mocked(mockClient.get)
        .mockResolvedValueOnce(mockSMAData)
        .mockResolvedValueOnce(mockEMAData)
        .mockResolvedValueOnce(mockRSIData);

      const [sma, ema, rsi] = await Promise.all([
        technical.getSMA('AAPL'),
        technical.getEMA('AAPL'),
        technical.getRSI('AAPL'),
      ]);

      expect(sma).toEqual(mockSMAData);
      expect(ema).toEqual(mockEMAData);
      expect(rsi).toEqual(mockRSIData);
      expect(mockClient.get).toHaveBeenCalledTimes(3);
    });

    it('should handle mixed symbol cases in batch requests', async () => {
      const mockData: SMA[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await Promise.all([
        technical.getSMA('aapl'),
        technical.getSMA('MSFT'),
        technical.getSMA('GoOgL'),
      ]);

      expect(mockClient.get).toHaveBeenCalledWith('technical-indicator/1day', expect.objectContaining({
        searchParams: expect.objectContaining({ symbol: 'AAPL' })
      }));
      expect(mockClient.get).toHaveBeenCalledWith('technical-indicator/1day', expect.objectContaining({
        searchParams: expect.objectContaining({ symbol: 'MSFT' })
      }));
      expect(mockClient.get).toHaveBeenCalledWith('technical-indicator/1day', expect.objectContaining({
        searchParams: expect.objectContaining({ symbol: 'GOOGL' })
      }));
    });

    it('should handle different timeframes for same symbol', async () => {
      const mockData: SMA[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await Promise.all([
        technical.getSMA('AAPL', 10, '1min'),
        technical.getSMA('AAPL', 10, '1hour'),
        technical.getSMA('AAPL', 10, '1day'),
      ]);

      expect(mockClient.get).toHaveBeenCalledWith('technical-indicator/1min', expect.any(Object));
      expect(mockClient.get).toHaveBeenCalledWith('technical-indicator/1hour', expect.any(Object));
      expect(mockClient.get).toHaveBeenCalledWith('technical-indicator/1day', expect.any(Object));
    });
  });
});
