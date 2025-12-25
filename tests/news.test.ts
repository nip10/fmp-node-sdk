import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NewsResource } from '../src/resources/news.js';
import type { FMPClient } from '../src/client.js';
import type {
  FMPArticle,
  StockNews,
  PressRelease,
  EarningsTranscript,
} from '../src/types/index.js';

describe('NewsResource', () => {
  let mockClient: FMPClient;
  let newsResource: NewsResource;

  beforeEach(() => {
    // Create a mock client with a get method
    mockClient = {
      get: vi.fn(),
    } as unknown as FMPClient;

    newsResource = new NewsResource(mockClient);
  });

  describe('getFMPArticles', () => {
    const mockArticles: FMPArticle[] = [
      {
        title: 'Market Update',
        date: '2024-01-15',
        content: 'Market news content',
        tickers: 'AAPL,MSFT',
        image: 'https://example.com/image.jpg',
        link: 'https://example.com/article',
        author: 'John Doe',
        site: 'FMP',
      },
      {
        title: 'Tech Stocks Rally',
        date: '2024-01-14',
        content: 'Tech stocks content',
        tickers: 'GOOGL,AMZN',
        image: 'https://example.com/image2.jpg',
        link: 'https://example.com/article2',
        author: 'Jane Smith',
        site: 'FMP',
      },
    ];

    it('should fetch FMP articles with default parameters', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockArticles);

      const result = await newsResource.getFMPArticles();

      expect(mockClient.get).toHaveBeenCalledWith('fmp-articles', {
        searchParams: {
          page: 0,
        size: 50,
      },
      }
);
      expect(result).toEqual(mockArticles);
    });

    it('should fetch FMP articles with custom page', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockArticles);

      const result = await newsResource.getFMPArticles(2);

      expect(mockClient.get).toHaveBeenCalledWith('fmp-articles', {
        searchParams: {
          page: 2,
        size: 50,
      },
      }
);
      expect(result).toEqual(mockArticles);
    });

    it('should fetch FMP articles with custom limit', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockArticles);

      const result = await newsResource.getFMPArticles(0, 100);

      expect(mockClient.get).toHaveBeenCalledWith('fmp-articles', {
        searchParams: {
          page: 0,
        size: 100,
      },
      }
);
      expect(result).toEqual(mockArticles);
    });

    it('should fetch FMP articles with custom page and limit', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockArticles);

      const result = await newsResource.getFMPArticles(5, 25);

      expect(mockClient.get).toHaveBeenCalledWith('fmp-articles', {
        searchParams: {
          page: 5,
        size: 25,
      },
      }
);
      expect(result).toEqual(mockArticles);
    });

    it('should handle empty results', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      const result = await newsResource.getFMPArticles();

      expect(result).toEqual([]);
    });

    it('should propagate API errors', async () => {
      const error = new Error('API Error');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(newsResource.getFMPArticles()).rejects.toThrow('API Error');
    });
  });

  describe('getGeneralNews', () => {
    const mockNews: StockNews[] = [
      {
        symbol: null,
        publishedDate: '2024-01-15T10:00:00.000Z',
        title: 'General Market News',
        image: 'https://example.com/market.jpg',
        site: 'MarketNews',
        text: 'General market update...',
        url: 'https://example.com/market-news',
      },
    ];

    it('should fetch general news with default page', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockNews);

      const result = await newsResource.getGeneralNews();

      expect(mockClient.get).toHaveBeenCalledWith('general-news', {
        searchParams: {
          page: 0,
      },
      }
);
      expect(result).toEqual(mockNews);
    });

    it('should fetch general news with custom page', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockNews);

      const result = await newsResource.getGeneralNews(3);

      expect(mockClient.get).toHaveBeenCalledWith('general-news', {
        searchParams: {
          page: 3,
      },
      }
);
      expect(result).toEqual(mockNews);
    });

    it('should handle empty results', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      const result = await newsResource.getGeneralNews();

      expect(result).toEqual([]);
    });

    it('should propagate API errors', async () => {
      const error = new Error('API Error');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(newsResource.getGeneralNews()).rejects.toThrow('API Error');
    });
  });

  describe('getCryptoNews', () => {
    const mockCryptoNews: StockNews[] = [
      {
        symbol: 'BTC',
        publishedDate: '2024-01-15T10:00:00.000Z',
        title: 'Bitcoin Rallies',
        image: 'https://example.com/btc.jpg',
        site: 'CryptoNews',
        text: 'Bitcoin price surges...',
        url: 'https://example.com/btc-news',
      },
    ];

    it('should fetch crypto news with default parameters', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockCryptoNews);

      const result = await newsResource.getCryptoNews();

      expect(mockClient.get).toHaveBeenCalledWith('crypto-news', {
        searchParams: {
          page: 0,
        limit: 50,
      },
      }
);
      expect(result).toEqual(mockCryptoNews);
    });

    it('should fetch crypto news with custom page', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockCryptoNews);

      const result = await newsResource.getCryptoNews(2);

      expect(mockClient.get).toHaveBeenCalledWith('crypto-news', {
        searchParams: {
          page: 2,
        limit: 50,
      },
      }
);
      expect(result).toEqual(mockCryptoNews);
    });

    it('should fetch crypto news with custom limit', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockCryptoNews);

      const result = await newsResource.getCryptoNews(0, 100);

      expect(mockClient.get).toHaveBeenCalledWith('crypto-news', {
        searchParams: {
          page: 0,
        limit: 100,
      },
      }
);
      expect(result).toEqual(mockCryptoNews);
    });

    it('should handle empty results', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      const result = await newsResource.getCryptoNews();

      expect(result).toEqual([]);
    });

    it('should propagate API errors', async () => {
      const error = new Error('Network Error');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(newsResource.getCryptoNews()).rejects.toThrow('Network Error');
    });
  });

  describe('getForexNews', () => {
    const mockForexNews: StockNews[] = [
      {
        symbol: 'EUR/USD',
        publishedDate: '2024-01-15T10:00:00.000Z',
        title: 'EUR/USD Analysis',
        image: 'https://example.com/forex.jpg',
        site: 'ForexNews',
        text: 'Euro strengthens against dollar...',
        url: 'https://example.com/forex-news',
      },
    ];

    it('should fetch forex news with default parameters', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockForexNews);

      const result = await newsResource.getForexNews();

      expect(mockClient.get).toHaveBeenCalledWith('forex-news', {
        searchParams: {
          page: 0,
        limit: 50,
      },
      }
);
      expect(result).toEqual(mockForexNews);
    });

    it('should fetch forex news with custom page', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockForexNews);

      const result = await newsResource.getForexNews(3);

      expect(mockClient.get).toHaveBeenCalledWith('forex-news', {
        searchParams: {
          page: 3,
        limit: 50,
      },
      }
);
      expect(result).toEqual(mockForexNews);
    });

    it('should fetch forex news with custom limit', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockForexNews);

      const result = await newsResource.getForexNews(0, 75);

      expect(mockClient.get).toHaveBeenCalledWith('forex-news', {
        searchParams: {
          page: 0,
        limit: 75,
      },
      }
);
      expect(result).toEqual(mockForexNews);
    });

    it('should handle empty results', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      const result = await newsResource.getForexNews();

      expect(result).toEqual([]);
    });

    it('should propagate API errors', async () => {
      const error = new Error('API Error');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(newsResource.getForexNews()).rejects.toThrow('API Error');
    });
  });

  describe('getStockNews', () => {
    const mockNews: StockNews[] = [
      {
        symbol: 'AAPL',
        publishedDate: '2024-01-15T10:00:00.000Z',
        title: 'Apple Announces New Product',
        image: 'https://example.com/apple.jpg',
        site: 'TechNews',
        text: 'Apple announced a new product today...',
        url: 'https://example.com/apple-news',
      },
      {
        symbol: 'MSFT',
        publishedDate: '2024-01-15T09:00:00.000Z',
        title: 'Microsoft Earnings Beat',
        image: 'https://example.com/msft.jpg',
        site: 'FinanceNews',
        text: 'Microsoft reported strong earnings...',
        url: 'https://example.com/msft-news',
      },
    ];

    it('should fetch stock news without tickers', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockNews);

      const result = await newsResource.getStockNews();

      expect(mockClient.get).toHaveBeenCalledWith('stock-news', {
        searchParams: {
          limit: 50,
      },
      }
);
      expect(result).toEqual(mockNews);
    });

    it('should fetch stock news with single ticker', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockNews);

      const result = await newsResource.getStockNews('AAPL');

      expect(mockClient.get).toHaveBeenCalledWith('stock-news', {
        searchParams: {
          limit: 50,
        tickers: 'AAPL',
      },
      }
);
      expect(result).toEqual(mockNews);
    });

    it('should fetch stock news with multiple tickers', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockNews);

      const result = await newsResource.getStockNews('AAPL,MSFT,GOOGL');

      expect(mockClient.get).toHaveBeenCalledWith('stock-news', {
        searchParams: {
          limit: 50,
        tickers: 'AAPL,MSFT,GOOGL',
      },
      }
);
      expect(result).toEqual(mockNews);
    });

    it('should fetch stock news with custom limit', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockNews);

      const result = await newsResource.getStockNews(undefined, 100);

      expect(mockClient.get).toHaveBeenCalledWith('stock-news', {
        searchParams: {
          limit: 100,
      },
      }
);
      expect(result).toEqual(mockNews);
    });

    it('should fetch stock news with tickers and custom limit', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockNews);

      const result = await newsResource.getStockNews('TSLA,NVDA', 25);

      expect(mockClient.get).toHaveBeenCalledWith('stock-news', {
        searchParams: {
          limit: 25,
        tickers: 'TSLA,NVDA',
      },
      }
);
      expect(result).toEqual(mockNews);
    });

    it('should handle empty string ticker parameter', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockNews);

      const result = await newsResource.getStockNews('');

      expect(mockClient.get).toHaveBeenCalledWith('stock-news', {
        searchParams: {
          limit: 50,
      },
      }
);
      expect(result).toEqual(mockNews);
    });

    it('should handle empty results', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      const result = await newsResource.getStockNews('XYZ');

      expect(result).toEqual([]);
    });

    it('should propagate API errors', async () => {
      const error = new Error('Network Error');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(newsResource.getStockNews('AAPL')).rejects.toThrow('Network Error');
    });
  });

  describe('getPressReleases', () => {
    const mockPressReleases: PressRelease[] = [
      {
        symbol: 'AAPL',
        date: '2024-01-15',
        title: 'Q4 Earnings Release',
        text: 'Apple Inc. today announced financial results...',
      },
      {
        symbol: 'AAPL',
        date: '2024-01-10',
        title: 'Product Launch Announcement',
        text: 'Apple is excited to announce...',
      },
    ];

    it('should fetch press releases with default page', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockPressReleases);

      const result = await newsResource.getPressReleases('AAPL');

      expect(mockClient.get).toHaveBeenCalledWith('press-releases', {
        searchParams: {
          symbol: 'AAPL',
          page: 0,
        },
      });
      expect(result).toEqual(mockPressReleases);
    });

    it('should normalize symbol to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockPressReleases);

      const result = await newsResource.getPressReleases('aapl');

      expect(mockClient.get).toHaveBeenCalledWith('press-releases', {
        searchParams: {
          symbol: 'AAPL',
          page: 0,
        },
      });
      expect(result).toEqual(mockPressReleases);
    });

    it('should fetch press releases with custom page', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockPressReleases);

      const result = await newsResource.getPressReleases('MSFT', 3);

      expect(mockClient.get).toHaveBeenCalledWith('press-releases', {
        searchParams: {
          symbol: 'MSFT',
          page: 3,
        },
      });
      expect(result).toEqual(mockPressReleases);
    });

    it('should handle lowercase symbol normalization', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockPressReleases);

      const result = await newsResource.getPressReleases('googl', 1);

      expect(mockClient.get).toHaveBeenCalledWith('press-releases', {
        searchParams: {
          symbol: 'GOOGL',
          page: 1,
        },
      });
      expect(result).toEqual(mockPressReleases);
    });

    it('should handle mixed case symbol normalization', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockPressReleases);

      const result = await newsResource.getPressReleases('TsLa');

      expect(mockClient.get).toHaveBeenCalledWith('press-releases', {
        searchParams: {
          symbol: 'TSLA',
          page: 0,
        },
      });
      expect(result).toEqual(mockPressReleases);
    });

    it('should handle empty results', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      const result = await newsResource.getPressReleases('XYZ');

      expect(result).toEqual([]);
    });

    it('should propagate API errors', async () => {
      const error = new Error('Symbol not found');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(newsResource.getPressReleases('INVALID')).rejects.toThrow('Symbol not found');
    });
  });

  describe('getLatestPressReleases', () => {
    const mockPressReleases: PressRelease[] = [
      {
        symbol: 'AAPL',
        date: '2024-01-15',
        title: 'Latest Announcement',
        text: 'Latest press release content...',
      },
    ];

    it('should fetch latest press releases with default limit', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockPressReleases);

      const result = await newsResource.getLatestPressReleases('AAPL');

      expect(mockClient.get).toHaveBeenCalledWith('press-releases', {
        searchParams: {
          symbol: 'AAPL',
          limit: 50,
        },
      });
      expect(result).toEqual(mockPressReleases);
    });

    it('should normalize symbol to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockPressReleases);

      const result = await newsResource.getLatestPressReleases('aapl');

      expect(mockClient.get).toHaveBeenCalledWith('press-releases', {
        searchParams: {
          symbol: 'AAPL',
          limit: 50,
        },
      });
      expect(result).toEqual(mockPressReleases);
    });

    it('should fetch latest press releases with custom limit', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockPressReleases);

      const result = await newsResource.getLatestPressReleases('MSFT', 10);

      expect(mockClient.get).toHaveBeenCalledWith('press-releases', {
        searchParams: {
          symbol: 'MSFT',
          limit: 10,
        },
      });
      expect(result).toEqual(mockPressReleases);
    });

    it('should handle large custom limit', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockPressReleases);

      const result = await newsResource.getLatestPressReleases('GOOGL', 200);

      expect(mockClient.get).toHaveBeenCalledWith('press-releases', {
        searchParams: {
          symbol: 'GOOGL',
          limit: 200,
        },
      });
      expect(result).toEqual(mockPressReleases);
    });

    it('should handle empty results', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      const result = await newsResource.getLatestPressReleases('XYZ');

      expect(result).toEqual([]);
    });

    it('should propagate API errors', async () => {
      const error = new Error('API Error');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(newsResource.getLatestPressReleases('AAPL')).rejects.toThrow('API Error');
    });
  });

  describe('getEarningsTranscript', () => {
    const mockTranscript: EarningsTranscript[] = [
      {
        symbol: 'AAPL',
        quarter: 4,
        year: 2023,
        date: '2024-01-31',
        content: 'Tim Cook: Thank you for joining us today...',
      },
    ];

    it('should fetch earnings transcript', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockTranscript);

      const result = await newsResource.getEarningsTranscript('AAPL', 2023, 4);

      expect(mockClient.get).toHaveBeenCalledWith('earning-call-transcript', {
        searchParams: {
          symbol: 'AAPL',
          year: 2023,
          quarter: 4,
        },
      });
      expect(result).toEqual(mockTranscript);
    });

    it('should normalize symbol to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockTranscript);

      const result = await newsResource.getEarningsTranscript('aapl', 2023, 4);

      expect(mockClient.get).toHaveBeenCalledWith('earning-call-transcript', {
        searchParams: {
          symbol: 'AAPL',
          year: 2023,
          quarter: 4,
        },
      });
      expect(result).toEqual(mockTranscript);
    });

    it('should handle Q1 transcript', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockTranscript);

      const result = await newsResource.getEarningsTranscript('MSFT', 2024, 1);

      expect(mockClient.get).toHaveBeenCalledWith('earning-call-transcript', {
        searchParams: {
          symbol: 'MSFT',
          year: 2024,
          quarter: 1,
        },
      });
      expect(result).toEqual(mockTranscript);
    });

    it('should handle Q2 transcript', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockTranscript);

      const result = await newsResource.getEarningsTranscript('GOOGL', 2024, 2);

      expect(mockClient.get).toHaveBeenCalledWith('earning-call-transcript', {
        searchParams: {
          symbol: 'GOOGL',
          year: 2024,
          quarter: 2,
        },
      });
      expect(result).toEqual(mockTranscript);
    });

    it('should handle Q3 transcript', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockTranscript);

      const result = await newsResource.getEarningsTranscript('AMZN', 2024, 3);

      expect(mockClient.get).toHaveBeenCalledWith('earning-call-transcript', {
        searchParams: {
          symbol: 'AMZN',
          year: 2024,
          quarter: 3,
        },
      });
      expect(result).toEqual(mockTranscript);
    });

    it('should handle historical year transcript', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockTranscript);

      const result = await newsResource.getEarningsTranscript('TSLA', 2020, 1);

      expect(mockClient.get).toHaveBeenCalledWith('earning-call-transcript', {
        searchParams: {
          symbol: 'TSLA',
          year: 2020,
          quarter: 1,
        },
      });
      expect(result).toEqual(mockTranscript);
    });

    it('should handle mixed case symbol', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockTranscript);

      const result = await newsResource.getEarningsTranscript('NvDa', 2023, 4);

      expect(mockClient.get).toHaveBeenCalledWith('earning-call-transcript', {
        searchParams: {
          symbol: 'NVDA',
          year: 2023,
          quarter: 4,
        },
      });
      expect(result).toEqual(mockTranscript);
    });

    it('should handle empty results', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      const result = await newsResource.getEarningsTranscript('XYZ', 2024, 1);

      expect(result).toEqual([]);
    });

    it('should propagate API errors', async () => {
      const error = new Error('Transcript not found');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(newsResource.getEarningsTranscript('AAPL', 2024, 1)).rejects.toThrow(
        'Transcript not found'
      );
    });
  });

  describe('getEarningsTranscriptDates', () => {
    const mockDates = [
      { year: 2024, quarter: 1 },
      { year: 2023, quarter: 4 },
      { year: 2023, quarter: 3 },
      { year: 2023, quarter: 2 },
    ];

    it('should fetch available earnings transcript dates', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockDates);

      const result = await newsResource.getEarningsTranscriptDates('AAPL');

      expect(mockClient.get).toHaveBeenCalledWith('earning-call-transcript-dates', {
        searchParams: {
          symbol: 'AAPL',
        },
      });
      expect(result).toEqual(mockDates);
    });

    it('should normalize symbol to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockDates);

      const result = await newsResource.getEarningsTranscriptDates('aapl');

      expect(mockClient.get).toHaveBeenCalledWith('earning-call-transcript-dates', {
        searchParams: {
          symbol: 'AAPL',
        },
      });
      expect(result).toEqual(mockDates);
    });

    it('should handle lowercase symbol', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockDates);

      const result = await newsResource.getEarningsTranscriptDates('msft');

      expect(mockClient.get).toHaveBeenCalledWith('earning-call-transcript-dates', {
        searchParams: {
          symbol: 'MSFT',
        },
      });
      expect(result).toEqual(mockDates);
    });

    it('should handle mixed case symbol', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockDates);

      const result = await newsResource.getEarningsTranscriptDates('GoOgL');

      expect(mockClient.get).toHaveBeenCalledWith('earning-call-transcript-dates', {
        searchParams: {
          symbol: 'GOOGL',
        },
      });
      expect(result).toEqual(mockDates);
    });

    it('should handle empty results for new company', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      const result = await newsResource.getEarningsTranscriptDates('NEWIPO');

      expect(result).toEqual([]);
    });

    it('should propagate API errors', async () => {
      const error = new Error('Symbol not found');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(newsResource.getEarningsTranscriptDates('INVALID')).rejects.toThrow(
        'Symbol not found'
      );
    });
  });

  describe('getBatchEarningsTranscripts', () => {
    const mockBatchTranscripts: EarningsTranscript[] = [
      {
        symbol: 'AAPL',
        quarter: 4,
        year: 2023,
        date: '2024-01-31',
        content: 'Q4 2023 earnings call transcript...',
      },
      {
        symbol: 'AAPL',
        quarter: 3,
        year: 2023,
        date: '2023-10-31',
        content: 'Q3 2023 earnings call transcript...',
      },
      {
        symbol: 'AAPL',
        quarter: 2,
        year: 2023,
        date: '2023-07-31',
        content: 'Q2 2023 earnings call transcript...',
      },
    ];

    it('should fetch batch earnings transcripts', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockBatchTranscripts);

      const result = await newsResource.getBatchEarningsTranscripts('AAPL');

      expect(mockClient.get).toHaveBeenCalledWith('batch-earning-call-transcript', {
        searchParams: { symbol: 'AAPL' },
      });
      expect(result).toEqual(mockBatchTranscripts);
    });

    it('should normalize symbol to uppercase', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockBatchTranscripts);

      const result = await newsResource.getBatchEarningsTranscripts('aapl');

      expect(mockClient.get).toHaveBeenCalledWith('batch-earning-call-transcript', {
        searchParams: { symbol: 'AAPL' },
      });
      expect(result).toEqual(mockBatchTranscripts);
    });

    it('should handle lowercase symbol', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockBatchTranscripts);

      const result = await newsResource.getBatchEarningsTranscripts('msft');

      expect(mockClient.get).toHaveBeenCalledWith('batch-earning-call-transcript', {
        searchParams: { symbol: 'MSFT' },
      });
      expect(result).toEqual(mockBatchTranscripts);
    });

    it('should handle mixed case symbol', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockBatchTranscripts);

      const result = await newsResource.getBatchEarningsTranscripts('TsLa');

      expect(mockClient.get).toHaveBeenCalledWith('batch-earning-call-transcript', {
        searchParams: { symbol: 'TSLA' },
      });
      expect(result).toEqual(mockBatchTranscripts);
    });

    it('should handle empty results for company without transcripts', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      const result = await newsResource.getBatchEarningsTranscripts('NEWCO');

      expect(result).toEqual([]);
    });

    it('should propagate API errors', async () => {
      const error = new Error('Rate limit exceeded');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(newsResource.getBatchEarningsTranscripts('AAPL')).rejects.toThrow(
        'Rate limit exceeded'
      );
    });
  });

  describe('Edge Cases and Error Handling', () => {
    describe('Symbol normalization edge cases', () => {
      it('should handle symbol with spaces', async () => {
        vi.mocked(mockClient.get).mockResolvedValue([]);

        await newsResource.getPressReleases('  AAPL  ');

        // toUpperCase preserves spaces, so the endpoint will include them
        expect(mockClient.get).toHaveBeenCalledWith('press-releases', {
          searchParams: {
            symbol: '  AAPL  ',
            page: 0,
          },
        });
      });

      it('should handle symbol with special characters', async () => {
        vi.mocked(mockClient.get).mockResolvedValue([]);

        await newsResource.getEarningsTranscript('BRK.B', 2023, 4);

        expect(mockClient.get).toHaveBeenCalledWith('earning-call-transcript', {
          searchParams: {
            symbol: 'BRK.B',
            year: 2023,
            quarter: 4,
          },
        });
      });
    });

    describe('Pagination edge cases', () => {
      it('should handle page 0', async () => {
        vi.mocked(mockClient.get).mockResolvedValue([]);

        await newsResource.getFMPArticles(0, 50);

        expect(mockClient.get).toHaveBeenCalledWith('fmp-articles', {
          searchParams: {
            page: 0,
          size: 50,
        },
        }
);
      });

      it('should handle large page numbers', async () => {
        vi.mocked(mockClient.get).mockResolvedValue([]);

        await newsResource.getFMPArticles(9999, 10);

        expect(mockClient.get).toHaveBeenCalledWith('fmp-articles', {
          searchParams: {
            page: 9999,
          size: 10,
        },
        }
);
      });

      it('should handle limit of 1', async () => {
        vi.mocked(mockClient.get).mockResolvedValue([]);

        await newsResource.getStockNews('AAPL', 1);

        expect(mockClient.get).toHaveBeenCalledWith('stock-news', {
          searchParams: {
            limit: 1,
          tickers: 'AAPL',
        },
        }
);
      });
    });

    describe('Quarter parameter validation', () => {
      it('should pass quarter 1 correctly', async () => {
        vi.mocked(mockClient.get).mockResolvedValue([]);

        await newsResource.getEarningsTranscript('AAPL', 2024, 1);

        expect(mockClient.get).toHaveBeenCalledWith('earning-call-transcript', {
          searchParams: {
            symbol: 'AAPL',
            year: 2024,
            quarter: 1,
          },
        });
      });

      it('should pass quarter 4 correctly', async () => {
        vi.mocked(mockClient.get).mockResolvedValue([]);

        await newsResource.getEarningsTranscript('AAPL', 2024, 4);

        expect(mockClient.get).toHaveBeenCalledWith('earning-call-transcript', {
          searchParams: {
            symbol: 'AAPL',
            year: 2024,
            quarter: 4,
          },
        });
      });
    });

    describe('Network and API error propagation', () => {
      it('should propagate network timeout errors', async () => {
        const timeoutError = new Error('Request timeout');
        vi.mocked(mockClient.get).mockRejectedValue(timeoutError);

        await expect(newsResource.getFMPArticles()).rejects.toThrow('Request timeout');
      });

      it('should propagate authentication errors', async () => {
        const authError = new Error('Invalid API key');
        vi.mocked(mockClient.get).mockRejectedValue(authError);

        await expect(newsResource.getStockNews('AAPL')).rejects.toThrow('Invalid API key');
      });

      it('should propagate rate limit errors', async () => {
        const rateLimitError = new Error('Rate limit exceeded');
        vi.mocked(mockClient.get).mockRejectedValue(rateLimitError);

        await expect(newsResource.getPressReleases('AAPL')).rejects.toThrow('Rate limit exceeded');
      });

      it('should propagate server errors', async () => {
        const serverError = new Error('Internal server error');
        vi.mocked(mockClient.get).mockRejectedValue(serverError);

        await expect(newsResource.getEarningsTranscript('AAPL', 2024, 1)).rejects.toThrow(
          'Internal server error'
        );
      });
    });

    describe('Multiple ticker combinations', () => {
      it('should handle two tickers', async () => {
        vi.mocked(mockClient.get).mockResolvedValue([]);

        await newsResource.getStockNews('AAPL,MSFT');

        expect(mockClient.get).toHaveBeenCalledWith('stock-news', {
          searchParams: {
            limit: 50,
          tickers: 'AAPL,MSFT',
        },
        }
);
      });

      it('should handle many tickers', async () => {
        vi.mocked(mockClient.get).mockResolvedValue([]);

        await newsResource.getStockNews('AAPL,MSFT,GOOGL,AMZN,TSLA,NVDA,META,NFLX');

        expect(mockClient.get).toHaveBeenCalledWith('stock-news', {
          searchParams: {
            limit: 50,
          tickers: 'AAPL,MSFT,GOOGL,AMZN,TSLA,NVDA,META,NFLX',
        },
        }
);
      });

      it('should handle tickers with no spaces', async () => {
        vi.mocked(mockClient.get).mockResolvedValue([]);

        await newsResource.getStockNews('AAPL,MSFT,GOOGL');

        expect(mockClient.get).toHaveBeenCalledWith('stock-news', {
          searchParams: {
            limit: 50,
          tickers: 'AAPL,MSFT,GOOGL',
        },
        }
);
      });
    });
  });

  describe('Type Safety', () => {
    it('should return correctly typed FMPArticle array', async () => {
      const mockData: FMPArticle[] = [
        {
          title: 'Test',
          date: '2024-01-01',
          content: 'Content',
          tickers: 'AAPL',
          image: 'image.jpg',
          link: 'link.html',
          author: 'Author',
          site: 'Site',
        },
      ];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      const result = await newsResource.getFMPArticles();

      expect(result[0]).toHaveProperty('title');
      expect(result[0]).toHaveProperty('date');
      expect(result[0]).toHaveProperty('content');
      expect(result[0]).toHaveProperty('tickers');
      expect(result[0]).toHaveProperty('image');
      expect(result[0]).toHaveProperty('link');
      expect(result[0]).toHaveProperty('author');
      expect(result[0]).toHaveProperty('site');
    });

    it('should return correctly typed StockNews array', async () => {
      const mockData: StockNews[] = [
        {
          symbol: 'AAPL',
          publishedDate: '2024-01-01',
          title: 'News',
          image: 'image.jpg',
          site: 'Site',
          text: 'Text',
          url: 'url.html',
        },
      ];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      const result = await newsResource.getStockNews();

      expect(result[0]).toHaveProperty('symbol');
      expect(result[0]).toHaveProperty('publishedDate');
      expect(result[0]).toHaveProperty('title');
      expect(result[0]).toHaveProperty('image');
      expect(result[0]).toHaveProperty('site');
      expect(result[0]).toHaveProperty('text');
      expect(result[0]).toHaveProperty('url');
    });

    it('should return correctly typed PressRelease array', async () => {
      const mockData: PressRelease[] = [
        {
          symbol: 'AAPL',
          date: '2024-01-01',
          title: 'Press Release',
          text: 'Text',
        },
      ];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      const result = await newsResource.getPressReleases('AAPL');

      expect(result[0]).toHaveProperty('symbol');
      expect(result[0]).toHaveProperty('date');
      expect(result[0]).toHaveProperty('title');
      expect(result[0]).toHaveProperty('text');
    });

    it('should return correctly typed EarningsTranscript array', async () => {
      const mockData: EarningsTranscript[] = [
        {
          symbol: 'AAPL',
          quarter: 1,
          year: 2024,
          date: '2024-01-01',
          content: 'Transcript',
        },
      ];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      const result = await newsResource.getEarningsTranscript('AAPL', 2024, 1);

      expect(result[0]).toHaveProperty('symbol');
      expect(result[0]).toHaveProperty('quarter');
      expect(result[0]).toHaveProperty('year');
      expect(result[0]).toHaveProperty('date');
      expect(result[0]).toHaveProperty('content');
    });

    it('should return correctly typed transcript dates array', async () => {
      const mockData = [
        { year: 2024, quarter: 1 },
        { year: 2023, quarter: 4 },
      ];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      const result = await newsResource.getEarningsTranscriptDates('AAPL');

      expect(result[0]).toHaveProperty('year');
      expect(result[0]).toHaveProperty('quarter');
      expect(typeof result[0].year).toBe('number');
      expect(typeof result[0].quarter).toBe('number');
    });
  });
});
