/**
 * Portfolio Tracker Example
 *
 * This example demonstrates how to build a simple portfolio tracker
 * that monitors the value and performance of your holdings.
 */

import { FMP } from '../src/index.js';

const fmp = new FMP({ apiKey: process.env.FMP_API_KEY || 'demo' });

interface Holding {
  symbol: string;
  shares: number;
  costBasis?: number; // Optional: average purchase price
}

async function trackPortfolio(holdings: Holding[]) {
  console.log('📊 Portfolio Tracker\n');
  console.log('='.repeat(80));

  try {
    // Get quotes for all holdings
    const symbols = holdings.map(h => h.symbol);
    const quotes = await fmp.company.getQuotes(symbols);

    let totalValue = 0;
    let totalCost = 0;
    let totalGainLoss = 0;
    let totalDailyChange = 0;

    console.log('\nHoldings:\n');

    for (const holding of holdings) {
      const quote = quotes.find(q => q.symbol === holding.symbol);
      if (!quote) {
        console.log(`⚠️  Could not find quote for ${holding.symbol}`);
        continue;
      }

      const currentValue = quote.price * holding.shares;
      const dailyChange = quote.change * holding.shares;
      const dailyChangePct = quote.changesPercentage;

      totalValue += currentValue;
      totalDailyChange += dailyChange;

      // Calculate total gain/loss if cost basis is provided
      let gainLoss = 0;
      let gainLossPct = 0;
      if (holding.costBasis) {
        const costValue = holding.costBasis * holding.shares;
        gainLoss = currentValue - costValue;
        gainLossPct = ((currentValue / costValue) - 1) * 100;
        totalCost += costValue;
      }

      // Display holding information
      console.log(`${holding.symbol.padEnd(8)} ${holding.shares.toString().padStart(6)} shares`);
      console.log(`  Current Price: $${quote.price.toFixed(2)}`);
      console.log(`  Market Value:  $${currentValue.toFixed(2)}`);
      console.log(`  Today's Change: ${dailyChange >= 0 ? '+' : ''}$${dailyChange.toFixed(2)} (${dailyChangePct >= 0 ? '+' : ''}${dailyChangePct.toFixed(2)}%)`);

      if (holding.costBasis) {
        const costValue = holding.costBasis * holding.shares;
        console.log(`  Cost Basis:    $${costValue.toFixed(2)} ($${holding.costBasis.toFixed(2)}/share)`);
        console.log(`  Total Gain/Loss: ${gainLoss >= 0 ? '+' : ''}$${gainLoss.toFixed(2)} (${gainLossPct >= 0 ? '+' : ''}${gainLossPct.toFixed(2)}%)`);
        totalGainLoss += gainLoss;
      }

      console.log();
    }

    // Display portfolio summary
    console.log('='.repeat(80));
    console.log('\nPortfolio Summary:\n');
    console.log(`  Total Market Value: $${totalValue.toFixed(2)}`);
    console.log(`  Today's Change:     ${totalDailyChange >= 0 ? '+' : ''}$${totalDailyChange.toFixed(2)}`);

    if (totalCost > 0) {
      const totalGainLossPct = ((totalValue / totalCost) - 1) * 100;
      console.log(`  Total Cost Basis:   $${totalCost.toFixed(2)}`);
      console.log(`  Total Gain/Loss:    ${totalGainLoss >= 0 ? '+' : ''}$${totalGainLoss.toFixed(2)} (${totalGainLossPct >= 0 ? '+' : ''}${totalGainLossPct.toFixed(2)}%)`);
    }

    console.log('\n' + '='.repeat(80));

  } catch (error) {
    console.error('Error tracking portfolio:', error);
  }
}

// Example portfolio with cost basis
const myPortfolio: Holding[] = [
  { symbol: 'AAPL', shares: 100, costBasis: 150.00 },
  { symbol: 'GOOGL', shares: 50, costBasis: 120.00 },
  { symbol: 'MSFT', shares: 75, costBasis: 300.00 },
  { symbol: 'TSLA', shares: 25, costBasis: 200.00 },
  { symbol: 'NVDA', shares: 40, costBasis: 400.00 },
];

// Run the portfolio tracker
trackPortfolio(myPortfolio);
