/**
 * Financial Statement Analysis Example
 *
 * This example demonstrates how to analyze a company's financial health
 * using income statements, balance sheets, cash flow statements, and ratios.
 */

import { FMP, Period } from '../src/index.js';

const fmp = new FMP({ apiKey: process.env.FMP_API_KEY || 'demo' });

async function analyzeFinancials(symbol: string, years: number = 5) {
  console.log(`📈 Financial Analysis for ${symbol}\n`);
  console.log('='.repeat(80));

  try {
    // Fetch financial data
    console.log('\nFetching financial data...\n');

    const [income, , cashFlow, ratios] = await Promise.all([
      fmp.financials.getIncomeStatement(symbol, Period.Annual, years),
      fmp.financials.getBalanceSheet(symbol, Period.Annual, years),
      fmp.financials.getCashFlowStatement(symbol, Period.Annual, years),
      fmp.financials.getRatios(symbol, Period.Annual, years),
      fmp.financials.getKeyMetrics(symbol, Period.Annual, years),
    ]);

    if (!income.length || !ratios.length) {
      console.log(`No financial data found for ${symbol}`);
      return;
    }

    // Revenue Analysis
    console.log('Revenue Analysis:\n');
    const latestRevenue = income[0].revenue;
    const oldestRevenue = income[income.length - 1].revenue;
    const revenueCAGR = (Math.pow(latestRevenue / oldestRevenue, 1 / (years - 1)) - 1) * 100;

    console.log(`  Latest Revenue (${income[0].date}): $${(latestRevenue / 1e9).toFixed(2)}B`);
    console.log(`  ${years}-Year Revenue CAGR: ${revenueCAGR.toFixed(2)}%`);
    console.log(`  Revenue Growth (YoY): ${((income[0].revenue / income[1].revenue - 1) * 100).toFixed(2)}%`);

    // Profitability Analysis
    console.log('\n' + '-'.repeat(80));
    console.log('\nProfitability Metrics:\n');
    const grossMargin = (income[0].grossProfit / income[0].revenue) * 100;
    const operatingMargin = (income[0].operatingIncome / income[0].revenue) * 100;
    const netMargin = (income[0].netIncome / income[0].revenue) * 100;

    console.log(`  Gross Margin:      ${grossMargin.toFixed(2)}%`);
    console.log(`  Operating Margin:  ${operatingMargin.toFixed(2)}%`);
    console.log(`  Net Profit Margin: ${netMargin.toFixed(2)}%`);
    console.log(`  Return on Equity:  ${(ratios[0].returnOnEquity * 100).toFixed(2)}%`);
    console.log(`  Return on Assets:  ${(ratios[0].returnOnAssets * 100).toFixed(2)}%`);

    // Valuation Metrics
    console.log('\n' + '-'.repeat(80));
    console.log('\nValuation Metrics:\n');
    console.log(`  P/E Ratio:         ${ratios[0].priceEarningsRatio?.toFixed(2) || 'N/A'}`);
    console.log(`  P/B Ratio:         ${ratios[0].priceToBookRatio?.toFixed(2) || 'N/A'}`);
    console.log(`  P/S Ratio:         ${ratios[0].priceToSalesRatio?.toFixed(2) || 'N/A'}`);
    console.log(`  EV/EBITDA:         ${ratios[0].enterpriseValueMultiple?.toFixed(2) || 'N/A'}`);

    // Financial Health
    console.log('\n' + '-'.repeat(80));
    console.log('\nFinancial Health:\n');
    console.log(`  Current Ratio:     ${ratios[0].currentRatio.toFixed(2)}`);
    console.log(`  Quick Ratio:       ${ratios[0].quickRatio.toFixed(2)}`);
    console.log(`  Debt to Equity:    ${ratios[0].debtEquityRatio.toFixed(2)}`);
    console.log(`  Interest Coverage: ${ratios[0].interestCoverage?.toFixed(2) || 'N/A'}`);

    // Cash Flow Analysis
    console.log('\n' + '-'.repeat(80));
    console.log('\nCash Flow Analysis:\n');
    const ocf = cashFlow[0].operatingCashFlow;
    const fcf = cashFlow[0].freeCashFlow;
    const capex = cashFlow[0].capitalExpenditure;

    console.log(`  Operating Cash Flow: $${(ocf / 1e9).toFixed(2)}B`);
    console.log(`  Free Cash Flow:      $${(fcf / 1e9).toFixed(2)}B`);
    console.log(`  Capital Expenditure: $${(Math.abs(capex) / 1e9).toFixed(2)}B`);
    console.log(`  FCF Margin:          ${((fcf / income[0].revenue) * 100).toFixed(2)}%`);

    // Growth Metrics
    console.log('\n' + '-'.repeat(80));
    console.log('\nGrowth Metrics:\n');

    const epsGrowth = income.length > 1
      ? ((income[0].eps / income[1].eps - 1) * 100)
      : 0;

    console.log(`  Revenue Growth:    ${((income[0].revenue / income[1].revenue - 1) * 100).toFixed(2)}%`);
    console.log(`  EPS Growth:        ${epsGrowth.toFixed(2)}%`);
    console.log(`  EPS (TTM):         $${income[0].eps.toFixed(2)}`);

    // Display historical trend
    console.log('\n' + '-'.repeat(80));
    console.log('\nHistorical Revenue & Net Income:\n');
    console.log('  Year      Revenue        Net Income     Margin');
    console.log('  ' + '-'.repeat(60));

    for (const stmt of income.slice(0, years).reverse()) {
      const year = stmt.date.substring(0, 4);
      const revenue = (stmt.revenue / 1e9).toFixed(2);
      const netIncome = (stmt.netIncome / 1e9).toFixed(2);
      const margin = ((stmt.netIncome / stmt.revenue) * 100).toFixed(2);

      console.log(`  ${year}      $${revenue.padStart(8)}B    $${netIncome.padStart(8)}B    ${margin.padStart(6)}%`);
    }

    console.log('\n' + '='.repeat(80));

  } catch (error) {
    console.error(`Error analyzing ${symbol}:`, error);
  }
}

// Analyze multiple companies
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function compareCompanies(symbols: string[]) {
  for (const symbol of symbols) {
    await analyzeFinancials(symbol, 5);
    console.log('\n\n');
  }
}

// Run analysis
const symbolToAnalyze = process.argv[2] || 'AAPL';
analyzeFinancials(symbolToAnalyze, 5);

// Or compare multiple companies:
// compareCompanies(['AAPL', 'GOOGL', 'MSFT']);
