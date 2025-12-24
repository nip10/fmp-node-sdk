import { describe, it, expect } from 'vitest';
import { FMP, FMPAPIError } from '../src/index.js';

describe('FMP SDK', () => {
  describe('Initialization', () => {
    it('should create an instance with valid API key', () => {
      const fmp = new FMP({ apiKey: 'test-key' });
      expect(fmp).toBeDefined();
      expect(fmp.company).toBeDefined();
      expect(fmp.market).toBeDefined();
    });

    it('should throw error with empty API key', () => {
      expect(() => new FMP({ apiKey: '' })).toThrow(FMPAPIError);
    });

    it('should throw error with missing API key', () => {
      expect(() => new FMP({ apiKey: '' })).toThrow('API key is required');
    });

    it('should accept custom baseUrl', () => {
      const customUrl = 'https://custom.api.com';
      const fmp = new FMP({ apiKey: 'test-key', baseUrl: customUrl });
      expect(fmp).toBeDefined();
    });

    it('should accept custom timeout', () => {
      const fmp = new FMP({ apiKey: 'test-key', timeout: 60000 });
      expect(fmp).toBeDefined();
    });

    it('should accept custom retries', () => {
      const fmp = new FMP({ apiKey: 'test-key', retries: 5 });
      expect(fmp).toBeDefined();
    });
  });

  describe('Resources', () => {
    it('should have company resource', () => {
      const fmp = new FMP({ apiKey: 'test-key' });
      expect(fmp.company).toBeDefined();
      expect(typeof fmp.company.getProfile).toBe('function');
      expect(typeof fmp.company.getQuote).toBe('function');
      expect(typeof fmp.company.getSymbolsList).toBe('function');
      expect(typeof fmp.company.search).toBe('function');
    });

    it('should have market resource', () => {
      const fmp = new FMP({ apiKey: 'test-key' });
      expect(fmp.market).toBeDefined();
      expect(typeof fmp.market.getHistoricalPrices).toBe('function');
      expect(typeof fmp.market.getIntradayChart).toBe('function');
      expect(typeof fmp.market.getForexPrice).toBe('function');
      expect(typeof fmp.market.getCryptoPrice).toBe('function');
      expect(typeof fmp.market.getForexCurrencyPairs).toBe('function');
      expect(typeof fmp.market.getForexQuoteShort).toBe('function');
      expect(typeof fmp.market.getForexLightChart).toBe('function');
      expect(typeof fmp.market.getForexIntraday1Min).toBe('function');
      expect(typeof fmp.market.getForexIntraday5Min).toBe('function');
      expect(typeof fmp.market.getForexIntraday1Hour).toBe('function');
    });

    it('should have financials resource', () => {
      const fmp = new FMP({ apiKey: 'test-key' });
      expect(fmp.financials).toBeDefined();
      expect(typeof fmp.financials.getIncomeStatement).toBe('function');
      expect(typeof fmp.financials.getBalanceSheet).toBe('function');
      expect(typeof fmp.financials.getCashFlowStatement).toBe('function');
      expect(typeof fmp.financials.getRatios).toBe('function');
      expect(typeof fmp.financials.getKeyMetrics).toBe('function');
    });

    it('should have analyst resource', () => {
      const fmp = new FMP({ apiKey: 'test-key' });
      expect(fmp.analyst).toBeDefined();
      expect(typeof fmp.analyst.getEstimates).toBe('function');
      expect(typeof fmp.analyst.getPriceTargets).toBe('function');
      expect(typeof fmp.analyst.getRecommendations).toBe('function');
      expect(typeof fmp.analyst.getGrades).toBe('function');
    });

    it('should have events resource', () => {
      const fmp = new FMP({ apiKey: 'test-key' });
      expect(fmp.events).toBeDefined();
      expect(typeof fmp.events.getEarnings).toBe('function');
      expect(typeof fmp.events.getDividends).toBe('function');
      expect(typeof fmp.events.getSplits).toBe('function');
      expect(typeof fmp.events.getIPOCalendar).toBe('function');
      expect(typeof fmp.events.getEconomicCalendar).toBe('function');
    });

    it('should have insider resource', () => {
      const fmp = new FMP({ apiKey: 'test-key' });
      expect(fmp.insider).toBeDefined();
      expect(typeof fmp.insider.getInsiderTrades).toBe('function');
      expect(typeof fmp.insider.getInstitutionalHolders).toBe('function');
      expect(typeof fmp.insider.get13F).toBe('function');
      expect(typeof fmp.insider.getSenateTrades).toBe('function');
    });

    it('should have news resource', () => {
      const fmp = new FMP({ apiKey: 'test-key' });
      expect(fmp.news).toBeDefined();
      expect(typeof fmp.news.getStockNews).toBe('function');
      expect(typeof fmp.news.getPressReleases).toBe('function');
      expect(typeof fmp.news.getEarningsTranscript).toBe('function');
    });

    it('should have SEC resource', () => {
      const fmp = new FMP({ apiKey: 'test-key' });
      expect(fmp.sec).toBeDefined();
      expect(typeof fmp.sec.getFilings).toBe('function');
      expect(typeof fmp.sec.getRSSFeed).toBe('function');
      expect(typeof fmp.sec.get8KFilings).toBe('function');
    });

    it('should have technical resource', () => {
      const fmp = new FMP({ apiKey: 'test-key' });
      expect(fmp.technical).toBeDefined();
      expect(typeof fmp.technical.getSMA).toBe('function');
      expect(typeof fmp.technical.getEMA).toBe('function');
      expect(typeof fmp.technical.getRSI).toBe('function');
      expect(typeof fmp.technical.getADX).toBe('function');
    });

    it('should have performance resource', () => {
      const fmp = new FMP({ apiKey: 'test-key' });
      expect(fmp.performance).toBeDefined();
      expect(typeof fmp.performance.getGainers).toBe('function');
      expect(typeof fmp.performance.getLosers).toBe('function');
      expect(typeof fmp.performance.getMostActive).toBe('function');
      expect(typeof fmp.performance.getSectorPerformance).toBe('function');
    });

    it('should have etf resource', () => {
      const fmp = new FMP({ apiKey: 'test-key' });
      expect(fmp.etf).toBeDefined();
      expect(typeof fmp.etf.getHoldings).toBe('function');
      expect(typeof fmp.etf.getInfo).toBe('function');
      expect(typeof fmp.etf.getSectorWeightings).toBe('function');
      expect(typeof fmp.etf.getStockExposure).toBe('function');
    });

    it('should have indexes resource', () => {
      const fmp = new FMP({ apiKey: 'test-key' });
      expect(fmp.indexes).toBeDefined();
      expect(typeof fmp.indexes.getSP500Constituents).toBe('function');
      expect(typeof fmp.indexes.getNASDAQConstituents).toBe('function');
      expect(typeof fmp.indexes.getDowJonesConstituents).toBe('function');
      expect(typeof fmp.indexes.getQuote).toBe('function');
    });

    it('should have commodities resource', () => {
      const fmp = new FMP({ apiKey: 'test-key' });
      expect(fmp.commodities).toBeDefined();
      expect(typeof fmp.commodities.getList).toBe('function');
      expect(typeof fmp.commodities.getQuote).toBe('function');
      expect(typeof fmp.commodities.getAllQuotes).toBe('function');
      expect(typeof fmp.commodities.getHistoricalPrices).toBe('function');
    });

    it('should have economics resource', () => {
      const fmp = new FMP({ apiKey: 'test-key' });
      expect(fmp.economics).toBeDefined();
      expect(typeof fmp.economics.getTreasuryRates).toBe('function');
      expect(typeof fmp.economics.getIndicator).toBe('function');
      expect(typeof fmp.economics.getGDP).toBe('function');
      expect(typeof fmp.economics.getMarketRiskPremium).toBe('function');
    });

    it('should have valuation resource', () => {
      const fmp = new FMP({ apiKey: 'test-key' });
      expect(fmp.valuation).toBeDefined();
      expect(typeof fmp.valuation.getDCF).toBe('function');
      expect(typeof fmp.valuation.getLeveredDCF).toBe('function');
      expect(typeof fmp.valuation.getAdvancedDCF).toBe('function');
      expect(typeof fmp.valuation.getHistoricalDailyDCF).toBe('function');
      expect(typeof fmp.valuation.getHistoricalDCF).toBe('function');
    });
  });
});
