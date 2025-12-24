/**
 * SEC filings types
 */

/**
 * SEC filing
 */
export interface SECFiling {
  symbol: string;
  cik: string;
  title: string;
  date: string;
  type: string;
  link: string;
  finalLink: string;
}

/**
 * SEC RSS feed item
 */
export interface SECRSSFeed {
  title: string;
  date: string;
  link: string;
  cik: string;
  formType: string;
  acceptanceDateTime: string;
  filingDate: string;
  reportDate: string;
  accessionNumber: string;
  fileNumber: string;
  filmNumber: string;
  items: string;
  size: string;
}

/**
 * SIC (Standard Industrial Classification) code
 */
export interface SICCode {
  sicCode: string;
  industry: string;
  office: string;
}

/**
 * Company CIK search result
 */
export interface CompanyCIKSearch {
  cik: string;
  name: string;
}

/**
 * SEC Full Profile - Comprehensive company outlook data
 * Returned by v4/company-outlook endpoint
 */
export interface SECFullProfile {
  profile: {
    symbol: string;
    price: number;
    beta: number;
    volAvg: number;
    mktCap: number;
    lastDiv: number;
    range: string;
    changes: number;
    companyName: string;
    currency: string;
    cik: string;
    isin: string;
    cusip: string;
    exchange: string;
    exchangeShortName: string;
    industry: string;
    website: string;
    description: string;
    ceo: string;
    sector: string;
    country: string;
    fullTimeEmployees: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    dcfDiff: number;
    dcf: number;
    image: string;
    ipoDate: string;
    defaultImage: boolean;
    isEtf: boolean;
    isActivelyTrading: boolean;
    isAdr: boolean;
    isFund: boolean;
  };
  metrics: {
    dividendYielTTM: number;
    volume: number;
    yearHigh: number;
    yearLow: number;
  };
  ratios: Array<{
    symbol: string;
    date: string;
    calendarYear: string;
    period: string;
    currentRatio: number;
    quickRatio: number;
    cashRatio: number;
    daysOfSalesOutstanding: number;
    daysOfInventoryOutstanding: number;
    operatingCycle: number;
    daysOfPayablesOutstanding: number;
    cashConversionCycle: number;
    grossProfitMargin: number;
    operatingProfitMargin: number;
    pretaxProfitMargin: number;
    netProfitMargin: number;
    effectiveTaxRate: number;
    returnOnAssets: number;
    returnOnEquity: number;
    returnOnCapitalEmployed: number;
    netIncomePerEBT: number;
    ebtPerEbit: number;
    ebitPerRevenue: number;
    debtRatio: number;
    debtEquityRatio: number;
    longTermDebtToCapitalization: number;
    totalDebtToCapitalization: number;
    interestCoverage: number;
    cashFlowToDebtRatio: number;
    companyEquityMultiplier: number;
    receivablesTurnover: number;
    payablesTurnover: number;
    inventoryTurnover: number;
    fixedAssetTurnover: number;
    assetTurnover: number;
    operatingCashFlowPerShare: number;
    freeCashFlowPerShare: number;
    cashPerShare: number;
    payoutRatio: number;
    operatingCashFlowSalesRatio: number;
    freeCashFlowOperatingCashFlowRatio: number;
    cashFlowCoverageRatios: number;
    shortTermCoverageRatios: number;
    capitalExpenditureCoverageRatio: number;
    dividendPaidAndCapexCoverageRatio: number;
    priceBookValueRatio: number;
    priceToBookRatio: number;
    priceToSalesRatio: number;
    priceEarningsRatio: number;
    priceToFreeCashFlowsRatio: number;
    priceToOperatingCashFlowsRatio: number;
    priceCashFlowRatio: number;
    priceEarningsToGrowthRatio: number;
    priceSalesRatio: number;
    dividendYield: number;
    enterpriseValueMultiple: number;
    priceFairValue: number;
  }>;
  insiderTrading: Array<{
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
  }>;
  keyExecutives: Array<{
    title: string;
    name: string;
    pay: number;
    currencyPay: string;
    gender: string;
    yearBorn: number;
    titleSince: number;
  }>;
  splitsHistory: Array<{
    date: string;
    label: string;
    symbol: string;
    numerator: number;
    denominator: number;
  }>;
  stockDividend: Array<{
    date: string;
    label: string;
    adjDividend: number;
    symbol: string;
    dividend: number;
    recordDate: string;
    paymentDate: string;
    declarationDate: string;
  }>;
  stockNews: Array<{
    symbol: string;
    publishedDate: string;
    title: string;
    image: string;
    site: string;
    text: string;
    url: string;
  }>;
  rating: Array<{
    symbol: string;
    date: string;
    rating: string;
    ratingScore: number;
    ratingRecommendation: string;
    ratingDetailsDCFScore: number;
    ratingDetailsDCFRecommendation: string;
    ratingDetailsROEScore: number;
    ratingDetailsROERecommendation: string;
    ratingDetailsROAScore: number;
    ratingDetailsROARecommendation: string;
    ratingDetailsDEScore: number;
    ratingDetailsDERecommendation: string;
    ratingDetailsPEScore: number;
    ratingDetailsPERecommendation: string;
    ratingDetailsPBScore: number;
    ratingDetailsPBRecommendation: string;
  }>;
  financialsAnnual: {
    income: Array<{
      date: string;
      symbol: string;
      reportedCurrency: string;
      cik: string;
      fillingDate: string;
      acceptedDate: string;
      calendarYear: string;
      period: string;
      revenue: number;
      costOfRevenue: number;
      grossProfit: number;
      grossProfitRatio: number;
      researchAndDevelopmentExpenses: number;
      generalAndAdministrativeExpenses: number;
      sellingAndMarketingExpenses: number;
      sellingGeneralAndAdministrativeExpenses: number;
      otherExpenses: number;
      operatingExpenses: number;
      costAndExpenses: number;
      interestIncome: number;
      interestExpense: number;
      depreciationAndAmortization: number;
      ebitda: number;
      ebitdaratio: number;
      operatingIncome: number;
      operatingIncomeRatio: number;
      totalOtherIncomeExpensesNet: number;
      incomeBeforeTax: number;
      incomeBeforeTaxRatio: number;
      incomeTaxExpense: number;
      netIncome: number;
      netIncomeRatio: number;
      eps: number;
      epsdiluted: number;
      weightedAverageShsOut: number;
      weightedAverageShsOutDil: number;
      link: string;
      finalLink: string;
    }>;
    balance: Array<{
      date: string;
      symbol: string;
      reportedCurrency: string;
      cik: string;
      fillingDate: string;
      acceptedDate: string;
      calendarYear: string;
      period: string;
      cashAndCashEquivalents: number;
      shortTermInvestments: number;
      cashAndShortTermInvestments: number;
      netReceivables: number;
      inventory: number;
      otherCurrentAssets: number;
      totalCurrentAssets: number;
      propertyPlantEquipmentNet: number;
      goodwill: number;
      intangibleAssets: number;
      goodwillAndIntangibleAssets: number;
      longTermInvestments: number;
      taxAssets: number;
      otherNonCurrentAssets: number;
      totalNonCurrentAssets: number;
      otherAssets: number;
      totalAssets: number;
      accountPayables: number;
      shortTermDebt: number;
      taxPayables: number;
      deferredRevenue: number;
      otherCurrentLiabilities: number;
      totalCurrentLiabilities: number;
      longTermDebt: number;
      deferredRevenueNonCurrent: number;
      deferredTaxLiabilitiesNonCurrent: number;
      otherNonCurrentLiabilities: number;
      totalNonCurrentLiabilities: number;
      otherLiabilities: number;
      capitalLeaseObligations: number;
      totalLiabilities: number;
      preferredStock: number;
      commonStock: number;
      retainedEarnings: number;
      accumulatedOtherComprehensiveIncomeLoss: number;
      othertotalStockholdersEquity: number;
      totalStockholdersEquity: number;
      totalEquity: number;
      totalLiabilitiesAndStockholdersEquity: number;
      minorityInterest: number;
      totalLiabilitiesAndTotalEquity: number;
      totalInvestments: number;
      totalDebt: number;
      netDebt: number;
      link: string;
      finalLink: string;
    }>;
    cash: Array<{
      date: string;
      symbol: string;
      reportedCurrency: string;
      cik: string;
      fillingDate: string;
      acceptedDate: string;
      calendarYear: string;
      period: string;
      netIncome: number;
      depreciationAndAmortization: number;
      deferredIncomeTax: number;
      stockBasedCompensation: number;
      changeInWorkingCapital: number;
      accountsReceivables: number;
      inventory: number;
      accountsPayables: number;
      otherWorkingCapital: number;
      otherNonCashItems: number;
      netCashProvidedByOperatingActivities: number;
      investmentsInPropertyPlantAndEquipment: number;
      acquisitionsNet: number;
      purchasesOfInvestments: number;
      salesMaturitiesOfInvestments: number;
      otherInvestingActivites: number;
      netCashUsedForInvestingActivites: number;
      debtRepayment: number;
      commonStockIssued: number;
      commonStockRepurchased: number;
      dividendsPaid: number;
      otherFinancingActivites: number;
      netCashUsedProvidedByFinancingActivities: number;
      effectOfForexChangesOnCash: number;
      netChangeInCash: number;
      cashAtEndOfPeriod: number;
      cashAtBeginningOfPeriod: number;
      operatingCashFlow: number;
      capitalExpenditure: number;
      freeCashFlow: number;
      link: string;
      finalLink: string;
    }>;
  };
  financialsQuarter: {
    income: Array<{
      date: string;
      symbol: string;
      reportedCurrency: string;
      cik: string;
      fillingDate: string;
      acceptedDate: string;
      calendarYear: string;
      period: string;
      revenue: number;
      costOfRevenue: number;
      grossProfit: number;
      grossProfitRatio: number;
      researchAndDevelopmentExpenses: number;
      generalAndAdministrativeExpenses: number;
      sellingAndMarketingExpenses: number;
      sellingGeneralAndAdministrativeExpenses: number;
      otherExpenses: number;
      operatingExpenses: number;
      costAndExpenses: number;
      interestIncome: number;
      interestExpense: number;
      depreciationAndAmortization: number;
      ebitda: number;
      ebitdaratio: number;
      operatingIncome: number;
      operatingIncomeRatio: number;
      totalOtherIncomeExpensesNet: number;
      incomeBeforeTax: number;
      incomeBeforeTaxRatio: number;
      incomeTaxExpense: number;
      netIncome: number;
      netIncomeRatio: number;
      eps: number;
      epsdiluted: number;
      weightedAverageShsOut: number;
      weightedAverageShsOutDil: number;
      link: string;
      finalLink: string;
    }>;
    balance: Array<{
      date: string;
      symbol: string;
      reportedCurrency: string;
      cik: string;
      fillingDate: string;
      acceptedDate: string;
      calendarYear: string;
      period: string;
      cashAndCashEquivalents: number;
      shortTermInvestments: number;
      cashAndShortTermInvestments: number;
      netReceivables: number;
      inventory: number;
      otherCurrentAssets: number;
      totalCurrentAssets: number;
      propertyPlantEquipmentNet: number;
      goodwill: number;
      intangibleAssets: number;
      goodwillAndIntangibleAssets: number;
      longTermInvestments: number;
      taxAssets: number;
      otherNonCurrentAssets: number;
      totalNonCurrentAssets: number;
      otherAssets: number;
      totalAssets: number;
      accountPayables: number;
      shortTermDebt: number;
      taxPayables: number;
      deferredRevenue: number;
      otherCurrentLiabilities: number;
      totalCurrentLiabilities: number;
      longTermDebt: number;
      deferredRevenueNonCurrent: number;
      deferredTaxLiabilitiesNonCurrent: number;
      otherNonCurrentLiabilities: number;
      totalNonCurrentLiabilities: number;
      otherLiabilities: number;
      capitalLeaseObligations: number;
      totalLiabilities: number;
      preferredStock: number;
      commonStock: number;
      retainedEarnings: number;
      accumulatedOtherComprehensiveIncomeLoss: number;
      othertotalStockholdersEquity: number;
      totalStockholdersEquity: number;
      totalEquity: number;
      totalLiabilitiesAndStockholdersEquity: number;
      minorityInterest: number;
      totalLiabilitiesAndTotalEquity: number;
      totalInvestments: number;
      totalDebt: number;
      netDebt: number;
      link: string;
      finalLink: string;
    }>;
    cash: Array<{
      date: string;
      symbol: string;
      reportedCurrency: string;
      cik: string;
      fillingDate: string;
      acceptedDate: string;
      calendarYear: string;
      period: string;
      netIncome: number;
      depreciationAndAmortization: number;
      deferredIncomeTax: number;
      stockBasedCompensation: number;
      changeInWorkingCapital: number;
      accountsReceivables: number;
      inventory: number;
      accountsPayables: number;
      otherWorkingCapital: number;
      otherNonCashItems: number;
      netCashProvidedByOperatingActivities: number;
      investmentsInPropertyPlantAndEquipment: number;
      acquisitionsNet: number;
      purchasesOfInvestments: number;
      salesMaturitiesOfInvestments: number;
      otherInvestingActivites: number;
      netCashUsedForInvestingActivites: number;
      debtRepayment: number;
      commonStockIssued: number;
      commonStockRepurchased: number;
      dividendsPaid: number;
      otherFinancingActivites: number;
      netCashUsedProvidedByFinancingActivities: number;
      effectOfForexChangesOnCash: number;
      netChangeInCash: number;
      cashAtEndOfPeriod: number;
      cashAtBeginningOfPeriod: number;
      operatingCashFlow: number;
      capitalExpenditure: number;
      freeCashFlow: number;
      link: string;
      finalLink: string;
    }>;
  };
}
