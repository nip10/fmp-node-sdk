/**
 * Insider trading types
 */

/**
 * Insider trading transaction
 */
export interface InsiderTrade {
  symbol: string;
  filingDate: string;
  transactionDate: string;
  reportingCik: string;
  transactionType: string;
  securitiesOwned: number;
  companyCik: string;
  reportingName: string;
  typeOfOwner: string;
  acquistionOrDisposition: string;
  formType: string;
  securitiesTransacted: number;
  price: number;
  securityName: string;
  link: string;
}

/**
 * Insider trading statistics
 */
export interface InsiderTradingStatistics {
  symbol: string;
  cik: string;
  year: number;
  quarter: number;
  purchases: number;
  sales: number;
  pPurchases: number;
  sSales: number;
}

/**
 * Insider roster
 */
export interface InsiderRoster {
  symbol: string;
  name: string;
  title: string;
  cik: string;
}

/**
 * Institutional ownership holder
 */
export interface InstitutionalHolder {
  holder: string;
  cik: string;
  shares: number;
  dateReported: string;
  change: number;
}

/**
 * Form 13F filing
 */
export interface Form13F {
  fillingDate: string;
  acceptedDate: string;
  cik: string;
  cusip: string;
  tickercusip: string;
  nameOfIssuer: string;
  shares: number;
  titleOfClass: string;
  value: number;
  link: string;
  finalLink: string;
}

/**
 * Congressional trading
 */
export interface CongressionalTrade {
  firstName: string;
  lastName: string;
  office: string;
  link: string;
  dateRecieved: string;
  transactionDate: string;
  owner: string;
  assetDescription: string;
  assetType: string;
  type: string;
  amount: string;
  representative: string;
  district: string;
  ptr_link: string;
  cap_gains_over_200_usd: boolean;
  symbol: string;
}

/**
 * Form 13F portfolio date
 */
export interface Form13FPortfolioDate {
  cik: string;
  date: string;
}

/**
 * Form 13F with analytics
 */
export interface Form13FWithAnalytics {
  date: string;
  fillingDate: string;
  acceptedDate: string;
  cik: string;
  cusip: string;
  tickercusip: string;
  nameOfIssuer: string;
  shares: number;
  titleOfClass: string;
  value: number;
  change?: number;
  changeP?: number;
  link: string;
  finalLink: string;
}

/**
 * Portfolio holdings summary
 */
export interface PortfolioHoldingsSummary {
  cik: string;
  date: string;
  symbol?: string;
  name?: string;
  shares: number;
  value: number;
  weightPercentage?: number;
}

/**
 * Industry portfolio holdings summary
 */
export interface IndustryPortfolioHoldingsSummary {
  cik: string;
  date: string;
  industry: string;
  totalValue: number;
  totalShares: number;
  numberOfHoldings: number;
  weightPercentage?: number;
}

/**
 * Symbol ownership position
 */
export interface SymbolOwnership {
  symbol: string;
  cik: string;
  name: string;
  date: string;
  shares: number;
  value: number;
  change?: number;
  changeP?: number;
  weightPercentage?: number;
}

/**
 * Industry institutional ownership summary
 */
export interface IndustryInstitutionalOwnership {
  symbol: string;
  industry: string;
  numberOfInstitutions: number;
  totalShares: number;
  totalValue: number;
  percentageOwned: number;
  date: string;
}

/**
 * Form 4 ownership filing data
 */
export interface Form4Ownership {
  symbol: string;
  filingDate: string;
  transactionDate: string;
  reportingCik: string;
  reportingName: string;
  typeOfOwner: string;
  acquistionOrDisposition: string;
  formType: string;
  securitiesOwned: number | null;
  securitiesTransacted: number | null;
  transactionType: string;
  price: number | null;
  securityName: string;
  companyCik: string;
  link: string;
}
