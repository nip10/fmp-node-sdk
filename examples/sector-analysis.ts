/**
 * Sector Analysis Example
 *
 * This example demonstrates how to analyze sector performance,
 * compare sectors, and identify trends across market sectors.
 */

import { FMP } from '../src/index.js';

const fmp = new FMP({ apiKey: process.env.FMP_API_KEY || 'demo' });

async function analyzeSector(sector: string) {
  console.log(`📊 Sector Analysis: ${sector}\n`);
  console.log('='.repeat(80));

  try {
    // Get sector performance data
    const sectorPerf = await fmp.performance.getSectorPerformance();
    const targetSector = sectorPerf.find(s => s.sector === sector);

    if (!targetSector) {
      console.log(`\nSector "${sector}" not found.`);
      console.log('\nAvailable sectors:');
      sectorPerf.forEach(s => console.log(`  • ${s.sector}`));
      return;
    }

    // Display performance metrics
    console.log('\nPerformance Metrics:\n');
    console.log(`  1 Day Change:    ${targetSector.changesPercentage >= 0 ? '+' : ''}${targetSector.changesPercentage.toFixed(2)}%`);

    if (targetSector['5DayChange']) {
      console.log(`  5 Day Change:    ${targetSector['5DayChange'] >= 0 ? '+' : ''}${targetSector['5DayChange'].toFixed(2)}%`);
    }

    if (targetSector['1MonthChange']) {
      console.log(`  1 Month Change:  ${targetSector['1MonthChange'] >= 0 ? '+' : ''}${targetSector['1MonthChange'].toFixed(2)}%`);
    }

    if (targetSector['3MonthChange']) {
      console.log(`  3 Month Change:  ${targetSector['3MonthChange'] >= 0 ? '+' : ''}${targetSector['3MonthChange'].toFixed(2)}%`);
    }

    if (targetSector['6MonthChange']) {
      console.log(`  6 Month Change:  ${targetSector['6MonthChange'] >= 0 ? '+' : ''}${targetSector['6MonthChange'].toFixed(2)}%`);
    }

    if (targetSector['yearToDateChange']) {
      console.log(`  YTD Change:      ${targetSector['yearToDateChange'] >= 0 ? '+' : ''}${targetSector['yearToDateChange'].toFixed(2)}%`);
    }

    if (targetSector['1YearChange']) {
      console.log(`  1 Year Change:   ${targetSector['1YearChange'] >= 0 ? '+' : ''}${targetSector['1YearChange'].toFixed(2)}%`);
    }

    // Get sector P/E ratios
    const today = new Date().toISOString().split('T')[0];
    const sectorPE = await fmp.performance.getSectorPE(today);
    const targetPE = sectorPE.find(s => s.sector === sector);

    if (targetPE && targetPE.pe) {
      console.log('\n' + '-'.repeat(80));
      console.log('\nValuation:\n');
      console.log(`  Average P/E Ratio: ${targetPE.pe.toFixed(2)}`);
      console.log(`  Date: ${targetPE.date}`);
    }

    console.log('\n' + '='.repeat(80));

  } catch (error) {
    console.error(`Error analyzing ${sector}:`, error);
  }
}

async function compareAllSectors() {
  console.log('📊 All Sectors Performance Comparison\n');
  console.log('='.repeat(80));

  try {
    const sectorPerf = await fmp.performance.getSectorPerformance();

    // Sort by 1-day performance
    const sortedByDay = [...sectorPerf].sort((a, b) => b.changesPercentage - a.changesPercentage);

    console.log('\n1-Day Performance:\n');
    console.log('  Sector                          Change');
    console.log('  ' + '-'.repeat(60));

    for (const sector of sortedByDay) {
      const change = sector.changesPercentage >= 0 ? '+' : '';
      const emoji = sector.changesPercentage >= 0 ? '🟢' : '🔴';
      console.log(`  ${emoji} ${sector.sector.padEnd(30)} ${change}${sector.changesPercentage.toFixed(2)}%`);
    }

    // Sort by YTD performance if available
    const withYTD = sectorPerf.filter(s => s['yearToDateChange'] !== undefined);
    if (withYTD.length > 0) {
      const sortedByYTD = [...withYTD].sort((a, b) =>
        (b['yearToDateChange'] || 0) - (a['yearToDateChange'] || 0)
      );

      console.log('\n' + '-'.repeat(80));
      console.log('\nYear-to-Date Performance:\n');
      console.log('  Sector                          Change');
      console.log('  ' + '-'.repeat(60));

      for (const sector of sortedByYTD) {
        const change = (sector['yearToDateChange'] || 0) >= 0 ? '+' : '';
        const emoji = (sector['yearToDateChange'] || 0) >= 0 ? '🟢' : '🔴';
        console.log(`  ${emoji} ${sector.sector.padEnd(30)} ${change}${sector['yearToDateChange']?.toFixed(2)}%`);
      }
    }

    // Get P/E ratios for all sectors
    const today = new Date().toISOString().split('T')[0];
    const sectorPE = await fmp.performance.getSectorPE(today);

    if (sectorPE.length > 0) {
      console.log('\n' + '-'.repeat(80));
      console.log('\nSector Valuations (P/E Ratios):\n');
      console.log('  Sector                          P/E Ratio');
      console.log('  ' + '-'.repeat(60));

      const sortedByPE = [...sectorPE]
        .filter(s => s.pe !== undefined)
        .sort((a, b) => (a.pe || 0) - (b.pe || 0));

      for (const sector of sortedByPE) {
        console.log(`  ${sector.sector.padEnd(30)} ${sector.pe?.toFixed(2) || 'N/A'}`);
      }
    }

    console.log('\n' + '='.repeat(80));

  } catch (error) {
    console.error('Error comparing sectors:', error);
  }
}

async function findBestPerformingSectors(period: 'day' | 'month' | 'ytd' | 'year' = 'day') {
  console.log(`🏆 Best Performing Sectors (${period.toUpperCase()})\n`);
  console.log('='.repeat(80));

  try {
    const sectorPerf = await fmp.performance.getSectorPerformance();

    let sortKey: keyof typeof sectorPerf[0];
    let title: string;

    switch (period) {
      case 'day':
        sortKey = 'changesPercentage';
        title = '1-Day';
        break;
      case 'month':
        sortKey = '1MonthChange';
        title = '1-Month';
        break;
      case 'ytd':
        sortKey = 'yearToDateChange';
        title = 'Year-to-Date';
        break;
      case 'year':
        sortKey = '1YearChange';
        title = '1-Year';
        break;
      default:
        sortKey = 'changesPercentage';
        title = '1-Day';
    }

    const filtered = sectorPerf.filter(s => s[sortKey] !== undefined);
    const sorted = [...filtered].sort((a, b) =>
      ((b[sortKey] as number) || 0) - ((a[sortKey] as number) || 0)
    );

    console.log(`\nTop Performing Sectors (${title}):\n`);

    const top5 = sorted.slice(0, 5);
    for (let i = 0; i < top5.length; i++) {
      const sector = top5[i];
      const value = sector[sortKey] as number;
      console.log(`${i + 1}. ${sector.sector}`);
      console.log(`   Performance: ${value >= 0 ? '+' : ''}${value.toFixed(2)}%`);
      console.log();
    }

    console.log('-'.repeat(80));
    console.log(`\nWorst Performing Sectors (${title}):\n`);

    const bottom5 = sorted.slice(-5).reverse();
    for (let i = 0; i < bottom5.length; i++) {
      const sector = bottom5[i];
      const value = sector[sortKey] as number;
      console.log(`${i + 1}. ${sector.sector}`);
      console.log(`   Performance: ${value >= 0 ? '+' : ''}${value.toFixed(2)}%`);
      console.log();
    }

    console.log('='.repeat(80));

  } catch (error) {
    console.error('Error finding best performing sectors:', error);
  }
}

async function historicalSectorTrends(sector: string = 'Technology', limit: number = 30) {
  console.log(`📈 Historical Sector Performance Trends: ${sector}\n`);
  console.log('='.repeat(80));

  try {
    const historical = await fmp.performance.getHistoricalSectorPerformance(sector, limit);

    if (!historical.length) {
      console.log('\nNo historical data available.');
      return;
    }

    console.log(`\nShowing last ${Math.min(limit, historical.length)} days of ${sector} sector performance:\n`);

    const sorted = historical.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const recent = sorted.slice(0, Math.min(10, historical.length)); // Show last 10 days

    console.log('  Date          Change');
    console.log('  ' + '-'.repeat(40));

    for (const day of recent) {
      const change = day.changesPercentage >= 0 ? '+' : '';
      const emoji = day.changesPercentage >= 0 ? '🟢' : '🔴';
      console.log(`  ${day.date}  ${emoji} ${change}${day.changesPercentage.toFixed(2)}%`);
    }

    console.log();

    console.log('='.repeat(80));

  } catch (error) {
    console.error('Error fetching historical sector trends:', error);
  }
}

// Run analysis based on command-line arguments
const analysisType = process.argv[2] || 'compare';
const sector = process.argv[3] || 'Technology';

switch (analysisType.toLowerCase()) {
  case 'single':
    analyzeSector(sector);
    break;
  case 'compare':
    compareAllSectors();
    break;
  case 'best':
    findBestPerformingSectors('day');
    break;
  case 'month':
    findBestPerformingSectors('month');
    break;
  case 'ytd':
    findBestPerformingSectors('ytd');
    break;
  case 'year':
    findBestPerformingSectors('year');
    break;
  case 'historical':
    historicalSectorTrends(sector, 30);
    break;
  default:
    console.log('Usage: tsx sector-analysis.ts [single|compare|best|month|ytd|year|historical] [sector]');
}
