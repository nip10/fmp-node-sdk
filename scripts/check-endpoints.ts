#!/usr/bin/env node
/**
 * FMP SDK Endpoint Health Checker
 *
 * Calls one representative method per SDK resource and reports which endpoints
 * are accessible (subscription permissions check).
 *
 * Usage:
 *   npx tsx scripts/check-endpoints.ts --api-key YOUR_KEY [--output ./report.json]
 *   FMP_API_KEY=YOUR_KEY npx tsx scripts/check-endpoints.ts
 *
 * Exit codes:
 *   0 - all endpoints OK
 *   1 - one or more endpoints failed (see report for details)
 */

import { FMP } from '../src/fmp.js';
import { FMPAPIError } from '../src/errors/index.js';
import { Period } from '../src/types/common.js';
import { IntradayInterval } from '../src/resources/market.js';
import { TechnicalTimeframe } from '../src/resources/technical.js';
import { writeFileSync, mkdirSync } from 'fs';
import { dirname, resolve } from 'path';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type EndpointStatus =
  | 'ok'
  | 'unauthorized'      // 401
  | 'payment_required'  // 402 – not in subscription
  | 'forbidden'         // 403 – wrong subscription tier
  | 'not_found'         // 404
  | 'rate_limited'      // 429
  | 'server_error'      // 5xx
  | 'error';            // network / unknown

interface EndpointResult {
  resource: string;
  method: string;
  description: string;
  status: EndpointStatus;
  statusCode: number | null;
  durationMs: number;
  hasData: boolean;
  dataCount: number | null;
  error: string | null;
  rawData: unknown;
}

interface Report {
  timestamp: string;
  apiKeyPrefix: string;
  durationMs: number;
  summary: {
    total: number;
    ok: number;
    unauthorized: number;
    payment_required: number;
    forbidden: number;
    not_found: number;
    rate_limited: number;
    server_error: number;
    error: number;
  };
  results: EndpointResult[];
}

// ---------------------------------------------------------------------------
// Arg parsing
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);

function getArg(flag: string): string | undefined {
  const idx = args.indexOf(flag);
  return idx >= 0 ? args[idx + 1] : undefined;
}

const apiKey = getArg('--api-key') ?? process.env['FMP_API_KEY'];
const outputPath = getArg('--output') ?? `./fmp-health-${Date.now()}.json`;

if (!apiKey) {
  console.error(
    '❌  API key required.\n' +
    '    --api-key YOUR_KEY   or   FMP_API_KEY=YOUR_KEY',
  );
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

function classifyError(err: unknown): { status: EndpointStatus; statusCode: number | null; message: string } {
  if (err instanceof FMPAPIError) {
    const code = err.status ?? null;
    let status: EndpointStatus = 'error';
    if (code === 401) status = 'unauthorized';
    else if (code === 402) status = 'payment_required';
    else if (code === 403) status = 'forbidden';
    else if (code === 404) status = 'not_found';
    else if (code === 429) status = 'rate_limited';
    else if (code && code >= 500) status = 'server_error';
    return { status, statusCode: code, message: err.message };
  }
  return {
    status: 'error',
    statusCode: null,
    message: err instanceof Error ? err.message : String(err),
  };
}

async function run<T>(
  resource: string,
  method: string,
  description: string,
  call: () => Promise<T>,
): Promise<EndpointResult> {
  const start = Date.now();
  try {
    const data = await call();
    const durationMs = Date.now() - start;
    const isArray = Array.isArray(data);
    const dataCount = isArray ? (data as unknown[]).length : null;
    // Truncate raw data: first 3 items for arrays, full object otherwise
    const rawData = isArray
      ? (data as unknown[]).slice(0, 3)
      : data;
    return {
      resource,
      method,
      description,
      status: 'ok',
      statusCode: 200,
      durationMs,
      hasData: isArray ? (data as unknown[]).length > 0 : data != null,
      dataCount,
      error: null,
      rawData,
    };
  } catch (err) {
    const { status, statusCode, message } = classifyError(err);
    return {
      resource,
      method,
      description,
      status,
      statusCode,
      durationMs: Date.now() - start,
      hasData: false,
      dataCount: null,
      error: message,
      rawData: null,
    };
  }
}

// ---------------------------------------------------------------------------
// Test definitions
// Symbols used: AAPL (equity), EURUSD (forex), BTCUSD (crypto), GC=F (gold)
// Dates: recent range less likely to hit data gaps
// ---------------------------------------------------------------------------

const SYMBOL = 'AAPL';
const FOREX_PAIR = 'EURUSD';
const CRYPTO = 'BTCUSD';
const COMMODITY = 'GCUSD';
const INDEX = '^GSPC';
const FROM = '2024-01-01';
const TO = '2024-03-31';
const CIK = '0000320193'; // Apple

async function runAllChecks(fmp: FMP): Promise<EndpointResult[]> {
  const checks: Array<() => Promise<EndpointResult>> = [
    // ── company ──────────────────────────────────────────────────────────────
    () => run('company', 'getProfile', 'Company profile', () => fmp.company.getProfile(SYMBOL)),
    () => run('company', 'getQuote', 'Real-time quote', () => fmp.company.getQuote(SYMBOL)),
    () => run('company', 'getSymbolsList', 'Full symbols list', () => fmp.company.getSymbolsList()),
    () => run('company', 'getMarketCap', 'Market cap', () => fmp.company.getMarketCap(SYMBOL)),
    () => run('company', 'getExecutives', 'Key executives', () => fmp.company.getExecutives(SYMBOL)),
    () => run('company', 'getStockPeers', 'Stock peers', () => fmp.company.getStockPeers(SYMBOL)),
    () => run('company', 'getSharesFloat', 'Shares float', () => fmp.company.getSharesFloat(SYMBOL)),
    () => run('company', 'getEmployeeCount', 'Employee count', () => fmp.company.getEmployeeCount(SYMBOL)),
    () => run('company', 'getPriceChange', 'Price change', () => fmp.company.getPriceChange(SYMBOL)),

    // ── market ───────────────────────────────────────────────────────────────
    () => run('market', 'getHistoricalPrices', 'Historical OHLCV', () => fmp.market.getHistoricalPrices(SYMBOL, FROM, TO)),
    () => run('market', 'getIntradayChart', 'Intraday 1h chart', () => fmp.market.getIntradayChart(SYMBOL, IntradayInterval.OneHour, FROM, TO)),
    () => run('market', 'getForexPrice', 'Forex price', () => fmp.market.getForexPrice(FOREX_PAIR)),
    () => run('market', 'getCryptoPrice', 'Crypto price', () => fmp.market.getCryptoPrice(CRYPTO)),
    () => run('market', 'getMarketHours', 'Market hours (NYSE)', () => fmp.market.getMarketHours('NYSE')),
    () => run('market', 'getHistoricalForex', 'Historical forex', () => fmp.market.getHistoricalForex(FOREX_PAIR, FROM, TO)),
    () => run('market', 'getCryptoFullChart', 'Crypto historical', () => fmp.market.getCryptoFullChart(CRYPTO, FROM, TO)),

    // ── financials ────────────────────────────────────────────────────────────
    () => run('financials', 'getIncomeStatement', 'Income statement (annual)', () => fmp.financials.getIncomeStatement(SYMBOL, Period.Annual, 4)),
    () => run('financials', 'getBalanceSheet', 'Balance sheet (annual)', () => fmp.financials.getBalanceSheet(SYMBOL, Period.Annual, 4)),
    () => run('financials', 'getCashFlowStatement', 'Cash flow (annual)', () => fmp.financials.getCashFlowStatement(SYMBOL, Period.Annual, 4)),
    () => run('financials', 'getRatios', 'Financial ratios', () => fmp.financials.getRatios(SYMBOL, Period.Annual, 4)),
    () => run('financials', 'getKeyMetrics', 'Key metrics', () => fmp.financials.getKeyMetrics(SYMBOL, Period.Annual, 4)),
    () => run('financials', 'getFinancialScores', 'Financial scores', () => fmp.financials.getFinancialScores(SYMBOL)),
    () => run('financials', 'getEnterpriseValues', 'Enterprise value', () => fmp.financials.getEnterpriseValues(SYMBOL, Period.Annual, 4)),
    () => run('financials', 'getRevenueByProduct', 'Revenue by product', () => fmp.financials.getRevenueByProduct(SYMBOL, Period.Annual)),
    () => run('financials', 'getRevenueByGeography', 'Revenue by geography', () => fmp.financials.getRevenueByGeography(SYMBOL, Period.Annual)),
    () => run('financials', 'getOwnerEarnings', 'Owner earnings', () => fmp.financials.getOwnerEarnings(SYMBOL, 4)),
    () => run('financials', 'getLatestFinancialStatement', 'Latest financial statement', () => fmp.financials.getLatestFinancialStatement(SYMBOL)),

    // ── analyst ───────────────────────────────────────────────────────────────
    () => run('analyst', 'getPriceTargets', 'Price targets', () => fmp.analyst.getPriceTargets(SYMBOL)),
    () => run('analyst', 'getRecommendations', 'Analyst recommendations', () => fmp.analyst.getRecommendations(SYMBOL)),
    () => run('analyst', 'getEstimates', 'EPS estimates', () => fmp.analyst.getEstimates(SYMBOL, Period.Annual, 4)),
    () => run('analyst', 'getGrades', 'Stock grades', () => fmp.analyst.getGrades(SYMBOL, 10)),
    () => run('analyst', 'getPriceTargetConsensus', 'Price target consensus', () => fmp.analyst.getPriceTargetConsensus(SYMBOL)),

    // ── events ────────────────────────────────────────────────────────────────
    () => run('events', 'getEarnings', 'Earnings history', () => fmp.events.getEarnings(SYMBOL, 8)),
    () => run('events', 'getEarningsCalendar', 'Earnings calendar', () => fmp.events.getEarningsCalendar(FROM, TO)),
    () => run('events', 'getDividends', 'Dividends', () => fmp.events.getDividends(SYMBOL)),
    () => run('events', 'getSplits', 'Stock splits', () => fmp.events.getSplits(SYMBOL)),
    () => run('events', 'getIPOCalendar', 'IPO calendar', () => fmp.events.getIPOCalendar(FROM, TO)),
    () => run('events', 'getEconomicCalendar', 'Economic calendar', () => fmp.events.getEconomicCalendar(FROM, TO)),

    // ── insider ───────────────────────────────────────────────────────────────
    () => run('insider', 'getInsiderTrades', 'Insider trades', () => fmp.insider.getInsiderTrades(SYMBOL, 10)),
    () => run('insider', 'getInsiderRoster', 'Insider roster', () => fmp.insider.getInsiderRoster(SYMBOL)),
    () => run('insider', 'getInstitutionalHolders', 'Institutional holders', () => fmp.insider.getInstitutionalHolders(SYMBOL)),
    () => run('insider', 'get13F', '13F filing', () => fmp.insider.get13F(CIK)),
    () => run('insider', 'getSenateTrades', 'Senate trades', () => fmp.insider.getSenateTrades(SYMBOL)),
    () => run('insider', 'getHouseTrades', 'House trades', () => fmp.insider.getHouseTrades(SYMBOL)),

    // ── news ──────────────────────────────────────────────────────────────────
    () => run('news', 'getStockNews', 'Stock news', () => fmp.news.getStockNews(SYMBOL, 5)),
    () => run('news', 'getGeneralNews', 'General news', () => fmp.news.getGeneralNews(0)),
    () => run('news', 'getCryptoNews', 'Crypto news', () => fmp.news.getCryptoNews(0, 5)),
    () => run('news', 'getFMPArticles', 'FMP articles', () => fmp.news.getFMPArticles(0, 5)),
    () => run('news', 'getPressReleases', 'Press releases', () => fmp.news.getPressReleases(SYMBOL, 0)),
    () => run('news', 'getEarningsTranscript', 'Earnings transcript (Q4 2023)', () => fmp.news.getEarningsTranscript(SYMBOL, 2023, 4)),

    // ── sec ───────────────────────────────────────────────────────────────────
    () => run('sec', 'getFilings', 'SEC filings', () => fmp.sec.getFilings(SYMBOL, undefined, 5)),
    () => run('sec', 'getRSSFeed', 'SEC RSS feed', () => fmp.sec.getRSSFeed(undefined, FROM, TO, 10)),
    () => run('sec', 'searchCompanyBySymbol', 'SEC company search', () => fmp.sec.searchCompanyBySymbol(SYMBOL)),
    () => run('sec', 'getAllSICCodes', 'SIC codes', () => fmp.sec.getAllSICCodes()),

    // ── technical ─────────────────────────────────────────────────────────────
    () => run('technical', 'getSMA', 'SMA (20, daily)', () => fmp.technical.getSMA(SYMBOL, 20, TechnicalTimeframe.Daily)),
    () => run('technical', 'getEMA', 'EMA (20, daily)', () => fmp.technical.getEMA(SYMBOL, 20, TechnicalTimeframe.Daily)),
    () => run('technical', 'getRSI', 'RSI (14, daily)', () => fmp.technical.getRSI(SYMBOL, 14, TechnicalTimeframe.Daily)),
    () => run('technical', 'getADX', 'ADX (14, daily)', () => fmp.technical.getADX(SYMBOL, 14, TechnicalTimeframe.Daily)),

    // ── performance ───────────────────────────────────────────────────────────
    () => run('performance', 'getGainers', 'Top gainers', () => fmp.performance.getGainers()),
    () => run('performance', 'getLosers', 'Top losers', () => fmp.performance.getLosers()),
    () => run('performance', 'getMostActive', 'Most active', () => fmp.performance.getMostActive()),
    () => run('performance', 'getSectorPerformance', 'Sector performance', () => fmp.performance.getSectorPerformance()),

    // ── etf ───────────────────────────────────────────────────────────────────
    () => run('etf', 'getHoldings', 'ETF holdings (SPY)', () => fmp.etf.getHoldings('SPY')),
    () => run('etf', 'getInfo', 'ETF info (SPY)', () => fmp.etf.getInfo('SPY')),
    () => run('etf', 'getSectorWeightings', 'ETF sector weightings (SPY)', () => fmp.etf.getSectorWeightings('SPY')),
    () => run('etf', 'getETFList', 'ETF list', () => fmp.etf.getETFList()),

    // ── indexes ───────────────────────────────────────────────────────────────
    () => run('indexes', 'getSP500Constituents', 'S&P 500 constituents', () => fmp.indexes.getSP500Constituents()),
    () => run('indexes', 'getNASDAQConstituents', 'NASDAQ constituents', () => fmp.indexes.getNASDAQConstituents()),
    () => run('indexes', 'getDowJonesConstituents', 'Dow Jones constituents', () => fmp.indexes.getDowJonesConstituents()),
    () => run('indexes', 'getHistoricalPrices', 'Index historical prices', () => fmp.indexes.getHistoricalPrices(INDEX, FROM, TO)),

    // ── commodities ───────────────────────────────────────────────────────────
    () => run('commodities', 'getList', 'Commodities list', () => fmp.commodities.getList()),
    () => run('commodities', 'getAllQuotes', 'All commodity quotes', () => fmp.commodities.getAllQuotes()),
    () => run('commodities', 'getHistoricalPrices', 'Commodity historical (gold)', () => fmp.commodities.getHistoricalPrices(COMMODITY, FROM, TO)),

    // ── economics ─────────────────────────────────────────────────────────────
    () => run('economics', 'getTreasuryRates', 'Treasury rates', () => fmp.economics.getTreasuryRates(FROM, TO)),
    () => run('economics', 'getGDP', 'GDP', () => fmp.economics.getGDP(FROM, TO)),
    () => run('economics', 'getCPI', 'CPI', () => fmp.economics.getCPI(FROM, TO)),
    () => run('economics', 'getInflationRate', 'Inflation rate', () => fmp.economics.getInflationRate(FROM, TO)),
    () => run('economics', 'getFederalFundsRate', 'Fed funds rate', () => fmp.economics.getFederalFundsRate(FROM, TO)),
    () => run('economics', 'getMarketRiskPremium', 'Market risk premium', () => fmp.economics.getMarketRiskPremium()),

    // ── valuation ─────────────────────────────────────────────────────────────
    () => run('valuation', 'getDCF', 'DCF valuation', () => fmp.valuation.getDCF(SYMBOL)),
    () => run('valuation', 'getAdvancedDCF', 'Advanced DCF', () => fmp.valuation.getAdvancedDCF(SYMBOL)),
    () => run('valuation', 'getHistoricalDCF', 'Historical DCF', () => fmp.valuation.getHistoricalDCF(SYMBOL, 'annual', 4)),

    // ── esg ───────────────────────────────────────────────────────────────────
    () => run('esg', 'getESGData', 'ESG data', () => fmp.esg.getESGData(SYMBOL)),
    () => run('esg', 'getESGRatings', 'ESG ratings', () => fmp.esg.getESGRatings(SYMBOL)),
    () => run('esg', 'getESGBenchmark', 'ESG benchmark (2023)', () => fmp.esg.getESGBenchmark(2023)),

    // ── cot ───────────────────────────────────────────────────────────────────
    () => run('cot', 'getSymbols', 'COT symbols', () => fmp.cot.getSymbols()),
    () => run('cot', 'getReport', 'COT report (gold)', () => fmp.cot.getReport('GC', FROM, TO)),
    () => run('cot', 'getAnalysis', 'COT analysis (gold)', () => fmp.cot.getAnalysis('GC', FROM, TO)),

    // ── fundraisers ───────────────────────────────────────────────────────────
    () => run('fundraisers', 'getLatestCrowdfunding', 'Latest crowdfunding', () => fmp.fundraisers.getLatestCrowdfunding(0)),
    () => run('fundraisers', 'getLatestEquity', 'Latest equity offerings', () => fmp.fundraisers.getLatestEquity(0)),

    // ── search ────────────────────────────────────────────────────────────────
    () => run('search', 'searchBySymbol', 'Symbol search', () => fmp.search.searchBySymbol('AAPL', 5)),
    () => run('search', 'searchByName', 'Name search', () => fmp.search.searchByName('Apple', 5)),
    () => run('search', 'screenStocks', 'Stock screener', () => fmp.search.screenStocks({ marketCapMoreThan: 1_000_000_000, limit: 10 })),

    // ── bulk ──────────────────────────────────────────────────────────────────
    () => run('bulk', 'getAllRatings', 'Bulk ratings', () => fmp.bulk.getAllRatings()),
    () => run('bulk', 'getAllKeyMetricsTTM', 'Bulk key metrics TTM', () => fmp.bulk.getAllKeyMetricsTTM()),
    () => run('bulk', 'getBatchEODPrices', 'Batch EOD prices', () => fmp.bulk.getBatchEODPrices('2024-03-28')),
    () => run('bulk', 'getAllEarningsSurprises', 'Bulk earnings surprises', () => fmp.bulk.getAllEarningsSurprises()),
  ];

  const results: EndpointResult[] = [];

  for (const check of checks) {
    const result = await check();
    const icon =
      result.status === 'ok' ? '✅' :
      result.status === 'payment_required' ? '💳' :
      result.status === 'forbidden' ? '🔒' :
      result.status === 'not_found' ? '🔍' :
      result.status === 'rate_limited' ? '⏳' : '❌';
    const dataInfo = result.dataCount !== null ? ` (${result.dataCount} items)` : '';
    const errInfo = result.error ? ` — ${result.error.slice(0, 80)}` : '';
    console.log(`${icon}  [${result.resource}] ${result.method}${dataInfo}${errInfo}`);
    results.push(result);
  }

  return results;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

(async () => {
  console.log(`\nFMP Endpoint Health Check`);
  console.log(`API key: ${apiKey.slice(0, 4)}${'*'.repeat(Math.max(0, apiKey.length - 4))}`);
  console.log(`Started: ${new Date().toISOString()}\n`);

  const fmp = new FMP({ apiKey, retries: 0 }); // no retries for health check

  const globalStart = Date.now();
  const results = await runAllChecks(fmp);
  const totalDuration = Date.now() - globalStart;

  // Build summary
  const counts: Record<EndpointStatus, number> = {
    ok: 0, unauthorized: 0, payment_required: 0, forbidden: 0,
    not_found: 0, rate_limited: 0, server_error: 0, error: 0,
  };
  for (const r of results) counts[r.status]++;

  const report: Report = {
    timestamp: new Date().toISOString(),
    apiKeyPrefix: `${apiKey.slice(0, 4)}****`,
    durationMs: totalDuration,
    summary: {
      total: results.length,
      ok: counts.ok,
      unauthorized: counts.unauthorized,
      payment_required: counts.payment_required,
      forbidden: counts.forbidden,
      not_found: counts.not_found,
      rate_limited: counts.rate_limited,
      server_error: counts.server_error,
      error: counts.error,
    },
    results,
  };

  // Console report
  console.log('\n─────────────────────────────────────────');
  console.log('SUMMARY');
  console.log('─────────────────────────────────────────');
  console.log(`Total endpoints tested   : ${report.summary.total}`);
  console.log(`✅  OK                   : ${counts.ok}`);
  console.log(`💳  Payment required (402): ${counts.payment_required}`);
  console.log(`🔒  Forbidden (403)       : ${counts.forbidden}`);
  console.log(`🚫  Unauthorized (401)    : ${counts.unauthorized}`);
  console.log(`🔍  Not found (404)       : ${counts.not_found}`);
  console.log(`⏳  Rate limited (429)    : ${counts.rate_limited}`);
  console.log(`💥  Server error (5xx)    : ${counts.server_error}`);
  console.log(`❓  Other error           : ${counts.error}`);
  console.log(`⏱   Duration              : ${totalDuration}ms`);

  if (counts.payment_required > 0) {
    console.log('\n💳  PAYMENT REQUIRED endpoints (not in current subscription):');
    results.filter(r => r.status === 'payment_required').forEach(r => {
      console.log(`    • [${r.resource}] ${r.method}`);
    });
  }
  if (counts.forbidden > 0) {
    console.log('\n🔒  FORBIDDEN endpoints (subscription tier issue):');
    results.filter(r => r.status === 'forbidden').forEach(r => {
      console.log(`    • [${r.resource}] ${r.method}`);
    });
  }
  if (counts.unauthorized > 0) {
    console.log('\n🚫  UNAUTHORIZED endpoints (invalid API key?):');
    results.filter(r => r.status === 'unauthorized').forEach(r => {
      console.log(`    • [${r.resource}] ${r.method}`);
    });
  }
  if (counts.not_found > 0) {
    console.log('\n🔍  NOT FOUND endpoints (path change or genuinely missing):');
    results.filter(r => r.status === 'not_found').forEach(r => {
      console.log(`    • [${r.resource}] ${r.method}`);
    });
  }
  if (counts.error + counts.server_error > 0) {
    console.log('\n❌  ERRORED endpoints (unexpected — likely a script or API bug):');
    results.filter(r => r.status === 'error' || r.status === 'server_error').forEach(r => {
      console.log(`    • [${r.resource}] ${r.method}: ${r.error}`);
    });
  }

  // Write JSON report
  const outPath = resolve(outputPath);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, JSON.stringify(report, null, 2), 'utf-8');
  console.log(`\n📄  JSON report: ${outPath}\n`);

  // Exit 1 only for genuinely unexpected failures (not subscription gates)
  process.exit(counts.unauthorized + counts.error + counts.server_error > 0 ? 1 : 0);
})();
