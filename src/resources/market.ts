import type { FMPClient } from '../client.js';
import type {
  HistoricalPrice,
  IntradayChart,
  ForexPrice,
  ForexCurrencyPair,
  ForexQuoteShort,
  LightChartData,
  CryptoPrice,
  CryptoList,
  MarketHours,
  MarketHoliday,
} from '../types/index.js';
import { validateDateRange, validateSymbol } from '../utils/validation.js';

/**
 * Time intervals for intraday data
 */
export enum IntradayInterval {
  OneMin = '1min',
  FiveMin = '5min',
  FifteenMin = '15min',
  ThirtyMin = '30min',
  OneHour = '1hour',
  FourHour = '4hour',
}

/**
 * Market data resource
 * Provides access to historical prices, intraday data, forex, and crypto
 */
export class MarketResource {
  constructor(private readonly client: FMPClient) {}

  /**
   * Get historical daily prices for a symbol (full data with OHLCV)
   * @param symbol - Stock symbol
   * @param from - Start date (YYYY-MM-DD)
   * @param to - End date (YYYY-MM-DD)
   */
  async getHistoricalPrices(
    symbol: string,
    from?: string,
    to?: string
  ): Promise<HistoricalPrice[]> {
    validateSymbol(symbol);
    validateDateRange(from, to);

    const params: Record<string, string> = {
      symbol: symbol.toUpperCase(),
    };

    if (from) params.from = from;
    if (to) params.to = to;

    return this.client.get<HistoricalPrice[]>('historical-price-eod/full', {
      searchParams: params,
    });
  }

  /**
   * Get light historical daily prices (date and close only)
   * @param symbol - Stock symbol
   * @param from - Start date (YYYY-MM-DD)
   * @param to - End date (YYYY-MM-DD)
   */
  async getHistoricalPricesLight(
    symbol: string,
    from?: string,
    to?: string
  ): Promise<LightChartData[]> {
    validateSymbol(symbol);
    validateDateRange(from, to);

    const params: Record<string, string> = {
      symbol: symbol.toUpperCase(),
    };

    if (from) params.from = from;
    if (to) params.to = to;

    return this.client.get<LightChartData[]>('historical-price-eod/light', {
      searchParams: params,
    });
  }

  /**
   * Get intraday chart data
   * @param symbol - Stock symbol
   * @param interval - Time interval
   * @param from - Start date (YYYY-MM-DD)
   * @param to - End date (YYYY-MM-DD)
   */
  async getIntradayChart(
    symbol: string,
    interval: IntradayInterval = IntradayInterval.OneHour,
    from?: string,
    to?: string
  ): Promise<IntradayChart[]> {
    validateSymbol(symbol);
    validateDateRange(from, to);

    const params: Record<string, string> = {
      symbol: symbol.toUpperCase(),
    };

    if (from) params.from = from;
    if (to) params.to = to;

    return this.client.get<IntradayChart[]>(`historical-chart/${interval}`, {
      searchParams: params,
    });
  }

  /**
   * Get forex pair quote
   * @param pair - Forex pair (e.g., "EURUSD")
   */
  async getForexPrice(pair: string): Promise<ForexPrice[]> {
    return this.client.get<ForexPrice[]>('quote', {
      searchParams: { symbol: pair.toUpperCase() },
    });
  }

  /**
   * Get all forex pair quotes
   */
  async getAllForexPrices(): Promise<ForexPrice[]> {
    return this.client.get<ForexPrice[]>('batch-forex-quotes');
  }

  /**
   * Get cryptocurrency quote
   * @param symbol - Crypto symbol (e.g., "BTCUSD")
   */
  async getCryptoPrice(symbol: string): Promise<CryptoPrice[]> {
    return this.client.get<CryptoPrice[]>('quote', {
      searchParams: { symbol: symbol.toUpperCase() },
    });
  }

  /**
   * Get all cryptocurrency quotes
   */
  async getAllCryptoPrices(): Promise<CryptoPrice[]> {
    return this.client.get<CryptoPrice[]>('batch-crypto-quotes');
  }

  /**
   * Get list of available cryptocurrencies
   */
  async getCryptoList(): Promise<CryptoList[]> {
    return this.client.get<CryptoList[]>('cryptocurrency-list');
  }

  /**
   * Get cryptocurrency quote (short format)
   * @param symbol - Crypto symbol (e.g., "BTCUSD")
   */
  async getCryptoQuoteShort(symbol: string): Promise<ForexQuoteShort[]> {
    return this.client.get<ForexQuoteShort[]>('quote-short', {
      searchParams: { symbol: symbol.toUpperCase() },
    });
  }

  /**
   * Get light historical chart for cryptocurrency (date and close only)
   * @param symbol - Crypto symbol (e.g., "BTCUSD")
   * @param from - Start date (YYYY-MM-DD)
   * @param to - End date (YYYY-MM-DD)
   */
  async getCryptoLightChart(
    symbol: string,
    from?: string,
    to?: string
  ): Promise<LightChartData[]> {
    const params: Record<string, string> = {
      symbol: symbol.toUpperCase(),
    };
    if (from) params.from = from;
    if (to) params.to = to;

    return this.client.get<LightChartData[]>('historical-price-eod/light', {
      searchParams: params,
    });
  }

  /**
   * Get full historical chart for cryptocurrency
   * @param symbol - Crypto symbol (e.g., "BTCUSD")
   * @param from - Start date (YYYY-MM-DD)
   * @param to - End date (YYYY-MM-DD)
   */
  async getCryptoFullChart(
    symbol: string,
    from?: string,
    to?: string
  ): Promise<HistoricalPrice[]> {
    const params: Record<string, string> = {
      symbol: symbol.toUpperCase(),
    };
    if (from) params.from = from;
    if (to) params.to = to;

    return this.client.get<HistoricalPrice[]>('historical-price-eod/full', {
      searchParams: params,
    });
  }

  /**
   * Get intraday chart data for cryptocurrency
   * @param symbol - Crypto symbol (e.g., "BTCUSD")
   * @param interval - Time interval
   * @param from - Start date (YYYY-MM-DD)
   * @param to - End date (YYYY-MM-DD)
   */
  async getCryptoIntraday(
    symbol: string,
    interval: IntradayInterval = IntradayInterval.OneHour,
    from?: string,
    to?: string
  ): Promise<IntradayChart[]> {
    const params: Record<string, string> = {
      symbol: symbol.toUpperCase(),
    };
    if (from) params.from = from;
    if (to) params.to = to;

    return this.client.get<IntradayChart[]>(`historical-chart/${interval}`, {
      searchParams: params,
    });
  }

  /**
   * Get historical forex prices
   * @param pair - Forex pair
   * @param from - Start date
   * @param to - End date
   */
  async getHistoricalForex(
    pair: string,
    from?: string,
    to?: string
  ): Promise<HistoricalPrice[]> {
    const params: Record<string, string> = {
      symbol: pair.toUpperCase(),
    };

    if (from) params.from = from;
    if (to) params.to = to;

    return this.client.get<HistoricalPrice[]>('historical-price-eod/full', {
      searchParams: params,
    });
  }

  /**
   * Get list of available forex currency pairs
   */
  async getForexCurrencyPairs(): Promise<ForexCurrencyPair[]> {
    return this.client.get<ForexCurrencyPair[]>('forex-list');
  }

  /**
   * Get forex quote in short format (symbol, price, volume)
   * @param pair - Forex pair (e.g., "EURUSD")
   */
  async getForexQuoteShort(pair: string): Promise<ForexQuoteShort[]> {
    return this.client.get<ForexQuoteShort[]>('quote-short', {
      searchParams: { symbol: pair.toUpperCase() },
    });
  }

  /**
   * Get light historical chart for forex pair (date and close only)
   * @param pair - Forex pair (e.g., "EURUSD")
   * @param from - Start date (YYYY-MM-DD)
   * @param to - End date (YYYY-MM-DD)
   */
  async getForexLightChart(
    pair: string,
    from?: string,
    to?: string
  ): Promise<LightChartData[]> {
    const params: Record<string, string> = {
      symbol: pair.toUpperCase(),
    };
    if (from) params.from = from;
    if (to) params.to = to;

    return this.client.get<LightChartData[]>('historical-price-eod/light', {
      searchParams: params,
    });
  }

  /**
   * Get intraday chart data for forex pairs
   * @param pair - Forex pair (e.g., "EURUSD")
   * @param interval - Time interval
   * @param from - Start date (YYYY-MM-DD)
   * @param to - End date (YYYY-MM-DD)
   */
  async getForexIntraday(
    pair: string,
    interval: IntradayInterval = IntradayInterval.OneHour,
    from?: string,
    to?: string
  ): Promise<IntradayChart[]> {
    const params: Record<string, string> = {
      symbol: pair.toUpperCase(),
    };
    if (from) params.from = from;
    if (to) params.to = to;

    return this.client.get<IntradayChart[]>(`historical-chart/${interval}`, {
      searchParams: params,
    });
  }

  /**
   * Get market hours for a specific exchange
   * @param exchange - Exchange name (e.g., "NYSE", "NASDAQ")
   */
  async getMarketHours(exchange: string): Promise<MarketHours[]> {
    return this.client.get<MarketHours[]>('exchange-market-hours', {
      searchParams: { exchange },
    });
  }

  /**
   * Get market holidays for a specific exchange
   * @param exchange - Exchange name (e.g., "NYSE", "NASDAQ")
   */
  async getMarketHolidays(exchange: string): Promise<MarketHoliday[]> {
    return this.client.get<MarketHoliday[]>('holidays-by-exchange', {
      searchParams: { exchange },
    });
  }

  /**
   * Get hours for all exchanges
   */
  async getAllMarketHours(): Promise<MarketHours[]> {
    return this.client.get<MarketHours[]>('all-exchange-market-hours');
  }

  /**
   * Get unadjusted historical prices (not adjusted for splits)
   * @param symbol - Stock symbol
   * @param from - Start date (YYYY-MM-DD)
   * @param to - End date (YYYY-MM-DD)
   */
  async getUnadjustedPrice(
    symbol: string,
    from?: string,
    to?: string
  ): Promise<HistoricalPrice[]> {
    const params: Record<string, string> = {
      symbol: symbol.toUpperCase(),
    };
    if (from) params.from = from;
    if (to) params.to = to;

    return this.client.get<HistoricalPrice[]>(
      'historical-price-eod/non-split-adjusted',
      { searchParams: params }
    );
  }

  /**
   * Get dividend-adjusted historical prices
   * @param symbol - Stock symbol
   * @param from - Start date (YYYY-MM-DD)
   * @param to - End date (YYYY-MM-DD)
   */
  async getDividendAdjusted(
    symbol: string,
    from?: string,
    to?: string
  ): Promise<HistoricalPrice[]> {
    const params: Record<string, string> = {
      symbol: symbol.toUpperCase(),
    };
    if (from) params.from = from;
    if (to) params.to = to;

    return this.client.get<HistoricalPrice[]>(
      'historical-price-eod/dividend-adjusted',
      { searchParams: params }
    );
  }
}
