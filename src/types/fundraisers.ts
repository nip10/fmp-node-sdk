/**
 * Fundraising data types
 */

/**
 * Crowdfunding offering
 */
export interface Crowdfunding {
  cik: string;
  name: string;
  date: string;
  acceptedDate: string;
  company_name: string;
  amount: number;
  security_type: string;
  form_type: string;
  link: string;
}

/**
 * Equity offering
 */
export interface EquityOffering {
  cik: string;
  name: string;
  date: string;
  acceptedDate: string;
  company_name: string;
  amount: number;
  security_type: string;
  form_type: string;
  link: string;
}

/**
 * RSS feed item for crowdfunding
 */
export interface CrowdfundingRSSItem {
  cik: string;
  title: string;
  date: string;
  link: string;
}

/**
 * RSS feed item for equity offering
 */
export interface EquityOfferingRSSItem {
  cik: string;
  title: string;
  date: string;
  link: string;
}
