/**
 * Financial statements types
 */

/**
 * Income statement data
 */
export interface IncomeStatement {
  date: string;
  symbol: string;
  reportedCurrency: string;
  cik: string | null;
  fillingDate: string;
  acceptedDate: string;
  calendarYear: string;
  period: string;
  revenue: number | null;
  costOfRevenue: number | null;
  grossProfit: number | null;
  grossProfitRatio: number | null;
  researchAndDevelopmentExpenses: number | null;
  generalAndAdministrativeExpenses: number | null;
  sellingAndMarketingExpenses: number | null;
  sellingGeneralAndAdministrativeExpenses: number | null;
  otherExpenses: number | null;
  operatingExpenses: number | null;
  costAndExpenses: number | null;
  interestIncome: number | null;
  interestExpense: number | null;
  depreciationAndAmortization: number | null;
  ebitda: number | null;
  ebitdaratio: number | null;
  operatingIncome: number | null;
  operatingIncomeRatio: number | null;
  totalOtherIncomeExpensesNet: number | null;
  incomeBeforeTax: number | null;
  incomeBeforeTaxRatio: number | null;
  incomeTaxExpense: number | null;
  netIncome: number | null;
  netIncomeRatio: number | null;
  eps: number | null;
  epsdiluted: number | null;
  weightedAverageShsOut: number | null;
  weightedAverageShsOutDil: number | null;
  link: string | null;
  finalLink: string | null;
}

/**
 * Balance sheet data
 */
export interface BalanceSheet {
  date: string;
  symbol: string;
  reportedCurrency: string;
  cik: string | null;
  fillingDate: string;
  acceptedDate: string;
  calendarYear: string;
  period: string;
  cashAndCashEquivalents: number | null;
  shortTermInvestments: number | null;
  cashAndShortTermInvestments: number | null;
  netReceivables: number | null;
  inventory: number | null;
  otherCurrentAssets: number | null;
  totalCurrentAssets: number | null;
  propertyPlantEquipmentNet: number | null;
  goodwill: number | null;
  intangibleAssets: number | null;
  goodwillAndIntangibleAssets: number | null;
  longTermInvestments: number | null;
  taxAssets: number | null;
  otherNonCurrentAssets: number | null;
  totalNonCurrentAssets: number | null;
  otherAssets: number | null;
  totalAssets: number | null;
  accountPayables: number | null;
  shortTermDebt: number | null;
  taxPayables: number | null;
  deferredRevenue: number | null;
  otherCurrentLiabilities: number | null;
  totalCurrentLiabilities: number | null;
  longTermDebt: number | null;
  deferredRevenueNonCurrent: number | null;
  deferredTaxLiabilitiesNonCurrent: number | null;
  otherNonCurrentLiabilities: number | null;
  totalNonCurrentLiabilities: number | null;
  otherLiabilities: number | null;
  capitalLeaseObligations: number | null;
  totalLiabilities: number | null;
  preferredStock: number | null;
  commonStock: number | null;
  retainedEarnings: number | null;
  accumulatedOtherComprehensiveIncomeLoss: number | null;
  othertotalStockholdersEquity: number | null;
  totalStockholdersEquity: number | null;
  totalEquity: number | null;
  totalLiabilitiesAndStockholdersEquity: number | null;
  minorityInterest: number | null;
  totalLiabilitiesAndTotalEquity: number | null;
  totalInvestments: number | null;
  totalDebt: number | null;
  netDebt: number | null;
  link: string | null;
  finalLink: string | null;
}

/**
 * Cash flow statement data
 */
export interface CashFlowStatement {
  date: string;
  symbol: string;
  reportedCurrency: string;
  cik: string | null;
  fillingDate: string;
  acceptedDate: string;
  calendarYear: string;
  period: string;
  netIncome: number | null;
  depreciationAndAmortization: number | null;
  deferredIncomeTax: number | null;
  stockBasedCompensation: number | null;
  changeInWorkingCapital: number | null;
  accountsReceivables: number | null;
  inventory: number | null;
  accountsPayables: number | null;
  otherWorkingCapital: number | null;
  otherNonCashItems: number | null;
  netCashProvidedByOperatingActivities: number | null;
  investmentsInPropertyPlantAndEquipment: number | null;
  acquisitionsNet: number | null;
  purchasesOfInvestments: number | null;
  salesMaturitiesOfInvestments: number | null;
  otherInvestingActivites: number | null;
  netCashUsedForInvestingActivites: number | null;
  debtRepayment: number | null;
  commonStockIssued: number | null;
  commonStockRepurchased: number | null;
  dividendsPaid: number | null;
  otherFinancingActivites: number | null;
  netCashUsedProvidedByFinancingActivities: number | null;
  effectOfForexChangesOnCash: number | null;
  netChangeInCash: number | null;
  cashAtEndOfPeriod: number | null;
  cashAtBeginningOfPeriod: number | null;
  operatingCashFlow: number | null;
  capitalExpenditure: number | null;
  freeCashFlow: number | null;
  link: string | null;
  finalLink: string | null;
}

/**
 * Financial ratios
 */
export interface FinancialRatios {
  symbol: string;
  date: string;
  calendarYear: string;
  period: string;
  currentRatio: number | null;
  quickRatio: number | null;
  cashRatio: number | null;
  daysOfSalesOutstanding: number | null;
  daysOfInventoryOutstanding: number | null;
  operatingCycle: number | null;
  daysOfPayablesOutstanding: number | null;
  cashConversionCycle: number | null;
  grossProfitMargin: number | null;
  operatingProfitMargin: number | null;
  pretaxProfitMargin: number | null;
  netProfitMargin: number | null;
  effectiveTaxRate: number | null;
  returnOnAssets: number | null;
  returnOnEquity: number | null;
  returnOnCapitalEmployed: number | null;
  netIncomePerEBT: number | null;
  ebtPerEbit: number | null;
  ebitPerRevenue: number | null;
  debtRatio: number | null;
  debtEquityRatio: number | null;
  longTermDebtToCapitalization: number | null;
  totalDebtToCapitalization: number | null;
  interestCoverage: number | null;
  cashFlowToDebtRatio: number | null;
  companyEquityMultiplier: number | null;
  receivablesTurnover: number | null;
  payablesTurnover: number | null;
  inventoryTurnover: number | null;
  fixedAssetTurnover: number | null;
  assetTurnover: number | null;
  operatingCashFlowPerShare: number | null;
  freeCashFlowPerShare: number | null;
  cashPerShare: number | null;
  payoutRatio: number | null;
  operatingCashFlowSalesRatio: number | null;
  freeCashFlowOperatingCashFlowRatio: number | null;
  cashFlowCoverageRatios: number | null;
  shortTermCoverageRatios: number | null;
  capitalExpenditureCoverageRatio: number | null;
  dividendPaidAndCapexCoverageRatio: number | null;
  priceBookValueRatio: number | null;
  priceToBookRatio: number | null;
  priceToSalesRatio: number | null;
  priceEarningsRatio: number | null;
  priceToFreeCashFlowsRatio: number | null;
  priceToOperatingCashFlowsRatio: number | null;
  priceCashFlowRatio: number | null;
  priceEarningsToGrowthRatio: number | null;
  priceSalesRatio: number | null;
  dividendYield: number | null;
  enterpriseValueMultiple: number | null;
  priceFairValue: number | null;
}

/**
 * Key metrics
 */
export interface KeyMetrics {
  symbol: string;
  date: string;
  calendarYear: string;
  period: string;
  revenuePerShare: number | null;
  netIncomePerShare: number | null;
  operatingCashFlowPerShare: number | null;
  freeCashFlowPerShare: number | null;
  cashPerShare: number | null;
  bookValuePerShare: number | null;
  tangibleBookValuePerShare: number | null;
  shareholdersEquityPerShare: number | null;
  interestDebtPerShare: number | null;
  marketCap: number | null;
  enterpriseValue: number | null;
  peRatio: number | null;
  priceToSalesRatio: number | null;
  pocfratio: number | null;
  pfcfRatio: number | null;
  pbRatio: number | null;
  ptbRatio: number | null;
  evToSales: number | null;
  enterpriseValueOverEBITDA: number | null;
  evToOperatingCashFlow: number | null;
  evToFreeCashFlow: number | null;
  earningsYield: number | null;
  freeCashFlowYield: number | null;
  debtToEquity: number | null;
  debtToAssets: number | null;
  netDebtToEBITDA: number | null;
  currentRatio: number | null;
  interestCoverage: number | null;
  incomeQuality: number | null;
  dividendYield: number | null;
  payoutRatio: number | null;
  salesGeneralAndAdministrativeToRevenue: number | null;
  researchAndDdevelopementToRevenue: number | null;
  intangiblesToTotalAssets: number | null;
  capexToOperatingCashFlow: number | null;
  capexToRevenue: number | null;
  capexToDepreciation: number | null;
  stockBasedCompensationToRevenue: number | null;
  grahamNumber: number | null;
  roic: number | null;
  returnOnTangibleAssets: number | null;
  grahamNetNet: number | null;
  workingCapital: number | null;
  tangibleAssetValue: number | null;
  netCurrentAssetValue: number | null;
  investedCapital: number | null;
  averageReceivables: number | null;
  averagePayables: number | null;
  averageInventory: number | null;
  daysSalesOutstanding: number | null;
  daysPayablesOutstanding: number | null;
  daysOfInventoryOnHand: number | null;
  receivablesTurnover: number | null;
  payablesTurnover: number | null;
  inventoryTurnover: number | null;
  roe: number | null;
  capexPerShare: number | null;
}

/**
 * Financial scores
 */
export interface FinancialScores {
  symbol: string;
  altmanZScore: number | null;
  piotroskiScore: number | null;
  workingCapital: number | null;
  totalAssets: number | null;
  retainedEarnings: number | null;
  ebit: number | null;
  marketCap: number | null;
  totalLiabilities: number | null;
  revenue: number | null;
}

/**
 * Owner earnings
 */
export interface OwnerEarnings {
  symbol: string;
  date: string;
  averagePPE: number | null;
  maintenanceCapex: number | null;
  ownersEarnings: number | null;
  growthCapex: number | null;
  ownersEarningsPerShare: number | null;
}

/**
 * Financial growth
 */
export interface FinancialGrowth {
  date: string;
  symbol: string;
  period: string;
  calendarYear: string;
  revenueGrowth: number | null;
  grossProfitGrowth: number | null;
  ebitgrowth: number | null;
  operatingIncomeGrowth: number | null;
  netIncomeGrowth: number | null;
  epsgrowth: number | null;
  epsdilutedGrowth: number | null;
  weightedAverageSharesGrowth: number | null;
  weightedAverageSharesDilutedGrowth: number | null;
  dividendsperShareGrowth: number | null;
  operatingCashFlowGrowth: number | null;
  freeCashFlowGrowth: number | null;
  tenYRevenueGrowthPerShare: number | null;
  fiveYRevenueGrowthPerShare: number | null;
  threeYRevenueGrowthPerShare: number | null;
  tenYOperatingCFGrowthPerShare: number | null;
  fiveYOperatingCFGrowthPerShare: number | null;
  threeYOperatingCFGrowthPerShare: number | null;
  tenYNetIncomeGrowthPerShare: number | null;
  fiveYNetIncomeGrowthPerShare: number | null;
  threeYNetIncomeGrowthPerShare: number | null;
  tenYShareholdersEquityGrowthPerShare: number | null;
  fiveYShareholdersEquityGrowthPerShare: number | null;
  threeYShareholdersEquityGrowthPerShare: number | null;
  tenYDividendperShareGrowthPerShare: number | null;
  fiveYDividendperShareGrowthPerShare: number | null;
  threeYDividendperShareGrowthPerShare: number | null;
  receivablesGrowth: number | null;
  inventoryGrowth: number | null;
  assetGrowth: number | null;
  bookValueperShareGrowth: number | null;
  debtGrowth: number | null;
  rdexpenseGrowth: number | null;
  sgaexpensesGrowth: number | null;
}

/**
 * Reporting dates
 */
export interface ReportDate {
  symbol: string;
  date: string;
  period: string;
  linkXlsx: string;
  linkJson: string;
}

/**
 * Latest financial statement (as-reported, v4 endpoint)
 */
export interface LatestFinancialStatement {
  date: string;
  symbol: string;
  period: string;
  documenttype: string;
  reportedCurrency: string;
  cik: string;
  fillingDate: string;
  acceptedDate: string;
  calendarYear: string;
  [key: string]: string | number | null;
}

/**
 * Financial report download URL response
 */
export interface FinancialReportDownload {
  url: string;
}

/**
 * Income statement growth data
 */
export interface IncomeStatementGrowth {
  date: string;
  symbol: string;
  period: string;
  calendarYear: string;
  growthRevenue: number | null;
  growthCostOfRevenue: number | null;
  growthGrossProfit: number | null;
  growthGrossProfitRatio: number | null;
  growthResearchAndDevelopmentExpenses: number | null;
  growthGeneralAndAdministrativeExpenses: number | null;
  growthSellingAndMarketingExpenses: number | null;
  growthOtherExpenses: number | null;
  growthOperatingExpenses: number | null;
  growthCostAndExpenses: number | null;
  growthInterestExpense: number | null;
  growthDepreciationAndAmortization: number | null;
  growthEBITDA: number | null;
  growthEBITDARatio: number | null;
  growthOperatingIncome: number | null;
  growthOperatingIncomeRatio: number | null;
  growthTotalOtherIncomeExpensesNet: number | null;
  growthIncomeBeforeTax: number | null;
  growthIncomeBeforeTaxRatio: number | null;
  growthIncomeTaxExpense: number | null;
  growthNetIncome: number | null;
  growthNetIncomeRatio: number | null;
  growthEPS: number | null;
  growthEPSDiluted: number | null;
  growthWeightedAverageShsOut: number | null;
  growthWeightedAverageShsOutDil: number | null;
}

/**
 * Balance sheet growth data
 */
export interface BalanceSheetGrowth {
  date: string;
  symbol: string;
  period: string;
  calendarYear: string;
  growthCashAndCashEquivalents: number | null;
  growthShortTermInvestments: number | null;
  growthCashAndShortTermInvestments: number | null;
  growthNetReceivables: number | null;
  growthInventory: number | null;
  growthOtherCurrentAssets: number | null;
  growthTotalCurrentAssets: number | null;
  growthPropertyPlantEquipmentNet: number | null;
  growthGoodwill: number | null;
  growthIntangibleAssets: number | null;
  growthGoodwillAndIntangibleAssets: number | null;
  growthLongTermInvestments: number | null;
  growthTaxAssets: number | null;
  growthOtherNonCurrentAssets: number | null;
  growthTotalNonCurrentAssets: number | null;
  growthOtherAssets: number | null;
  growthTotalAssets: number | null;
  growthAccountPayables: number | null;
  growthShortTermDebt: number | null;
  growthTaxPayables: number | null;
  growthDeferredRevenue: number | null;
  growthOtherCurrentLiabilities: number | null;
  growthTotalCurrentLiabilities: number | null;
  growthLongTermDebt: number | null;
  growthDeferredRevenueNonCurrent: number | null;
  growthDeferrredTaxLiabilitiesNonCurrent: number | null;
  growthOtherNonCurrentLiabilities: number | null;
  growthTotalNonCurrentLiabilities: number | null;
  growthOtherLiabilities: number | null;
  growthTotalLiabilities: number | null;
  growthCommonStock: number | null;
  growthRetainedEarnings: number | null;
  growthAccumulatedOtherComprehensiveIncomeLoss: number | null;
  growthOthertotalStockholdersEquity: number | null;
  growthTotalStockholdersEquity: number | null;
  growthTotalLiabilitiesAndStockholdersEquity: number | null;
  growthTotalInvestments: number | null;
  growthTotalDebt: number | null;
  growthNetDebt: number | null;
}

/**
 * Cash flow statement growth data
 */
export interface CashFlowStatementGrowth {
  date: string;
  symbol: string;
  period: string;
  calendarYear: string;
  growthNetIncome: number | null;
  growthDepreciationAndAmortization: number | null;
  growthDeferredIncomeTax: number | null;
  growthStockBasedCompensation: number | null;
  growthChangeInWorkingCapital: number | null;
  growthAccountsReceivables: number | null;
  growthInventory: number | null;
  growthAccountsPayables: number | null;
  growthOtherWorkingCapital: number | null;
  growthOtherNonCashItems: number | null;
  growthNetCashProvidedByOperatingActivites: number | null;
  growthInvestmentsInPropertyPlantAndEquipment: number | null;
  growthAcquisitionsNet: number | null;
  growthPurchasesOfInvestments: number | null;
  growthSalesMaturitiesOfInvestments: number | null;
  growthOtherInvestingActivites: number | null;
  growthNetCashUsedForInvestingActivites: number | null;
  growthDebtRepayment: number | null;
  growthCommonStockIssued: number | null;
  growthCommonStockRepurchased: number | null;
  growthDividendsPaid: number | null;
  growthOtherFinancingActivites: number | null;
  growthNetCashUsedProvidedByFinancingActivities: number | null;
  growthEffectOfForexChangesOnCash: number | null;
  growthNetChangeInCash: number | null;
  growthCashAtEndOfPeriod: number | null;
  growthCashAtBeginningOfPeriod: number | null;
  growthOperatingCashFlow: number | null;
  growthCapitalExpenditure: number | null;
  growthFreeCashFlow: number | null;
}

/**
 * Revenue by product segment
 */
export interface RevenueProductSegmentation {
  date: string;
  symbol: string;
  [segmentName: string]: string | number | null;
}

/**
 * Revenue by geographic segment
 */
export interface RevenueGeographicSegmentation {
  date: string;
  symbol: string;
  [regionName: string]: string | number | null;
}
