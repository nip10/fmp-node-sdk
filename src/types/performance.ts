/**
 * Market performance types
 */

/**
 * Stock gainer/loser/most active
 */
export interface StockMover {
  symbol: string;
  name: string;
  change: number;
  price: number;
  changesPercentage: number;
}

/**
 * Sector performance
 */
export interface SectorPerformance {
  sector: string;
  changesPercentage: number;
  '5DayChange'?: number;
  '1MonthChange'?: number;
  '3MonthChange'?: number;
  '6MonthChange'?: number;
  'yearToDateChange'?: number;
  '1YearChange'?: number;
}

/**
 * Sector PE ratio
 */
export interface SectorPE {
  date: string;
  sector: string;
  pe: number;
}

/**
 * Historical sector performance
 */
export interface HistoricalSectorPerformance {
  date: string;
  sector: string;
  changesPercentage: number;
}
