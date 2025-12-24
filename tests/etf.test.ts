import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ETFResource } from '../src/resources/etf.js';
import { FMPClient } from '../src/client.js';
import {
  FMPAPIError,
  FMPAPIError,
  FMPAPIError,
} from '../src/errors/index.js';
import type {
  ETFHolding,
  ETFInfo,
  ETFSectorWeighting,
  ETFCountryWeighting,
  ETFStockExposure,
  MutualFundHolder,
} from '../src/types/index.js';

describe('ETFResource', () => {
  let etfResource: ETFResource;
  let mockClient: FMPClient;

  beforeEach(() => {
    // Create a mock client with a mocked get method
    mockClient = {
      get: vi.fn(),
    } as unknown as FMPClient;

    etfResource = new ETFResource(mockClient);
  });

  describe('getHoldings', () => {
    const mockHoldings: ETFHolding[] = [
      {
        asset: 'AAPL',
        name: 'Apple Inc.',
        shares: 1000000,
        weightPercentage: '7.5',
        marketValue: 150000000,
      },
      {
        asset: 'MSFT',
        name: 'Microsoft Corporation',
        shares: 800000,
        weightPercentage: '6.2',
        marketValue: 120000000,
      },
    ];

    it('should fetch ETF holdings successfully', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockHoldings);

      const result = await etfResource.getHoldings('SPY');

      expect(mockClient.get).toHaveBeenCalledWith('v3/etf-holder/SPY');
      expect(result).toEqual(mockHoldings);
    });

    it('should normalize symbol to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockHoldings);

      await etfResource.getHoldings('spy');

      expect(mockClient.get).toHaveBeenCalledWith('v3/etf-holder/SPY');
    });

    it('should handle lowercase ETF symbols', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockHoldings);

      await etfResource.getHoldings('voo');

      expect(mockClient.get).toHaveBeenCalledWith('v3/etf-holder/VOO');
    });

    it('should handle mixed case symbols', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockHoldings);

      await etfResource.getHoldings('QqQ');

      expect(mockClient.get).toHaveBeenCalledWith('v3/etf-holder/QQQ');
    });

    it('should handle empty response', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      const result = await etfResource.getHoldings('EMPTY');

      expect(result).toEqual([]);
    });

    it('should throw FMPAPIError on API failure', async () => {
      const apiError = new FMPAPIError('API Error', 500, 'Internal Server Error');
      vi.mocked(mockClient.get).mockRejectedValue(apiError);

      await expect(etfResource.getHoldings('SPY')).rejects.toThrow(FMPAPIError);
    });

    it('should throw FMPAPIError on auth failure', async () => {
      const authError = new FMPAPIError('Invalid API key');
      vi.mocked(mockClient.get).mockRejectedValue(authError);

      await expect(etfResource.getHoldings('SPY')).rejects.toThrow(
        FMPAPIError
      );
    });

    it('should throw FMPAPIError on rate limit', async () => {
      const rateLimitError = new FMPAPIError();
      vi.mocked(mockClient.get).mockRejectedValue(rateLimitError);

      await expect(etfResource.getHoldings('SPY')).rejects.toThrow(FMPAPIError);
    });
  });

  describe('getInfo', () => {
    const mockInfo: ETFInfo[] = [
      {
        symbol: 'SPY',
        companyName: 'SPDR S&P 500 ETF Trust',
        cik: '0000884394',
        isin: 'US78462F1030',
        cusip: '78462F103',
        exchange: 'NYSE Arca',
        exchangeShortName: 'AMEX',
        description: 'The SPDR S&P 500 ETF Trust seeks to provide investment results...',
        domicile: 'US',
        etfCompany: 'State Street Global Advisors',
        aum: 400000000000,
        nav: 450.25,
        navCurrency: 'USD',
        expenseRatio: 0.0945,
        inceptionDate: '1993-01-22',
        website: 'https://www.ssga.com',
      },
    ];

    it('should fetch ETF info successfully', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockInfo);

      const result = await etfResource.getInfo('SPY');

      expect(mockClient.get).toHaveBeenCalledWith('v4/etf-info', {
        searchParams: {
          symbol: 'SPY',
      },
      }
);
      expect(result).toEqual(mockInfo);
    });

    it('should normalize symbol to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockInfo);

      await etfResource.getInfo('spy');

      expect(mockClient.get).toHaveBeenCalledWith('v4/etf-info', {
        searchParams: {
          symbol: 'SPY',
      },
      }
);
    });

    it('should handle multiple ETF symbols', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockInfo);

      await etfResource.getInfo('VOO');

      expect(mockClient.get).toHaveBeenCalledWith('v4/etf-info', {
        searchParams: {
          symbol: 'VOO',
      },
      }
);
    });

    it('should handle empty response', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      const result = await etfResource.getInfo('NOTFOUND');

      expect(result).toEqual([]);
    });

    it('should throw error on API failure', async () => {
      const apiError = new FMPAPIError('Not Found', 404);
      vi.mocked(mockClient.get).mockRejectedValue(apiError);

      await expect(etfResource.getInfo('INVALID')).rejects.toThrow(FMPAPIError);
    });
  });

  describe('getSectorWeightings', () => {
    const mockSectorWeightings: ETFSectorWeighting[] = [
      {
        sector: 'Technology',
        weightPercentage: '28.5',
      },
      {
        sector: 'Healthcare',
        weightPercentage: '14.2',
      },
      {
        sector: 'Financials',
        weightPercentage: '12.8',
      },
    ];

    it('should fetch sector weightings successfully', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockSectorWeightings);

      const result = await etfResource.getSectorWeightings('SPY');

      expect(mockClient.get).toHaveBeenCalledWith('v3/etf-sector-weightings/SPY');
      expect(result).toEqual(mockSectorWeightings);
    });

    it('should normalize symbol to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockSectorWeightings);

      await etfResource.getSectorWeightings('vti');

      expect(mockClient.get).toHaveBeenCalledWith('v3/etf-sector-weightings/VTI');
    });

    it('should handle sector-specific ETFs', async () => {
      const techETF: ETFSectorWeighting[] = [
        {
          sector: 'Technology',
          weightPercentage: '95.5',
        },
      ];
      vi.mocked(mockClient.get).mockResolvedValue(techETF);

      const result = await etfResource.getSectorWeightings('XLK');

      expect(result).toEqual(techETF);
    });

    it('should handle empty weightings', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      const result = await etfResource.getSectorWeightings('BOND');

      expect(result).toEqual([]);
    });

    it('should throw error on API failure', async () => {
      const apiError = new FMPAPIError('Server Error', 500);
      vi.mocked(mockClient.get).mockRejectedValue(apiError);

      await expect(etfResource.getSectorWeightings('SPY')).rejects.toThrow(
        FMPAPIError
      );
    });
  });

  describe('getCountryWeightings', () => {
    const mockCountryWeightings: ETFCountryWeighting[] = [
      {
        country: 'United States',
        weightPercentage: '65.5',
      },
      {
        country: 'Japan',
        weightPercentage: '8.2',
      },
      {
        country: 'United Kingdom',
        weightPercentage: '5.1',
      },
    ];

    it('should fetch country weightings successfully', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockCountryWeightings);

      const result = await etfResource.getCountryWeightings('VT');

      expect(mockClient.get).toHaveBeenCalledWith('v3/etf-country-weightings/VT');
      expect(result).toEqual(mockCountryWeightings);
    });

    it('should normalize symbol to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockCountryWeightings);

      await etfResource.getCountryWeightings('vt');

      expect(mockClient.get).toHaveBeenCalledWith('v3/etf-country-weightings/VT');
    });

    it('should handle international ETFs', async () => {
      const internationalETF: ETFCountryWeighting[] = [
        {
          country: 'China',
          weightPercentage: '30.0',
        },
        {
          country: 'India',
          weightPercentage: '20.0',
        },
      ];
      vi.mocked(mockClient.get).mockResolvedValue(internationalETF);

      const result = await etfResource.getCountryWeightings('EEM');

      expect(result).toEqual(internationalETF);
    });

    it('should handle US-only ETFs', async () => {
      const usOnlyETF: ETFCountryWeighting[] = [
        {
          country: 'United States',
          weightPercentage: '100.0',
        },
      ];
      vi.mocked(mockClient.get).mockResolvedValue(usOnlyETF);

      const result = await etfResource.getCountryWeightings('SPY');

      expect(result).toEqual(usOnlyETF);
    });

    it('should handle empty response', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      const result = await etfResource.getCountryWeightings('EMPTY');

      expect(result).toEqual([]);
    });

    it('should throw error on API failure', async () => {
      const apiError = new FMPAPIError('Bad Request', 400);
      vi.mocked(mockClient.get).mockRejectedValue(apiError);

      await expect(etfResource.getCountryWeightings('INVALID')).rejects.toThrow(
        FMPAPIError
      );
    });
  });

  describe('getStockExposure', () => {
    const mockStockExposure: ETFStockExposure[] = [
      {
        etfSymbol: 'SPY',
        assetExposure: 'AAPL',
        sharesNumber: 1000000,
        weightPercentage: '7.5',
        marketValue: 150000000,
      },
      {
        etfSymbol: 'QQQ',
        assetExposure: 'AAPL',
        sharesNumber: 500000,
        weightPercentage: '12.1',
        marketValue: 75000000,
      },
    ];

    it('should fetch stock exposure successfully', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockStockExposure);

      const result = await etfResource.getStockExposure('AAPL');

      expect(mockClient.get).toHaveBeenCalledWith('v3/etf-stock-exposure/AAPL');
      expect(result).toEqual(mockStockExposure);
    });

    it('should normalize symbol to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockStockExposure);

      await etfResource.getStockExposure('aapl');

      expect(mockClient.get).toHaveBeenCalledWith('v3/etf-stock-exposure/AAPL');
    });

    it('should handle stocks with limited ETF exposure', async () => {
      const limitedExposure: ETFStockExposure[] = [
        {
          etfSymbol: 'XLK',
          assetExposure: 'SMALLCAP',
          sharesNumber: 10000,
          weightPercentage: '0.1',
          marketValue: 100000,
        },
      ];
      vi.mocked(mockClient.get).mockResolvedValue(limitedExposure);

      const result = await etfResource.getStockExposure('SMALLCAP');

      expect(result).toEqual(limitedExposure);
    });

    it('should handle stocks with no ETF exposure', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      const result = await etfResource.getStockExposure('NOEXPOSURE');

      expect(result).toEqual([]);
    });

    it('should handle mixed case stock symbols', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockStockExposure);

      await etfResource.getStockExposure('TsLa');

      expect(mockClient.get).toHaveBeenCalledWith('v3/etf-stock-exposure/TSLA');
    });

    it('should throw error on API failure', async () => {
      const apiError = new FMPAPIError('Not Found', 404);
      vi.mocked(mockClient.get).mockRejectedValue(apiError);

      await expect(etfResource.getStockExposure('INVALID')).rejects.toThrow(
        FMPAPIError
      );
    });

    it('should throw authentication error', async () => {
      const authError = new FMPAPIError();
      vi.mocked(mockClient.get).mockRejectedValue(authError);

      await expect(etfResource.getStockExposure('AAPL')).rejects.toThrow(
        FMPAPIError
      );
    });
  });

  describe('getMutualFundHolders', () => {
    const mockMutualFundHolders: MutualFundHolder[] = [
      {
        holder: 'Vanguard Total Stock Market Index Fund',
        shares: 5000000,
        dateReported: '2024-03-31',
        change: 100000,
        weightPercent: 2.5,
      },
      {
        holder: 'Fidelity Contrafund',
        shares: 3000000,
        dateReported: '2024-03-31',
        change: -50000,
        weightPercent: 1.8,
      },
    ];

    it('should fetch mutual fund holders successfully', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockMutualFundHolders);

      const result = await etfResource.getMutualFundHolders('AAPL');

      expect(mockClient.get).toHaveBeenCalledWith('v3/mutual-fund-holder/AAPL');
      expect(result).toEqual(mockMutualFundHolders);
    });

    it('should normalize symbol to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockMutualFundHolders);

      await etfResource.getMutualFundHolders('msft');

      expect(mockClient.get).toHaveBeenCalledWith('v3/mutual-fund-holder/MSFT');
    });

    it('should handle stocks with no mutual fund holders', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      const result = await etfResource.getMutualFundHolders('SMALLCAP');

      expect(result).toEqual([]);
    });

    it('should handle large cap stocks with many holders', async () => {
      const manyHolders = Array.from({ length: 50 }, (_, i) => ({
        holder: `Fund ${i + 1}`,
        shares: 1000000 - i * 10000,
        dateReported: '2024-03-31',
        change: Math.random() > 0.5 ? 10000 : -10000,
        weightPercent: 0.5 - i * 0.01,
      }));
      vi.mocked(mockClient.get).mockResolvedValue(manyHolders);

      const result = await etfResource.getMutualFundHolders('AAPL');

      expect(result).toHaveLength(50);
    });

    it('should throw error on API failure', async () => {
      const apiError = new FMPAPIError('Server Error', 500);
      vi.mocked(mockClient.get).mockRejectedValue(apiError);

      await expect(etfResource.getMutualFundHolders('AAPL')).rejects.toThrow(
        FMPAPIError
      );
    });

    it('should throw rate limit error', async () => {
      const rateLimitError = new FMPAPIError();
      vi.mocked(mockClient.get).mockRejectedValue(rateLimitError);

      await expect(etfResource.getMutualFundHolders('AAPL')).rejects.toThrow(
        FMPAPIError
      );
    });
  });

  describe('getETFList', () => {
    const mockETFList = [
      { symbol: 'SPY', name: 'SPDR S&P 500 ETF Trust' },
      { symbol: 'VOO', name: 'Vanguard S&P 500 ETF' },
      { symbol: 'QQQ', name: 'Invesco QQQ Trust' },
    ];

    it('should fetch ETF list successfully', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockETFList);

      const result = await etfResource.getETFList();

      expect(mockClient.get).toHaveBeenCalledWith('v3/etf/list');
      expect(result).toEqual(mockETFList);
    });

    it('should handle empty list', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      const result = await etfResource.getETFList();

      expect(result).toEqual([]);
    });

    it('should throw error on API failure', async () => {
      const apiError = new FMPAPIError('Server Error', 500);
      vi.mocked(mockClient.get).mockRejectedValue(apiError);

      await expect(etfResource.getETFList()).rejects.toThrow(FMPAPIError);
    });
  });

  describe('getAvailableMutualFunds', () => {
    const mockMutualFunds = [
      { symbol: 'VFIAX', name: 'Vanguard 500 Index Fund Admiral Shares' },
      { symbol: 'FXAIX', name: 'Fidelity 500 Index Fund' },
    ];

    it('should fetch available mutual funds successfully', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockMutualFunds);

      const result = await etfResource.getAvailableMutualFunds();

      expect(mockClient.get).toHaveBeenCalledWith('v3/symbol/available-mutual-funds');
      expect(result).toEqual(mockMutualFunds);
    });

    it('should handle empty list', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      const result = await etfResource.getAvailableMutualFunds();

      expect(result).toEqual([]);
    });

    it('should throw error on API failure', async () => {
      const apiError = new FMPAPIError('Bad Gateway', 502);
      vi.mocked(mockClient.get).mockRejectedValue(apiError);

      await expect(etfResource.getAvailableMutualFunds()).rejects.toThrow(
        FMPAPIError
      );
    });
  });

  describe('getLatestDisclosures', () => {
    const mockDisclosures = [
      { symbol: 'SPY', date: '2024-03-31' },
      { symbol: 'VOO', date: '2024-03-31' },
      { symbol: 'QQQ', date: '2024-03-31' },
    ];

    it('should fetch latest disclosures successfully', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockDisclosures);

      const result = await etfResource.getLatestDisclosures();

      expect(mockClient.get).toHaveBeenCalledWith('v4/etf-holdings/portfolio-date');
      expect(result).toEqual(mockDisclosures);
    });

    it('should handle empty disclosures', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      const result = await etfResource.getLatestDisclosures();

      expect(result).toEqual([]);
    });

    it('should handle disclosures with different dates', async () => {
      const disclosuresWithDifferentDates = [
        { symbol: 'SPY', date: '2024-03-31' },
        { symbol: 'VOO', date: '2024-02-29' },
        { symbol: 'QQQ', date: '2024-01-31' },
      ];
      vi.mocked(mockClient.get).mockResolvedValue(disclosuresWithDifferentDates);

      const result = await etfResource.getLatestDisclosures();

      expect(result).toEqual(disclosuresWithDifferentDates);
    });

    it('should throw error on API failure', async () => {
      const apiError = new FMPAPIError('Service Unavailable', 503);
      vi.mocked(mockClient.get).mockRejectedValue(apiError);

      await expect(etfResource.getLatestDisclosures()).rejects.toThrow(FMPAPIError);
    });

    it('should throw authentication error', async () => {
      const authError = new FMPAPIError('Invalid API key');
      vi.mocked(mockClient.get).mockRejectedValue(authError);

      await expect(etfResource.getLatestDisclosures()).rejects.toThrow(
        FMPAPIError
      );
    });
  });

  describe('Symbol Normalization', () => {
    it('should normalize all variations of SPY correctly', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await etfResource.getHoldings('spy');
      await etfResource.getHoldings('SPY');
      await etfResource.getHoldings('Spy');
      await etfResource.getHoldings('SpY');

      expect(mockClient.get).toHaveBeenNthCalledWith(1, 'v3/etf-holder/SPY');
      expect(mockClient.get).toHaveBeenNthCalledWith(2, 'v3/etf-holder/SPY');
      expect(mockClient.get).toHaveBeenNthCalledWith(3, 'v3/etf-holder/SPY');
      expect(mockClient.get).toHaveBeenNthCalledWith(4, 'v3/etf-holder/SPY');
    });

    it('should normalize symbols with numbers', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await etfResource.getStockExposure('tsla');
      await etfResource.getInfo('voo');

      expect(mockClient.get).toHaveBeenCalledWith('v3/etf-stock-exposure/TSLA');
      expect(mockClient.get).toHaveBeenCalledWith('v4/etf-info', { searchParams: {   symbol: 'VOO' }, }
);
    });

    it('should handle symbols with special characters', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      // While ETF symbols typically don't have special characters,
      // the normalization should still work
      await etfResource.getHoldings('brk.b');

      expect(mockClient.get).toHaveBeenCalledWith('v3/etf-holder/BRK.B');
    });
  });

  describe('Error Handling', () => {
    it('should handle network timeout errors', async () => {
      const timeoutError = new FMPAPIError('Request timeout');
      vi.mocked(mockClient.get).mockRejectedValue(timeoutError);

      await expect(etfResource.getHoldings('SPY')).rejects.toThrow(FMPAPIError);
      await expect(etfResource.getInfo('SPY')).rejects.toThrow(FMPAPIError);
      await expect(etfResource.getSectorWeightings('SPY')).rejects.toThrow(
        FMPAPIError
      );
    });

    it('should handle 404 errors for non-existent ETFs', async () => {
      const notFoundError = new FMPAPIError('Not Found', 404);
      vi.mocked(mockClient.get).mockRejectedValue(notFoundError);

      await expect(etfResource.getHoldings('NOTFOUND')).rejects.toThrow(FMPAPIError);
    });

    it('should handle 500 server errors', async () => {
      const serverError = new FMPAPIError('Internal Server Error', 500);
      vi.mocked(mockClient.get).mockRejectedValue(serverError);

      await expect(etfResource.getCountryWeightings('SPY')).rejects.toThrow(
        FMPAPIError
      );
    });

    it('should handle authentication errors across all methods', async () => {
      const authError = new FMPAPIError('Unauthorized');
      vi.mocked(mockClient.get).mockRejectedValue(authError);

      await expect(etfResource.getHoldings('SPY')).rejects.toThrow(
        FMPAPIError
      );
      await expect(etfResource.getInfo('SPY')).rejects.toThrow(
        FMPAPIError
      );
      await expect(etfResource.getSectorWeightings('SPY')).rejects.toThrow(
        FMPAPIError
      );
      await expect(etfResource.getCountryWeightings('SPY')).rejects.toThrow(
        FMPAPIError
      );
      await expect(etfResource.getStockExposure('AAPL')).rejects.toThrow(
        FMPAPIError
      );
      await expect(etfResource.getMutualFundHolders('AAPL')).rejects.toThrow(
        FMPAPIError
      );
    });

    it('should handle rate limit errors across all methods', async () => {
      const rateLimitError = new FMPAPIError('Too many requests');
      vi.mocked(mockClient.get).mockRejectedValue(rateLimitError);

      await expect(etfResource.getHoldings('SPY')).rejects.toThrow(
        FMPAPIError
      );
      await expect(etfResource.getETFList()).rejects.toThrow(FMPAPIError);
      await expect(etfResource.getAvailableMutualFunds()).rejects.toThrow(
        FMPAPIError
      );
      await expect(etfResource.getLatestDisclosures()).rejects.toThrow(
        FMPAPIError
      );
    });
  });

  describe('Response Data Integrity', () => {
    it('should return holdings with correct structure', async () => {
      const holding: ETFHolding = {
        asset: 'AAPL',
        name: 'Apple Inc.',
        shares: 1000000,
        weightPercentage: '7.5',
        marketValue: 150000000,
      };
      vi.mocked(mockClient.get).mockResolvedValue([holding]);

      const result = await etfResource.getHoldings('SPY');

      expect(result[0]).toHaveProperty('asset');
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('shares');
      expect(result[0]).toHaveProperty('weightPercentage');
      expect(result[0]).toHaveProperty('marketValue');
    });

    it('should return ETF info with correct structure', async () => {
      const info: ETFInfo = {
        symbol: 'SPY',
        companyName: 'SPDR S&P 500 ETF Trust',
        cik: '0000884394',
        isin: 'US78462F1030',
        cusip: '78462F103',
        exchange: 'NYSE Arca',
        exchangeShortName: 'AMEX',
        description: 'ETF description',
        domicile: 'US',
        etfCompany: 'State Street',
        aum: 400000000000,
        nav: 450.25,
        navCurrency: 'USD',
        expenseRatio: 0.0945,
        inceptionDate: '1993-01-22',
        website: 'https://www.ssga.com',
      };
      vi.mocked(mockClient.get).mockResolvedValue([info]);

      const result = await etfResource.getInfo('SPY');

      expect(result[0]).toHaveProperty('symbol');
      expect(result[0]).toHaveProperty('companyName');
      expect(result[0]).toHaveProperty('aum');
      expect(result[0]).toHaveProperty('expenseRatio');
      expect(result[0]).toHaveProperty('inceptionDate');
    });

    it('should return sector weightings with correct structure', async () => {
      const weighting: ETFSectorWeighting = {
        sector: 'Technology',
        weightPercentage: '28.5',
      };
      vi.mocked(mockClient.get).mockResolvedValue([weighting]);

      const result = await etfResource.getSectorWeightings('SPY');

      expect(result[0]).toHaveProperty('sector');
      expect(result[0]).toHaveProperty('weightPercentage');
    });

    it('should return country weightings with correct structure', async () => {
      const weighting: ETFCountryWeighting = {
        country: 'United States',
        weightPercentage: '65.5',
      };
      vi.mocked(mockClient.get).mockResolvedValue([weighting]);

      const result = await etfResource.getCountryWeightings('VT');

      expect(result[0]).toHaveProperty('country');
      expect(result[0]).toHaveProperty('weightPercentage');
    });

    it('should return stock exposure with correct structure', async () => {
      const exposure: ETFStockExposure = {
        etfSymbol: 'SPY',
        assetExposure: 'AAPL',
        sharesNumber: 1000000,
        weightPercentage: '7.5',
        marketValue: 150000000,
      };
      vi.mocked(mockClient.get).mockResolvedValue([exposure]);

      const result = await etfResource.getStockExposure('AAPL');

      expect(result[0]).toHaveProperty('etfSymbol');
      expect(result[0]).toHaveProperty('assetExposure');
      expect(result[0]).toHaveProperty('sharesNumber');
      expect(result[0]).toHaveProperty('weightPercentage');
      expect(result[0]).toHaveProperty('marketValue');
    });

    it('should return mutual fund holders with correct structure', async () => {
      const holder: MutualFundHolder = {
        holder: 'Vanguard Total Stock Market Index Fund',
        shares: 5000000,
        dateReported: '2024-03-31',
        change: 100000,
        weightPercent: 2.5,
      };
      vi.mocked(mockClient.get).mockResolvedValue([holder]);

      const result = await etfResource.getMutualFundHolders('AAPL');

      expect(result[0]).toHaveProperty('holder');
      expect(result[0]).toHaveProperty('shares');
      expect(result[0]).toHaveProperty('dateReported');
      expect(result[0]).toHaveProperty('change');
      expect(result[0]).toHaveProperty('weightPercent');
    });
  });
});
