/**
 * ESG (Environmental, Social, and Governance) related types
 */

/**
 * ESG data for a company
 */
export interface ESGData {
  symbol: string;
  cik: string;
  companyName: string;
  formType: string;
  filingDate: string;
  acceptanceDate: string;
  date: string;
  environmentalScore: number;
  socialScore: number;
  governanceScore: number;
  ESGScore: number;
  url: string;
}

/**
 * ESG rating for a company
 */
export interface ESGRating {
  symbol: string;
  cik: string;
  companyName: string;
  formType: string;
  filingDate: string;
  acceptanceDate: string;
  date: string;
  ESGRiskRating: string;
  industryRank: string;
  url: string;
}

/**
 * ESG sector benchmark data
 */
export interface ESGBenchmark {
  year: number;
  sector: string;
  environmentalScore: number;
  socialScore: number;
  governanceScore: number;
  ESGScore: number;
}
