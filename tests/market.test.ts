import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MarketResource, IntradayInterval } from '../src/resources/market.js';
import type { FMPClient } from '../src/client.js';
import type {
  IntradayChart,
  HistoricalPrice,
  ForexPrice,
  ForexCurrencyPair,
  ForexQuoteShort,
  LightChartData,
  CryptoPrice,
  CryptoList,
  MarketHours,
  MarketHoliday,
} from '../src/types/index.js';

describe('MarketResource', () => {
  let mockClient: FMPClient;
  let marketResource: MarketResource;

  beforeEach(() => {
    // Create a mock client with a get method
    mockClient = {
      get: vi.fn(),
    } as unknown as FMPClient;

    marketResource = new MarketResource(mockClient);
  });

  describe('getHistoricalPrices', () => {
    const mockHistoricalData: HistoricalPrice[] = [
      {
        date: '2024-01-01',
        open: 150.5,
        high: 152.3,
        low: 149.8,
        close: 151.2,
        adjClose: 151.2,
        volume: 1000000,
        unadjustedVolume: 1000000,
        change: 0.7,
        changePercent: 0.46,
        vwap: 151.0,
        label: 'January 01, 24',
        changeOverTime: 0.0046,
      },
    ];

    it('should fetch historical prices without date range', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockHistoricalData);

      const result = await marketResource.getHistoricalPrices('AAPL');

      expect(mockClient.get).toHaveBeenCalledWith('historical-price-eod/full', {
        searchParams: { symbol: 'AAPL' },
      });
      expect(result).toEqual(mockHistoricalData);
    });

    it('should fetch historical prices with from date', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockHistoricalData);

      const result = await marketResource.getHistoricalPrices('AAPL', '2024-01-01');

      expect(mockClient.get).toHaveBeenCalledWith('historical-price-eod/full', {
        searchParams: { symbol: 'AAPL', from: '2024-01-01' },
      });
      expect(result).toEqual(mockHistoricalData);
    });

    it('should fetch historical prices with date range', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockHistoricalData);

      const result = await marketResource.getHistoricalPrices(
        'AAPL',
        '2024-01-01',
        '2024-12-31'
      );

      expect(mockClient.get).toHaveBeenCalledWith('historical-price-eod/full', {
        searchParams: { symbol: 'AAPL', from: '2024-01-01', to: '2024-12-31' },
      });
      expect(result).toEqual(mockHistoricalData);
    });

    it('should convert symbol to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockHistoricalData);

      await marketResource.getHistoricalPrices('aapl');

      expect(mockClient.get).toHaveBeenCalledWith('historical-price-eod/full', {
        searchParams: { symbol: 'AAPL' },
      });
    });
  });

  describe('getHistoricalPricesLight', () => {
    const mockLightData: LightChartData[] = [
      {
        date: '2024-01-01',
        close: 151.2,
      },
    ];

    it('should fetch light historical prices without date range', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockLightData);

      const result = await marketResource.getHistoricalPricesLight('AAPL');

      expect(mockClient.get).toHaveBeenCalledWith('historical-price-eod/light', {
        searchParams: { symbol: 'AAPL' },
      });
      expect(result).toEqual(mockLightData);
    });

    it('should fetch light historical prices with date range', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockLightData);

      const result = await marketResource.getHistoricalPricesLight(
        'AAPL',
        '2024-01-01',
        '2024-12-31'
      );

      expect(mockClient.get).toHaveBeenCalledWith('historical-price-eod/light', {
        searchParams: { symbol: 'AAPL', from: '2024-01-01', to: '2024-12-31' },
      });
      expect(result).toEqual(mockLightData);
    });
  });

  describe('getIntradayChart', () => {
    const mockIntradayData: IntradayChart[] = [
      {
        date: '2024-01-01 09:30:00',
        open: 150.0,
        high: 151.0,
        low: 149.5,
        close: 150.5,
        volume: 50000,
      },
    ];

    it('should fetch intraday chart with default interval (1hour)', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockIntradayData);

      const result = await marketResource.getIntradayChart('AAPL');

      expect(mockClient.get).toHaveBeenCalledWith('historical-chart/1hour', {
        searchParams: { symbol: 'AAPL' },
      });
      expect(result).toEqual(mockIntradayData);
    });

    it('should fetch intraday chart with 1min interval', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockIntradayData);

      const result = await marketResource.getIntradayChart('AAPL', IntradayInterval.OneMin);

      expect(mockClient.get).toHaveBeenCalledWith('historical-chart/1min', {
        searchParams: { symbol: 'AAPL' },
      });
      expect(result).toEqual(mockIntradayData);
    });

    it('should fetch intraday chart with 5min interval', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockIntradayData);

      const result = await marketResource.getIntradayChart('AAPL', IntradayInterval.FiveMin);

      expect(mockClient.get).toHaveBeenCalledWith('historical-chart/5min', {
        searchParams: { symbol: 'AAPL' },
      });
      expect(result).toEqual(mockIntradayData);
    });

    it('should fetch intraday chart with 15min interval', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockIntradayData);

      const result = await marketResource.getIntradayChart('AAPL', IntradayInterval.FifteenMin);

      expect(mockClient.get).toHaveBeenCalledWith('historical-chart/15min', {
        searchParams: { symbol: 'AAPL' },
      });
      expect(result).toEqual(mockIntradayData);
    });

    it('should fetch intraday chart with 30min interval', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockIntradayData);

      const result = await marketResource.getIntradayChart('AAPL', IntradayInterval.ThirtyMin);

      expect(mockClient.get).toHaveBeenCalledWith('historical-chart/30min', {
        searchParams: { symbol: 'AAPL' },
      });
      expect(result).toEqual(mockIntradayData);
    });

    it('should fetch intraday chart with 4hour interval', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockIntradayData);

      const result = await marketResource.getIntradayChart('AAPL', IntradayInterval.FourHour);

      expect(mockClient.get).toHaveBeenCalledWith('historical-chart/4hour', {
        searchParams: { symbol: 'AAPL' },
      });
      expect(result).toEqual(mockIntradayData);
    });

    it('should fetch intraday chart with date range', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockIntradayData);

      const result = await marketResource.getIntradayChart(
        'AAPL',
        IntradayInterval.OneHour,
        '2024-01-01',
        '2024-01-31'
      );

      expect(mockClient.get).toHaveBeenCalledWith('historical-chart/1hour', {
        searchParams: { symbol: 'AAPL', from: '2024-01-01', to: '2024-01-31' },
      });
      expect(result).toEqual(mockIntradayData);
    });

    it('should convert symbol to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockIntradayData);

      await marketResource.getIntradayChart('tsla', IntradayInterval.OneMin);

      expect(mockClient.get).toHaveBeenCalledWith('historical-chart/1min', {
        searchParams: { symbol: 'TSLA' },
      });
    });
  });

  describe('getForexPrice', () => {
    const mockForexData: ForexPrice[] = [
      {
        ticker: 'EUR/USD',
        bid: 1.0850,
        ask: 1.0852,
        open: 1.0845,
        low: 1.0840,
        high: 1.0860,
        changes: 0.0005,
        date: '2024-01-01 12:00:00',
      },
    ];

    it('should fetch specific forex pair price', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockForexData);

      const result = await marketResource.getForexPrice('EURUSD');

      expect(mockClient.get).toHaveBeenCalledWith('quote', {
        searchParams: { symbol: 'EURUSD' },
      });
      expect(result).toEqual(mockForexData);
    });

    it('should convert pair to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockForexData);

      await marketResource.getForexPrice('eurusd');

      expect(mockClient.get).toHaveBeenCalledWith('quote', {
        searchParams: { symbol: 'EURUSD' },
      });
    });
  });

  describe('getAllForexPrices', () => {
    const mockForexData: ForexPrice[] = [
      {
        ticker: 'EUR/USD',
        bid: 1.0850,
        ask: 1.0852,
        open: 1.0845,
        low: 1.0840,
        high: 1.0860,
        changes: 0.0005,
        date: '2024-01-01 12:00:00',
      },
    ];

    it('should fetch all forex prices', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockForexData);

      const result = await marketResource.getAllForexPrices();

      expect(mockClient.get).toHaveBeenCalledWith('batch-forex-quotes');
      expect(result).toEqual(mockForexData);
    });
  });

  describe('getHistoricalForex', () => {
    const mockHistoricalForex: HistoricalPrice[] = [
      {
        date: '2024-01-01',
        open: 1.0850,
        high: 1.0860,
        low: 1.0840,
        close: 1.0855,
        adjClose: 1.0855,
        volume: 0,
        unadjustedVolume: 0,
        change: 0.0005,
        changePercent: 0.05,
        vwap: 1.0851,
        label: 'January 01, 24',
        changeOverTime: 0.0005,
      },
    ];

    it('should fetch historical forex without date range', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockHistoricalForex);

      const result = await marketResource.getHistoricalForex('EURUSD');

      expect(mockClient.get).toHaveBeenCalledWith('historical-price-eod/full', {
        searchParams: { symbol: 'EURUSD' },
      });
      expect(result).toEqual(mockHistoricalForex);
    });

    it('should fetch historical forex with date range', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockHistoricalForex);

      const result = await marketResource.getHistoricalForex(
        'EURUSD',
        '2024-01-01',
        '2024-12-31'
      );

      expect(mockClient.get).toHaveBeenCalledWith('historical-price-eod/full', {
        searchParams: { symbol: 'EURUSD', from: '2024-01-01', to: '2024-12-31' },
      });
      expect(result).toEqual(mockHistoricalForex);
    });

    it('should convert pair to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockHistoricalForex);

      await marketResource.getHistoricalForex('gbpusd');

      expect(mockClient.get).toHaveBeenCalledWith('historical-price-eod/full', {
        searchParams: { symbol: 'GBPUSD' },
      });
    });
  });

  describe('getCryptoPrice', () => {
    const mockCryptoData: CryptoPrice[] = [
      {
        symbol: 'BTCUSD',
        name: 'Bitcoin USD',
        price: 45000,
        changesPercentage: 2.5,
        change: 1100,
        dayLow: 44000,
        dayHigh: 46000,
        yearHigh: 69000,
        yearLow: 15000,
        marketCap: 880000000000,
        priceAvg50: 43000,
        priceAvg200: 35000,
        volume: 25000000000,
        avgVolume: 22000000000,
        exchange: 'CRYPTO',
        open: 44500,
        previousClose: 43900,
        timestamp: 1704110400,
      },
    ];

    it('should fetch specific crypto price', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockCryptoData);

      const result = await marketResource.getCryptoPrice('BTCUSD');

      expect(mockClient.get).toHaveBeenCalledWith('quote', {
        searchParams: { symbol: 'BTCUSD' },
      });
      expect(result).toEqual(mockCryptoData);
    });

    it('should convert symbol to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockCryptoData);

      await marketResource.getCryptoPrice('ethusd');

      expect(mockClient.get).toHaveBeenCalledWith('quote', {
        searchParams: { symbol: 'ETHUSD' },
      });
    });
  });

  describe('getAllCryptoPrices', () => {
    const mockCryptoData: CryptoPrice[] = [
      {
        symbol: 'BTCUSD',
        name: 'Bitcoin USD',
        price: 45000,
        changesPercentage: 2.5,
        change: 1100,
        dayLow: 44000,
        dayHigh: 46000,
        yearHigh: 69000,
        yearLow: 15000,
        marketCap: 880000000000,
        priceAvg50: 43000,
        priceAvg200: 35000,
        volume: 25000000000,
        avgVolume: 22000000000,
        exchange: 'CRYPTO',
        open: 44500,
        previousClose: 43900,
        timestamp: 1704110400,
      },
    ];

    it('should fetch all crypto prices', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockCryptoData);

      const result = await marketResource.getAllCryptoPrices();

      expect(mockClient.get).toHaveBeenCalledWith('batch-crypto-quotes');
      expect(result).toEqual(mockCryptoData);
    });
  });

  describe('getMarketHours', () => {
    const mockMarketHours: MarketHours[] = [
      {
        stockExchangeName: 'New York Stock Exchange',
        stockMarketHours: {
          openingHour: '09:30:00',
          closingHour: '16:00:00',
        },
        stockMarketHolidays: ['2024-01-01', '2024-07-04', '2024-12-25'],
        isTheStockMarketOpen: true,
        isTheEuronextMarketOpen: false,
        isTheForexMarketOpen: true,
        isTheCryptoMarketOpen: true,
      },
    ];

    it('should fetch market hours for specific exchange', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockMarketHours);

      const result = await marketResource.getMarketHours('NYSE');

      expect(mockClient.get).toHaveBeenCalledWith('exchange-market-hours', {
        searchParams: { exchange: 'NYSE' },
      });
      expect(result).toEqual(mockMarketHours);
    });
  });

  describe('getMarketHolidays', () => {
    const mockHolidays: MarketHoliday[] = [
      {
        year: 2024,
        'New Years Day': '2024-01-01',
        'Martin Luther King, Jr. Day': '2024-01-15',
        "Washington's Birthday": '2024-02-19',
        'Good Friday': '2024-03-29',
        'Memorial Day': '2024-05-27',
        'Independence Day': '2024-07-04',
        'Labor Day': '2024-09-02',
        'Thanksgiving Day': '2024-11-28',
        Christmas: '2024-12-25',
      },
    ];

    it('should fetch market holidays for specific exchange', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockHolidays);

      const result = await marketResource.getMarketHolidays('NYSE');

      expect(mockClient.get).toHaveBeenCalledWith('holidays-by-exchange', {
        searchParams: { exchange: 'NYSE' },
      });
      expect(result).toEqual(mockHolidays);
    });
  });

  describe('getAllMarketHours', () => {
    const mockAllMarketHours: MarketHours[] = [
      {
        stockExchangeName: 'New York Stock Exchange',
        stockMarketHours: {
          openingHour: '09:30:00',
          closingHour: '16:00:00',
        },
        stockMarketHolidays: ['2024-01-01', '2024-07-04', '2024-12-25'],
        isTheStockMarketOpen: true,
        isTheEuronextMarketOpen: false,
        isTheForexMarketOpen: true,
        isTheCryptoMarketOpen: true,
      },
      {
        stockExchangeName: 'NASDAQ',
        stockMarketHours: {
          openingHour: '09:30:00',
          closingHour: '16:00:00',
        },
        stockMarketHolidays: ['2024-01-01', '2024-07-04', '2024-12-25'],
        isTheStockMarketOpen: true,
        isTheEuronextMarketOpen: false,
        isTheForexMarketOpen: true,
        isTheCryptoMarketOpen: true,
      },
    ];

    it('should fetch all market hours', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockAllMarketHours);

      const result = await marketResource.getAllMarketHours();

      expect(mockClient.get).toHaveBeenCalledWith('all-exchange-market-hours');
      expect(result).toEqual(mockAllMarketHours);
    });
  });

  describe('getForexCurrencyPairs', () => {
    const mockPairs: ForexCurrencyPair[] = [
      {
        symbol: 'EURUSD',
        name: 'EUR/USD',
        currency: 'USD',
        stockExchange: 'CCY',
        exchangeShortName: 'FOREX',
      },
    ];

    it('should fetch forex currency pairs', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockPairs);

      const result = await marketResource.getForexCurrencyPairs();

      expect(mockClient.get).toHaveBeenCalledWith('forex-list');
      expect(result).toEqual(mockPairs);
    });
  });

  describe('getForexQuoteShort', () => {
    const mockQuotes: ForexQuoteShort[] = [
      {
        symbol: 'EURUSD',
        price: 1.0850,
        volume: 1000000,
      },
    ];

    it('should fetch specific forex quote', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockQuotes);

      const result = await marketResource.getForexQuoteShort('EURUSD');

      expect(mockClient.get).toHaveBeenCalledWith('quote-short', {
        searchParams: { symbol: 'EURUSD' },
      });
      expect(result).toEqual(mockQuotes);
    });

    it('should convert pair to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockQuotes);

      await marketResource.getForexQuoteShort('eurusd');

      expect(mockClient.get).toHaveBeenCalledWith('quote-short', {
        searchParams: { symbol: 'EURUSD' },
      });
    });
  });

  describe('getForexLightChart', () => {
    const mockLightChart: LightChartData[] = [
      {
        date: '2024-01-01',
        close: 1.0850,
      },
    ];

    it('should fetch forex light chart without date range', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockLightChart);

      const result = await marketResource.getForexLightChart('EURUSD');

      expect(mockClient.get).toHaveBeenCalledWith('historical-price-eod/light', {
        searchParams: { symbol: 'EURUSD' },
      });
      expect(result).toEqual(mockLightChart);
    });

    it('should fetch forex light chart with date range', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockLightChart);

      const result = await marketResource.getForexLightChart(
        'EURUSD',
        '2024-01-01',
        '2024-12-31'
      );

      expect(mockClient.get).toHaveBeenCalledWith('historical-price-eod/light', {
        searchParams: { symbol: 'EURUSD', from: '2024-01-01', to: '2024-12-31' },
      });
      expect(result).toEqual(mockLightChart);
    });

    it('should convert pair to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockLightChart);

      await marketResource.getForexLightChart('gbpjpy');

      expect(mockClient.get).toHaveBeenCalledWith('historical-price-eod/light', {
        searchParams: { symbol: 'GBPJPY' },
      });
    });
  });

  describe('getForexIntraday', () => {
    const mockIntradayData: IntradayChart[] = [
      {
        date: '2024-01-01 09:30:00',
        open: 1.0850,
        high: 1.0852,
        low: 1.0848,
        close: 1.0851,
        volume: 10000,
      },
    ];

    it('should fetch forex intraday data with default interval', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockIntradayData);

      const result = await marketResource.getForexIntraday('EURUSD');

      expect(mockClient.get).toHaveBeenCalledWith('historical-chart/1hour', {
        searchParams: { symbol: 'EURUSD' },
      });
      expect(result).toEqual(mockIntradayData);
    });

    it('should fetch forex intraday data with custom interval', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockIntradayData);

      const result = await marketResource.getForexIntraday('EURUSD', IntradayInterval.FiveMin);

      expect(mockClient.get).toHaveBeenCalledWith('historical-chart/5min', {
        searchParams: { symbol: 'EURUSD' },
      });
      expect(result).toEqual(mockIntradayData);
    });

    it('should fetch forex intraday data with date range', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockIntradayData);

      const result = await marketResource.getForexIntraday(
        'EURUSD',
        IntradayInterval.OneMin,
        '2024-01-01',
        '2024-01-02'
      );

      expect(mockClient.get).toHaveBeenCalledWith('historical-chart/1min', {
        searchParams: { symbol: 'EURUSD', from: '2024-01-01', to: '2024-01-02' },
      });
      expect(result).toEqual(mockIntradayData);
    });

    it('should convert pair to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockIntradayData);

      await marketResource.getForexIntraday('usdjpy');

      expect(mockClient.get).toHaveBeenCalledWith('historical-chart/1hour', {
        searchParams: { symbol: 'USDJPY' },
      });
    });
  });

  describe('getCryptoList', () => {
    const mockCryptoList: CryptoList[] = [
      {
        symbol: 'BTCUSD',
        name: 'Bitcoin USD',
        currency: 'USD',
        stockExchange: 'CRYPTO',
        exchangeShortName: 'CRYPTO',
      },
    ];

    it('should fetch crypto list', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockCryptoList);

      const result = await marketResource.getCryptoList();

      expect(mockClient.get).toHaveBeenCalledWith('cryptocurrency-list');
      expect(result).toEqual(mockCryptoList);
    });
  });

  describe('getCryptoQuoteShort', () => {
    const mockCryptoQuote: ForexQuoteShort[] = [
      {
        symbol: 'BTCUSD',
        price: 45000,
        volume: 25000000000,
      },
    ];

    it('should fetch specific crypto quote short', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockCryptoQuote);

      const result = await marketResource.getCryptoQuoteShort('BTCUSD');

      expect(mockClient.get).toHaveBeenCalledWith('quote-short', {
        searchParams: { symbol: 'BTCUSD' },
      });
      expect(result).toEqual(mockCryptoQuote);
    });

    it('should convert symbol to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockCryptoQuote);

      await marketResource.getCryptoQuoteShort('ethusd');

      expect(mockClient.get).toHaveBeenCalledWith('quote-short', {
        searchParams: { symbol: 'ETHUSD' },
      });
    });
  });

  describe('getCryptoLightChart', () => {
    const mockLightChart: LightChartData[] = [
      {
        date: '2024-01-01',
        close: 45000,
      },
    ];

    it('should fetch crypto light chart without date range', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockLightChart);

      const result = await marketResource.getCryptoLightChart('BTCUSD');

      expect(mockClient.get).toHaveBeenCalledWith('historical-price-eod/light', {
        searchParams: { symbol: 'BTCUSD' },
      });
      expect(result).toEqual(mockLightChart);
    });

    it('should fetch crypto light chart with date range', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockLightChart);

      const result = await marketResource.getCryptoLightChart(
        'BTCUSD',
        '2024-01-01',
        '2024-12-31'
      );

      expect(mockClient.get).toHaveBeenCalledWith('historical-price-eod/light', {
        searchParams: { symbol: 'BTCUSD', from: '2024-01-01', to: '2024-12-31' },
      });
      expect(result).toEqual(mockLightChart);
    });

    it('should convert symbol to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockLightChart);

      await marketResource.getCryptoLightChart('ethusd');

      expect(mockClient.get).toHaveBeenCalledWith('historical-price-eod/light', {
        searchParams: { symbol: 'ETHUSD' },
      });
    });
  });

  describe('getCryptoFullChart', () => {
    const mockFullChart: HistoricalPrice[] = [
      {
        date: '2024-01-01',
        open: 45000,
        high: 46000,
        low: 44000,
        close: 45500,
        adjClose: 45500,
        volume: 25000000000,
        unadjustedVolume: 25000000000,
        change: 500,
        changePercent: 1.11,
        vwap: 45300,
        label: 'January 01, 24',
        changeOverTime: 0.0111,
      },
    ];

    it('should fetch crypto full chart without date range', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockFullChart);

      const result = await marketResource.getCryptoFullChart('BTCUSD');

      expect(mockClient.get).toHaveBeenCalledWith('historical-price-eod/full', {
        searchParams: { symbol: 'BTCUSD' },
      });
      expect(result).toEqual(mockFullChart);
    });

    it('should fetch crypto full chart with date range', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockFullChart);

      const result = await marketResource.getCryptoFullChart(
        'BTCUSD',
        '2024-01-01',
        '2024-12-31'
      );

      expect(mockClient.get).toHaveBeenCalledWith('historical-price-eod/full', {
        searchParams: { symbol: 'BTCUSD', from: '2024-01-01', to: '2024-12-31' },
      });
      expect(result).toEqual(mockFullChart);
    });

    it('should convert symbol to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockFullChart);

      await marketResource.getCryptoFullChart('btcusd');

      expect(mockClient.get).toHaveBeenCalledWith('historical-price-eod/full', {
        searchParams: { symbol: 'BTCUSD' },
      });
    });
  });

  describe('getCryptoIntraday', () => {
    const mockIntradayData: IntradayChart[] = [
      {
        date: '2024-01-01 09:30:00',
        open: 45000,
        high: 45100,
        low: 44900,
        close: 45050,
        volume: 1000000,
      },
    ];

    it('should fetch crypto intraday data with default interval', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockIntradayData);

      const result = await marketResource.getCryptoIntraday('BTCUSD');

      expect(mockClient.get).toHaveBeenCalledWith('historical-chart/1hour', {
        searchParams: { symbol: 'BTCUSD' },
      });
      expect(result).toEqual(mockIntradayData);
    });

    it('should fetch crypto intraday data with custom interval', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockIntradayData);

      const result = await marketResource.getCryptoIntraday('BTCUSD', IntradayInterval.FiveMin);

      expect(mockClient.get).toHaveBeenCalledWith('historical-chart/5min', {
        searchParams: { symbol: 'BTCUSD' },
      });
      expect(result).toEqual(mockIntradayData);
    });

    it('should fetch crypto intraday data with date range', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockIntradayData);

      const result = await marketResource.getCryptoIntraday(
        'BTCUSD',
        IntradayInterval.OneMin,
        '2024-01-01',
        '2024-01-02'
      );

      expect(mockClient.get).toHaveBeenCalledWith('historical-chart/1min', {
        searchParams: { symbol: 'BTCUSD', from: '2024-01-01', to: '2024-01-02' },
      });
      expect(result).toEqual(mockIntradayData);
    });

    it('should convert symbol to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockIntradayData);

      await marketResource.getCryptoIntraday('ethusd');

      expect(mockClient.get).toHaveBeenCalledWith('historical-chart/1hour', {
        searchParams: { symbol: 'ETHUSD' },
      });
    });
  });

  describe('getUnadjustedPrice', () => {
    const mockUnadjustedData: HistoricalPrice[] = [
      {
        date: '2024-01-01',
        open: 150.0,
        high: 152.0,
        low: 149.0,
        close: 150.5,
        adjClose: 150.5,
        volume: 1000000,
        unadjustedVolume: 1000000,
        change: 0.5,
        changePercent: 0.33,
        vwap: 150.3,
        label: 'January 01, 24',
        changeOverTime: 0.0033,
      },
    ];

    it('should fetch unadjusted prices without date range', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockUnadjustedData);

      const result = await marketResource.getUnadjustedPrice('AAPL');

      expect(mockClient.get).toHaveBeenCalledWith('historical-price-eod/non-split-adjusted', {
        searchParams: { symbol: 'AAPL' },
      });
      expect(result).toEqual(mockUnadjustedData);
    });

    it('should fetch unadjusted prices with date range', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockUnadjustedData);

      const result = await marketResource.getUnadjustedPrice(
        'AAPL',
        '2024-01-01',
        '2024-12-31'
      );

      expect(mockClient.get).toHaveBeenCalledWith('historical-price-eod/non-split-adjusted', {
        searchParams: { symbol: 'AAPL', from: '2024-01-01', to: '2024-12-31' },
      });
      expect(result).toEqual(mockUnadjustedData);
    });

    it('should convert symbol to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockUnadjustedData);

      await marketResource.getUnadjustedPrice('msft');

      expect(mockClient.get).toHaveBeenCalledWith('historical-price-eod/non-split-adjusted', {
        searchParams: { symbol: 'MSFT' },
      });
    });
  });

  describe('getDividendAdjusted', () => {
    const mockDividendAdjusted: HistoricalPrice[] = [
      {
        date: '2024-01-01',
        open: 150.0,
        high: 152.0,
        low: 149.0,
        close: 151.0,
        adjClose: 149.5,
        volume: 1000000,
        unadjustedVolume: 1000000,
        change: 1.0,
        changePercent: 0.67,
        vwap: 150.5,
        label: 'January 01, 24',
        changeOverTime: 0.0067,
      },
    ];

    it('should fetch dividend-adjusted prices without date range', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockDividendAdjusted);

      const result = await marketResource.getDividendAdjusted('AAPL');

      expect(mockClient.get).toHaveBeenCalledWith('historical-price-eod/dividend-adjusted', {
        searchParams: { symbol: 'AAPL' },
      });
      expect(result).toEqual(mockDividendAdjusted);
    });

    it('should fetch dividend-adjusted prices with date range', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockDividendAdjusted);

      const result = await marketResource.getDividendAdjusted(
        'AAPL',
        '2024-01-01',
        '2024-12-31'
      );

      expect(mockClient.get).toHaveBeenCalledWith('historical-price-eod/dividend-adjusted', {
        searchParams: { symbol: 'AAPL', from: '2024-01-01', to: '2024-12-31' },
      });
      expect(result).toEqual(mockDividendAdjusted);
    });

    it('should convert symbol to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockDividendAdjusted);

      await marketResource.getDividendAdjusted('goog');

      expect(mockClient.get).toHaveBeenCalledWith('historical-price-eod/dividend-adjusted', {
        searchParams: { symbol: 'GOOG' },
      });
    });
  });

  describe('Error Handling', () => {
    it('should propagate client errors', async () => {
      const error = new Error('Network error');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(marketResource.getHistoricalPrices('AAPL')).rejects.toThrow(
        'Network error'
      );
    });

    it('should handle API errors', async () => {
      const apiError = new Error('API Error: Invalid symbol');
      vi.mocked(mockClient.get).mockRejectedValue(apiError);

      await expect(marketResource.getIntradayChart('INVALID')).rejects.toThrow(
        'API Error: Invalid symbol'
      );
    });

    it('should handle errors in forex methods', async () => {
      const error = new Error('Forex API unavailable');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(marketResource.getForexPrice('EURUSD')).rejects.toThrow(
        'Forex API unavailable'
      );
    });

    it('should handle errors in crypto methods', async () => {
      const error = new Error('Crypto API unavailable');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(marketResource.getCryptoPrice('BTCUSD')).rejects.toThrow(
        'Crypto API unavailable'
      );
    });
  });

  describe('Symbol Case Handling', () => {
    const mockData: HistoricalPrice[] = [];

    it('should handle mixed case symbols', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await marketResource.getHistoricalPrices('AaPl');

      expect(mockClient.get).toHaveBeenCalledWith('historical-price-eod/full', {
        searchParams: { symbol: 'AAPL' },
      });
    });

    it('should handle lowercase forex pairs', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await marketResource.getForexPrice('eurusd');

      expect(mockClient.get).toHaveBeenCalledWith('quote', {
        searchParams: { symbol: 'EURUSD' },
      });
    });

    it('should handle lowercase crypto symbols', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await marketResource.getCryptoPrice('btcusd');

      expect(mockClient.get).toHaveBeenCalledWith('quote', {
        searchParams: { symbol: 'BTCUSD' },
      });
    });
  });

  describe('Date Parameter Handling', () => {
    const mockData: HistoricalPrice[] = [];

    it('should handle only from date', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await marketResource.getHistoricalPrices('AAPL', '2024-01-01');

      expect(mockClient.get).toHaveBeenCalledWith('historical-price-eod/full', {
        searchParams: { symbol: 'AAPL', from: '2024-01-01' },
      });
    });

    it('should handle both from and to dates', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await marketResource.getHistoricalPrices(
        'AAPL',
        '2024-01-01',
        '2024-12-31'
      );

      expect(mockClient.get).toHaveBeenCalledWith('historical-price-eod/full', {
        searchParams: { symbol: 'AAPL', from: '2024-01-01', to: '2024-12-31' },
      });
    });

    it('should not include undefined dates in params', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await marketResource.getHistoricalPrices('AAPL');

      const params = vi.mocked(mockClient.get).mock.calls[0][1];
      expect(params).toEqual({ searchParams: { symbol: 'AAPL' } });
      expect(params?.searchParams).not.toHaveProperty('from');
      expect(params?.searchParams).not.toHaveProperty('to');
    });
  });

  describe('Interval Validation', () => {
    const mockData: IntradayChart[] = [];

    it('should accept 1min interval', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await marketResource.getIntradayChart('AAPL', IntradayInterval.OneMin);

      expect(mockClient.get).toHaveBeenCalledWith('historical-chart/1min', {
        searchParams: { symbol: 'AAPL' },
      });
    });

    it('should accept 5min interval', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await marketResource.getIntradayChart('AAPL', IntradayInterval.FiveMin);

      expect(mockClient.get).toHaveBeenCalledWith('historical-chart/5min', {
        searchParams: { symbol: 'AAPL' },
      });
    });

    it('should accept 15min interval', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await marketResource.getIntradayChart('AAPL', IntradayInterval.FifteenMin);

      expect(mockClient.get).toHaveBeenCalledWith('historical-chart/15min', {
        searchParams: { symbol: 'AAPL' },
      });
    });

    it('should accept 30min interval', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await marketResource.getIntradayChart('AAPL', IntradayInterval.ThirtyMin);

      expect(mockClient.get).toHaveBeenCalledWith('historical-chart/30min', {
        searchParams: { symbol: 'AAPL' },
      });
    });

    it('should accept 1hour interval', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await marketResource.getIntradayChart('AAPL', IntradayInterval.OneHour);

      expect(mockClient.get).toHaveBeenCalledWith('historical-chart/1hour', {
        searchParams: { symbol: 'AAPL' },
      });
    });

    it('should accept 4hour interval', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await marketResource.getIntradayChart('AAPL', IntradayInterval.FourHour);

      expect(mockClient.get).toHaveBeenCalledWith('historical-chart/4hour', {
        searchParams: { symbol: 'AAPL' },
      });
    });
  });
});
