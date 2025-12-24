import { FMP } from '../src/index.js';

async function main() {
  // Initialize the SDK with your API key
  const fmp = new FMP({
    apiKey: process.env.FMP_API_KEY || 'your-api-key-here',
  });

  try {
    // Example 1: Get company profile
    console.log('\n=== Company Profile ===');
    const profile = await fmp.company.getProfile('AAPL');
    console.log(`Company: ${profile[0]?.companyName}`);
    console.log(`Sector: ${profile[0]?.sector}`);
    console.log(`Market Cap: $${(profile[0]?.mktCap / 1e9).toFixed(2)}B`);

    // Example 2: Get real-time quote
    console.log('\n=== Real-time Quote ===');
    const quote = await fmp.company.getQuote('AAPL');
    console.log(`Price: $${quote[0]?.price}`);
    console.log(`Change: ${quote[0]?.change} (${quote[0]?.changesPercentage}%)`);
    console.log(`Volume: ${quote[0]?.volume.toLocaleString()}`);

    // Example 3: Get multiple quotes
    console.log('\n=== Multiple Quotes ===');
    const quotes = await fmp.company.getQuotes(['AAPL', 'GOOGL', 'MSFT']);
    quotes.forEach(q => {
      console.log(`${q.symbol}: $${q.price} (${q.changesPercentage > 0 ? '+' : ''}${q.changesPercentage}%)`);
    });

    // Example 4: Search companies
    console.log('\n=== Search Results ===');
    const searchResults = await fmp.company.search('Tesla', 5);
    searchResults.forEach(result => {
      console.log(`${result.symbol} - ${result.name} (${result.exchangeShortName})`);
    });

    // Example 5: Get historical prices
    console.log('\n=== Historical Prices (Last 5 days) ===');
    const historicalData = await fmp.market.getHistoricalPrices('AAPL');
    historicalData.historical.slice(0, 5).forEach(day => {
      console.log(`${day.date}: Close $${day.close} (${day.changePercent > 0 ? '+' : ''}${day.changePercent.toFixed(2)}%)`);
    });

    // Example 6: Get forex data
    console.log('\n=== Forex - EUR/USD ===');
    const forex = await fmp.market.getForexPrice('EURUSD');
    console.log(`Bid: ${forex[0]?.bid}`);
    console.log(`Ask: ${forex[0]?.ask}`);
    console.log(`Change: ${forex[0]?.changes}`);

    // Example 7: Get crypto data
    console.log('\n=== Cryptocurrency - BTC ===');
    const crypto = await fmp.market.getCryptoPrice('BTCUSD');
    console.log(`Price: $${crypto[0]?.price}`);
    console.log(`24h Change: ${crypto[0]?.changesPercentage}%`);
    console.log(`Market Cap: $${(crypto[0]?.marketCap / 1e9).toFixed(2)}B`);

  } catch (error) {
    console.error('Error:', error);
  }
}

main();
