import { describe, it, expect, vi, beforeEach } from 'vitest';
import { IndexesResource } from '../src/resources/indexes.js';
import type { FMPClient } from '../src/client.js';
import type {
  IndexConstituent,
  HistoricalIndexConstituent,
  Quote,
  IntradayChart,
} from '../src/types/index.js';

describe('IndexesResource', () => {
  let mockClient: FMPClient;
  let indexesResource: IndexesResource;

  beforeEach(() => {
    // Create a mock client with a spy on the get method
    mockClient = {
      get: vi.fn(),
    } as unknown as FMPClient;

    indexesResource = new IndexesResource(mockClient);
  });

  describe('Constituent Methods', () => {
    describe('getSP500Constituents', () => {
      it('should fetch S&P 500 constituents', async () => {
        const mockConstituents: IndexConstituent[] = [
          {
            symbol: 'AAPL',
            name: 'Apple Inc.',
            sector: 'Technology',
            subSector: 'Consumer Electronics',
            headQuarter: 'Cupertino, California',
            dateFirstAdded: '1982-11-30',
            cik: '0000320193',
            founded: '1976',
          },
          {
            symbol: 'MSFT',
            name: 'Microsoft Corporation',
            sector: 'Technology',
            subSector: 'Software',
            headQuarter: 'Redmond, Washington',
            dateFirstAdded: '1994-06-01',
            cik: '0000789019',
            founded: '1975',
          },
        ];

        vi.mocked(mockClient.get).mockResolvedValue(mockConstituents);

        const result = await indexesResource.getSP500Constituents();

        expect(mockClient.get).toHaveBeenCalledWith('v3/sp500_constituent');
        expect(result).toEqual(mockConstituents);
        expect(result).toHaveLength(2);
        expect(result[0].symbol).toBe('AAPL');
      });

      it('should return empty array when no constituents', async () => {
        vi.mocked(mockClient.get).mockResolvedValue([]);

        const result = await indexesResource.getSP500Constituents();

        expect(result).toEqual([]);
        expect(result).toHaveLength(0);
      });
    });

    describe('getNASDAQConstituents', () => {
      it('should fetch NASDAQ constituents', async () => {
        const mockConstituents: IndexConstituent[] = [
          {
            symbol: 'GOOGL',
            name: 'Alphabet Inc.',
            sector: 'Technology',
            subSector: 'Internet Services',
            headQuarter: 'Mountain View, California',
            dateFirstAdded: '2004-08-19',
            cik: '0001652044',
            founded: '1998',
          },
        ];

        vi.mocked(mockClient.get).mockResolvedValue(mockConstituents);

        const result = await indexesResource.getNASDAQConstituents();

        expect(mockClient.get).toHaveBeenCalledWith('v3/nasdaq_constituent');
        expect(result).toEqual(mockConstituents);
        expect(result[0].symbol).toBe('GOOGL');
      });
    });

    describe('getDowJonesConstituents', () => {
      it('should fetch Dow Jones constituents', async () => {
        const mockConstituents: IndexConstituent[] = [
          {
            symbol: 'GS',
            name: 'Goldman Sachs Group Inc.',
            sector: 'Financials',
            subSector: 'Investment Banking',
            headQuarter: 'New York, New York',
            dateFirstAdded: '2013-09-20',
            cik: '0000886982',
            founded: '1869',
          },
        ];

        vi.mocked(mockClient.get).mockResolvedValue(mockConstituents);

        const result = await indexesResource.getDowJonesConstituents();

        expect(mockClient.get).toHaveBeenCalledWith('v3/dowjones_constituent');
        expect(result).toEqual(mockConstituents);
        expect(result[0].symbol).toBe('GS');
      });
    });
  });

  describe('Historical Constituent Methods', () => {
    describe('getHistoricalSP500', () => {
      it('should fetch historical S&P 500 constituents', async () => {
        const mockHistorical: HistoricalIndexConstituent[] = [
          {
            dateAdded: '2023-12-18',
            addedSecurity: 'VLTO',
            removedTicker: 'WBD',
            removedSecurity: 'Warner Bros. Discovery',
            date: '2023-12-18',
            symbol: 'VLTO',
            reason: 'Market cap change',
          },
        ];

        vi.mocked(mockClient.get).mockResolvedValue(mockHistorical);

        const result = await indexesResource.getHistoricalSP500();

        expect(mockClient.get).toHaveBeenCalledWith('v3/historical/sp500_constituent');
        expect(result).toEqual(mockHistorical);
        expect(result[0].addedSecurity).toBe('VLTO');
      });
    });

    describe('getHistoricalNASDAQ', () => {
      it('should fetch historical NASDAQ constituents', async () => {
        const mockHistorical: HistoricalIndexConstituent[] = [
          {
            dateAdded: '2024-01-15',
            addedSecurity: 'NVDA',
            removedTicker: 'INTC',
            removedSecurity: 'Intel Corporation',
            date: '2024-01-15',
            symbol: 'NVDA',
            reason: 'Index rebalance',
          },
        ];

        vi.mocked(mockClient.get).mockResolvedValue(mockHistorical);

        const result = await indexesResource.getHistoricalNASDAQ();

        expect(mockClient.get).toHaveBeenCalledWith('v3/historical/nasdaq_constituent');
        expect(result).toEqual(mockHistorical);
      });
    });

    describe('getHistoricalDowJones', () => {
      it('should fetch historical Dow Jones constituents', async () => {
        const mockHistorical: HistoricalIndexConstituent[] = [
          {
            dateAdded: '2023-02-21',
            addedSecurity: 'AMZN',
            removedTicker: 'WALGREENS',
            removedSecurity: 'Walgreens Boots Alliance',
            date: '2023-02-21',
            symbol: 'AMZN',
            reason: 'Composition change',
          },
        ];

        vi.mocked(mockClient.get).mockResolvedValue(mockHistorical);

        const result = await indexesResource.getHistoricalDowJones();

        expect(mockClient.get).toHaveBeenCalledWith('v3/historical/dowjones_constituent');
        expect(result).toEqual(mockHistorical);
      });
    });
  });

  describe('Quote Methods', () => {
    describe('getQuote', () => {
      it('should fetch quote for S&P 500 index', async () => {
        const mockQuote: Quote[] = [
          {
            symbol: '^GSPC',
            name: 'S&P 500',
            price: 4783.45,
            changesPercentage: 1.23,
            change: 58.21,
            dayLow: 4750.12,
            dayHigh: 4790.33,
            yearHigh: 4818.62,
            yearLow: 3764.49,
            marketCap: 0,
            priceAvg50: 4650.22,
            priceAvg200: 4450.11,
            exchange: 'INDEX',
            volume: 0,
            avgVolume: 0,
            open: 4725.24,
            previousClose: 4725.24,
            eps: 0,
            pe: 0,
            earningsAnnouncement: '',
            sharesOutstanding: 0,
            timestamp: 1703260800,
          },
        ];

        vi.mocked(mockClient.get).mockResolvedValue(mockQuote);

        const result = await indexesResource.getQuote('^GSPC');

        expect(mockClient.get).toHaveBeenCalledWith('v3/quote/^GSPC');
        expect(result).toEqual(mockQuote);
        expect(result[0].symbol).toBe('^GSPC');
        expect(result[0].price).toBe(4783.45);
      });

      it('should fetch quote for NASDAQ index', async () => {
        const mockQuote: Quote[] = [
          {
            symbol: '^IXIC',
            name: 'NASDAQ Composite',
            price: 15011.35,
            changesPercentage: 0.87,
            change: 129.45,
            dayLow: 14950.22,
            dayHigh: 15025.11,
            yearHigh: 16212.23,
            yearLow: 10088.83,
            marketCap: 0,
            priceAvg50: 14800.33,
            priceAvg200: 13950.44,
            exchange: 'INDEX',
            volume: 0,
            avgVolume: 0,
            open: 14881.90,
            previousClose: 14881.90,
            eps: 0,
            pe: 0,
            earningsAnnouncement: '',
            sharesOutstanding: 0,
            timestamp: 1703260800,
          },
        ];

        vi.mocked(mockClient.get).mockResolvedValue(mockQuote);

        const result = await indexesResource.getQuote('^IXIC');

        expect(mockClient.get).toHaveBeenCalledWith('v3/quote/^IXIC');
        expect(result[0].symbol).toBe('^IXIC');
      });

      it('should fetch quote for Dow Jones index', async () => {
        const mockQuote: Quote[] = [
          {
            symbol: '^DJI',
            name: 'Dow Jones Industrial Average',
            price: 37305.16,
            changesPercentage: 0.54,
            change: 200.12,
            dayLow: 37200.45,
            dayHigh: 37350.88,
            yearHigh: 37492.66,
            yearLow: 28660.94,
            marketCap: 0,
            priceAvg50: 36950.22,
            priceAvg200: 35100.33,
            exchange: 'INDEX',
            volume: 0,
            avgVolume: 0,
            open: 37105.04,
            previousClose: 37105.04,
            eps: 0,
            pe: 0,
            earningsAnnouncement: '',
            sharesOutstanding: 0,
            timestamp: 1703260800,
          },
        ];

        vi.mocked(mockClient.get).mockResolvedValue(mockQuote);

        const result = await indexesResource.getQuote('^DJI');

        expect(mockClient.get).toHaveBeenCalledWith('v3/quote/^DJI');
        expect(result[0].symbol).toBe('^DJI');
      });

      it('should convert symbol to uppercase', async () => {
        vi.mocked(mockClient.get).mockResolvedValue([]);

        await indexesResource.getQuote('^gspc');

        expect(mockClient.get).toHaveBeenCalledWith('v3/quote/^GSPC');
      });

      it('should handle lowercase index symbols', async () => {
        vi.mocked(mockClient.get).mockResolvedValue([]);

        await indexesResource.getQuote('^ixic');

        expect(mockClient.get).toHaveBeenCalledWith('v3/quote/^IXIC');
      });
    });

    describe('getQuoteShort', () => {
      it('should fetch short quote for index', async () => {
        const mockShortQuote = [
          {
            symbol: '^GSPC',
            price: 4783.45,
            volume: 3450000000,
          },
        ];

        vi.mocked(mockClient.get).mockResolvedValue(mockShortQuote);

        const result = await indexesResource.getQuoteShort('^GSPC');

        expect(mockClient.get).toHaveBeenCalledWith('v3/quote-short/^GSPC');
        expect(result).toEqual(mockShortQuote);
      });

      it('should convert symbol to uppercase for short quote', async () => {
        vi.mocked(mockClient.get).mockResolvedValue([]);

        await indexesResource.getQuoteShort('^dji');

        expect(mockClient.get).toHaveBeenCalledWith('v3/quote-short/^DJI');
      });
    });

    describe('getAllQuotes', () => {
      it('should fetch all index quotes', async () => {
        const mockQuotes: Quote[] = [
          {
            symbol: '^GSPC',
            name: 'S&P 500',
            price: 4783.45,
            changesPercentage: 1.23,
            change: 58.21,
            dayLow: 4750.12,
            dayHigh: 4790.33,
            yearHigh: 4818.62,
            yearLow: 3764.49,
            marketCap: 0,
            priceAvg50: 4650.22,
            priceAvg200: 4450.11,
            exchange: 'INDEX',
            volume: 0,
            avgVolume: 0,
            open: 4725.24,
            previousClose: 4725.24,
            eps: 0,
            pe: 0,
            earningsAnnouncement: '',
            sharesOutstanding: 0,
            timestamp: 1703260800,
          },
          {
            symbol: '^IXIC',
            name: 'NASDAQ Composite',
            price: 15011.35,
            changesPercentage: 0.87,
            change: 129.45,
            dayLow: 14950.22,
            dayHigh: 15025.11,
            yearHigh: 16212.23,
            yearLow: 10088.83,
            marketCap: 0,
            priceAvg50: 14800.33,
            priceAvg200: 13950.44,
            exchange: 'INDEX',
            volume: 0,
            avgVolume: 0,
            open: 14881.90,
            previousClose: 14881.90,
            eps: 0,
            pe: 0,
            earningsAnnouncement: '',
            sharesOutstanding: 0,
            timestamp: 1703260800,
          },
        ];

        vi.mocked(mockClient.get).mockResolvedValue(mockQuotes);

        const result = await indexesResource.getAllQuotes();

        expect(mockClient.get).toHaveBeenCalledWith('v3/quotes/index');
        expect(result).toEqual(mockQuotes);
        expect(result).toHaveLength(2);
      });
    });
  });

  describe('List Method', () => {
    describe('getList', () => {
      it('should fetch available indexes list', async () => {
        const mockList = [
          {
            symbol: '^GSPC',
            name: 'S&P 500',
            currency: 'USD',
            stockExchange: 'INDEX',
            exchangeShortName: 'INDEX',
          },
          {
            symbol: '^IXIC',
            name: 'NASDAQ Composite',
            currency: 'USD',
            stockExchange: 'INDEX',
            exchangeShortName: 'INDEX',
          },
          {
            symbol: '^DJI',
            name: 'Dow Jones Industrial Average',
            currency: 'USD',
            stockExchange: 'INDEX',
            exchangeShortName: 'INDEX',
          },
        ];

        vi.mocked(mockClient.get).mockResolvedValue(mockList);

        const result = await indexesResource.getList();

        expect(mockClient.get).toHaveBeenCalledWith('v3/symbol/available-indexes');
        expect(result).toEqual(mockList);
        expect(result).toHaveLength(3);
      });
    });
  });

  describe('Historical Price Methods', () => {
    describe('getHistoricalPrices', () => {
      it('should fetch historical prices without date parameters', async () => {
        const mockHistorical = {
          historical: [
            {
              date: '2023-12-22',
              open: 4754.63,
              high: 4788.66,
              low: 4754.63,
              close: 4783.45,
              adjClose: 4783.45,
              volume: 0,
              unadjustedVolume: 0,
              change: 28.82,
              changePercent: 0.606,
              vwap: 4771.545,
              label: 'December 22, 23',
              changeOverTime: 0.00606,
            },
          ],
        };

        vi.mocked(mockClient.get).mockResolvedValue(mockHistorical);

        const result = await indexesResource.getHistoricalPrices('^GSPC');

        expect(mockClient.get).toHaveBeenCalledWith('v3/historical-price-full/^GSPC', { searchParams: {} });
        expect(result).toEqual(mockHistorical);
        expect(result.historical).toHaveLength(1);
      });

      it('should fetch historical prices with from date', async () => {
        const mockHistorical = {
          historical: [
            {
              date: '2023-12-01',
              open: 4567.18,
              high: 4594.63,
              low: 4567.18,
              close: 4594.63,
              adjClose: 4594.63,
              volume: 0,
              unadjustedVolume: 0,
              change: 27.45,
              changePercent: 0.601,
              vwap: 4580.905,
              label: 'December 01, 23',
              changeOverTime: 0.00601,
            },
          ],
        };

        vi.mocked(mockClient.get).mockResolvedValue(mockHistorical);

        const result = await indexesResource.getHistoricalPrices('^GSPC', '2023-12-01');

        expect(mockClient.get).toHaveBeenCalledWith('v3/historical-price-full/^GSPC', {
          searchParams: {
            from: '2023-12-01',
        },
        }
);
        expect(result).toEqual(mockHistorical);
      });

      it('should fetch historical prices with date range', async () => {
        const mockHistorical = {
          historical: [
            {
              date: '2023-12-31',
              open: 4769.83,
              high: 4783.35,
              low: 4769.83,
              close: 4769.83,
              adjClose: 4769.83,
              volume: 0,
              unadjustedVolume: 0,
              change: 13.52,
              changePercent: 0.284,
              vwap: 4776.59,
              label: 'December 31, 23',
              changeOverTime: 0.00284,
            },
            {
              date: '2023-12-01',
              open: 4567.18,
              high: 4594.63,
              low: 4567.18,
              close: 4594.63,
              adjClose: 4594.63,
              volume: 0,
              unadjustedVolume: 0,
              change: 27.45,
              changePercent: 0.601,
              vwap: 4580.905,
              label: 'December 01, 23',
              changeOverTime: 0.00601,
            },
          ],
        };

        vi.mocked(mockClient.get).mockResolvedValue(mockHistorical);

        const result = await indexesResource.getHistoricalPrices(
          '^GSPC',
          '2023-12-01',
          '2023-12-31'
        );

        expect(mockClient.get).toHaveBeenCalledWith('v3/historical-price-full/^GSPC', {
          searchParams: {
            from: '2023-12-01',
          to: '2023-12-31',
        },
        }
);
        expect(result.historical).toHaveLength(2);
      });

      it('should convert symbol to uppercase for historical prices', async () => {
        vi.mocked(mockClient.get).mockResolvedValue({ historical: [] });

        await indexesResource.getHistoricalPrices('^dji', '2023-01-01', '2023-12-31');

        expect(mockClient.get).toHaveBeenCalledWith('v3/historical-price-full/^DJI', {
          searchParams: {
            from: '2023-01-01',
          to: '2023-12-31',
        },
        }
);
      });

      it('should fetch historical prices for NASDAQ', async () => {
        const mockHistorical = {
          historical: [
            {
              date: '2023-12-22',
              open: 14963.87,
              high: 15025.11,
              low: 14963.87,
              close: 15011.35,
              adjClose: 15011.35,
              volume: 0,
              unadjustedVolume: 0,
              change: 61.24,
              changePercent: 0.409,
              vwap: 14994.49,
              label: 'December 22, 23',
              changeOverTime: 0.00409,
            },
          ],
        };

        vi.mocked(mockClient.get).mockResolvedValue(mockHistorical);

        const result = await indexesResource.getHistoricalPrices('^IXIC');

        expect(mockClient.get).toHaveBeenCalledWith('v3/historical-price-full/^IXIC', { searchParams: {} });
        expect(result.historical[0].symbol).toBeUndefined();
      });
    });

    describe('getHistoricalLight', () => {
      it('should fetch light historical data without date parameters', async () => {
        const mockLightData = [
          { date: '2023-12-22', close: 4783.45 },
          { date: '2023-12-21', close: 4754.63 },
          { date: '2023-12-20', close: 4698.35 },
        ];

        vi.mocked(mockClient.get).mockResolvedValue(mockLightData);

        const result = await indexesResource.getHistoricalLight('^GSPC');

        expect(mockClient.get).toHaveBeenCalledWith('v3/historical-chart/line/^GSPC', { searchParams: {} });
        expect(result).toEqual(mockLightData);
        expect(result).toHaveLength(3);
        expect(result[0]).toHaveProperty('date');
        expect(result[0]).toHaveProperty('close');
      });

      it('should fetch light historical data with from date', async () => {
        const mockLightData = [
          { date: '2023-12-15', close: 4719.19 },
          { date: '2023-12-14', close: 4707.09 },
        ];

        vi.mocked(mockClient.get).mockResolvedValue(mockLightData);

        const result = await indexesResource.getHistoricalLight('^GSPC', '2023-12-14');

        expect(mockClient.get).toHaveBeenCalledWith('v3/historical-chart/line/^GSPC', {
          searchParams: {
            from: '2023-12-14',
        },
        }
);
        expect(result).toEqual(mockLightData);
      });

      it('should fetch light historical data with date range', async () => {
        const mockLightData = [
          { date: '2023-12-31', close: 4769.83 },
          { date: '2023-12-29', close: 4783.45 },
          { date: '2023-12-28', close: 4781.58 },
          { date: '2023-12-27', close: 4774.75 },
        ];

        vi.mocked(mockClient.get).mockResolvedValue(mockLightData);

        const result = await indexesResource.getHistoricalLight(
          '^GSPC',
          '2023-12-27',
          '2023-12-31'
        );

        expect(mockClient.get).toHaveBeenCalledWith('v3/historical-chart/line/^GSPC', {
          searchParams: {
            from: '2023-12-27',
          to: '2023-12-31',
        },
        }
);
        expect(result).toHaveLength(4);
        expect(result[0].date).toBe('2023-12-31');
      });

      it('should convert symbol to uppercase for light data', async () => {
        vi.mocked(mockClient.get).mockResolvedValue([]);

        await indexesResource.getHistoricalLight('^ixic', '2023-01-01', '2023-12-31');

        expect(mockClient.get).toHaveBeenCalledWith('v3/historical-chart/line/^IXIC', {
          searchParams: {
            from: '2023-01-01',
          to: '2023-12-31',
        },
        }
);
      });

      it('should fetch light data for Dow Jones', async () => {
        const mockLightData = [
          { date: '2023-12-22', close: 37305.16 },
          { date: '2023-12-21', close: 37404.35 },
        ];

        vi.mocked(mockClient.get).mockResolvedValue(mockLightData);

        const result = await indexesResource.getHistoricalLight('^DJI');

        expect(mockClient.get).toHaveBeenCalledWith('v3/historical-chart/line/^DJI', { searchParams: {} });
        expect(result[0].close).toBe(37305.16);
      });

      it('should return empty array when no data available', async () => {
        vi.mocked(mockClient.get).mockResolvedValue([]);

        const result = await indexesResource.getHistoricalLight('^GSPC', '2025-01-01');

        expect(result).toEqual([]);
      });
    });
  });

  describe('Intraday Chart Method', () => {
    describe('getIntradayChart', () => {
      it('should fetch intraday chart with default 1hour interval', async () => {
        const mockIntraday: IntradayChart[] = [
          {
            date: '2023-12-22 15:00:00',
            open: 4780.12,
            low: 4775.33,
            high: 4785.66,
            close: 4783.45,
            volume: 125000000,
          },
          {
            date: '2023-12-22 14:00:00',
            open: 4772.88,
            low: 4770.22,
            high: 4782.11,
            close: 4780.12,
            volume: 138000000,
          },
        ];

        vi.mocked(mockClient.get).mockResolvedValue(mockIntraday);

        const result = await indexesResource.getIntradayChart('^GSPC');

        expect(mockClient.get).toHaveBeenCalledWith('v3/historical-chart/1hour/^GSPC', { searchParams: {} });
        expect(result).toEqual(mockIntraday);
        expect(result).toHaveLength(2);
      });

      it('should fetch intraday chart with 5min interval', async () => {
        const mockIntraday: IntradayChart[] = [
          {
            date: '2023-12-22 15:55:00',
            open: 4782.45,
            low: 4781.88,
            high: 4783.66,
            close: 4783.45,
            volume: 5000000,
          },
        ];

        vi.mocked(mockClient.get).mockResolvedValue(mockIntraday);

        const result = await indexesResource.getIntradayChart('^GSPC', '5min');

        expect(mockClient.get).toHaveBeenCalledWith('v3/historical-chart/5min/^GSPC', { searchParams: {} });
        expect(result).toEqual(mockIntraday);
      });

      it('should fetch intraday chart with 15min interval', async () => {
        const mockIntraday: IntradayChart[] = [
          {
            date: '2023-12-22 15:45:00',
            open: 4780.12,
            low: 4779.33,
            high: 4783.88,
            close: 4783.45,
            volume: 15000000,
          },
        ];

        vi.mocked(mockClient.get).mockResolvedValue(mockIntraday);

        const result = await indexesResource.getIntradayChart('^GSPC', '15min');

        expect(mockClient.get).toHaveBeenCalledWith('v3/historical-chart/15min/^GSPC', { searchParams: {} });
        expect(result).toEqual(mockIntraday);
      });

      it('should fetch intraday chart with 30min interval', async () => {
        vi.mocked(mockClient.get).mockResolvedValue([]);

        await indexesResource.getIntradayChart('^GSPC', '30min');

        expect(mockClient.get).toHaveBeenCalledWith('v3/historical-chart/30min/^GSPC', { searchParams: {} });
      });

      it('should fetch intraday chart with 4hour interval', async () => {
        vi.mocked(mockClient.get).mockResolvedValue([]);

        await indexesResource.getIntradayChart('^GSPC', '4hour');

        expect(mockClient.get).toHaveBeenCalledWith('v3/historical-chart/4hour/^GSPC', { searchParams: {} });
      });

      it('should fetch intraday chart with date range', async () => {
        const mockIntraday: IntradayChart[] = [
          {
            date: '2023-12-22 15:00:00',
            open: 4780.12,
            low: 4775.33,
            high: 4785.66,
            close: 4783.45,
            volume: 125000000,
          },
        ];

        vi.mocked(mockClient.get).mockResolvedValue(mockIntraday);

        const result = await indexesResource.getIntradayChart(
          '^GSPC',
          '1hour',
          '2023-12-22',
          '2023-12-22'
        );

        expect(mockClient.get).toHaveBeenCalledWith('v3/historical-chart/1hour/^GSPC', {
          searchParams: {
            from: '2023-12-22',
          to: '2023-12-22',
        },
        }
);
        expect(result).toEqual(mockIntraday);
      });

      it('should convert symbol to uppercase for intraday chart', async () => {
        vi.mocked(mockClient.get).mockResolvedValue([]);

        await indexesResource.getIntradayChart('^dji', '1hour', '2023-12-22');

        expect(mockClient.get).toHaveBeenCalledWith('v3/historical-chart/1hour/^DJI', {
          searchParams: {
            from: '2023-12-22',
        },
        }
);
      });

      it('should fetch intraday chart for NASDAQ', async () => {
        const mockIntraday: IntradayChart[] = [
          {
            date: '2023-12-22 15:00:00',
            open: 15005.22,
            low: 15000.11,
            high: 15015.88,
            close: 15011.35,
            volume: 245000000,
          },
        ];

        vi.mocked(mockClient.get).mockResolvedValue(mockIntraday);

        const result = await indexesResource.getIntradayChart('^IXIC', '1hour');

        expect(mockClient.get).toHaveBeenCalledWith('v3/historical-chart/1hour/^IXIC', { searchParams: {} });
        expect(result[0].close).toBe(15011.35);
      });
    });
  });

  describe('Error Handling', () => {
    it('should propagate errors from client.get for constituents', async () => {
      const mockError = new Error('API Error');
      vi.mocked(mockClient.get).mockRejectedValue(mockError);

      await expect(indexesResource.getSP500Constituents()).rejects.toThrow('API Error');
    });

    it('should propagate errors from client.get for historical constituents', async () => {
      const mockError = new Error('Network Error');
      vi.mocked(mockClient.get).mockRejectedValue(mockError);

      await expect(indexesResource.getHistoricalNASDAQ()).rejects.toThrow('Network Error');
    });

    it('should propagate errors from client.get for quotes', async () => {
      const mockError = new Error('Invalid Symbol');
      vi.mocked(mockClient.get).mockRejectedValue(mockError);

      await expect(indexesResource.getQuote('^INVALID')).rejects.toThrow('Invalid Symbol');
    });

    it('should propagate errors from client.get for historical prices', async () => {
      const mockError = new Error('Date Range Error');
      vi.mocked(mockClient.get).mockRejectedValue(mockError);

      await expect(
        indexesResource.getHistoricalPrices('^GSPC', 'invalid-date')
      ).rejects.toThrow('Date Range Error');
    });

    it('should propagate errors from client.get for light historical data', async () => {
      const mockError = new Error('Service Unavailable');
      vi.mocked(mockClient.get).mockRejectedValue(mockError);

      await expect(indexesResource.getHistoricalLight('^GSPC')).rejects.toThrow(
        'Service Unavailable'
      );
    });

    it('should propagate errors from client.get for intraday chart', async () => {
      const mockError = new Error('Timeout Error');
      vi.mocked(mockClient.get).mockRejectedValue(mockError);

      await expect(indexesResource.getIntradayChart('^GSPC', '1hour')).rejects.toThrow(
        'Timeout Error'
      );
    });
  });

  describe('Symbol Handling', () => {
    it('should handle various index symbols correctly', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      // S&P 500 variations
      await indexesResource.getQuote('^gspc');
      expect(mockClient.get).toHaveBeenCalledWith('v3/quote/^GSPC');

      await indexesResource.getQuote('^GSPC');
      expect(mockClient.get).toHaveBeenCalledWith('v3/quote/^GSPC');

      // NASDAQ variations
      await indexesResource.getQuote('^ixic');
      expect(mockClient.get).toHaveBeenCalledWith('v3/quote/^IXIC');

      await indexesResource.getQuote('^IXIC');
      expect(mockClient.get).toHaveBeenCalledWith('v3/quote/^IXIC');

      // Dow Jones variations
      await indexesResource.getQuote('^dji');
      expect(mockClient.get).toHaveBeenCalledWith('v3/quote/^DJI');

      await indexesResource.getQuote('^DJI');
      expect(mockClient.get).toHaveBeenCalledWith('v3/quote/^DJI');
    });

    it('should handle mixed case symbols', async () => {
      vi.mocked(mockClient.get).mockResolvedValue({ historical: [] });

      await indexesResource.getHistoricalPrices('^GsPc');
      expect(mockClient.get).toHaveBeenCalledWith('v3/historical-price-full/^GSPC', { searchParams: {} });
    });

    it('should handle symbols without caret prefix', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await indexesResource.getQuote('SPY');
      expect(mockClient.get).toHaveBeenCalledWith('v3/quote/SPY');
    });
  });

  describe('Date Range Validation', () => {
    it('should handle valid date ranges', async () => {
      const mockData = { historical: [] };
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await indexesResource.getHistoricalPrices('^GSPC', '2023-01-01', '2023-12-31');

      expect(mockClient.get).toHaveBeenCalledWith('v3/historical-price-full/^GSPC', {
        searchParams: {
          from: '2023-01-01',
        to: '2023-12-31',
      },
      }
);
    });

    it('should handle only from date', async () => {
      const mockData = { historical: [] };
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await indexesResource.getHistoricalPrices('^GSPC', '2023-06-01');

      expect(mockClient.get).toHaveBeenCalledWith('v3/historical-price-full/^GSPC', {
        searchParams: {
          from: '2023-06-01',
      },
      }
);
    });

    it('should handle only to date (from is undefined)', async () => {
      const mockData = { historical: [] };
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await indexesResource.getHistoricalPrices('^GSPC', undefined, '2023-12-31');

      expect(mockClient.get).toHaveBeenCalledWith('v3/historical-price-full/^GSPC', {
        searchParams: {
          to: '2023-12-31',
      },
      }
);
    });

    it('should handle light historical with only from date', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await indexesResource.getHistoricalLight('^GSPC', '2023-06-01');

      expect(mockClient.get).toHaveBeenCalledWith('v3/historical-chart/line/^GSPC', {
        searchParams: {
          from: '2023-06-01',
      },
      }
);
    });

    it('should handle intraday with only from date', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await indexesResource.getIntradayChart('^GSPC', '1hour', '2023-12-22');

      expect(mockClient.get).toHaveBeenCalledWith('v3/historical-chart/1hour/^GSPC', {
        searchParams: {
          from: '2023-12-22',
      },
      }
);
    });
  });

  describe('Integration with All Index Types', () => {
    it('should work with S&P 500 throughout all methods', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await indexesResource.getQuote('^GSPC');
      await indexesResource.getQuoteShort('^GSPC');
      await indexesResource.getHistoricalPrices('^GSPC');
      await indexesResource.getHistoricalLight('^GSPC');
      await indexesResource.getIntradayChart('^GSPC');

      expect(mockClient.get).toHaveBeenCalledTimes(5);
    });

    it('should work with NASDAQ throughout all methods', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await indexesResource.getQuote('^IXIC');
      await indexesResource.getQuoteShort('^IXIC');
      await indexesResource.getHistoricalPrices('^IXIC');
      await indexesResource.getHistoricalLight('^IXIC');
      await indexesResource.getIntradayChart('^IXIC');

      expect(mockClient.get).toHaveBeenCalledTimes(5);
    });

    it('should work with Dow Jones throughout all methods', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await indexesResource.getQuote('^DJI');
      await indexesResource.getQuoteShort('^DJI');
      await indexesResource.getHistoricalPrices('^DJI');
      await indexesResource.getHistoricalLight('^DJI');
      await indexesResource.getIntradayChart('^DJI');

      expect(mockClient.get).toHaveBeenCalledTimes(5);
    });
  });
});
