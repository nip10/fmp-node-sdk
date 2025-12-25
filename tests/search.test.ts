import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SearchResource } from '../src/resources/search.js';
import type { FMPClient } from '../src/client.js';
import type {
  SymbolSearchResult,
  NameSearchResult,
  CIKSearchResult,
  CUSIPSearchResult,
  ISINSearchResult,
  StockScreenerResult,
  ExchangeSymbol,
} from '../src/types/index.js';

describe('SearchResource', () => {
  let mockClient: FMPClient;
  let searchResource: SearchResource;

  beforeEach(() => {
    // Create a mock FMPClient with a get method
    mockClient = {
      get: vi.fn(),
    } as unknown as FMPClient;

    searchResource = new SearchResource(mockClient);
  });

  describe('searchBySymbol', () => {
    const mockSymbolResults: SymbolSearchResult[] = [
      {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        currency: 'USD',
        stockExchange: 'NASDAQ Global Select',
        exchangeShortName: 'NASDAQ',
      },
      {
        symbol: 'AAPLW',
        name: 'Apple Inc. Warrants',
        currency: 'USD',
        stockExchange: 'NASDAQ Global Select',
        exchangeShortName: 'NASDAQ',
      },
    ];

    it('should search by symbol with default limit', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockSymbolResults);

      const result = await searchResource.searchBySymbol('AAPL');

      expect(mockClient.get).toHaveBeenCalledWith('search-symbol', {
        searchParams: {
          query: 'AAPL',
        limit: 10,
      },
      }
);
      expect(result).toEqual(mockSymbolResults);
    });

    it('should convert query to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockSymbolResults);

      await searchResource.searchBySymbol('aapl');

      expect(mockClient.get).toHaveBeenCalledWith('search-symbol', {
        searchParams: {
          query: 'AAPL',
        limit: 10,
      },
      }
);
    });

    it('should search with custom limit', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockSymbolResults);

      await searchResource.searchBySymbol('AAPL', 20);

      expect(mockClient.get).toHaveBeenCalledWith('search-symbol', {
        searchParams: {
          query: 'AAPL',
        limit: 20,
      },
      }
);
    });

    it('should search with exchange filter', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([mockSymbolResults[0]]);

      await searchResource.searchBySymbol('AAPL', 10, 'NASDAQ');

      expect(mockClient.get).toHaveBeenCalledWith('search-symbol', {
        searchParams: {
          query: 'AAPL',
        limit: 10,
        exchange: 'NASDAQ',
      },
      }
);
    });

    it('should convert exchange to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([mockSymbolResults[0]]);

      await searchResource.searchBySymbol('AAPL', 10, 'nasdaq');

      expect(mockClient.get).toHaveBeenCalledWith('search-symbol', {
        searchParams: {
          query: 'AAPL',
        limit: 10,
        exchange: 'NASDAQ',
      },
      }
);
    });

    it('should handle partial symbol matches', async () => {
      const partialResults: SymbolSearchResult[] = [
        {
          symbol: 'AA',
          name: 'Alcoa Corporation',
          currency: 'USD',
          stockExchange: 'New York Stock Exchange',
          exchangeShortName: 'NYSE',
        },
        {
          symbol: 'AAL',
          name: 'American Airlines Group Inc.',
          currency: 'USD',
          stockExchange: 'NASDAQ Global Select',
          exchangeShortName: 'NASDAQ',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(partialResults);

      const result = await searchResource.searchBySymbol('AA', 20);

      expect(result).toEqual(partialResults);
      expect(result).toHaveLength(2);
    });

    it('should return empty array for no matches', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      const result = await searchResource.searchBySymbol('NONEXISTENT');

      expect(result).toEqual([]);
    });
  });

  describe('searchByName', () => {
    const mockNameResults: NameSearchResult[] = [
      {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        currency: 'USD',
        stockExchange: 'NASDAQ Global Select',
        exchangeShortName: 'NASDAQ',
      },
      {
        symbol: 'AAPL34',
        name: 'Apple Inc.',
        currency: 'BRL',
        stockExchange: 'Sao Paolo',
        exchangeShortName: 'SAO',
      },
    ];

    it('should search by name with default limit', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockNameResults);

      const result = await searchResource.searchByName('Apple');

      expect(mockClient.get).toHaveBeenCalledWith('search-name', {
        searchParams: {
          query: 'Apple',
        limit: 10,
      },
      }
);
      expect(result).toEqual(mockNameResults);
    });

    it('should preserve query case sensitivity', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockNameResults);

      await searchResource.searchByName('apple');

      expect(mockClient.get).toHaveBeenCalledWith('search-name', {
        searchParams: {
          query: 'apple',
        limit: 10,
      },
      }
);
    });

    it('should search with custom limit', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockNameResults);

      await searchResource.searchByName('Apple', 50);

      expect(mockClient.get).toHaveBeenCalledWith('search-name', {
        searchParams: {
          query: 'Apple',
        limit: 50,
      },
      }
);
    });

    it('should search with exchange filter', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([mockNameResults[0]]);

      await searchResource.searchByName('Apple', 10, 'NASDAQ');

      expect(mockClient.get).toHaveBeenCalledWith('search-name', {
        searchParams: {
          query: 'Apple',
        limit: 10,
        exchange: 'NASDAQ',
      },
      }
);
    });

    it('should convert exchange to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([mockNameResults[0]]);

      await searchResource.searchByName('Apple', 10, 'nyse');

      expect(mockClient.get).toHaveBeenCalledWith('search-name', {
        searchParams: {
          query: 'Apple',
        limit: 10,
        exchange: 'NYSE',
      },
      }
);
    });

    it('should handle partial name matches', async () => {
      const techCompanies: NameSearchResult[] = [
        {
          symbol: 'MSFT',
          name: 'Microsoft Corporation',
          currency: 'USD',
          stockExchange: 'NASDAQ Global Select',
          exchangeShortName: 'NASDAQ',
        },
        {
          symbol: 'GOOGL',
          name: 'Alphabet Inc.',
          currency: 'USD',
          stockExchange: 'NASDAQ Global Select',
          exchangeShortName: 'NASDAQ',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(techCompanies);

      const result = await searchResource.searchByName('Tech');

      expect(result).toEqual(techCompanies);
    });

    it('should return empty array for no matches', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      const result = await searchResource.searchByName('NonexistentCompany');

      expect(result).toEqual([]);
    });
  });

  describe('searchByCIK', () => {
    const mockCIKResults: CIKSearchResult[] = [
      {
        cik: '0000320193',
        name: 'Apple Inc.',
      },
    ];

    it('should search by CIK', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockCIKResults);

      const result = await searchResource.searchByCIK('0000320193');

      expect(mockClient.get).toHaveBeenCalledWith('search-cik', { searchParams: { cik: '0000320193' } });
      expect(result).toEqual(mockCIKResults);
    });

    it('should handle CIK without leading zeros', async () => {
      const results: CIKSearchResult[] = [
        {
          cik: '320193',
          name: 'Apple Inc.',
        },
      ];
      vi.mocked(mockClient.get).mockResolvedValue(results);

      const result = await searchResource.searchByCIK('320193');

      expect(mockClient.get).toHaveBeenCalledWith('search-cik', { searchParams: { cik: '320193' } });
      expect(result).toEqual(results);
    });

    it('should return empty array for invalid CIK', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      const result = await searchResource.searchByCIK('0000000000');

      expect(result).toEqual([]);
    });
  });

  describe('searchByCUSIP', () => {
    const mockCUSIPResults: CUSIPSearchResult[] = [
      {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        cusip: '037833100',
        isin: 'US0378331005',
        exchange: 'NASDAQ',
      },
    ];

    it('should search by CUSIP', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockCUSIPResults);

      const result = await searchResource.searchByCUSIP('037833100');

      expect(mockClient.get).toHaveBeenCalledWith('search-cusip', { searchParams: { cusip: '037833100' } });
      expect(result).toEqual(mockCUSIPResults);
    });

    it('should handle 9-character CUSIP', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockCUSIPResults);

      const result = await searchResource.searchByCUSIP('037833100');

      expect(mockClient.get).toHaveBeenCalledWith('search-cusip', { searchParams: { cusip: '037833100' } });
      expect(result).toHaveLength(1);
      expect(result[0].cusip).toBe('037833100');
    });

    it('should return empty array for invalid CUSIP', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      const result = await searchResource.searchByCUSIP('000000000');

      expect(result).toEqual([]);
    });
  });

  describe('searchByISIN', () => {
    const mockISINResults: ISINSearchResult[] = [
      {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        isin: 'US0378331005',
        cusip: '037833100',
        exchange: 'NASDAQ',
      },
    ];

    it('should search by ISIN', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockISINResults);

      const result = await searchResource.searchByISIN('US0378331005');

      expect(mockClient.get).toHaveBeenCalledWith('search-isin', {
        searchParams: {
          isin: 'US0378331005',
      },
      }
);
      expect(result).toEqual(mockISINResults);
    });

    it('should handle international ISIN', async () => {
      const internationalResults: ISINSearchResult[] = [
        {
          symbol: 'NESN',
          name: 'Nestle S.A.',
          isin: 'CH0038863350',
          cusip: 'N/A',
          exchange: 'SWX',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(internationalResults);

      const result = await searchResource.searchByISIN('CH0038863350');

      expect(mockClient.get).toHaveBeenCalledWith('search-isin', {
        searchParams: {
          isin: 'CH0038863350',
      },
      }
);
      expect(result).toEqual(internationalResults);
    });

    it('should return empty array for invalid ISIN', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      const result = await searchResource.searchByISIN('XX0000000000');

      expect(result).toEqual([]);
    });
  });

  describe('screenStocks', () => {
    const mockScreenerResults: StockScreenerResult[] = [
      {
        symbol: 'AAPL',
        companyName: 'Apple Inc.',
        marketCap: 3000000000000,
        sector: 'Technology',
        industry: 'Consumer Electronics',
        beta: 1.2,
        price: 175.5,
        lastAnnualDividend: 0.96,
        volume: 50000000,
        exchange: 'NASDAQ Global Select',
        exchangeShortName: 'NASDAQ',
        country: 'US',
        isEtf: false,
        isActivelyTrading: true,
      },
      {
        symbol: 'MSFT',
        companyName: 'Microsoft Corporation',
        marketCap: 2800000000000,
        sector: 'Technology',
        industry: 'Software - Infrastructure',
        beta: 0.9,
        price: 380.0,
        lastAnnualDividend: 2.72,
        volume: 25000000,
        exchange: 'NASDAQ Global Select',
        exchangeShortName: 'NASDAQ',
        country: 'US',
        isEtf: false,
        isActivelyTrading: true,
      },
    ];

    it('should screen stocks with market cap filters', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockScreenerResults);

      const result = await searchResource.screenStocks({
        marketCapMoreThan: 1000000000000,
        marketCapLowerThan: 5000000000000,
      });

      expect(mockClient.get).toHaveBeenCalledWith('company-screener', {
        searchParams: {
          marketCapMoreThan: 1000000000000,
        marketCapLowerThan: 5000000000000,
      },
      }
);
      expect(result).toEqual(mockScreenerResults);
    });

    it('should screen stocks with price filters', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockScreenerResults);

      await searchResource.screenStocks({
        priceMoreThan: 100,
        priceLowerThan: 500,
      });

      expect(mockClient.get).toHaveBeenCalledWith('company-screener', {
        searchParams: {
          priceMoreThan: 100,
        priceLowerThan: 500,
      },
      }
);
    });

    it('should screen stocks with beta filters', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([mockScreenerResults[1]]);

      await searchResource.screenStocks({
        betaMoreThan: 0.5,
        betaLowerThan: 1.0,
      });

      expect(mockClient.get).toHaveBeenCalledWith('company-screener', {
        searchParams: {
          betaMoreThan: 0.5,
        betaLowerThan: 1.0,
      },
      }
);
    });

    it('should screen stocks with volume filters', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockScreenerResults);

      await searchResource.screenStocks({
        volumeMoreThan: 10000000,
        volumeLowerThan: 100000000,
      });

      expect(mockClient.get).toHaveBeenCalledWith('company-screener', {
        searchParams: {
          volumeMoreThan: 10000000,
        volumeLowerThan: 100000000,
      },
      }
);
    });

    it('should screen stocks with dividend filters', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockScreenerResults);

      await searchResource.screenStocks({
        dividendMoreThan: 1,
        dividendLowerThan: 5,
      });

      expect(mockClient.get).toHaveBeenCalledWith('company-screener', {
        searchParams: {
          dividendMoreThan: 1,
        dividendLowerThan: 5,
      },
      }
);
    });

    it('should screen stocks with sector filter', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockScreenerResults);

      await searchResource.screenStocks({
        sector: 'Technology',
      });

      expect(mockClient.get).toHaveBeenCalledWith('company-screener', {
        searchParams: {
          sector: 'Technology',
      },
      }
);
    });

    it('should screen stocks with industry filter', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([mockScreenerResults[0]]);

      await searchResource.screenStocks({
        industry: 'Consumer Electronics',
      });

      expect(mockClient.get).toHaveBeenCalledWith('company-screener', {
        searchParams: {
          industry: 'Consumer Electronics',
      },
      }
);
    });

    it('should screen stocks with country filter', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockScreenerResults);

      await searchResource.screenStocks({
        country: 'US',
      });

      expect(mockClient.get).toHaveBeenCalledWith('company-screener', {
        searchParams: {
          country: 'US',
      },
      }
);
    });

    it('should screen stocks with exchange filter', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockScreenerResults);

      await searchResource.screenStocks({
        exchange: 'NASDAQ',
      });

      expect(mockClient.get).toHaveBeenCalledWith('company-screener', {
        searchParams: {
          exchange: 'NASDAQ',
      },
      }
);
    });

    it('should convert exchange to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockScreenerResults);

      await searchResource.screenStocks({
        exchange: 'nasdaq',
      });

      expect(mockClient.get).toHaveBeenCalledWith('company-screener', {
        searchParams: {
          exchange: 'NASDAQ',
      },
      }
);
    });

    it('should screen stocks with isEtf filter', async () => {
      const etfResults: StockScreenerResult[] = [
        {
          symbol: 'SPY',
          companyName: 'SPDR S&P 500 ETF Trust',
          marketCap: 500000000000,
          sector: 'N/A',
          industry: 'N/A',
          beta: 1.0,
          price: 450.0,
          lastAnnualDividend: 6.5,
          volume: 80000000,
          exchange: 'NYSE Arca',
          exchangeShortName: 'AMEX',
          country: 'US',
          isEtf: true,
          isActivelyTrading: true,
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(etfResults);

      await searchResource.screenStocks({
        isEtf: true,
      });

      expect(mockClient.get).toHaveBeenCalledWith('company-screener', {
        searchParams: {
          isEtf: true,
      },
      }
);
    });

    it('should screen stocks with isActivelyTrading filter', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockScreenerResults);

      await searchResource.screenStocks({
        isActivelyTrading: true,
      });

      expect(mockClient.get).toHaveBeenCalledWith('company-screener', {
        searchParams: {
          isActivelyTrading: true,
      },
      }
);
    });

    it('should screen stocks with limit parameter', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockScreenerResults);

      await searchResource.screenStocks({
        sector: 'Technology',
        limit: 100,
      });

      expect(mockClient.get).toHaveBeenCalledWith('company-screener', {
        searchParams: {
          sector: 'Technology',
        limit: 100,
      },
      }
);
    });

    it('should screen stocks with multiple filters', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockScreenerResults);

      await searchResource.screenStocks({
        marketCapMoreThan: 100000000000,
        sector: 'Technology',
        betaMoreThan: 0.8,
        betaLowerThan: 1.5,
        isActivelyTrading: true,
        exchange: 'NASDAQ',
        limit: 50,
      });

      expect(mockClient.get).toHaveBeenCalledWith('company-screener', {
        searchParams: {
          marketCapMoreThan: 100000000000,
        sector: 'Technology',
        betaMoreThan: 0.8,
        betaLowerThan: 1.5,
        isActivelyTrading: true,
        exchange: 'NASDAQ',
        limit: 50,
      },
      }
);
    });

    it('should screen stocks with empty parameters', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockScreenerResults);

      await searchResource.screenStocks({});

      expect(mockClient.get).toHaveBeenCalledWith('company-screener', { searchParams: {} });
    });

    it('should screen stocks with no parameters', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockScreenerResults);

      await searchResource.screenStocks();

      expect(mockClient.get).toHaveBeenCalledWith('company-screener', { searchParams: {} });
    });

    it('should not include undefined parameters', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockScreenerResults);

      await searchResource.screenStocks({
        sector: 'Technology',
        industry: undefined,
        marketCapMoreThan: undefined,
      });

      expect(mockClient.get).toHaveBeenCalledWith('company-screener', {
        searchParams: {
          sector: 'Technology',
      },
      }
);
    });

    it('should handle zero values in filters', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await searchResource.screenStocks({
        priceMoreThan: 0,
        volumeMoreThan: 0,
      });

      expect(mockClient.get).toHaveBeenCalledWith('company-screener', {
        searchParams: {
          priceMoreThan: 0,
        volumeMoreThan: 0,
      },
      }
);
    });

    it('should screen dividend stocks', async () => {
      const dividendResults: StockScreenerResult[] = [mockScreenerResults[1]];

      vi.mocked(mockClient.get).mockResolvedValue(dividendResults);

      const result = await searchResource.screenStocks({
        dividendMoreThan: 2,
        priceMoreThan: 10,
        volumeMoreThan: 1000000,
      });

      expect(result).toEqual(dividendResults);
      expect(result[0].lastAnnualDividend).toBeGreaterThan(2);
    });

    it('should return empty array when no stocks match criteria', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      const result = await searchResource.screenStocks({
        marketCapMoreThan: 10000000000000,
        sector: 'NonexistentSector',
      });

      expect(result).toEqual([]);
    });
  });

  describe('getExchangeSymbols', () => {
    const mockNasdaqSymbols: ExchangeSymbol[] = [
      {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        price: 175.5,
        exchange: 'NASDAQ Global Select',
        exchangeShortName: 'NASDAQ',
        type: 'stock',
      },
      {
        symbol: 'MSFT',
        name: 'Microsoft Corporation',
        price: 380.0,
        exchange: 'NASDAQ Global Select',
        exchangeShortName: 'NASDAQ',
        type: 'stock',
      },
    ];

    it('should get NASDAQ symbols', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockNasdaqSymbols);

      const result = await searchResource.getExchangeSymbols('NASDAQ');

      expect(mockClient.get).toHaveBeenCalledWith('exchange-symbols', { searchParams: { exchange: 'NASDAQ' } });
      expect(result).toEqual(mockNasdaqSymbols);
    });

    it('should convert exchange to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockNasdaqSymbols);

      await searchResource.getExchangeSymbols('nasdaq');

      expect(mockClient.get).toHaveBeenCalledWith('exchange-symbols', { searchParams: { exchange: 'NASDAQ' } });
    });

    it('should get NYSE symbols', async () => {
      const nyseSymbols: ExchangeSymbol[] = [
        {
          symbol: 'IBM',
          name: 'International Business Machines Corporation',
          price: 158.0,
          exchange: 'New York Stock Exchange',
          exchangeShortName: 'NYSE',
          type: 'stock',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(nyseSymbols);

      const result = await searchResource.getExchangeSymbols('NYSE');

      expect(mockClient.get).toHaveBeenCalledWith('exchange-symbols', { searchParams: { exchange: 'NYSE' } });
      expect(result).toEqual(nyseSymbols);
    });

    it('should get ETF symbols', async () => {
      const etfSymbols: ExchangeSymbol[] = [
        {
          symbol: 'SPY',
          name: 'SPDR S&P 500 ETF Trust',
          price: 450.0,
          exchange: 'NYSE Arca',
          exchangeShortName: 'AMEX',
          type: 'etf',
        },
        {
          symbol: 'QQQ',
          name: 'Invesco QQQ Trust',
          price: 385.0,
          exchange: 'NASDAQ Global Market',
          exchangeShortName: 'NASDAQ',
          type: 'etf',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(etfSymbols);

      const result = await searchResource.getExchangeSymbols('ETF');

      expect(mockClient.get).toHaveBeenCalledWith('exchange-symbols', { searchParams: { exchange: 'ETF' } });
      expect(result).toEqual(etfSymbols);
    });

    it('should get AMEX symbols', async () => {
      const amexSymbols: ExchangeSymbol[] = [
        {
          symbol: 'GLD',
          name: 'SPDR Gold Trust',
          price: 180.0,
          exchange: 'NYSE Arca',
          exchangeShortName: 'AMEX',
          type: 'etf',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(amexSymbols);

      const result = await searchResource.getExchangeSymbols('AMEX');

      expect(mockClient.get).toHaveBeenCalledWith('exchange-symbols', { searchParams: { exchange: 'AMEX' } });
      expect(result).toEqual(amexSymbols);
    });

    it('should get mutual fund symbols', async () => {
      const mutualFundSymbols: ExchangeSymbol[] = [
        {
          symbol: 'VFIAX',
          name: 'Vanguard 500 Index Fund Admiral Shares',
          price: 420.0,
          exchange: 'MUTUAL_FUND',
          exchangeShortName: 'MUTUAL_FUND',
          type: 'fund',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mutualFundSymbols);

      const result = await searchResource.getExchangeSymbols('MUTUAL_FUND');

      expect(mockClient.get).toHaveBeenCalledWith('exchange-symbols', { searchParams: { exchange: 'MUTUAL_FUND' } });
      expect(result).toEqual(mutualFundSymbols);
    });

    it('should get commodity symbols', async () => {
      const commoditySymbols: ExchangeSymbol[] = [
        {
          symbol: 'GCUSD',
          name: 'Gold Futures',
          price: 2000.0,
          exchange: 'COMMODITY',
          exchangeShortName: 'COMMODITY',
          type: 'commodity',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(commoditySymbols);

      const result = await searchResource.getExchangeSymbols('COMMODITY');

      expect(mockClient.get).toHaveBeenCalledWith('exchange-symbols', { searchParams: { exchange: 'COMMODITY' } });
      expect(result).toEqual(commoditySymbols);
    });

    it('should get index symbols', async () => {
      const indexSymbols: ExchangeSymbol[] = [
        {
          symbol: '^GSPC',
          name: 'S&P 500',
          price: 4500.0,
          exchange: 'INDEX',
          exchangeShortName: 'INDEX',
          type: 'index',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(indexSymbols);

      const result = await searchResource.getExchangeSymbols('INDEX');

      expect(mockClient.get).toHaveBeenCalledWith('exchange-symbols', { searchParams: { exchange: 'INDEX' } });
      expect(result).toEqual(indexSymbols);
    });

    it('should get crypto symbols', async () => {
      const cryptoSymbols: ExchangeSymbol[] = [
        {
          symbol: 'BTCUSD',
          name: 'Bitcoin',
          price: 45000.0,
          exchange: 'CRYPTO',
          exchangeShortName: 'CRYPTO',
          type: 'crypto',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(cryptoSymbols);

      const result = await searchResource.getExchangeSymbols('CRYPTO');

      expect(mockClient.get).toHaveBeenCalledWith('exchange-symbols', { searchParams: { exchange: 'CRYPTO' } });
      expect(result).toEqual(cryptoSymbols);
    });

    it('should get forex symbols', async () => {
      const forexSymbols: ExchangeSymbol[] = [
        {
          symbol: 'EURUSD',
          name: 'EUR/USD',
          price: 1.09,
          exchange: 'FOREX',
          exchangeShortName: 'FOREX',
          type: 'forex',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(forexSymbols);

      const result = await searchResource.getExchangeSymbols('FOREX');

      expect(mockClient.get).toHaveBeenCalledWith('exchange-symbols', { searchParams: { exchange: 'FOREX' } });
      expect(result).toEqual(forexSymbols);
    });

    it('should get TSX symbols', async () => {
      const tsxSymbols: ExchangeSymbol[] = [
        {
          symbol: 'SHOP.TO',
          name: 'Shopify Inc.',
          price: 75.0,
          exchange: 'Toronto Stock Exchange',
          exchangeShortName: 'TSX',
          type: 'stock',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(tsxSymbols);

      const result = await searchResource.getExchangeSymbols('TSX');

      expect(mockClient.get).toHaveBeenCalledWith('exchange-symbols', { searchParams: { exchange: 'TSX' } });
      expect(result).toEqual(tsxSymbols);
    });

    it('should get EURONEXT symbols', async () => {
      const euronextSymbols: ExchangeSymbol[] = [
        {
          symbol: 'MC.PA',
          name: 'LVMH Moet Hennessy Louis Vuitton SE',
          price: 750.0,
          exchange: 'Euronext Paris',
          exchangeShortName: 'EURONEXT',
          type: 'stock',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(euronextSymbols);

      const result = await searchResource.getExchangeSymbols('EURONEXT');

      expect(mockClient.get).toHaveBeenCalledWith('exchange-symbols', { searchParams: { exchange: 'EURONEXT' } });
      expect(result).toEqual(euronextSymbols);
    });

    it('should return empty array for exchange with no symbols', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      const result = await searchResource.getExchangeSymbols('UNKNOWN');

      expect(result).toEqual([]);
    });
  });

  describe('Error Handling', () => {
    it('should propagate errors from searchBySymbol', async () => {
      const error = new Error('API Error');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(searchResource.searchBySymbol('AAPL')).rejects.toThrow('API Error');
    });

    it('should propagate errors from searchByName', async () => {
      const error = new Error('API Error');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(searchResource.searchByName('Apple')).rejects.toThrow('API Error');
    });

    it('should propagate errors from searchByCIK', async () => {
      const error = new Error('API Error');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(searchResource.searchByCIK('0000320193')).rejects.toThrow('API Error');
    });

    it('should propagate errors from searchByCUSIP', async () => {
      const error = new Error('API Error');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(searchResource.searchByCUSIP('037833100')).rejects.toThrow('API Error');
    });

    it('should propagate errors from searchByISIN', async () => {
      const error = new Error('API Error');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(searchResource.searchByISIN('US0378331005')).rejects.toThrow('API Error');
    });

    it('should propagate errors from screenStocks', async () => {
      const error = new Error('API Error');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(searchResource.screenStocks({ sector: 'Technology' })).rejects.toThrow('API Error');
    });

    it('should propagate errors from getExchangeSymbols', async () => {
      const error = new Error('API Error');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(searchResource.getExchangeSymbols('NASDAQ')).rejects.toThrow('API Error');
    });
  });
});
