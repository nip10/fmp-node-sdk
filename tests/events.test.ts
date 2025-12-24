import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EventsResource } from '../src/resources/events.js';
import type { FMPClient } from '../src/client.js';
import type {
  Earnings,
  EarningsCalendar,
  Dividend,
  DividendCalendar,
  StockSplit,
  IPOCalendar,
  IPOProspectus,
  IPOConfirmed,
  EconomicCalendar,
} from '../src/types/index.js';

describe('EventsResource', () => {
  let eventsResource: EventsResource;
  let mockClient: FMPClient;

  beforeEach(() => {
    mockClient = {
      get: vi.fn(),
    } as unknown as FMPClient;
    eventsResource = new EventsResource(mockClient);
  });

  describe('getEarnings', () => {
    it('should fetch historical earnings for a symbol', async () => {
      const mockEarnings: Earnings[] = [
        {
          date: '2024-01-15',
          symbol: 'AAPL',
          eps: 2.18,
          epsEstimated: 2.10,
          time: 'amc',
          revenue: 119575000000,
          revenueEstimated: 118000000000,
          fiscalDateEnding: '2023-12-31',
          updatedFromDate: '2024-01-15',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockEarnings);

      const result = await eventsResource.getEarnings('AAPL');

      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/historical/earning_calendar/AAPL',
        { searchParams: {} }
      );
      expect(result).toEqual(mockEarnings);
    });

    it('should normalize symbol to uppercase', async () => {
      const mockEarnings: Earnings[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockEarnings);

      await eventsResource.getEarnings('aapl');

      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/historical/earning_calendar/AAPL',
        { searchParams: {} }
      );
    });

    it('should include limit parameter when provided', async () => {
      const mockEarnings: Earnings[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockEarnings);

      await eventsResource.getEarnings('AAPL', 10);

      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/historical/earning_calendar/AAPL',
        { searchParams: {   limit: 10 }, }

      );
    });

    it('should handle mixed case symbols', async () => {
      const mockEarnings: Earnings[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockEarnings);

      await eventsResource.getEarnings('TsLa');

      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/historical/earning_calendar/TSLA',
        { searchParams: {} }
      );
    });

    it('should handle API errors', async () => {
      const error = new Error('API Error');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(eventsResource.getEarnings('AAPL')).rejects.toThrow('API Error');
    });
  });

  describe('getEarningsCalendar', () => {
    it('should fetch earnings calendar without date filters', async () => {
      const mockCalendar: EarningsCalendar[] = [
        {
          date: '2024-01-15',
          symbol: 'AAPL',
          eps: 2.18,
          epsEstimated: 2.10,
          time: 'amc',
          revenue: 119575000000,
          revenueEstimated: 118000000000,
          fiscalDateEnding: '2023-12-31',
          updatedFromDate: '2024-01-15',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockCalendar);

      const result = await eventsResource.getEarningsCalendar();

      expect(mockClient.get).toHaveBeenCalledWith('v3/earning_calendar', { searchParams: {} });
      expect(result).toEqual(mockCalendar);
    });

    it('should fetch earnings calendar with from date only', async () => {
      const mockCalendar: EarningsCalendar[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockCalendar);

      await eventsResource.getEarningsCalendar('2024-01-01');

      expect(mockClient.get).toHaveBeenCalledWith('v3/earning_calendar', {
        searchParams: {
          from: '2024-01-01',
      },
      }
);
    });

    it('should fetch earnings calendar with to date only', async () => {
      const mockCalendar: EarningsCalendar[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockCalendar);

      await eventsResource.getEarningsCalendar(undefined, '2024-12-31');

      expect(mockClient.get).toHaveBeenCalledWith('v3/earning_calendar', {
        searchParams: {
          to: '2024-12-31',
      },
      }
);
    });

    it('should fetch earnings calendar with both from and to dates', async () => {
      const mockCalendar: EarningsCalendar[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockCalendar);

      await eventsResource.getEarningsCalendar('2024-01-01', '2024-12-31');

      expect(mockClient.get).toHaveBeenCalledWith('v3/earning_calendar', {
        searchParams: {
          from: '2024-01-01',
        to: '2024-12-31',
      },
      }
);
    });

    it('should handle null/undefined earnings data', async () => {
      const mockCalendar: EarningsCalendar[] = [
        {
          date: '2024-01-15',
          symbol: 'AAPL',
          eps: null,
          epsEstimated: null,
          time: 'bmo',
          revenue: null,
          revenueEstimated: null,
          fiscalDateEnding: '2023-12-31',
          updatedFromDate: '2024-01-15',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockCalendar);

      const result = await eventsResource.getEarningsCalendar();

      expect(result).toEqual(mockCalendar);
      expect(result[0].eps).toBeNull();
      expect(result[0].revenue).toBeNull();
    });
  });

  describe('getDividends', () => {
    it('should fetch historical dividends for a symbol', async () => {
      const mockDividends: Dividend[] = [
        {
          date: '2024-02-09',
          label: 'February 09, 24',
          adjDividend: 0.24,
          dividend: 0.24,
          recordDate: '2024-02-12',
          paymentDate: '2024-02-15',
          declarationDate: '2024-02-01',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockDividends);

      const result = await eventsResource.getDividends('AAPL');

      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/historical-price-full/stock_dividend/AAPL'
      );
      expect(result).toEqual(mockDividends);
    });

    it('should normalize symbol to uppercase', async () => {
      const mockDividends: Dividend[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockDividends);

      await eventsResource.getDividends('msft');

      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/historical-price-full/stock_dividend/MSFT'
      );
    });

    it('should handle empty dividend history', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      const result = await eventsResource.getDividends('TSLA');

      expect(result).toEqual([]);
    });
  });

  describe('getDividendCalendar', () => {
    it('should fetch dividend calendar without date filters', async () => {
      const mockCalendar: DividendCalendar[] = [
        {
          date: '2024-02-09',
          label: 'February 09, 24',
          adjDividend: 0.24,
          symbol: 'AAPL',
          dividend: 0.24,
          recordDate: '2024-02-12',
          paymentDate: '2024-02-15',
          declarationDate: '2024-02-01',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockCalendar);

      const result = await eventsResource.getDividendCalendar();

      expect(mockClient.get).toHaveBeenCalledWith('v3/stock_dividend_calendar', { searchParams: {} });
      expect(result).toEqual(mockCalendar);
    });

    it('should fetch dividend calendar with from date', async () => {
      const mockCalendar: DividendCalendar[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockCalendar);

      await eventsResource.getDividendCalendar('2024-01-01');

      expect(mockClient.get).toHaveBeenCalledWith('v3/stock_dividend_calendar', {
        searchParams: {
          from: '2024-01-01',
      },
      }
);
    });

    it('should fetch dividend calendar with to date', async () => {
      const mockCalendar: DividendCalendar[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockCalendar);

      await eventsResource.getDividendCalendar(undefined, '2024-12-31');

      expect(mockClient.get).toHaveBeenCalledWith('v3/stock_dividend_calendar', {
        searchParams: {
          to: '2024-12-31',
      },
      }
);
    });

    it('should fetch dividend calendar with date range', async () => {
      const mockCalendar: DividendCalendar[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockCalendar);

      await eventsResource.getDividendCalendar('2024-01-01', '2024-03-31');

      expect(mockClient.get).toHaveBeenCalledWith('v3/stock_dividend_calendar', {
        searchParams: {
          from: '2024-01-01',
        to: '2024-03-31',
      },
      }
);
    });
  });

  describe('getSplits', () => {
    it('should fetch historical stock splits for a symbol', async () => {
      const mockSplits: StockSplit[] = [
        {
          date: '2020-08-31',
          label: 'August 31, 20',
          symbol: 'AAPL',
          numerator: 4,
          denominator: 1,
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockSplits);

      const result = await eventsResource.getSplits('AAPL');

      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/historical-price-full/stock_split/AAPL'
      );
      expect(result).toEqual(mockSplits);
    });

    it('should normalize symbol to uppercase', async () => {
      const mockSplits: StockSplit[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockSplits);

      await eventsResource.getSplits('googl');

      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/historical-price-full/stock_split/GOOGL'
      );
    });

    it('should handle companies with no split history', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      const result = await eventsResource.getSplits('BRK.A');

      expect(result).toEqual([]);
    });
  });

  describe('getSplitsCalendar', () => {
    it('should fetch stock splits calendar without date filters', async () => {
      const mockCalendar: StockSplit[] = [
        {
          date: '2024-01-15',
          label: 'January 15, 24',
          symbol: 'XYZ',
          numerator: 2,
          denominator: 1,
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockCalendar);

      const result = await eventsResource.getSplitsCalendar();

      expect(mockClient.get).toHaveBeenCalledWith('v3/stock_split_calendar', { searchParams: {} });
      expect(result).toEqual(mockCalendar);
    });

    it('should fetch stock splits calendar with from date', async () => {
      const mockCalendar: StockSplit[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockCalendar);

      await eventsResource.getSplitsCalendar('2024-01-01');

      expect(mockClient.get).toHaveBeenCalledWith('v3/stock_split_calendar', {
        searchParams: {
          from: '2024-01-01',
      },
      }
);
    });

    it('should fetch stock splits calendar with to date', async () => {
      const mockCalendar: StockSplit[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockCalendar);

      await eventsResource.getSplitsCalendar(undefined, '2024-12-31');

      expect(mockClient.get).toHaveBeenCalledWith('v3/stock_split_calendar', {
        searchParams: {
          to: '2024-12-31',
      },
      }
);
    });

    it('should fetch stock splits calendar with date range', async () => {
      const mockCalendar: StockSplit[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockCalendar);

      await eventsResource.getSplitsCalendar('2024-01-01', '2024-06-30');

      expect(mockClient.get).toHaveBeenCalledWith('v3/stock_split_calendar', {
        searchParams: {
          from: '2024-01-01',
        to: '2024-06-30',
      },
      }
);
    });
  });

  describe('getIPOCalendar', () => {
    it('should fetch IPO calendar without date filters', async () => {
      const mockIPOs: IPOCalendar[] = [
        {
          date: '2024-01-15',
          company: 'Example Corp',
          symbol: 'EX',
          exchange: 'NASDAQ',
          actions: 'expected',
          shares: 10000000,
          priceRange: '$15-$17',
          marketCap: 1700000000,
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockIPOs);

      const result = await eventsResource.getIPOCalendar();

      expect(mockClient.get).toHaveBeenCalledWith('v3/ipo_calendar', { searchParams: {} });
      expect(result).toEqual(mockIPOs);
    });

    it('should fetch IPO calendar with from date', async () => {
      const mockIPOs: IPOCalendar[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockIPOs);

      await eventsResource.getIPOCalendar('2024-01-01');

      expect(mockClient.get).toHaveBeenCalledWith('v3/ipo_calendar', {
        searchParams: {
          from: '2024-01-01',
      },
      }
);
    });

    it('should fetch IPO calendar with to date', async () => {
      const mockIPOs: IPOCalendar[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockIPOs);

      await eventsResource.getIPOCalendar(undefined, '2024-12-31');

      expect(mockClient.get).toHaveBeenCalledWith('v3/ipo_calendar', {
        searchParams: {
          to: '2024-12-31',
      },
      }
);
    });

    it('should fetch IPO calendar with date range', async () => {
      const mockIPOs: IPOCalendar[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockIPOs);

      await eventsResource.getIPOCalendar('2024-01-01', '2024-12-31');

      expect(mockClient.get).toHaveBeenCalledWith('v3/ipo_calendar', {
        searchParams: {
          from: '2024-01-01',
        to: '2024-12-31',
      },
      }
);
    });

    it('should handle empty IPO calendar', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      const result = await eventsResource.getIPOCalendar();

      expect(result).toEqual([]);
    });
  });

  describe('getIPOProspectus', () => {
    it('should fetch IPO prospectus without date filters', async () => {
      const mockProspectus: IPOProspectus[] = [
        {
          date: '2024-01-15',
          company: 'Example Corp',
          symbol: 'EX',
          exchange: 'NASDAQ',
          actions: 'filed',
          shares: 10000000,
          priceRange: '$15-$17',
          marketCap: 1700000000,
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockProspectus);

      const result = await eventsResource.getIPOProspectus();

      expect(mockClient.get).toHaveBeenCalledWith('v4/ipo-calendar-prospectus', { searchParams: {} });
      expect(result).toEqual(mockProspectus);
    });

    it('should fetch IPO prospectus with from date', async () => {
      const mockProspectus: IPOProspectus[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockProspectus);

      await eventsResource.getIPOProspectus('2024-01-01');

      expect(mockClient.get).toHaveBeenCalledWith('v4/ipo-calendar-prospectus', {
        searchParams: {
          from: '2024-01-01',
      },
      }
);
    });

    it('should fetch IPO prospectus with to date', async () => {
      const mockProspectus: IPOProspectus[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockProspectus);

      await eventsResource.getIPOProspectus(undefined, '2024-12-31');

      expect(mockClient.get).toHaveBeenCalledWith('v4/ipo-calendar-prospectus', {
        searchParams: {
          to: '2024-12-31',
      },
      }
);
    });

    it('should fetch IPO prospectus with date range', async () => {
      const mockProspectus: IPOProspectus[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockProspectus);

      await eventsResource.getIPOProspectus('2024-01-01', '2024-12-31');

      expect(mockClient.get).toHaveBeenCalledWith('v4/ipo-calendar-prospectus', {
        searchParams: {
          from: '2024-01-01',
        to: '2024-12-31',
      },
      }
);
    });
  });

  describe('getIPOConfirmed', () => {
    it('should fetch confirmed IPOs without date filters', async () => {
      const mockConfirmed: IPOConfirmed[] = [
        {
          date: '2024-01-15',
          company: 'Example Corp',
          symbol: 'EX',
          exchange: 'NASDAQ',
          actions: 'priced',
          shares: 10000000,
          priceRange: '$16',
          marketCap: 1600000000,
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockConfirmed);

      const result = await eventsResource.getIPOConfirmed();

      expect(mockClient.get).toHaveBeenCalledWith('v4/ipo-calendar-confirmed', { searchParams: {} });
      expect(result).toEqual(mockConfirmed);
    });

    it('should fetch confirmed IPOs with from date', async () => {
      const mockConfirmed: IPOConfirmed[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockConfirmed);

      await eventsResource.getIPOConfirmed('2024-01-01');

      expect(mockClient.get).toHaveBeenCalledWith('v4/ipo-calendar-confirmed', {
        searchParams: {
          from: '2024-01-01',
      },
      }
);
    });

    it('should fetch confirmed IPOs with to date', async () => {
      const mockConfirmed: IPOConfirmed[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockConfirmed);

      await eventsResource.getIPOConfirmed(undefined, '2024-12-31');

      expect(mockClient.get).toHaveBeenCalledWith('v4/ipo-calendar-confirmed', {
        searchParams: {
          to: '2024-12-31',
      },
      }
);
    });

    it('should fetch confirmed IPOs with date range', async () => {
      const mockConfirmed: IPOConfirmed[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockConfirmed);

      await eventsResource.getIPOConfirmed('2024-01-01', '2024-12-31');

      expect(mockClient.get).toHaveBeenCalledWith('v4/ipo-calendar-confirmed', {
        searchParams: {
          from: '2024-01-01',
        to: '2024-12-31',
      },
      }
);
    });
  });

  describe('getEconomicCalendar', () => {
    it('should fetch economic calendar without date filters', async () => {
      const mockEconomic: EconomicCalendar[] = [
        {
          event: 'GDP Growth Rate',
          date: '2024-01-26',
          country: 'US',
          actual: 3.3,
          previous: 4.9,
          change: -1.6,
          changePercentage: -32.65,
          estimate: 2.0,
          impact: 'High',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockEconomic);

      const result = await eventsResource.getEconomicCalendar();

      expect(mockClient.get).toHaveBeenCalledWith('v3/economic_calendar', { searchParams: {} });
      expect(result).toEqual(mockEconomic);
    });

    it('should fetch economic calendar with from date', async () => {
      const mockEconomic: EconomicCalendar[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockEconomic);

      await eventsResource.getEconomicCalendar('2024-01-01');

      expect(mockClient.get).toHaveBeenCalledWith('v3/economic_calendar', {
        searchParams: {
          from: '2024-01-01',
      },
      }
);
    });

    it('should fetch economic calendar with to date', async () => {
      const mockEconomic: EconomicCalendar[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockEconomic);

      await eventsResource.getEconomicCalendar(undefined, '2024-12-31');

      expect(mockClient.get).toHaveBeenCalledWith('v3/economic_calendar', {
        searchParams: {
          to: '2024-12-31',
      },
      }
);
    });

    it('should fetch economic calendar with date range', async () => {
      const mockEconomic: EconomicCalendar[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockEconomic);

      await eventsResource.getEconomicCalendar('2024-01-01', '2024-12-31');

      expect(mockClient.get).toHaveBeenCalledWith('v3/economic_calendar', {
        searchParams: {
          from: '2024-01-01',
        to: '2024-12-31',
      },
      }
);
    });

    it('should handle multiple economic events', async () => {
      const mockEconomic: EconomicCalendar[] = [
        {
          event: 'GDP Growth Rate',
          date: '2024-01-26',
          country: 'US',
          actual: 3.3,
          previous: 4.9,
          change: -1.6,
          changePercentage: -32.65,
          estimate: 2.0,
          impact: 'High',
        },
        {
          event: 'Unemployment Rate',
          date: '2024-01-27',
          country: 'US',
          actual: 3.7,
          previous: 3.5,
          change: 0.2,
          changePercentage: 5.71,
          estimate: 3.6,
          impact: 'High',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockEconomic);

      const result = await eventsResource.getEconomicCalendar();

      expect(result).toHaveLength(2);
      expect(result[0].event).toBe('GDP Growth Rate');
      expect(result[1].event).toBe('Unemployment Rate');
    });
  });

  describe('getConfirmedEarnings', () => {
    it('should fetch confirmed earnings without date filters', async () => {
      const mockConfirmed: EarningsCalendar[] = [
        {
          date: '2024-01-15',
          symbol: 'AAPL',
          eps: 2.18,
          epsEstimated: 2.10,
          time: 'amc',
          revenue: 119575000000,
          revenueEstimated: 118000000000,
          fiscalDateEnding: '2023-12-31',
          updatedFromDate: '2024-01-15',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockConfirmed);

      const result = await eventsResource.getConfirmedEarnings();

      expect(mockClient.get).toHaveBeenCalledWith('v4/earning-calendar-confirmed', { searchParams: {} });
      expect(result).toEqual(mockConfirmed);
    });

    it('should fetch confirmed earnings with from date', async () => {
      const mockConfirmed: EarningsCalendar[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockConfirmed);

      await eventsResource.getConfirmedEarnings('2024-01-01');

      expect(mockClient.get).toHaveBeenCalledWith('v4/earning-calendar-confirmed', {
        searchParams: {
          from: '2024-01-01',
      },
      }
);
    });

    it('should fetch confirmed earnings with to date', async () => {
      const mockConfirmed: EarningsCalendar[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockConfirmed);

      await eventsResource.getConfirmedEarnings(undefined, '2024-12-31');

      expect(mockClient.get).toHaveBeenCalledWith('v4/earning-calendar-confirmed', {
        searchParams: {
          to: '2024-12-31',
      },
      }
);
    });

    it('should fetch confirmed earnings with date range', async () => {
      const mockConfirmed: EarningsCalendar[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockConfirmed);

      await eventsResource.getConfirmedEarnings('2024-01-01', '2024-12-31');

      expect(mockClient.get).toHaveBeenCalledWith('v4/earning-calendar-confirmed', {
        searchParams: {
          from: '2024-01-01',
        to: '2024-12-31',
      },
      }
);
    });
  });

  describe('Error handling', () => {
    it('should propagate errors from client.get in getEarnings', async () => {
      const error = new Error('Network error');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(eventsResource.getEarnings('AAPL')).rejects.toThrow('Network error');
    });

    it('should propagate errors from client.get in getEarningsCalendar', async () => {
      const error = new Error('API timeout');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(eventsResource.getEarningsCalendar()).rejects.toThrow('API timeout');
    });

    it('should propagate errors from client.get in getDividends', async () => {
      const error = new Error('Invalid symbol');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(eventsResource.getDividends('INVALID')).rejects.toThrow('Invalid symbol');
    });

    it('should propagate errors from client.get in getDividendCalendar', async () => {
      const error = new Error('Rate limit exceeded');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(eventsResource.getDividendCalendar()).rejects.toThrow('Rate limit exceeded');
    });

    it('should propagate errors from client.get in getSplits', async () => {
      const error = new Error('Unauthorized');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(eventsResource.getSplits('AAPL')).rejects.toThrow('Unauthorized');
    });

    it('should propagate errors from client.get in getIPOCalendar', async () => {
      const error = new Error('Service unavailable');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(eventsResource.getIPOCalendar()).rejects.toThrow('Service unavailable');
    });

    it('should propagate errors from client.get in getEconomicCalendar', async () => {
      const error = new Error('Bad request');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(eventsResource.getEconomicCalendar()).rejects.toThrow('Bad request');
    });
  });

  describe('Edge cases', () => {
    it('should handle symbols with special characters', async () => {
      const mockDividends: Dividend[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockDividends);

      await eventsResource.getDividends('BRK.B');

      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/historical-price-full/stock_dividend/BRK.B'
      );
    });

    it('should handle empty string dates gracefully', async () => {
      const mockCalendar: EarningsCalendar[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockCalendar);

      await eventsResource.getEarningsCalendar('', '');

      // Empty strings are falsy, so they won't be included in params
      expect(mockClient.get).toHaveBeenCalledWith('v3/earning_calendar', { searchParams: {} });
    });

    it('should handle limit of 0 in getEarnings', async () => {
      const mockEarnings: Earnings[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockEarnings);

      await eventsResource.getEarnings('AAPL', 0);

      // 0 is falsy, so it won't be included
      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/historical/earning_calendar/AAPL',
        { searchParams: {} }
      );
    });

    it('should include limit when it is a positive number', async () => {
      const mockEarnings: Earnings[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockEarnings);

      await eventsResource.getEarnings('AAPL', 100);

      expect(mockClient.get).toHaveBeenCalledWith(
        'v3/historical/earning_calendar/AAPL',
        { searchParams: {   limit: 100 }, }

      );
    });

    it('should handle very long date ranges in calendar methods', async () => {
      const mockCalendar: EarningsCalendar[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockCalendar);

      await eventsResource.getEarningsCalendar('2000-01-01', '2030-12-31');

      expect(mockClient.get).toHaveBeenCalledWith('v3/earning_calendar', {
        searchParams: {
          from: '2000-01-01',
        to: '2030-12-31',
      },
      }
);
    });
  });

  describe('Type validation', () => {
    it('should return correctly typed Earnings array', async () => {
      const mockEarnings: Earnings[] = [
        {
          date: '2024-01-15',
          symbol: 'AAPL',
          eps: 2.18,
          epsEstimated: 2.10,
          time: 'amc',
          revenue: 119575000000,
          revenueEstimated: 118000000000,
          fiscalDateEnding: '2023-12-31',
          updatedFromDate: '2024-01-15',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockEarnings);

      const result = await eventsResource.getEarnings('AAPL');

      expect(result[0]).toHaveProperty('date');
      expect(result[0]).toHaveProperty('symbol');
      expect(result[0]).toHaveProperty('eps');
      expect(result[0]).toHaveProperty('epsEstimated');
      expect(result[0]).toHaveProperty('time');
      expect(result[0]).toHaveProperty('revenue');
      expect(result[0]).toHaveProperty('revenueEstimated');
      expect(result[0]).toHaveProperty('fiscalDateEnding');
      expect(result[0]).toHaveProperty('updatedFromDate');
    });

    it('should return correctly typed StockSplit array', async () => {
      const mockSplits: StockSplit[] = [
        {
          date: '2020-08-31',
          label: 'August 31, 20',
          symbol: 'AAPL',
          numerator: 4,
          denominator: 1,
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockSplits);

      const result = await eventsResource.getSplits('AAPL');

      expect(result[0]).toHaveProperty('date');
      expect(result[0]).toHaveProperty('label');
      expect(result[0]).toHaveProperty('symbol');
      expect(result[0]).toHaveProperty('numerator');
      expect(result[0]).toHaveProperty('denominator');
    });

    it('should return correctly typed EconomicCalendar array', async () => {
      const mockEconomic: EconomicCalendar[] = [
        {
          event: 'GDP Growth Rate',
          date: '2024-01-26',
          country: 'US',
          actual: 3.3,
          previous: 4.9,
          change: -1.6,
          changePercentage: -32.65,
          estimate: 2.0,
          impact: 'High',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockEconomic);

      const result = await eventsResource.getEconomicCalendar();

      expect(result[0]).toHaveProperty('event');
      expect(result[0]).toHaveProperty('date');
      expect(result[0]).toHaveProperty('country');
      expect(result[0]).toHaveProperty('actual');
      expect(result[0]).toHaveProperty('previous');
      expect(result[0]).toHaveProperty('change');
      expect(result[0]).toHaveProperty('changePercentage');
      expect(result[0]).toHaveProperty('estimate');
      expect(result[0]).toHaveProperty('impact');
    });
  });
});
