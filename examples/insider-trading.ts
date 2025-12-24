/**
 * Insider Trading Monitor Example
 *
 * This example demonstrates how to monitor insider trading activity
 * and identify significant buying or selling by company insiders.
 */

import { FMP } from '../src/index.js';

const fmp = new FMP({ apiKey: process.env.FMP_API_KEY || 'demo' });

async function checkInsiderActivity(symbol: string, days: number = 30) {
  console.log(`🔍 Insider Trading Activity for ${symbol}\n`);
  console.log('='.repeat(80));

  try {
    // Get recent insider trades
    const trades = await fmp.insider.getInsiderTrades(symbol, 100);

    if (!trades.length) {
      console.log(`\nNo insider trading data found for ${symbol}`);
      return;
    }

    // Filter for trades in the specified time period
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const recentTrades = trades.filter(trade =>
      new Date(trade.filingDate) > cutoffDate
    );

    if (!recentTrades.length) {
      console.log(`\nNo insider trades in the last ${days} days for ${symbol}`);
      return;
    }

    // Separate purchases and sales
    const purchases = recentTrades.filter(t => t.transactionType.includes('Purchase'));
    const sales = recentTrades.filter(t => t.transactionType.includes('Sale'));

    console.log(`\nFound ${recentTrades.length} insider trades in the last ${days} days\n`);

    // Display summary
    if (purchases.length > 0) {
      console.log(`🟢 Purchases: ${purchases.length}`);
      const totalShares = purchases.reduce((sum, t) => sum + (t.securitiesTransacted || 0), 0);
      const avgPrice = purchases.reduce((sum, t) => sum + (t.price || 0), 0) / purchases.length;

      console.log(`   Total Shares Purchased: ${totalShares.toLocaleString()}`);
      console.log(`   Average Purchase Price: $${avgPrice.toFixed(2)}`);
      console.log();
    }

    if (sales.length > 0) {
      console.log(`🔴 Sales: ${sales.length}`);
      const totalShares = sales.reduce((sum, t) => sum + (t.securitiesTransacted || 0), 0);
      const avgPrice = sales.reduce((sum, t) => sum + (t.price || 0), 0) / sales.length;

      console.log(`   Total Shares Sold: ${totalShares.toLocaleString()}`);
      console.log(`   Average Sale Price: $${avgPrice.toFixed(2)}`);
      console.log();
    }

    // Display significant purchases (top 5)
    if (purchases.length > 0) {
      console.log('-'.repeat(80));
      console.log('\n📊 Top 5 Insider Purchases:\n');

      const topPurchases = purchases
        .sort((a, b) => (b.securitiesTransacted * b.price) - (a.securitiesTransacted * a.price))
        .slice(0, 5);

      for (const trade of topPurchases) {
        const value = trade.securitiesTransacted * trade.price;
        console.log(`  ${trade.reportingName}`);
        console.log(`    Date:   ${trade.filingDate}`);
        console.log(`    Owner:  ${trade.typeOfOwner || 'N/A'}`);
        console.log(`    Shares: ${trade.securitiesTransacted.toLocaleString()} @ $${trade.price.toFixed(2)}`);
        console.log(`    Value:  $${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
        console.log();
      }
    }

    // Display significant sales (top 5)
    if (sales.length > 0) {
      console.log('-'.repeat(80));
      console.log('\n📊 Top 5 Insider Sales:\n');

      const topSales = sales
        .sort((a, b) => (b.securitiesTransacted * b.price) - (a.securitiesTransacted * a.price))
        .slice(0, 5);

      for (const trade of topSales) {
        const value = trade.securitiesTransacted * trade.price;
        console.log(`  ${trade.reportingName}`);
        console.log(`    Date:   ${trade.filingDate}`);
        console.log(`    Owner:  ${trade.typeOfOwner || 'N/A'}`);
        console.log(`    Shares: ${trade.securitiesTransacted.toLocaleString()} @ $${trade.price.toFixed(2)}`);
        console.log(`    Value:  $${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
        console.log();
      }
    }

    // Analyze sentiment
    console.log('-'.repeat(80));
    console.log('\n💡 Insider Sentiment Analysis:\n');

    const purchaseValue = purchases.reduce((sum, t) => sum + (t.securitiesTransacted * t.price), 0);
    const saleValue = sales.reduce((sum, t) => sum + (t.securitiesTransacted * t.price), 0);
    const netValue = purchaseValue - saleValue;

    console.log(`  Purchase Value: $${purchaseValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
    console.log(`  Sale Value:     $${saleValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
    console.log(`  Net Value:      ${netValue >= 0 ? '+' : ''}$${netValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);

    let sentiment = 'Neutral';
    if (netValue > 0 && purchaseValue > saleValue * 2) {
      sentiment = '🟢 Bullish - Strong buying activity';
    } else if (netValue > 0) {
      sentiment = '🟢 Moderately Bullish - More buying than selling';
    } else if (netValue < 0 && saleValue > purchaseValue * 2) {
      sentiment = '🔴 Bearish - Strong selling activity';
    } else if (netValue < 0) {
      sentiment = '🔴 Moderately Bearish - More selling than buying';
    }

    console.log(`\n  Sentiment: ${sentiment}`);

    console.log('\n' + '='.repeat(80));

  } catch (error) {
    console.error('Error checking insider activity:', error);
  }
}

// Monitor multiple symbols
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function monitorMultipleStocks(symbols: string[], days: number = 30) {
  console.log(`🔍 Monitoring Insider Trading for ${symbols.length} Stocks\n`);

  for (const symbol of symbols) {
    await checkInsiderActivity(symbol, days);
    console.log('\n\n');
  }
}

// Run the monitor
const symbolToMonitor = process.argv[2] || 'AAPL';
const daysToMonitor = parseInt(process.argv[3] || '30');

checkInsiderActivity(symbolToMonitor, daysToMonitor);

// Or monitor multiple stocks:
// monitorMultipleStocks(['AAPL', 'GOOGL', 'MSFT', 'TSLA'], 30);
