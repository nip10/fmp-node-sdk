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
   * Get historical daily prices for a symbol
   * @param symbol - Stock symbol
   * @param from - Start date (YYYY-MM-DD)
   * @param to - End date (YYYY-MM-DD)
   */
  async getHistoricalPrices(
    symbol: string,
    from?: string,
    to?: string
  ): Promise<{ historical: HistoricalPrice[] }> {
    validateSymbol(symbol);
    validateDateRange(from, to);

    const params: Record<string, string> = {};

    if (from) params.from = from;
    if (to) params.to = to;

    return this.client.get<{ historical: HistoricalPrice[] }>(
      `v3/historical-price-full/${symbol.toUpperCase()}`,
      { searchParams: params }
    );
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

    const params: Record<string, string> = {};

    if (from) params.from = from;
    if (to) params.to = to;

    return this.client.get<IntradayChart[]>(
      `v3/historical-chart/${interval}/${symbol.toUpperCase()}`,
      { searchParams: params }
    );
  }

  /**
   * Get forex pair prices
   * @param pair - Forex pair (e.g., "EURUSD")
   */
  async getForexPrice(pair?: string): Promise<ForexPrice[]> {
    const endpoint = pair ? `v3/fx/${pair.toUpperCase()}` : 'v3/fx';
    return this.client.get<ForexPrice[]>(endpoint);
  }

  /**
   * Get all forex pairs
   */
  async getAllForexPrices(): Promise<ForexPrice[]> {
    return this.getForexPrice();
  }

  /**
   * Get cryptocurrency prices
   * @param symbol - Crypto symbol (e.g., "BTCUSD")
   */
  async getCryptoPrice(symbol?: string): Promise<CryptoPrice[]> {
    const endpoint = symbol
      ? `v3/quote/${symbol.toUpperCase()}`
      : 'v3/quotes/crypto';
    return this.client.get<CryptoPrice[]>(endpoint);
  }

  /**
   * Get all cryptocurrency prices
   */
  async getAllCryptoPrices(): Promise<CryptoPrice[]> {
    return this.getCryptoPrice();
  }

  /**
   * Get list of available cryptocurrencies
   */
  async getCryptoList(): Promise<CryptoList[]> {
    return this.client.get<CryptoList[]>('v3/symbol/available-cryptocurrencies');
  }

  /**
   * Get cryptocurrency quotes in short format (symbol, price, volume)
   * @param symbol - Crypto symbol (e.g., "BTCUSD")
   */
  async getCryptoQuoteShort(symbol?: string): Promise<CryptoPrice[]> {
    const endpoint = symbol
      ? `v3/quote/${symbol.toUpperCase()}`
      : 'v3/quotes/crypto';
    return this.client.get<CryptoPrice[]>(endpoint);
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
    const params: Record<string, string> = {};
    if (from) params.from = from;
    if (to) params.to = to;

    return this.client.get<LightChartData[]>(
      `v3/historical-chart/line/${symbol.toUpperCase()}`,
      { searchParams: params }
    );
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
  ): Promise<{ historical: HistoricalPrice[] }> {
    const params: Record<string, string> = {};
    if (from) params.from = from;
    if (to) params.to = to;

    return this.client.get<{ historical: HistoricalPrice[] }>(
      `v3/historical-price-full/${symbol.toUpperCase()}`,
      { searchParams: params }
    );
  }

  /**
   * Get intraday chart data for cryptocurrency (1-minute intervals)
   * @param symbol - Crypto symbol (e.g., "BTCUSD")
   * @param from - Start date (YYYY-MM-DD)
   * @param to - End date (YYYY-MM-DD)
   */
  async getCryptoIntraday1Min(
    symbol: string,
    from?: string,
    to?: string
  ): Promise<IntradayChart[]> {
    const params: Record<string, string> = {};
    if (from) params.from = from;
    if (to) params.to = to;

    return this.client.get<IntradayChart[]>(
      `v3/historical-chart/1min/${symbol.toUpperCase()}`,
      { searchParams: params }
    );
  }

  /**
   * Get intraday chart data for cryptocurrency (5-minute intervals)
   * @param symbol - Crypto symbol (e.g., "BTCUSD")
   * @param from - Start date (YYYY-MM-DD)
   * @param to - End date (YYYY-MM-DD)
   */
  async getCryptoIntraday5Min(
    symbol: string,
    from?: string,
    to?: string
  ): Promise<IntradayChart[]> {
    const params: Record<string, string> = {};
    if (from) params.from = from;
    if (to) params.to = to;

    return this.client.get<IntradayChart[]>(
      `v3/historical-chart/5min/${symbol.toUpperCase()}`,
      { searchParams: params }
    );
  }

  /**
   * Get intraday chart data for cryptocurrency (1-hour intervals)
   * @param symbol - Crypto symbol (e.g., "BTCUSD")
   * @param from - Start date (YYYY-MM-DD)
   * @param to - End date (YYYY-MM-DD)
   */
  async getCryptoIntraday1Hour(
    symbol: string,
    from?: string,
    to?: string
  ): Promise<IntradayChart[]> {
    const params: Record<string, string> = {};
    if (from) params.from = from;
    if (to) params.to = to;

    return this.client.get<IntradayChart[]>(
      `v3/historical-chart/1hour/${symbol.toUpperCase()}`,
      { searchParams: params }
    );
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
  ): Promise<{ historical: HistoricalPrice[] }> {
    const params: Record<string, string> = {};

    if (from) params.from = from;
    if (to) params.to = to;

    return this.client.get<{ historical: HistoricalPrice[] }>(
      `v3/historical-price-full/${pair.toUpperCase()}`,
      { searchParams: params }
    );
  }

  /**
   * Get list of available forex currency pairs
   */
  async getForexCurrencyPairs(): Promise<ForexCurrencyPair[]> {
    return this.client.get<ForexCurrencyPair[]>('v3/symbol/available-forex-currency-pairs');
  }

  /**
   * Get forex quote in short format (symbol, price, volume)
   * @param pair - Forex pair (e.g., "EURUSD")
   */
  async getForexQuoteShort(pair?: string): Promise<ForexQuoteShort[]> {
    const endpoint = pair ? `v3/forex/${pair.toUpperCase()}` : 'v3/forex';
    return this.client.get<ForexQuoteShort[]>(endpoint);
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
    const params: Record<string, string> = {};
    if (from) params.from = from;
    if (to) params.to = to;

    return this.client.get<LightChartData[]>(
      `v3/historical-chart/line/${pair.toUpperCase()}`,
      { searchParams: params }
    );
  }

  /**
   * Get intraday chart data for forex pairs (1-minute intervals)
   * @param pair - Forex pair (e.g., "EURUSD")
   * @param from - Start date (YYYY-MM-DD)
   * @param to - End date (YYYY-MM-DD)
   */
  async getForexIntraday1Min(
    pair: string,
    from?: string,
    to?: string
  ): Promise<IntradayChart[]> {
    const params: Record<string, string> = {};
    if (from) params.from = from;
    if (to) params.to = to;

    return this.client.get<IntradayChart[]>(
      `v3/historical-chart/1min/${pair.toUpperCase()}`,
      { searchParams: params }
    );
  }

  /**
   * Get intraday chart data for forex pairs (5-minute intervals)
   * @param pair - Forex pair (e.g., "EURUSD")
   * @param from - Start date (YYYY-MM-DD)
   * @param to - End date (YYYY-MM-DD)
   */
  async getForexIntraday5Min(
    pair: string,
    from?: string,
    to?: string
  ): Promise<IntradayChart[]> {
    const params: Record<string, string> = {};
    if (from) params.from = from;
    if (to) params.to = to;

    return this.client.get<IntradayChart[]>(
      `v3/historical-chart/5min/${pair.toUpperCase()}`,
      { searchParams: params }
    );
  }

  /**
   * Get intraday chart data for forex pairs (1-hour intervals)
   * @param pair - Forex pair (e.g., "EURUSD")
   * @param from - Start date (YYYY-MM-DD)
   * @param to - End date (YYYY-MM-DD)
   */
  async getForexIntraday1Hour(
    pair: string,
    from?: string,
    to?: string
  ): Promise<IntradayChart[]> {
    const params: Record<string, string> = {};
    if (from) params.from = from;
    if (to) params.to = to;

    return this.client.get<IntradayChart[]>(
      `v3/historical-chart/1hour/${pair.toUpperCase()}`,
      { searchParams: params }
    );
  }

  /**
   * Get market hours for a specific exchange
   * @param exchange - Exchange name (e.g., "NYSE", "NASDAQ")
   */
  async getMarketHours(exchange?: string): Promise<MarketHours> {
    const params: Record<string, string> = {};
    if (exchange) params.exchange = exchange;
    return this.client.get<MarketHours>('v3/is-the-market-open', { searchParams: params });
  }

  /**
   * Get market holidays
   */
  async getMarketHolidays(): Promise<MarketHoliday[]> {
    return this.client.get<MarketHoliday[]>('v3/market-holidays');
  }

  /**
   * Get hours for all exchanges
   */
  async getAllMarketHours(): Promise<MarketHours[]> {
    return this.client.get<MarketHours[]>('v3/market-hours');
  }

  /**
   * Get light historical chart data (lightweight price data with intervals)
   * @param interval - Time interval (e.g., '1min', '5min', '15min', '30min', '1hour', '4hour')
   * @param symbol - Stock symbol
   * @param from - Start date (YYYY-MM-DD)
   * @param to - End date (YYYY-MM-DD)
   */
  async getLightChart(
    interval: string,
    symbol: string,
    from?: string,
    to?: string
  ): Promise<LightChartData[]> {
    const params: Record<string, string> = {};
    if (from) params.from = from;
    if (to) params.to = to;

    return this.client.get<LightChartData[]>(
      `v3/historical-chart/${interval}/${symbol.toUpperCase()}`,
      { searchParams: params }
    );
  }

  /**
   * Get unadjusted historical prices (not adjusted for splits or dividends)
   * @param symbol - Stock symbol
   * @param from - Start date (YYYY-MM-DD)
   * @param to - End date (YYYY-MM-DD)
   */
  async getUnadjustedPrice(
    symbol: string,
    from?: string,
    to?: string
  ): Promise<LightChartData[]> {
    const params: Record<string, string> = {};
    if (from) params.from = from;
    if (to) params.to = to;

    return this.client.get<LightChartData[]>(
      `v3/historical-price-full/${symbol.toUpperCase()}/line`,
      { searchParams: params }
    );
  }

  /**
   * Get dividend-adjusted historical prices (adjusted for dividends only)
   * @param symbol - Stock symbol
   * @param from - Start date (YYYY-MM-DD)
   * @param to - End date (YYYY-MM-DD)
   */
  async getDividendAdjusted(
    symbol: string,
    from?: string,
    to?: string
  ): Promise<{ historical: HistoricalPrice[] }> {
    const params: Record<string, string> = {
      serietype: 'line'
    };
    if (from) params.from = from;
    if (to) params.to = to;

    return this.client.get<{ historical: HistoricalPrice[] }>(
      `v3/historical-price-full/${symbol.toUpperCase()}`,
      { searchParams: params }
    );
  }
}
