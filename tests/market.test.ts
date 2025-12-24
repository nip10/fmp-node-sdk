import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MarketResource } from '../src/resources/market.js';
import type { FMPClient } from '../src/client.js';
import type {
  IntradayChart,
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
    const mockHistoricalData = {
      historical: [
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
      ],
    };

    it('should fetch historical prices without date range', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockHistoricalData);

      const result = await marketResource.getHistoricalPrices('AAPL');

      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/historical-price-full/AAPL',
        { searchParams: {} }
      );
      expect(result).toEqual(mockHistoricalData);
    });

    it('should fetch historical prices with from date', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockHistoricalData);

      const result = await marketResource.getHistoricalPrices('AAPL', '2024-01-01');

      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/historical-price-full/AAPL',
        { searchParams: {   from: '2024-01-01' }, }

      );
      expect(result).toEqual(mockHistoricalData);
    });

    it('should fetch historical prices with date range', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockHistoricalData);

      const result = await marketResource.getHistoricalPrices(
        'AAPL',
        '2024-01-01',
        '2024-12-31'
      );

      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/historical-price-full/AAPL',
        { searchParams: {   from: '2024-01-01', to: '2024-12-31' }, }

      );
      expect(result).toEqual(mockHistoricalData);
    });

    it('should convert symbol to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockHistoricalData);

      await marketResource.getHistoricalPrices('aapl');

      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/historical-price-full/AAPL',
        { searchParams: {} }
      );
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

      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/historical-chart/1hour/AAPL',
        { searchParams: {} }
      );
      expect(result).toEqual(mockIntradayData);
    });

    it('should fetch intraday chart with 1min interval', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockIntradayData);

      const result = await marketResource.getIntradayChart('AAPL', '1min');

      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/historical-chart/1min/AAPL',
        { searchParams: {} }
      );
      expect(result).toEqual(mockIntradayData);
    });

    it('should fetch intraday chart with 5min interval', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockIntradayData);

      const result = await marketResource.getIntradayChart('AAPL', '5min');

      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/historical-chart/5min/AAPL',
        { searchParams: {} }
      );
      expect(result).toEqual(mockIntradayData);
    });

    it('should fetch intraday chart with 15min interval', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockIntradayData);

      const result = await marketResource.getIntradayChart('AAPL', '15min');

      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/historical-chart/15min/AAPL',
        { searchParams: {} }
      );
      expect(result).toEqual(mockIntradayData);
    });

    it('should fetch intraday chart with 30min interval', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockIntradayData);

      const result = await marketResource.getIntradayChart('AAPL', '30min');

      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/historical-chart/30min/AAPL',
        { searchParams: {} }
      );
      expect(result).toEqual(mockIntradayData);
    });

    it('should fetch intraday chart with 4hour interval', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockIntradayData);

      const result = await marketResource.getIntradayChart('AAPL', '4hour');

      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/historical-chart/4hour/AAPL',
        { searchParams: {} }
      );
      expect(result).toEqual(mockIntradayData);
    });

    it('should fetch intraday chart with date range', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockIntradayData);

      const result = await marketResource.getIntradayChart(
        'AAPL',
        '1hour',
        '2024-01-01',
        '2024-01-31'
      );

      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/historical-chart/1hour/AAPL',
        { searchParams: {   from: '2024-01-01', to: '2024-01-31' }, }

      );
      expect(result).toEqual(mockIntradayData);
    });

    it('should convert symbol to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockIntradayData);

      await marketResource.getIntradayChart('tsla', '1min');

      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/historical-chart/1min/TSLA',
        { searchParams: {} }
      );
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

      expect(mockClient.get).toHaveBeenCalledWith('v3/fx/EURUSD');
      expect(result).toEqual(mockForexData);
    });

    it('should fetch all forex prices when no pair specified', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockForexData);

      const result = await marketResource.getForexPrice();

      expect(mockClient.get).toHaveBeenCalledWith('v3/fx');
      expect(result).toEqual(mockForexData);
    });

    it('should convert pair to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockForexData);

      await marketResource.getForexPrice('eurusd');

      expect(mockClient.get).toHaveBeenCalledWith('v3/fx/EURUSD');
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

      expect(mockClient.get).toHaveBeenCalledWith('v3/fx');
      expect(result).toEqual(mockForexData);
    });
  });

  describe('getHistoricalForex', () => {
    const mockHistoricalForex = {
      historical: [
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
      ],
    };

    it('should fetch historical forex without date range', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockHistoricalForex);

      const result = await marketResource.getHistoricalForex('EURUSD');

      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/historical-price-full/EURUSD',
        { searchParams: {} }
      );
      expect(result).toEqual(mockHistoricalForex);
    });

    it('should fetch historical forex with date range', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockHistoricalForex);

      const result = await marketResource.getHistoricalForex(
        'EURUSD',
        '2024-01-01',
        '2024-12-31'
      );

      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/historical-price-full/EURUSD',
        { searchParams: {   from: '2024-01-01', to: '2024-12-31' }, }

      );
      expect(result).toEqual(mockHistoricalForex);
    });

    it('should convert pair to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockHistoricalForex);

      await marketResource.getHistoricalForex('gbpusd');

      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/historical-price-full/GBPUSD',
        { searchParams: {} }
      );
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

      expect(mockClient.get).toHaveBeenCalledWith('v3/quote/BTCUSD');
      expect(result).toEqual(mockCryptoData);
    });

    it('should fetch all crypto prices when no symbol specified', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockCryptoData);

      const result = await marketResource.getCryptoPrice();

      expect(mockClient.get).toHaveBeenCalledWith('v3/quotes/crypto');
      expect(result).toEqual(mockCryptoData);
    });

    it('should convert symbol to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockCryptoData);

      await marketResource.getCryptoPrice('ethusd');

      expect(mockClient.get).toHaveBeenCalledWith('v3/quote/ETHUSD');
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

      expect(mockClient.get).toHaveBeenCalledWith('v3/quotes/crypto');
      expect(result).toEqual(mockCryptoData);
    });
  });

  describe('getMarketHours', () => {
    const mockMarketHours: MarketHours = {
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
    };

    it('should fetch market hours without exchange', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockMarketHours);

      const result = await marketResource.getMarketHours();

      expect(mockClient.get).toHaveBeenCalledWith('v3/is-the-market-open', { searchParams: {} });
      expect(result).toEqual(mockMarketHours);
    });

    it('should fetch market hours for specific exchange', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockMarketHours);

      const result = await marketResource.getMarketHours('NYSE');

      expect(mockClient.get).toHaveBeenCalledWith('v3/is-the-market-open', {
        searchParams: {
          exchange: 'NYSE',
      },
      }
);
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
        'Christmas': '2024-12-25',
      },
    ];

    it('should fetch market holidays', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockHolidays);

      const result = await marketResource.getMarketHolidays();

      expect(mockClient.get).toHaveBeenCalledWith('v3/market-holidays');
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

      expect(mockClient.get).toHaveBeenCalledWith('v3/market-hours');
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

      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/symbol/available-forex-currency-pairs'
      );
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

      expect(mockClient.get).toHaveBeenCalledWith('v3/forex/EURUSD');
      expect(result).toEqual(mockQuotes);
    });

    it('should fetch all forex quotes when no pair specified', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockQuotes);

      const result = await marketResource.getForexQuoteShort();

      expect(mockClient.get).toHaveBeenCalledWith('v3/forex');
      expect(result).toEqual(mockQuotes);
    });

    it('should convert pair to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockQuotes);

      await marketResource.getForexQuoteShort('eurusd');

      expect(mockClient.get).toHaveBeenCalledWith('v3/forex/EURUSD');
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

      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/historical-chart/line/EURUSD',
        { searchParams: {} }
      );
      expect(result).toEqual(mockLightChart);
    });

    it('should fetch forex light chart with date range', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockLightChart);

      const result = await marketResource.getForexLightChart(
        'EURUSD',
        '2024-01-01',
        '2024-12-31'
      );

      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/historical-chart/line/EURUSD',
        { searchParams: {   from: '2024-01-01', to: '2024-12-31' }, }

      );
      expect(result).toEqual(mockLightChart);
    });

    it('should convert pair to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockLightChart);

      await marketResource.getForexLightChart('gbpjpy');

      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/historical-chart/line/GBPJPY',
        { searchParams: {} }
      );
    });
  });

  describe('getForexIntraday1Min', () => {
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

    it('should fetch 1-minute forex intraday data', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockIntradayData);

      const result = await marketResource.getForexIntraday1Min('EURUSD');

      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/historical-chart/1min/EURUSD',
        { searchParams: {} }
      );
      expect(result).toEqual(mockIntradayData);
    });

    it('should fetch 1-minute forex intraday data with date range', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockIntradayData);

      const result = await marketResource.getForexIntraday1Min(
        'EURUSD',
        '2024-01-01',
        '2024-01-02'
      );

      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/historical-chart/1min/EURUSD',
        { searchParams: {   from: '2024-01-01', to: '2024-01-02' }, }

      );
      expect(result).toEqual(mockIntradayData);
    });

    it('should convert pair to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockIntradayData);

      await marketResource.getForexIntraday1Min('usdjpy');

      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/historical-chart/1min/USDJPY',
        { searchParams: {} }
      );
    });
  });

  describe('getForexIntraday5Min', () => {
    const mockIntradayData: IntradayChart[] = [
      {
        date: '2024-01-01 09:30:00',
        open: 1.0850,
        high: 1.0855,
        low: 1.0845,
        close: 1.0852,
        volume: 50000,
      },
    ];

    it('should fetch 5-minute forex intraday data', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockIntradayData);

      const result = await marketResource.getForexIntraday5Min('EURUSD');

      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/historical-chart/5min/EURUSD',
        { searchParams: {} }
      );
      expect(result).toEqual(mockIntradayData);
    });

    it('should fetch 5-minute forex intraday data with date range', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockIntradayData);

      const result = await marketResource.getForexIntraday5Min(
        'EURUSD',
        '2024-01-01',
        '2024-01-02'
      );

      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/historical-chart/5min/EURUSD',
        { searchParams: {   from: '2024-01-01', to: '2024-01-02' }, }

      );
      expect(result).toEqual(mockIntradayData);
    });
  });

  describe('getForexIntraday1Hour', () => {
    const mockIntradayData: IntradayChart[] = [
      {
        date: '2024-01-01 09:00:00',
        open: 1.0850,
        high: 1.0870,
        low: 1.0840,
        close: 1.0865,
        volume: 500000,
      },
    ];

    it('should fetch 1-hour forex intraday data', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockIntradayData);

      const result = await marketResource.getForexIntraday1Hour('EURUSD');

      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/historical-chart/1hour/EURUSD',
        { searchParams: {} }
      );
      expect(result).toEqual(mockIntradayData);
    });

    it('should fetch 1-hour forex intraday data with date range', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockIntradayData);

      const result = await marketResource.getForexIntraday1Hour(
        'EURUSD',
        '2024-01-01',
        '2024-01-31'
      );

      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/historical-chart/1hour/EURUSD',
        { searchParams: {   from: '2024-01-01', to: '2024-01-31' }, }

      );
      expect(result).toEqual(mockIntradayData);
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

      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/symbol/available-cryptocurrencies'
      );
      expect(result).toEqual(mockCryptoList);
    });
  });

  describe('getCryptoQuoteShort', () => {
    const mockCryptoQuote: CryptoPrice[] = [
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

    it('should fetch specific crypto quote', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockCryptoQuote);

      const result = await marketResource.getCryptoQuoteShort('BTCUSD');

      expect(mockClient.get).toHaveBeenCalledWith('v3/quote/BTCUSD');
      expect(result).toEqual(mockCryptoQuote);
    });

    it('should fetch all crypto quotes when no symbol specified', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockCryptoQuote);

      const result = await marketResource.getCryptoQuoteShort();

      expect(mockClient.get).toHaveBeenCalledWith('v3/quotes/crypto');
      expect(result).toEqual(mockCryptoQuote);
    });

    it('should convert symbol to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockCryptoQuote);

      await marketResource.getCryptoQuoteShort('ethusd');

      expect(mockClient.get).toHaveBeenCalledWith('v3/quote/ETHUSD');
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

      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/historical-chart/line/BTCUSD',
        { searchParams: {} }
      );
      expect(result).toEqual(mockLightChart);
    });

    it('should fetch crypto light chart with date range', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockLightChart);

      const result = await marketResource.getCryptoLightChart(
        'BTCUSD',
        '2024-01-01',
        '2024-12-31'
      );

      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/historical-chart/line/BTCUSD',
        { searchParams: {   from: '2024-01-01', to: '2024-12-31' }, }

      );
      expect(result).toEqual(mockLightChart);
    });

    it('should convert symbol to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockLightChart);

      await marketResource.getCryptoLightChart('ethusd');

      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/historical-chart/line/ETHUSD',
        { searchParams: {} }
      );
    });
  });

  describe('getCryptoFullChart', () => {
    const mockFullChart = {
      historical: [
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
      ],
    };

    it('should fetch crypto full chart without date range', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockFullChart);

      const result = await marketResource.getCryptoFullChart('BTCUSD');

      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/historical-price-full/BTCUSD',
        { searchParams: {} }
      );
      expect(result).toEqual(mockFullChart);
    });

    it('should fetch crypto full chart with date range', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockFullChart);

      const result = await marketResource.getCryptoFullChart(
        'BTCUSD',
        '2024-01-01',
        '2024-12-31'
      );

      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/historical-price-full/BTCUSD',
        { searchParams: {   from: '2024-01-01', to: '2024-12-31' }, }

      );
      expect(result).toEqual(mockFullChart);
    });

    it('should convert symbol to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockFullChart);

      await marketResource.getCryptoFullChart('btcusd');

      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/historical-price-full/BTCUSD',
        { searchParams: {} }
      );
    });
  });

  describe('getCryptoIntraday1Min', () => {
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

    it('should fetch 1-minute crypto intraday data', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockIntradayData);

      const result = await marketResource.getCryptoIntraday1Min('BTCUSD');

      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/historical-chart/1min/BTCUSD',
        { searchParams: {} }
      );
      expect(result).toEqual(mockIntradayData);
    });

    it('should fetch 1-minute crypto intraday data with date range', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockIntradayData);

      const result = await marketResource.getCryptoIntraday1Min(
        'BTCUSD',
        '2024-01-01',
        '2024-01-02'
      );

      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/historical-chart/1min/BTCUSD',
        { searchParams: {   from: '2024-01-01', to: '2024-01-02' }, }

      );
      expect(result).toEqual(mockIntradayData);
    });

    it('should convert symbol to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockIntradayData);

      await marketResource.getCryptoIntraday1Min('ethusd');

      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/historical-chart/1min/ETHUSD',
        { searchParams: {} }
      );
    });
  });

  describe('getCryptoIntraday5Min', () => {
    const mockIntradayData: IntradayChart[] = [
      {
        date: '2024-01-01 09:30:00',
        open: 45000,
        high: 45200,
        low: 44800,
        close: 45100,
        volume: 5000000,
      },
    ];

    it('should fetch 5-minute crypto intraday data', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockIntradayData);

      const result = await marketResource.getCryptoIntraday5Min('BTCUSD');

      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/historical-chart/5min/BTCUSD',
        { searchParams: {} }
      );
      expect(result).toEqual(mockIntradayData);
    });

    it('should fetch 5-minute crypto intraday data with date range', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockIntradayData);

      const result = await marketResource.getCryptoIntraday5Min(
        'BTCUSD',
        '2024-01-01',
        '2024-01-02'
      );

      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/historical-chart/5min/BTCUSD',
        { searchParams: {   from: '2024-01-01', to: '2024-01-02' }, }

      );
      expect(result).toEqual(mockIntradayData);
    });
  });

  describe('getCryptoIntraday1Hour', () => {
    const mockIntradayData: IntradayChart[] = [
      {
        date: '2024-01-01 09:00:00',
        open: 45000,
        high: 45500,
        low: 44500,
        close: 45300,
        volume: 50000000,
      },
    ];

    it('should fetch 1-hour crypto intraday data', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockIntradayData);

      const result = await marketResource.getCryptoIntraday1Hour('BTCUSD');

      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/historical-chart/1hour/BTCUSD',
        { searchParams: {} }
      );
      expect(result).toEqual(mockIntradayData);
    });

    it('should fetch 1-hour crypto intraday data with date range', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockIntradayData);

      const result = await marketResource.getCryptoIntraday1Hour(
        'BTCUSD',
        '2024-01-01',
        '2024-01-31'
      );

      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/historical-chart/1hour/BTCUSD',
        { searchParams: {   from: '2024-01-01', to: '2024-01-31' }, }

      );
      expect(result).toEqual(mockIntradayData);
    });
  });

  describe('getLightChart', () => {
    const mockLightChart: LightChartData[] = [
      {
        date: '2024-01-01 09:30:00',
        close: 150.5,
      },
    ];

    it('should fetch light chart with interval', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockLightChart);

      const result = await marketResource.getLightChart('1min', 'AAPL');

      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/historical-chart/1min/AAPL',
        { searchParams: {} }
      );
      expect(result).toEqual(mockLightChart);
    });

    it('should fetch light chart with date range', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockLightChart);

      const result = await marketResource.getLightChart(
        '5min',
        'AAPL',
        '2024-01-01',
        '2024-01-31'
      );

      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/historical-chart/5min/AAPL',
        { searchParams: {   from: '2024-01-01', to: '2024-01-31' }, }

      );
      expect(result).toEqual(mockLightChart);
    });

    it('should convert symbol to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockLightChart);

      await marketResource.getLightChart('1hour', 'tsla');

      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/historical-chart/1hour/TSLA',
        { searchParams: {} }
      );
    });

    it('should work with custom intervals', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockLightChart);

      await marketResource.getLightChart('15min', 'AAPL');

      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/historical-chart/15min/AAPL',
        { searchParams: {} }
      );
    });
  });

  describe('getUnadjustedPrice', () => {
    const mockUnadjustedData: LightChartData[] = [
      {
        date: '2024-01-01',
        close: 150.5,
      },
    ];

    it('should fetch unadjusted prices without date range', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockUnadjustedData);

      const result = await marketResource.getUnadjustedPrice('AAPL');

      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/historical-price-full/AAPL/line',
        { searchParams: {} }
      );
      expect(result).toEqual(mockUnadjustedData);
    });

    it('should fetch unadjusted prices with date range', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockUnadjustedData);

      const result = await marketResource.getUnadjustedPrice(
        'AAPL',
        '2024-01-01',
        '2024-12-31'
      );

      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/historical-price-full/AAPL/line',
        { searchParams: {   from: '2024-01-01', to: '2024-12-31' }, }

      );
      expect(result).toEqual(mockUnadjustedData);
    });

    it('should convert symbol to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockUnadjustedData);

      await marketResource.getUnadjustedPrice('msft');

      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/historical-price-full/MSFT/line',
        { searchParams: {} }
      );
    });
  });

  describe('getDividendAdjusted', () => {
    const mockDividendAdjusted = {
      historical: [
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
      ],
    };

    it('should fetch dividend-adjusted prices without date range', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockDividendAdjusted);

      const result = await marketResource.getDividendAdjusted('AAPL');

      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/historical-price-full/AAPL',
        { searchParams: {   serietype: 'line' }, }

      );
      expect(result).toEqual(mockDividendAdjusted);
    });

    it('should fetch dividend-adjusted prices with date range', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockDividendAdjusted);

      const result = await marketResource.getDividendAdjusted(
        'AAPL',
        '2024-01-01',
        '2024-12-31'
      );

      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/historical-price-full/AAPL',
        {
          searchParams: {
            serietype: 'line',
          from: '2024-01-01',
          to: '2024-12-31',
        },
        }

      );
      expect(result).toEqual(mockDividendAdjusted);
    });

    it('should convert symbol to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockDividendAdjusted);

      await marketResource.getDividendAdjusted('goog');

      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/historical-price-full/GOOG',
        { searchParams: {   serietype: 'line' }, }

      );
    });

    it('should always include serietype parameter', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockDividendAdjusted);

      await marketResource.getDividendAdjusted('AAPL', '2024-01-01');

      const callArgs = vi.mocked(mockClient.get).mock.calls[0];
      expect(callArgs[1].searchParams).toHaveProperty('serietype', 'line');
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
    const mockData = { historical: [] };

    it('should handle mixed case symbols', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await marketResource.getHistoricalPrices('AaPl');

      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/historical-price-full/AAPL',
        { searchParams: {} }
      );
    });

    it('should handle lowercase forex pairs', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await marketResource.getForexPrice('eurusd');

      expect(mockClient.get).toHaveBeenCalledWith('v3/fx/EURUSD');
    });

    it('should handle lowercase crypto symbols', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await marketResource.getCryptoPrice('btcusd');

      expect(mockClient.get).toHaveBeenCalledWith('v3/quote/BTCUSD');
    });
  });

  describe('Date Parameter Handling', () => {
    const mockData = { historical: [] };

    it('should handle only from date', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await marketResource.getHistoricalPrices('AAPL', '2024-01-01');

      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/historical-price-full/AAPL',
        { searchParams: {   from: '2024-01-01' }, }

      );
    });

    it('should handle both from and to dates', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await marketResource.getHistoricalPrices(
        'AAPL',
        '2024-01-01',
        '2024-12-31'
      );

      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/historical-price-full/AAPL',
        { searchParams: {   from: '2024-01-01', to: '2024-12-31' }, }

      );
    });

    it('should not include undefined dates in params', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await marketResource.getHistoricalPrices('AAPL');

      const params = vi.mocked(mockClient.get).mock.calls[0][1];
      expect(params).toEqual({ searchParams: {} });
      expect(params.searchParams).not.toHaveProperty('from');
      expect(params.searchParams).not.toHaveProperty('to');
    });
  });

  describe('Interval Validation', () => {
    const mockData: IntradayChart[] = [];

    it('should accept 1min interval', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await marketResource.getIntradayChart('AAPL', '1min');

      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/historical-chart/1min/AAPL',
        { searchParams: {} }
      );
    });

    it('should accept 5min interval', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await marketResource.getIntradayChart('AAPL', '5min');

      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/historical-chart/5min/AAPL',
        { searchParams: {} }
      );
    });

    it('should accept 15min interval', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await marketResource.getIntradayChart('AAPL', '15min');

      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/historical-chart/15min/AAPL',
        { searchParams: {} }
      );
    });

    it('should accept 30min interval', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await marketResource.getIntradayChart('AAPL', '30min');

      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/historical-chart/30min/AAPL',
        { searchParams: {} }
      );
    });

    it('should accept 1hour interval', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await marketResource.getIntradayChart('AAPL', '1hour');

      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/historical-chart/1hour/AAPL',
        { searchParams: {} }
      );
    });

    it('should accept 4hour interval', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await marketResource.getIntradayChart('AAPL', '4hour');

      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/historical-chart/4hour/AAPL',
        { searchParams: {} }
      );
    });
  });

  describe('Optional Parameters', () => {
    it('should handle getForexPrice without pair parameter', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await marketResource.getForexPrice();

      expect(mockClient.get).toHaveBeenCalledWith('v3/fx');
    });

    it('should handle getCryptoPrice without symbol parameter', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await marketResource.getCryptoPrice();

      expect(mockClient.get).toHaveBeenCalledWith('v3/quotes/crypto');
    });

    it('should handle getForexQuoteShort without pair parameter', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await marketResource.getForexQuoteShort();

      expect(mockClient.get).toHaveBeenCalledWith('v3/forex');
    });

    it('should handle getCryptoQuoteShort without symbol parameter', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await marketResource.getCryptoQuoteShort();

      expect(mockClient.get).toHaveBeenCalledWith('v3/quotes/crypto');
    });

    it('should handle getMarketHours without exchange parameter', async () => {
      vi.mocked(mockClient.get).mockResolvedValue({} as MarketHours);

      await marketResource.getMarketHours();

      expect(mockClient.get).toHaveBeenCalledWith('v3/is-the-market-open', { searchParams: {} });
    });
  });
});
