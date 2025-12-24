/**
 * Market Screener Example
 *
 * This example demonstrates how to use the stock screener to find stocks
 * that match specific criteria such as market cap, sector, volume, etc.
 */

import { FMP } from '../src/index.js';
import type { StockScreenerParams } from '../src/types/index.js';

const fmp = new FMP({ apiKey: process.env.FMP_API_KEY || 'demo' });

async function screenGrowthStocks() {
  console.log('📈 Growth Stock Screener\n');
  console.log('='.repeat(80));
  console.log('\nCriteria:');
  console.log('  • Market Cap > $10B');
  console.log('  • Volume > 1M shares/day');
  console.log('  • Beta > 1.2 (higher volatility)');
  console.log('  • Sector: Technology');
  console.log('  • Exchange: NASDAQ\n');
  console.log('-'.repeat(80));

  try {
    const criteria: StockScreenerParams = {
      marketCapMoreThan: 10000000000,  // $10B+
      volumeMoreThan: 1000000,          // 1M+ daily volume
      betaMoreThan: 1.2,                // High beta
      sector: 'Technology',
      exchange: 'NASDAQ',
      limit: 20
    };

    const results = await fmp.search.screenStocks(criteria);

    console.log(`\nFound ${results.length} growth stocks:\n`);

    for (const stock of results) {
      console.log(`${stock.symbol.padEnd(8)} ${stock.companyName}`);
      console.log(`  Market Cap: $${(stock.marketCap / 1e9).toFixed(2)}B`);
      console.log(`  Beta:       ${stock.beta?.toFixed(2) || 'N/A'}`);
      console.log(`  Volume:     ${(stock.volume / 1e6).toFixed(2)}M`);
      console.log(`  Price:      $${stock.price?.toFixed(2) || 'N/A'}`);
      console.log();
    }

    console.log('='.repeat(80));

  } catch (error) {
    console.error('Error screening stocks:', error);
  }
}

async function screenValueStocks() {
  console.log('💰 Value Stock Screener\n');
  console.log('='.repeat(80));
  console.log('\nCriteria:');
  console.log('  • Market Cap > $1B');
  console.log('  • P/E Ratio < 15');
  console.log('  • Dividend Yield > 2%');
  console.log('  • Volume > 500K shares/day\n');
  console.log('-'.repeat(80));

  try {
    const criteria: StockScreenerParams = {
      marketCapMoreThan: 1000000000,   // $1B+
      priceMoreThan: 5,                 // Avoid penny stocks
      volumeMoreThan: 500000,           // 500K+ volume
      betaLowerThan: 1.5,               // Lower volatility
      dividendMoreThan: 0.02,           // 2%+ dividend
      limit: 20
    };

    const results = await fmp.search.screenStocks(criteria);

    console.log(`\nFound ${results.length} value stocks:\n`);

    for (const stock of results) {
      console.log(`${stock.symbol.padEnd(8)} ${stock.companyName}`);
      console.log(`  Market Cap:      $${(stock.marketCap / 1e9).toFixed(2)}B`);
      console.log(`  Price:           $${stock.price?.toFixed(2) || 'N/A'}`);
      console.log(`  Beta:            ${stock.beta?.toFixed(2) || 'N/A'}`);
      console.log(`  Dividend Yield:  ${stock.lastAnnualDividend ? (stock.lastAnnualDividend * 100).toFixed(2) + '%' : 'N/A'}`);
      console.log();
    }

    console.log('='.repeat(80));

  } catch (error) {
    console.error('Error screening stocks:', error);
  }
}

async function screenMomentumStocks() {
  console.log('🚀 Momentum Stock Screener\n');
  console.log('='.repeat(80));
  console.log('\nCriteria:');
  console.log('  • Market Cap > $5B');
  console.log('  • Volume > 2M shares/day');
  console.log('  • Active trading (high liquidity)\n');
  console.log('-'.repeat(80));

  try {
    const criteria: StockScreenerParams = {
      marketCapMoreThan: 5000000000,   // $5B+
      volumeMoreThan: 2000000,          // 2M+ volume
      priceMoreThan: 10,                // Avoid low-priced stocks
      isActivelyTrading: true,
      limit: 20
    };

    const results = await fmp.search.screenStocks(criteria);

    console.log(`\nFound ${results.length} momentum stocks:\n`);

    for (const stock of results) {
      console.log(`${stock.symbol.padEnd(8)} ${stock.companyName}`);
      console.log(`  Market Cap: $${(stock.marketCap / 1e9).toFixed(2)}B`);
      console.log(`  Price:      $${stock.price?.toFixed(2) || 'N/A'}`);
      console.log(`  Volume:     ${(stock.volume / 1e6).toFixed(2)}M`);
      console.log(`  Exchange:   ${stock.exchangeShortName || 'N/A'}`);
      console.log();
    }

    console.log('='.repeat(80));

  } catch (error) {
    console.error('Error screening stocks:', error);
  }
}

async function screenBySector(sector: string) {
  console.log(`🏢 ${sector} Sector Screener\n`);
  console.log('='.repeat(80));

  try {
    const criteria: StockScreenerParams = {
      sector,
      marketCapMoreThan: 1000000000,   // $1B+
      volumeMoreThan: 100000,           // 100K+ volume
      isActivelyTrading: true,
      limit: 30
    };

    const results = await fmp.search.screenStocks(criteria);

    console.log(`\nFound ${results.length} stocks in ${sector} sector:\n`);

    // Group by industry
    const byIndustry = results.reduce((acc, stock) => {
      const industry = stock.industry || 'Other';
      if (!acc[industry]) acc[industry] = [];
      acc[industry].push(stock);
      return acc;
    }, {} as Record<string, typeof results>);

    for (const [industry, stocks] of Object.entries(byIndustry)) {
      console.log(`\n${industry} (${stocks.length} stocks):`);
      console.log('-'.repeat(60));

      for (const stock of stocks.slice(0, 10)) { // Show top 10 per industry
        console.log(`  ${stock.symbol.padEnd(8)} ${stock.companyName}`);
        console.log(`    Market Cap: $${(stock.marketCap / 1e9).toFixed(2)}B`);
      }
    }

    console.log('\n' + '='.repeat(80));

  } catch (error) {
    console.error('Error screening stocks:', error);
  }
}

async function customScreen() {
  console.log('🎯 Custom Stock Screener\n');
  console.log('='.repeat(80));

  // Build your own custom criteria
  const criteria: StockScreenerParams = {
    marketCapMoreThan: 50000000000,   // $50B+ (large cap)
    marketCapLowerThan: 200000000000, // Under $200B
    volumeMoreThan: 5000000,           // 5M+ volume
    priceMoreThan: 50,                 // $50+ stock price
    betaMoreThan: 0.8,
    betaLowerThan: 1.5,                // Moderate volatility
    sector: 'Technology',
    exchange: 'NASDAQ',
    isActivelyTrading: true,
    limit: 50
  };

  console.log('\nCustom Criteria:');
  console.log(`  • Market Cap: $${(criteria.marketCapMoreThan! / 1e9).toFixed(0)}B - $${(criteria.marketCapLowerThan! / 1e9).toFixed(0)}B`);
  console.log(`  • Price: > $${criteria.priceMoreThan}`);
  console.log(`  • Volume: > ${(criteria.volumeMoreThan! / 1e6).toFixed(0)}M`);
  console.log(`  • Beta: ${criteria.betaMoreThan} - ${criteria.betaLowerThan}`);
  console.log(`  • Sector: ${criteria.sector}`);
  console.log(`  • Exchange: ${criteria.exchange}\n`);
  console.log('-'.repeat(80));

  try {
    const results = await fmp.search.screenStocks(criteria);

    console.log(`\nFound ${results.length} stocks matching criteria:\n`);

    for (const stock of results) {
      console.log(`${stock.symbol.padEnd(8)} ${stock.companyName}`);
      console.log(`  Market Cap: $${(stock.marketCap / 1e9).toFixed(2)}B`);
      console.log(`  Price:      $${stock.price?.toFixed(2) || 'N/A'}`);
      console.log(`  Beta:       ${stock.beta?.toFixed(2) || 'N/A'}`);
      console.log(`  Volume:     ${(stock.volume / 1e6).toFixed(2)}M`);
      console.log();
    }

    console.log('='.repeat(80));

  } catch (error) {
    console.error('Error with custom screen:', error);
  }
}

// Run different screening strategies
async function runAllScreens() {
  await screenGrowthStocks();
  console.log('\n\n');

  await screenValueStocks();
  console.log('\n\n');

  await screenMomentumStocks();
  console.log('\n\n');

  await screenBySector('Technology');
  console.log('\n\n');

  await customScreen();
}

// Run based on command-line argument
const screenType = process.argv[2] || 'growth';

switch (screenType.toLowerCase()) {
  case 'growth':
    screenGrowthStocks();
    break;
  case 'value':
    screenValueStocks();
    break;
  case 'momentum':
    screenMomentumStocks();
    break;
  case 'sector':
    screenBySector(process.argv[3] || 'Technology');
    break;
  case 'custom':
    customScreen();
    break;
  case 'all':
    runAllScreens();
    break;
  default:
    console.log('Usage: tsx market-screener.ts [growth|value|momentum|sector|custom|all]');
}
