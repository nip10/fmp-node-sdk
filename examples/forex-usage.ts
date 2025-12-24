import { FMP } from '../src/index.js';

async function main() {
  // Initialize the SDK with your API key
  const fmp = new FMP({
    apiKey: process.env.FMP_API_KEY || 'your-api-key-here',
  });

  try {
    // Example 1: Get list of available forex currency pairs
    console.log('\n=== Available Forex Currency Pairs ===');
    const currencyPairs = await fmp.market.getForexCurrencyPairs();
    console.log(`Total available pairs: ${currencyPairs.length}`);
    console.log('First 5 pairs:');
    currencyPairs.slice(0, 5).forEach(pair => {
      console.log(`  ${pair.symbol} - ${pair.name}`);
    });

    // Example 2: Get forex quote in short format
    console.log('\n=== Forex Quote Short (EUR/USD) ===');
    const shortQuote = await fmp.market.getForexQuoteShort('EURUSD');
    console.log(`Symbol: ${shortQuote[0]?.symbol}`);
    console.log(`Price: ${shortQuote[0]?.price}`);
    console.log(`Volume: ${shortQuote[0]?.volume}`);

    // Example 3: Get all forex quotes in short format
    console.log('\n=== All Forex Quotes (Short Format) ===');
    const allShortQuotes = await fmp.market.getForexQuoteShort();
    console.log(`Total quotes: ${allShortQuotes.length}`);
    allShortQuotes.slice(0, 3).forEach(quote => {
      console.log(`${quote.symbol}: $${quote.price}`);
    });

    // Example 4: Get light historical chart (date and close only)
    console.log('\n=== Forex Light Chart (EUR/USD - Last 5 days) ===');
    const lightChart = await fmp.market.getForexLightChart('EURUSD');
    lightChart.slice(0, 5).forEach(point => {
      console.log(`${point.date}: ${point.close}`);
    });

    // Example 5: Get 1-minute intraday chart
    console.log('\n=== Forex 1-Minute Intraday (EUR/USD) ===');
    const intraday1min = await fmp.market.getForexIntraday1Min('EURUSD');
    console.log(`Data points: ${intraday1min.length}`);
    console.log('Latest 3 data points:');
    intraday1min.slice(0, 3).forEach(point => {
      console.log(`${point.date}: Open ${point.open}, High ${point.high}, Low ${point.low}, Close ${point.close}`);
    });

    // Example 6: Get 5-minute intraday chart
    console.log('\n=== Forex 5-Minute Intraday (EUR/USD) ===');
    const intraday5min = await fmp.market.getForexIntraday5Min('EURUSD');
    console.log(`Data points: ${intraday5min.length}`);
    console.log('Latest 3 data points:');
    intraday5min.slice(0, 3).forEach(point => {
      console.log(`${point.date}: Close ${point.close}, Volume ${point.volume}`);
    });

    // Example 7: Get 1-hour intraday chart
    console.log('\n=== Forex 1-Hour Intraday (EUR/USD) ===');
    const intraday1hour = await fmp.market.getForexIntraday1Hour('EURUSD');
    console.log(`Data points: ${intraday1hour.length}`);
    console.log('Latest 3 data points:');
    intraday1hour.slice(0, 3).forEach(point => {
      console.log(`${point.date}: Close ${point.close}, Volume ${point.volume}`);
    });

    // Example 8: Get intraday chart with date range
    console.log('\n=== Forex 1-Hour Intraday with Date Range ===');
    const intradayRange = await fmp.market.getForexIntraday1Hour(
      'EURUSD',
      '2024-01-01',
      '2024-01-31'
    );
    console.log(`Data points in January 2024: ${intradayRange.length}`);

    // Example 9: Compare multiple forex pairs using short quotes
    console.log('\n=== Compare Multiple Forex Pairs ===');
    const pairs = ['EURUSD', 'GBPUSD', 'USDJPY'];
    for (const pair of pairs) {
      const quote = await fmp.market.getForexQuoteShort(pair);
      console.log(`${pair}: ${quote[0]?.price}`);
    }

    // Example 10: Analyze forex volatility using light chart
    console.log('\n=== Analyze Forex Volatility (EUR/USD - Last 30 days) ===');
    const historicalData = await fmp.market.getForexLightChart('EURUSD');
    const recentData = historicalData.slice(0, 30);
    const prices = recentData.map(d => d.close);
    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    const volatility = ((maxPrice - minPrice) / avgPrice) * 100;

    console.log(`Max Price: ${maxPrice.toFixed(5)}`);
    console.log(`Min Price: ${minPrice.toFixed(5)}`);
    console.log(`Avg Price: ${avgPrice.toFixed(5)}`);
    console.log(`Volatility: ${volatility.toFixed(2)}%`);

  } catch (error) {
    console.error('Error:', error);
  }
}

main();
