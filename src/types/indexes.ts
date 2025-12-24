/**
 * Index types
 */

/**
 * Index constituent (S&P 500, NASDAQ, Dow Jones)
 */
export interface IndexConstituent {
  symbol: string;
  name: string;
  sector: string;
  subSector: string;
  headQuarter: string;
  dateFirstAdded: string;
  cik: string;
  founded: string;
}

/**
 * Historical index constituent change
 */
export interface HistoricalIndexConstituent {
  dateAdded: string;
  addedSecurity: string;
  removedTicker: string;
  removedSecurity: string;
  date: string;
  symbol: string;
  reason: string;
}
