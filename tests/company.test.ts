import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CompanyResource } from '../src/resources/company.js';
import type { FMPClient } from '../src/client.js';
import {
  FMPAPIError,
  FMPAPIError,
  FMPAPIError,
} from '../src/errors/index.js';
import type {
  CompanyProfile,
  Quote,
  SymbolsList,
  CompanyNotes,
  StockPeer,
  DelistedCompany,
  EmployeeCount,
  HistoricalEmployeeCount,
  MarketCap,
  HistoricalMarketCap,
  SharesFloat,
  MergerAcquisition,
  Executive,
  ExecutiveCompensation,
  CompensationBenchmark,
  CIKMapping,
  SymbolChange,
  ExchangeInfo,
  SectorIndustry,
  TradableSymbol,
} from '../src/types/index.js';

describe('CompanyResource', () => {
  let mockClient: FMPClient;
  let companyResource: CompanyResource;

  beforeEach(() => {
    mockClient = {
      get: vi.fn(),
    } as unknown as FMPClient;
    companyResource = new CompanyResource(mockClient);
  });

  describe('getProfile', () => {
    it('should get company profile successfully', async () => {
      const mockProfile: CompanyProfile[] = [
        {
          symbol: 'AAPL',
          price: 150.0,
          beta: 1.2,
          volAvg: 50000000,
          mktCap: 2500000000000,
          lastDiv: 0.92,
          range: '120-180',
          changes: 2.5,
          companyName: 'Apple Inc.',
          currency: 'USD',
          cik: '0000320193',
          isin: 'US0378331005',
          cusip: '037833100',
          exchange: 'NASDAQ',
          exchangeShortName: 'NASDAQ',
          industry: 'Consumer Electronics',
          website: 'https://www.apple.com',
          description: 'Technology company',
          ceo: 'Tim Cook',
          sector: 'Technology',
          country: 'US',
          fullTimeEmployees: '164000',
          phone: '408-996-1010',
          address: 'One Apple Park Way',
          city: 'Cupertino',
          state: 'CA',
          zip: '95014',
          dcfDiff: 10.5,
          dcf: 160.5,
          image: 'https://example.com/logo.png',
          ipoDate: '1980-12-12',
          defaultImage: false,
          isEtf: false,
          isActivelyTrading: true,
          isAdr: false,
          isFund: false,
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockProfile);

      const result = await companyResource.getProfile('AAPL');

      expect(mockClient.get).toHaveBeenCalledWith('profile', {
        searchParams: { symbol: 'AAPL' },
      });
      expect(result).toEqual(mockProfile);
    });

    it('should normalize symbol to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await companyResource.getProfile('aapl');

      expect(mockClient.get).toHaveBeenCalledWith('profile', {
        searchParams: { symbol: 'AAPL' },
      });
    });

    it('should handle API errors', async () => {
      vi.mocked(mockClient.get).mockRejectedValue(
        new FMPAPIError('API Error', 500, 'Internal Server Error')
      );

      await expect(companyResource.getProfile('AAPL')).rejects.toThrow(FMPAPIError);
    });

    it('should handle authentication errors', async () => {
      vi.mocked(mockClient.get).mockRejectedValue(
        new FMPAPIError('Invalid API key')
      );

      await expect(companyResource.getProfile('AAPL')).rejects.toThrow(
        FMPAPIError
      );
    });

    it('should handle rate limit errors', async () => {
      vi.mocked(mockClient.get).mockRejectedValue(
        new FMPAPIError('Rate limit exceeded')
      );

      await expect(companyResource.getProfile('AAPL')).rejects.toThrow(FMPAPIError);
    });
  });

  describe('getQuote', () => {
    it('should get quote successfully', async () => {
      const mockQuote: Quote[] = [
        {
          symbol: 'AAPL',
          name: 'Apple Inc.',
          price: 150.0,
          changesPercentage: 1.5,
          change: 2.25,
          dayLow: 148.0,
          dayHigh: 152.0,
          yearHigh: 180.0,
          yearLow: 120.0,
          marketCap: 2500000000000,
          priceAvg50: 145.0,
          priceAvg200: 140.0,
          exchange: 'NASDAQ',
          volume: 60000000,
          avgVolume: 50000000,
          open: 149.0,
          previousClose: 147.75,
          eps: 6.05,
          pe: 24.8,
          earningsAnnouncement: '2024-01-25T16:30:00.000+0000',
          sharesOutstanding: 16000000000,
          timestamp: 1703175600,
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockQuote);

      const result = await companyResource.getQuote('AAPL');

      expect(mockClient.get).toHaveBeenCalledWith('quote', {
        searchParams: { symbol: 'AAPL' },
      });
      expect(result).toEqual(mockQuote);
    });

    it('should normalize symbol to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await companyResource.getQuote('aapl');

      expect(mockClient.get).toHaveBeenCalledWith('quote', {
        searchParams: { symbol: 'AAPL' },
      });
    });

    it('should handle API errors', async () => {
      vi.mocked(mockClient.get).mockRejectedValue(
        new FMPAPIError('Not found', 404, 'Not Found')
      );

      await expect(companyResource.getQuote('INVALID')).rejects.toThrow(FMPAPIError);
    });
  });

  describe('getQuotes', () => {
    it('should get multiple quotes successfully', async () => {
      const mockQuotes: Quote[] = [
        {
          symbol: 'AAPL',
          name: 'Apple Inc.',
          price: 150.0,
          changesPercentage: 1.5,
          change: 2.25,
          dayLow: 148.0,
          dayHigh: 152.0,
          yearHigh: 180.0,
          yearLow: 120.0,
          marketCap: 2500000000000,
          priceAvg50: 145.0,
          priceAvg200: 140.0,
          exchange: 'NASDAQ',
          volume: 60000000,
          avgVolume: 50000000,
          open: 149.0,
          previousClose: 147.75,
          eps: 6.05,
          pe: 24.8,
          earningsAnnouncement: '2024-01-25T16:30:00.000+0000',
          sharesOutstanding: 16000000000,
          timestamp: 1703175600,
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockQuotes);

      const result = await companyResource.getQuotes(['AAPL', 'MSFT']);

      expect(mockClient.get).toHaveBeenCalledWith('batch-quote', {
        searchParams: { symbols: 'AAPL,MSFT' },
      });
      expect(result).toEqual(mockQuotes);
    });

    it('should normalize symbols to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await companyResource.getQuotes(['aapl', 'msft', 'goog']);

      expect(mockClient.get).toHaveBeenCalledWith('batch-quote', {
        searchParams: { symbols: 'AAPL,MSFT,GOOG' },
      });
    });

    it('should handle empty array', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await companyResource.getQuotes([]);

      expect(mockClient.get).toHaveBeenCalledWith('batch-quote', {
        searchParams: { symbols: '' },
      });
    });

    it('should handle API errors', async () => {
      vi.mocked(mockClient.get).mockRejectedValue(
        new FMPAPIError('Server error', 500, 'Internal Server Error')
      );

      await expect(companyResource.getQuotes(['AAPL', 'MSFT'])).rejects.toThrow(
        FMPAPIError
      );
    });
  });

  describe('getSymbolsList', () => {
    it('should get symbols list successfully', async () => {
      const mockSymbols: SymbolsList[] = [
        {
          symbol: 'AAPL',
          name: 'Apple Inc.',
          price: 150.0,
          exchange: 'NASDAQ Global Select',
          exchangeShortName: 'NASDAQ',
          type: 'stock',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockSymbols);

      const result = await companyResource.getSymbolsList();

      expect(mockClient.get).toHaveBeenCalledWith('stock-list');
      expect(result).toEqual(mockSymbols);
    });

    it('should handle API errors', async () => {
      vi.mocked(mockClient.get).mockRejectedValue(
        new FMPAPIError('Server error', 500, 'Internal Server Error')
      );

      await expect(companyResource.getSymbolsList()).rejects.toThrow(FMPAPIError);
    });
  });

  describe('getExchangeSymbols', () => {
    it('should get exchange symbols successfully', async () => {
      const mockSymbols: SymbolsList[] = [
        {
          symbol: 'AAPL',
          name: 'Apple Inc.',
          price: 150.0,
          exchange: 'NASDAQ Global Select',
          exchangeShortName: 'NASDAQ',
          type: 'stock',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockSymbols);

      const result = await companyResource.getExchangeSymbols('NASDAQ');

      expect(mockClient.get).toHaveBeenCalledWith('stock-list', {
        searchParams: { exchange: 'NASDAQ' },
      });
      expect(result).toEqual(mockSymbols);
    });

    it('should normalize exchange to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await companyResource.getExchangeSymbols('nasdaq');

      expect(mockClient.get).toHaveBeenCalledWith('stock-list', {
        searchParams: { exchange: 'NASDAQ' },
      });
    });

    it('should handle API errors', async () => {
      vi.mocked(mockClient.get).mockRejectedValue(
        new FMPAPIError('Invalid exchange', 400, 'Bad Request')
      );

      await expect(companyResource.getExchangeSymbols('INVALID')).rejects.toThrow(
        FMPAPIError
      );
    });
  });

  describe('search', () => {
    it('should search companies successfully with default limit', async () => {
      const mockResults: SymbolsList[] = [
        {
          symbol: 'AAPL',
          name: 'Apple Inc.',
          price: 150.0,
          exchange: 'NASDAQ Global Select',
          exchangeShortName: 'NASDAQ',
          type: 'stock',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockResults);

      const result = await companyResource.search('Apple');

      expect(mockClient.get).toHaveBeenCalledWith('search-symbol', {
        searchParams: {
          query: 'Apple',
          limit: 10,
        },
      });
      expect(result).toEqual(mockResults);
    });

    it('should search with custom limit', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await companyResource.search('Apple', 25);

      expect(mockClient.get).toHaveBeenCalledWith('search-symbol', {
        searchParams: {
          query: 'Apple',
          limit: 25,
        },
      });
    });

    it('should search with exchange filter', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await companyResource.search('Apple', 10, 'NASDAQ');

      expect(mockClient.get).toHaveBeenCalledWith('search-symbol', {
        searchParams: {
          query: 'Apple',
          limit: 10,
          exchange: 'NASDAQ',
        },
      });
    });

    it('should handle API errors', async () => {
      vi.mocked(mockClient.get).mockRejectedValue(
        new FMPAPIError('Search error', 500, 'Internal Server Error')
      );

      await expect(companyResource.search('Apple')).rejects.toThrow(FMPAPIError);
    });
  });

  describe('getProfileByCIK', () => {
    it('should get profile by CIK successfully', async () => {
      const mockProfile: CompanyProfile[] = [
        {
          symbol: 'AAPL',
          price: 150.0,
          beta: 1.2,
          volAvg: 50000000,
          mktCap: 2500000000000,
          lastDiv: 0.92,
          range: '120-180',
          changes: 2.5,
          companyName: 'Apple Inc.',
          currency: 'USD',
          cik: '0000320193',
          isin: 'US0378331005',
          cusip: '037833100',
          exchange: 'NASDAQ',
          exchangeShortName: 'NASDAQ',
          industry: 'Consumer Electronics',
          website: 'https://www.apple.com',
          description: 'Technology company',
          ceo: 'Tim Cook',
          sector: 'Technology',
          country: 'US',
          fullTimeEmployees: '164000',
          phone: '408-996-1010',
          address: 'One Apple Park Way',
          city: 'Cupertino',
          state: 'CA',
          zip: '95014',
          dcfDiff: 10.5,
          dcf: 160.5,
          image: 'https://example.com/logo.png',
          ipoDate: '1980-12-12',
          defaultImage: false,
          isEtf: false,
          isActivelyTrading: true,
          isAdr: false,
          isFund: false,
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockProfile);

      const result = await companyResource.getProfileByCIK('0000320193');

      expect(mockClient.get).toHaveBeenCalledWith('profile-cik', {
        searchParams: { cik: '0000320193' },
      });
      expect(result).toEqual(mockProfile);
    });

    it('should handle API errors', async () => {
      vi.mocked(mockClient.get).mockRejectedValue(
        new FMPAPIError('Invalid CIK', 404, 'Not Found')
      );

      await expect(companyResource.getProfileByCIK('invalid')).rejects.toThrow(
        FMPAPIError
      );
    });
  });

  describe('getCompanyNotes', () => {
    it('should get company notes successfully', async () => {
      const mockNotes: CompanyNotes[] = [
        {
          symbol: 'AAPL',
          cik: '0000320193',
          title: 'Apple Inc.',
          exchange: 'NASDAQ',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockNotes);

      const result = await companyResource.getCompanyNotes('AAPL');

      expect(mockClient.get).toHaveBeenCalledWith('company-notes', {
        searchParams: {
          symbol: 'AAPL',
        },
      });
      expect(result).toEqual(mockNotes);
    });

    it('should normalize symbol to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await companyResource.getCompanyNotes('aapl');

      expect(mockClient.get).toHaveBeenCalledWith('company-notes', {
        searchParams: {
          symbol: 'AAPL',
        },
      });
    });

    it('should handle API errors', async () => {
      vi.mocked(mockClient.get).mockRejectedValue(
        new FMPAPIError('Not found', 404, 'Not Found')
      );

      await expect(companyResource.getCompanyNotes('INVALID')).rejects.toThrow(
        FMPAPIError
      );
    });
  });

  describe('getStockPeers', () => {
    it('should get stock peers successfully', async () => {
      const mockPeers: StockPeer[] = [
        {
          symbol: 'AAPL',
          peersList: ['MSFT', 'GOOG', 'META'],
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockPeers);

      const result = await companyResource.getStockPeers('AAPL');

      expect(mockClient.get).toHaveBeenCalledWith('stock-peers', {
        searchParams: {
          symbol: 'AAPL',
        },
      });
      expect(result).toEqual(mockPeers);
    });

    it('should normalize symbol to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await companyResource.getStockPeers('aapl');

      expect(mockClient.get).toHaveBeenCalledWith('stock-peers', {
        searchParams: {
          symbol: 'AAPL',
        },
      });
    });

    it('should handle API errors', async () => {
      vi.mocked(mockClient.get).mockRejectedValue(
        new FMPAPIError('Server error', 500, 'Internal Server Error')
      );

      await expect(companyResource.getStockPeers('AAPL')).rejects.toThrow(FMPAPIError);
    });
  });

  describe('getDelistedCompanies', () => {
    it('should get delisted companies with default pagination', async () => {
      const mockDelisted: DelistedCompany[] = [
        {
          symbol: 'XYZ',
          companyName: 'XYZ Corp',
          exchange: 'NASDAQ',
          ipoDate: '2010-01-01',
          delistedDate: '2023-12-31',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockDelisted);

      const result = await companyResource.getDelistedCompanies();

      expect(mockClient.get).toHaveBeenCalledWith('delisted-companies', {
        searchParams: { page: 0, limit: 100 },
      });
      expect(result).toEqual(mockDelisted);
    });

    it('should get delisted companies with custom pagination', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await companyResource.getDelistedCompanies(2, 50);

      expect(mockClient.get).toHaveBeenCalledWith('delisted-companies', {
        searchParams: {
          page: 2,
          limit: 50,
        },
      });
    });

    it('should handle API errors', async () => {
      vi.mocked(mockClient.get).mockRejectedValue(
        new FMPAPIError('Server error', 500, 'Internal Server Error')
      );

      await expect(companyResource.getDelistedCompanies()).rejects.toThrow(FMPAPIError);
    });
  });

  describe('getEmployeeCount', () => {
    it('should get employee count successfully', async () => {
      const mockEmployeeCount: EmployeeCount[] = [
        {
          symbol: 'AAPL',
          cik: '0000320193',
          acceptanceTime: '2024-01-01T12:00:00.000Z',
          periodOfReport: '2023-12-31',
          companyName: 'Apple Inc.',
          formType: '10-K',
          filingDate: '2024-01-15',
          employeeCount: 164000,
          source: 'SEC',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockEmployeeCount);

      const result = await companyResource.getEmployeeCount('AAPL');

      expect(mockClient.get).toHaveBeenCalledWith('employee-count', {
        searchParams: {
          symbol: 'AAPL',
        },
      });
      expect(result).toEqual(mockEmployeeCount);
    });

    it('should normalize symbol to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await companyResource.getEmployeeCount('aapl');

      expect(mockClient.get).toHaveBeenCalledWith('employee-count', {
        searchParams: {
          symbol: 'AAPL',
        },
      });
    });

    it('should handle API errors', async () => {
      vi.mocked(mockClient.get).mockRejectedValue(
        new FMPAPIError('Not found', 404, 'Not Found')
      );

      await expect(companyResource.getEmployeeCount('INVALID')).rejects.toThrow(
        FMPAPIError
      );
    });
  });

  describe('getHistoricalEmployeeCount', () => {
    it('should get historical employee count successfully', async () => {
      const mockHistorical: HistoricalEmployeeCount[] = [
        {
          symbol: 'AAPL',
          cik: '0000320193',
          acceptanceTime: '2024-01-01T12:00:00.000Z',
          periodOfReport: '2023-12-31',
          companyName: 'Apple Inc.',
          formType: '10-K',
          filingDate: '2024-01-15',
          employeeCount: 164000,
          source: 'SEC',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockHistorical);

      const result = await companyResource.getHistoricalEmployeeCount('AAPL');

      expect(mockClient.get).toHaveBeenCalledWith('historical-employee-count', {
        searchParams: {
          symbol: 'AAPL',
        },
      });
      expect(result).toEqual(mockHistorical);
    });

    it('should normalize symbol to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await companyResource.getHistoricalEmployeeCount('aapl');

      expect(mockClient.get).toHaveBeenCalledWith('historical-employee-count', {
        searchParams: {
          symbol: 'AAPL',
        },
      });
    });

    it('should handle API errors', async () => {
      vi.mocked(mockClient.get).mockRejectedValue(
        new FMPAPIError('Server error', 500, 'Internal Server Error')
      );

      await expect(companyResource.getHistoricalEmployeeCount('AAPL')).rejects.toThrow(
        FMPAPIError
      );
    });
  });

  describe('getMarketCap', () => {
    it('should get market cap successfully', async () => {
      const mockMarketCap: MarketCap[] = [
        {
          symbol: 'AAPL',
          date: '2024-01-15',
          marketCap: 2500000000000,
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockMarketCap);

      const result = await companyResource.getMarketCap('AAPL');

      expect(mockClient.get).toHaveBeenCalledWith('market-capitalization', {
        searchParams: { symbol: 'AAPL' },
      });
      expect(result).toEqual(mockMarketCap);
    });

    it('should normalize symbol to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await companyResource.getMarketCap('aapl');

      expect(mockClient.get).toHaveBeenCalledWith('market-capitalization', {
        searchParams: { symbol: 'AAPL' },
      });
    });

    it('should handle API errors', async () => {
      vi.mocked(mockClient.get).mockRejectedValue(
        new FMPAPIError('Not found', 404, 'Not Found')
      );

      await expect(companyResource.getMarketCap('INVALID')).rejects.toThrow(
        FMPAPIError
      );
    });
  });

  describe('getBatchMarketCap', () => {
    it('should get batch market cap successfully', async () => {
      const mockMarketCaps: MarketCap[] = [
        {
          symbol: 'AAPL',
          date: '2024-01-15',
          marketCap: 2500000000000,
        },
        {
          symbol: 'MSFT',
          date: '2024-01-15',
          marketCap: 2800000000000,
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockMarketCaps);

      const result = await companyResource.getBatchMarketCap(['AAPL', 'MSFT']);

      expect(mockClient.get).toHaveBeenCalledWith('market-capitalization-batch', {
        searchParams: { symbols: 'AAPL,MSFT' },
      });
      expect(result).toEqual(mockMarketCaps);
    });

    it('should normalize symbols to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await companyResource.getBatchMarketCap(['aapl', 'msft', 'goog']);

      expect(mockClient.get).toHaveBeenCalledWith('market-capitalization-batch', {
        searchParams: { symbols: 'AAPL,MSFT,GOOG' },
      });
    });

    it('should handle API errors', async () => {
      vi.mocked(mockClient.get).mockRejectedValue(
        new FMPAPIError('Server error', 500, 'Internal Server Error')
      );

      await expect(companyResource.getBatchMarketCap(['AAPL', 'MSFT'])).rejects.toThrow(
        FMPAPIError
      );
    });
  });

  describe('getHistoricalMarketCap', () => {
    it('should get historical market cap without limit', async () => {
      const mockHistorical: HistoricalMarketCap[] = [
        {
          symbol: 'AAPL',
          date: '2024-01-15',
          marketCap: 2500000000000,
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockHistorical);

      const result = await companyResource.getHistoricalMarketCap('AAPL');

      expect(mockClient.get).toHaveBeenCalledWith('historical-market-capitalization', {
        searchParams: {
          symbol: 'AAPL',
        },
      });
      expect(result).toEqual(mockHistorical);
    });

    it('should get historical market cap with limit', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await companyResource.getHistoricalMarketCap('AAPL', 100);

      expect(mockClient.get).toHaveBeenCalledWith('historical-market-capitalization', {
        searchParams: {
          symbol: 'AAPL',
          limit: 100,
        },
      });
    });

    it('should normalize symbol to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await companyResource.getHistoricalMarketCap('aapl');

      expect(mockClient.get).toHaveBeenCalledWith('historical-market-capitalization', {
        searchParams: {
          symbol: 'AAPL',
        },
      });
    });

    it('should handle API errors', async () => {
      vi.mocked(mockClient.get).mockRejectedValue(
        new FMPAPIError('Server error', 500, 'Internal Server Error')
      );

      await expect(companyResource.getHistoricalMarketCap('AAPL')).rejects.toThrow(
        FMPAPIError
      );
    });
  });

  describe('getSharesFloat', () => {
    it('should get shares float successfully', async () => {
      const mockSharesFloat: SharesFloat[] = [
        {
          symbol: 'AAPL',
          date: '2024-01-15',
          freeFloat: 0.95,
          floatShares: 15200000000,
          outstandingShares: 16000000000,
          source: 'SEC',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockSharesFloat);

      const result = await companyResource.getSharesFloat('AAPL');

      expect(mockClient.get).toHaveBeenCalledWith('shares-float', {
        searchParams: {
          symbol: 'AAPL',
        },
      });
      expect(result).toEqual(mockSharesFloat);
    });

    it('should normalize symbol to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await companyResource.getSharesFloat('aapl');

      expect(mockClient.get).toHaveBeenCalledWith('shares-float', {
        searchParams: {
          symbol: 'AAPL',
        },
      });
    });

    it('should handle API errors', async () => {
      vi.mocked(mockClient.get).mockRejectedValue(
        new FMPAPIError('Not found', 404, 'Not Found')
      );

      await expect(companyResource.getSharesFloat('INVALID')).rejects.toThrow(
        FMPAPIError
      );
    });
  });

  describe('getAllSharesFloat', () => {
    it('should get all shares float successfully', async () => {
      const mockAllShares: SharesFloat[] = [
        {
          symbol: 'AAPL',
          date: '2024-01-15',
          freeFloat: 0.95,
          floatShares: 15200000000,
          outstandingShares: 16000000000,
          source: 'SEC',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockAllShares);

      const result = await companyResource.getAllSharesFloat();

      expect(mockClient.get).toHaveBeenCalledWith('shares-float-all', {
        searchParams: { page: 0, limit: 1000 },
      });
      expect(result).toEqual(mockAllShares);
    });

    it('should handle API errors', async () => {
      vi.mocked(mockClient.get).mockRejectedValue(
        new FMPAPIError('Server error', 500, 'Internal Server Error')
      );

      await expect(companyResource.getAllSharesFloat()).rejects.toThrow(FMPAPIError);
    });
  });

  describe('getMergerAcquisitions', () => {
    it('should get M&A transactions successfully', async () => {
      const mockMA: MergerAcquisition[] = [
        {
          symbol: 'AAPL',
          companyName: 'Apple Inc.',
          targetedCompanySymbol: 'TARG',
          targetedCompanyName: 'Target Company',
          transactionDate: '2024-01-15',
          acceptanceTime: '2024-01-15T12:00:00.000Z',
          url: 'https://example.com/filing',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockMA);

      const result = await companyResource.getMergerAcquisitions();

      expect(mockClient.get).toHaveBeenCalledWith('mergers-acquisitions-latest', {
        searchParams: { page: 0, limit: 100 },
      });
      expect(result).toEqual(mockMA);
    });

    it('should handle API errors', async () => {
      vi.mocked(mockClient.get).mockRejectedValue(
        new FMPAPIError('Server error', 500, 'Internal Server Error')
      );

      await expect(companyResource.getMergerAcquisitions()).rejects.toThrow(
        FMPAPIError
      );
    });
  });

  describe('searchMergerAcquisitions', () => {
    it('should search M&A transactions successfully', async () => {
      const mockMA: MergerAcquisition[] = [
        {
          symbol: 'AAPL',
          companyName: 'Apple Inc.',
          targetedCompanySymbol: 'TARG',
          targetedCompanyName: 'Target Company',
          transactionDate: '2024-01-15',
          acceptanceTime: '2024-01-15T12:00:00.000Z',
          url: 'https://example.com/filing',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockMA);

      const result = await companyResource.searchMergerAcquisitions('Apple');

      expect(mockClient.get).toHaveBeenCalledWith('mergers-acquisitions-search', {
        searchParams: {
          name: 'Apple',
        },
      });
      expect(result).toEqual(mockMA);
    });

    it('should handle API errors', async () => {
      vi.mocked(mockClient.get).mockRejectedValue(
        new FMPAPIError('Server error', 500, 'Internal Server Error')
      );

      await expect(companyResource.searchMergerAcquisitions('Apple')).rejects.toThrow(
        FMPAPIError
      );
    });
  });

  describe('getExecutives', () => {
    it('should get executives successfully', async () => {
      const mockExecutives: Executive[] = [
        {
          title: 'CEO',
          name: 'Tim Cook',
          pay: 3000000,
          currencyPay: 'USD',
          gender: 'male',
          yearBorn: 1960,
          titleSince: 2011,
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockExecutives);

      const result = await companyResource.getExecutives('AAPL');

      expect(mockClient.get).toHaveBeenCalledWith('key-executives', {
        searchParams: { symbol: 'AAPL' },
      });
      expect(result).toEqual(mockExecutives);
    });

    it('should normalize symbol to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await companyResource.getExecutives('aapl');

      expect(mockClient.get).toHaveBeenCalledWith('key-executives', {
        searchParams: { symbol: 'AAPL' },
      });
    });

    it('should handle API errors', async () => {
      vi.mocked(mockClient.get).mockRejectedValue(
        new FMPAPIError('Not found', 404, 'Not Found')
      );

      await expect(companyResource.getExecutives('INVALID')).rejects.toThrow(
        FMPAPIError
      );
    });
  });

  describe('getExecutiveCompensation', () => {
    it('should get executive compensation successfully', async () => {
      const mockCompensation: ExecutiveCompensation[] = [
        {
          cik: '0000320193',
          symbol: 'AAPL',
          companyName: 'Apple Inc.',
          industryTitle: 'Technology',
          filingDate: '2024-01-15',
          acceptanceDate: '2024-01-15',
          nameAndPosition: 'Tim Cook - CEO',
          year: 2023,
          salary: 3000000,
          bonus: 2000000,
          stockAward: 10000000,
          incentivePlanCompensation: 5000000,
          allOtherCompensation: 500000,
          total: 20500000,
          url: 'https://example.com/filing',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockCompensation);

      const result = await companyResource.getExecutiveCompensation('AAPL');

      expect(mockClient.get).toHaveBeenCalledWith('governance-executive-compensation', {
        searchParams: {
          symbol: 'AAPL',
        },
      });
      expect(result).toEqual(mockCompensation);
    });

    it('should normalize symbol to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await companyResource.getExecutiveCompensation('aapl');

      expect(mockClient.get).toHaveBeenCalledWith('governance-executive-compensation', {
        searchParams: {
          symbol: 'AAPL',
        },
      });
    });

    it('should handle API errors', async () => {
      vi.mocked(mockClient.get).mockRejectedValue(
        new FMPAPIError('Server error', 500, 'Internal Server Error')
      );

      await expect(companyResource.getExecutiveCompensation('AAPL')).rejects.toThrow(
        FMPAPIError
      );
    });
  });

  describe('getCompensationBenchmark', () => {
    it('should get compensation benchmark successfully', async () => {
      const mockBenchmark: CompensationBenchmark[] = [
        {
          industryTitle: 'Technology',
          year: 2023,
          averageSalary: 3500000,
          averageBonus: 2500000,
          averageStockAward: 12000000,
          averageIncentivePlanCompensation: 6000000,
          averageAllOtherCompensation: 600000,
          averageTotal: 24600000,
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockBenchmark);

      const result = await companyResource.getCompensationBenchmark(2023);

      expect(mockClient.get).toHaveBeenCalledWith('executive-compensation-benchmark', {
        searchParams: {
          year: 2023,
        },
      });
      expect(result).toEqual(mockBenchmark);
    });

    it('should handle API errors', async () => {
      vi.mocked(mockClient.get).mockRejectedValue(
        new FMPAPIError('Invalid year', 400, 'Bad Request')
      );

      await expect(companyResource.getCompensationBenchmark(1900)).rejects.toThrow(
        FMPAPIError
      );
    });
  });

  describe('getFinancialStatementSymbols', () => {
    it('should get financial statement symbols successfully', async () => {
      const mockSymbols: SymbolsList[] = [
        {
          symbol: 'AAPL',
          name: 'Apple Inc.',
          price: 150.0,
          exchange: 'NASDAQ Global Select',
          exchangeShortName: 'NASDAQ',
          type: 'stock',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockSymbols);

      const result = await companyResource.getFinancialStatementSymbols();

      expect(mockClient.get).toHaveBeenCalledWith('financial-statement-symbol-list');
      expect(result).toEqual(mockSymbols);
    });

    it('should handle API errors', async () => {
      vi.mocked(mockClient.get).mockRejectedValue(
        new FMPAPIError('Server error', 500, 'Internal Server Error')
      );

      await expect(companyResource.getFinancialStatementSymbols()).rejects.toThrow(
        FMPAPIError
      );
    });
  });

  describe('getCIKList', () => {
    it('should get CIK list successfully', async () => {
      const mockCIK: CIKMapping[] = [
        {
          cik: '0000320193',
          name: 'Apple Inc.',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockCIK);

      const result = await companyResource.getCIKList();

      expect(mockClient.get).toHaveBeenCalledWith('cik-list', {
        searchParams: { page: 0, limit: 1000 },
      });
      expect(result).toEqual(mockCIK);
    });

    it('should handle API errors', async () => {
      vi.mocked(mockClient.get).mockRejectedValue(
        new FMPAPIError('Server error', 500, 'Internal Server Error')
      );

      await expect(companyResource.getCIKList()).rejects.toThrow(FMPAPIError);
    });
  });

  describe('getSymbolChanges', () => {
    it('should get symbol changes successfully', async () => {
      const mockChanges: SymbolChange[] = [
        {
          date: '2024-01-15',
          name: 'Company Name',
          oldSymbol: 'OLD',
          newSymbol: 'NEW',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockChanges);

      const result = await companyResource.getSymbolChanges();

      expect(mockClient.get).toHaveBeenCalledWith('symbol-change');
      expect(result).toEqual(mockChanges);
    });

    it('should handle API errors', async () => {
      vi.mocked(mockClient.get).mockRejectedValue(
        new FMPAPIError('Server error', 500, 'Internal Server Error')
      );

      await expect(companyResource.getSymbolChanges()).rejects.toThrow(FMPAPIError);
    });
  });

  describe('getETFSymbols', () => {
    it('should get ETF symbols successfully', async () => {
      const mockETFs: SymbolsList[] = [
        {
          symbol: 'SPY',
          name: 'SPDR S&P 500 ETF Trust',
          price: 450.0,
          exchange: 'NYSE Arca',
          exchangeShortName: 'AMEX',
          type: 'etf',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockETFs);

      const result = await companyResource.getETFSymbols();

      expect(mockClient.get).toHaveBeenCalledWith('etf-list');
      expect(result).toEqual(mockETFs);
    });

    it('should handle API errors', async () => {
      vi.mocked(mockClient.get).mockRejectedValue(
        new FMPAPIError('Server error', 500, 'Internal Server Error')
      );

      await expect(companyResource.getETFSymbols()).rejects.toThrow(FMPAPIError);
    });
  });

  describe('getActivelyTrading', () => {
    it('should get actively trading symbols successfully', async () => {
      const mockTrading: TradableSymbol[] = [
        {
          symbol: 'AAPL',
          name: 'Apple Inc.',
          price: 150.0,
          exchange: 'NASDAQ',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockTrading);

      const result = await companyResource.getActivelyTrading();

      expect(mockClient.get).toHaveBeenCalledWith('actively-trading-list');
      expect(result).toEqual(mockTrading);
    });

    it('should handle API errors', async () => {
      vi.mocked(mockClient.get).mockRejectedValue(
        new FMPAPIError('Server error', 500, 'Internal Server Error')
      );

      await expect(companyResource.getActivelyTrading()).rejects.toThrow(FMPAPIError);
    });
  });

  describe('getExchanges', () => {
    it('should get exchanges successfully', async () => {
      const mockExchanges: ExchangeInfo[] = [
        {
          name: 'NASDAQ',
          code: 'NASDAQ',
          exchangeShortName: 'NASDAQ',
          country: 'US',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockExchanges);

      const result = await companyResource.getExchanges();

      expect(mockClient.get).toHaveBeenCalledWith('available-exchanges');
      expect(result).toEqual(mockExchanges);
    });

    it('should handle API errors', async () => {
      vi.mocked(mockClient.get).mockRejectedValue(
        new FMPAPIError('Server error', 500, 'Internal Server Error')
      );

      await expect(companyResource.getExchanges()).rejects.toThrow(FMPAPIError);
    });
  });

  describe('getSectors', () => {
    it('should get sectors successfully', async () => {
      const mockSectors: SectorIndustry[] = [
        {
          sector: 'Technology',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockSectors);

      const result = await companyResource.getSectors();

      expect(mockClient.get).toHaveBeenCalledWith('available-sectors');
      expect(result).toEqual(mockSectors);
    });

    it('should handle API errors', async () => {
      vi.mocked(mockClient.get).mockRejectedValue(
        new FMPAPIError('Server error', 500, 'Internal Server Error')
      );

      await expect(companyResource.getSectors()).rejects.toThrow(FMPAPIError);
    });
  });

  describe('getIndustries', () => {
    it('should get industries successfully', async () => {
      const mockIndustries: SectorIndustry[] = [
        {
          industry: 'Consumer Electronics',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockIndustries);

      const result = await companyResource.getIndustries();

      expect(mockClient.get).toHaveBeenCalledWith('available-industries');
      expect(result).toEqual(mockIndustries);
    });

    it('should handle API errors', async () => {
      vi.mocked(mockClient.get).mockRejectedValue(
        new FMPAPIError('Server error', 500, 'Internal Server Error')
      );

      await expect(companyResource.getIndustries()).rejects.toThrow(FMPAPIError);
    });
  });

  describe('getCountries', () => {
    it('should get countries successfully', async () => {
      const mockCountries = ['US', 'CA', 'GB', 'DE'];

      vi.mocked(mockClient.get).mockResolvedValue(mockCountries);

      const result = await companyResource.getCountries();

      expect(mockClient.get).toHaveBeenCalledWith('available-countries');
      expect(result).toEqual(mockCountries);
    });

    it('should handle API errors', async () => {
      vi.mocked(mockClient.get).mockRejectedValue(
        new FMPAPIError('Server error', 500, 'Internal Server Error')
      );

      await expect(companyResource.getCountries()).rejects.toThrow(FMPAPIError);
    });
  });

  describe('getQuoteShort', () => {
    it('should get short quote successfully', async () => {
      const mockQuote = [{ symbol: 'AAPL', price: 150.0, volume: 60000000 }];

      vi.mocked(mockClient.get).mockResolvedValue(mockQuote);

      const result = await companyResource.getQuoteShort('AAPL');

      expect(mockClient.get).toHaveBeenCalledWith('quote-short', {
        searchParams: { symbol: 'AAPL' },
      });
      expect(result).toEqual(mockQuote);
    });

    it('should normalize symbol to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await companyResource.getQuoteShort('aapl');

      expect(mockClient.get).toHaveBeenCalledWith('quote-short', {
        searchParams: { symbol: 'AAPL' },
      });
    });

    it('should handle API errors', async () => {
      vi.mocked(mockClient.get).mockRejectedValue(
        new FMPAPIError('Not found', 404, 'Not Found')
      );

      await expect(companyResource.getQuoteShort('INVALID')).rejects.toThrow(
        FMPAPIError
      );
    });
  });

  describe('getAftermarketTrade', () => {
    it('should get aftermarket trade successfully', async () => {
      const mockTrade = [{ symbol: 'AAPL', price: 150.5, volume: 100000 }];

      vi.mocked(mockClient.get).mockResolvedValue(mockTrade);

      const result = await companyResource.getAftermarketTrade('AAPL');

      expect(mockClient.get).toHaveBeenCalledWith('aftermarket-trade', {
        searchParams: { symbol: 'AAPL' },
      });
      expect(result).toEqual(mockTrade);
    });

    it('should normalize symbol to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await companyResource.getAftermarketTrade('aapl');

      expect(mockClient.get).toHaveBeenCalledWith('aftermarket-trade', {
        searchParams: { symbol: 'AAPL' },
      });
    });

    it('should handle API errors', async () => {
      vi.mocked(mockClient.get).mockRejectedValue(
        new FMPAPIError('Server error', 500, 'Internal Server Error')
      );

      await expect(companyResource.getAftermarketTrade('AAPL')).rejects.toThrow(
        FMPAPIError
      );
    });
  });

  describe('getAftermarketQuote', () => {
    it('should get aftermarket quote successfully', async () => {
      const mockQuote = [{ symbol: 'AAPL', price: 150.5, change: 0.5 }];

      vi.mocked(mockClient.get).mockResolvedValue(mockQuote);

      const result = await companyResource.getAftermarketQuote('AAPL');

      expect(mockClient.get).toHaveBeenCalledWith('aftermarket-quote', {
        searchParams: { symbol: 'AAPL' },
      });
      expect(result).toEqual(mockQuote);
    });

    it('should normalize symbol to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await companyResource.getAftermarketQuote('aapl');

      expect(mockClient.get).toHaveBeenCalledWith('aftermarket-quote', {
        searchParams: { symbol: 'AAPL' },
      });
    });

    it('should handle API errors', async () => {
      vi.mocked(mockClient.get).mockRejectedValue(
        new FMPAPIError('Server error', 500, 'Internal Server Error')
      );

      await expect(companyResource.getAftermarketQuote('AAPL')).rejects.toThrow(
        FMPAPIError
      );
    });
  });

  describe('getPriceChange', () => {
    it('should get price change successfully', async () => {
      const mockChange = [
        { symbol: 'AAPL', '1D': 1.5, '5D': 3.2, '1M': 5.7, '3M': 8.1, '6M': 12.5, '1Y': 25.3 },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockChange);

      const result = await companyResource.getPriceChange('AAPL');

      expect(mockClient.get).toHaveBeenCalledWith('stock-price-change', {
        searchParams: { symbol: 'AAPL' },
      });
      expect(result).toEqual(mockChange);
    });

    it('should normalize symbol to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await companyResource.getPriceChange('aapl');

      expect(mockClient.get).toHaveBeenCalledWith('stock-price-change', {
        searchParams: { symbol: 'AAPL' },
      });
    });

    it('should handle API errors', async () => {
      vi.mocked(mockClient.get).mockRejectedValue(
        new FMPAPIError('Not found', 404, 'Not Found')
      );

      await expect(companyResource.getPriceChange('INVALID')).rejects.toThrow(
        FMPAPIError
      );
    });
  });

  describe('getBatchQuotesShort', () => {
    it('should get batch short quotes successfully', async () => {
      const mockQuotes = [
        { symbol: 'AAPL', price: 150.0, volume: 60000000 },
        { symbol: 'MSFT', price: 350.0, volume: 40000000 },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockQuotes);

      const result = await companyResource.getBatchQuotesShort(['AAPL', 'MSFT']);

      expect(mockClient.get).toHaveBeenCalledWith('quote-short', {
        searchParams: { symbol: 'AAPL,MSFT' },
      });
      expect(result).toEqual(mockQuotes);
    });

    it('should normalize symbols to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await companyResource.getBatchQuotesShort(['aapl', 'msft', 'goog']);

      expect(mockClient.get).toHaveBeenCalledWith('quote-short', {
        searchParams: { symbol: 'AAPL,MSFT,GOOG' },
      });
    });

    it('should handle API errors', async () => {
      vi.mocked(mockClient.get).mockRejectedValue(
        new FMPAPIError('Server error', 500, 'Internal Server Error')
      );

      await expect(companyResource.getBatchQuotesShort(['AAPL', 'MSFT'])).rejects.toThrow(
        FMPAPIError
      );
    });
  });

  describe('getBatchAftermarketQuotes', () => {
    it('should get batch aftermarket quotes successfully', async () => {
      const mockQuotes = [
        { symbol: 'AAPL', price: 150.5, change: 0.5 },
        { symbol: 'MSFT', price: 350.5, change: 0.5 },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockQuotes);

      const result = await companyResource.getBatchAftermarketQuotes(['AAPL', 'MSFT']);

      expect(mockClient.get).toHaveBeenCalledWith('batch-aftermarket-quote', {
        searchParams: { symbols: 'AAPL,MSFT' },
      });
      expect(result).toEqual(mockQuotes);
    });

    it('should normalize symbols to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      await companyResource.getBatchAftermarketQuotes(['aapl', 'msft', 'goog']);

      expect(mockClient.get).toHaveBeenCalledWith('batch-aftermarket-quote', {
        searchParams: { symbols: 'AAPL,MSFT,GOOG' },
      });
    });

    it('should handle API errors', async () => {
      vi.mocked(mockClient.get).mockRejectedValue(
        new FMPAPIError('Server error', 500, 'Internal Server Error')
      );

      await expect(
        companyResource.getBatchAftermarketQuotes(['AAPL', 'MSFT'])
      ).rejects.toThrow(FMPAPIError);
    });
  });

  describe('getMutualFundQuotes', () => {
    it('should get mutual fund quotes successfully', async () => {
      const mockQuotes = [
        { symbol: 'VFIAX', price: 400.0, change: 2.5 },
        { symbol: 'FXAIX', price: 150.0, change: 1.2 },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockQuotes);

      const result = await companyResource.getMutualFundQuotes();

      expect(mockClient.get).toHaveBeenCalledWith('batch-mutualfund-quotes');
      expect(result).toEqual(mockQuotes);
    });

    it('should handle API errors', async () => {
      vi.mocked(mockClient.get).mockRejectedValue(
        new FMPAPIError('Server error', 500, 'Internal Server Error')
      );

      await expect(companyResource.getMutualFundQuotes()).rejects.toThrow(FMPAPIError);
    });
  });

  describe('getETFQuotes', () => {
    it('should get ETF quotes successfully', async () => {
      const mockQuotes = [
        { symbol: 'SPY', price: 450.0, change: 3.5 },
        { symbol: 'QQQ', price: 370.0, change: 2.8 },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockQuotes);

      const result = await companyResource.getETFQuotes();

      expect(mockClient.get).toHaveBeenCalledWith('batch-etf-quotes');
      expect(result).toEqual(mockQuotes);
    });

    it('should handle API errors', async () => {
      vi.mocked(mockClient.get).mockRejectedValue(
        new FMPAPIError('Server error', 500, 'Internal Server Error')
      );

      await expect(companyResource.getETFQuotes()).rejects.toThrow(FMPAPIError);
    });
  });

  describe('getCommoditiesQuotes', () => {
    it('should get commodities quotes successfully', async () => {
      const mockQuotes = [
        { symbol: 'GCUSD', price: 2000.0, change: 15.5 },
        { symbol: 'CLUSD', price: 75.0, change: 2.3 },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockQuotes);

      const result = await companyResource.getCommoditiesQuotes();

      expect(mockClient.get).toHaveBeenCalledWith('batch-commodity-quotes');
      expect(result).toEqual(mockQuotes);
    });

    it('should handle API errors', async () => {
      vi.mocked(mockClient.get).mockRejectedValue(
        new FMPAPIError('Server error', 500, 'Internal Server Error')
      );

      await expect(companyResource.getCommoditiesQuotes()).rejects.toThrow(FMPAPIError);
    });
  });

  describe('getIndexQuotes', () => {
    it('should get index quotes successfully', async () => {
      const mockQuotes = [
        { symbol: 'SPX', price: 4500.0, change: 25.5 },
        { symbol: 'DJI', price: 35000.0, change: 150.0 },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockQuotes);

      const result = await companyResource.getIndexQuotes();

      expect(mockClient.get).toHaveBeenCalledWith('batch-index-quotes');
      expect(result).toEqual(mockQuotes);
    });

    it('should handle API errors', async () => {
      vi.mocked(mockClient.get).mockRejectedValue(
        new FMPAPIError('Server error', 500, 'Internal Server Error')
      );

      await expect(companyResource.getIndexQuotes()).rejects.toThrow(FMPAPIError);
    });
  });
});
