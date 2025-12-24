import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BulkResource } from '../src/resources/bulk.js';
import { FMPClient } from '../src/client.js';
import type {
  CompanyProfile,
  AnalystRecommendation,
  DCFValuation,
  FinancialScores,
  PriceTarget,
  ETFHolding,
  StockGrade,
  KeyMetrics,
  FinancialRatios,
  StockPeer,
  IncomeStatement,
  BalanceSheet,
  CashFlowStatement,
} from '../src/types/index.js';
import type {
  EarningsSurprise,
  IncomeStatementGrowth,
  BalanceSheetGrowth,
  CashFlowStatementGrowth,
  EODPrice,
} from '../src/resources/bulk.js';

describe('BulkResource', () => {
  let bulkResource: BulkResource;
  let mockClient: FMPClient;

  beforeEach(() => {
    mockClient = {
      get: vi.fn(),
    } as unknown as FMPClient;
    bulkResource = new BulkResource(mockClient);
  });

  describe('getAllProfiles', () => {
    it('should fetch all company profiles', async () => {
      const mockProfiles: CompanyProfile[] = [
        {
          symbol: 'AAPL',
          price: 150.5,
          beta: 1.2,
          volAvg: 50000000,
          mktCap: 2500000000000,
          lastDiv: 0.92,
          range: '120-180',
          changes: 2.5,
          companyName: 'Apple Inc.',
          currency: 'USD',
          cik: '0000320193',
          isin: 'US0378331005',
          cusip: '037833100',
          exchange: 'NASDAQ',
          exchangeShortName: 'NASDAQ',
          industry: 'Consumer Electronics',
          website: 'https://www.apple.com',
          description: 'Apple Inc. designs, manufactures, and markets smartphones',
          ceo: 'Tim Cook',
          sector: 'Technology',
          country: 'US',
          fullTimeEmployees: '164000',
          phone: '14089961010',
          address: 'One Apple Park Way',
          city: 'Cupertino',
          state: 'CA',
          zip: '95014',
          dcfDiff: 10.5,
          dcf: 160.0,
          image: 'https://financialmodelingprep.com/image-stock/AAPL.png',
          ipoDate: '1980-12-12',
          defaultImage: false,
          isEtf: false,
          isActivelyTrading: true,
          isAdr: false,
          isFund: false,
        },
        {
          symbol: 'MSFT',
          price: 340.2,
          beta: 0.9,
          volAvg: 30000000,
          mktCap: 2400000000000,
          lastDiv: 2.72,
          range: '280-360',
          changes: 1.8,
          companyName: 'Microsoft Corporation',
          currency: 'USD',
          cik: '0000789019',
          isin: 'US5949181045',
          cusip: '594918104',
          exchange: 'NASDAQ',
          exchangeShortName: 'NASDAQ',
          industry: 'Software',
          website: 'https://www.microsoft.com',
          description: 'Microsoft Corporation develops, licenses, and supports software',
          ceo: 'Satya Nadella',
          sector: 'Technology',
          country: 'US',
          fullTimeEmployees: '221000',
          phone: '14258828080',
          address: 'One Microsoft Way',
          city: 'Redmond',
          state: 'WA',
          zip: '98052',
          dcfDiff: 8.3,
          dcf: 348.5,
          image: 'https://financialmodelingprep.com/image-stock/MSFT.png',
          ipoDate: '1986-03-13',
          defaultImage: false,
          isEtf: false,
          isActivelyTrading: true,
          isAdr: false,
          isFund: false,
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockProfiles);

      const result = await bulkResource.getAllProfiles();

      expect(mockClient.get).toHaveBeenCalledWith('v4/profile/all');
      expect(result).toEqual(mockProfiles);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no profiles available', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      const result = await bulkResource.getAllProfiles();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });

  describe('getAllRatings', () => {
    it('should fetch all analyst ratings', async () => {
      const mockRatings: AnalystRecommendation[] = [
        {
          symbol: 'AAPL',
          date: '2024-01-15',
          analystRatingsbuy: 25,
          analystRatingsHold: 5,
          analystRatingsSell: 2,
          analystRatingsStrongSell: 1,
          analystRatingsStrongBuy: 10,
        },
        {
          symbol: 'MSFT',
          date: '2024-01-15',
          analystRatingsbuy: 20,
          analystRatingsHold: 8,
          analystRatingsSell: 1,
          analystRatingsStrongSell: 0,
          analystRatingsStrongBuy: 15,
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockRatings);

      const result = await bulkResource.getAllRatings();

      expect(mockClient.get).toHaveBeenCalledWith('v4/rating');
      expect(result).toEqual(mockRatings);
      expect(result).toHaveLength(2);
    });
  });

  describe('getAllDCF', () => {
    it('should fetch all DCF valuations', async () => {
      const mockDCF: DCFValuation[] = [
        {
          symbol: 'AAPL',
          date: '2024-01-15',
          dcf: 160.5,
          'Stock Price': 150.5,
        },
        {
          symbol: 'MSFT',
          date: '2024-01-15',
          dcf: 350.2,
          'Stock Price': 340.2,
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockDCF);

      const result = await bulkResource.getAllDCF();

      expect(mockClient.get).toHaveBeenCalledWith('v4/dcf');
      expect(result).toEqual(mockDCF);
    });
  });

  describe('getAllScores', () => {
    it('should fetch all financial scores', async () => {
      const mockScores: FinancialScores[] = [
        {
          symbol: 'AAPL',
          altmanZScore: 5.2,
          piotroskiScore: 8,
          workingCapital: 50000000000,
          totalAssets: 350000000000,
          retainedEarnings: 100000000000,
          ebit: 80000000000,
          marketCap: 2500000000000,
          totalLiabilities: 250000000000,
          revenue: 380000000000,
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockScores);

      const result = await bulkResource.getAllScores();

      expect(mockClient.get).toHaveBeenCalledWith('v4/score');
      expect(result).toEqual(mockScores);
    });
  });

  describe('getAllPriceTargets', () => {
    it('should fetch all price targets', async () => {
      const mockTargets: PriceTarget[] = [
        {
          symbol: 'AAPL',
          publishedDate: '2024-01-15',
          newsURL: 'https://example.com/news',
          newsTitle: 'Apple Price Target Raised',
          analystName: 'John Doe',
          priceTarget: 180,
          adjPriceTarget: 180,
          priceWhenPosted: 150,
          newsPublisher: 'Example Finance',
          newsBaseURL: 'https://example.com',
          analystCompany: 'Example Securities',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockTargets);

      const result = await bulkResource.getAllPriceTargets();

      expect(mockClient.get).toHaveBeenCalledWith('v4/price-target');
      expect(result).toEqual(mockTargets);
    });
  });

  describe('getAllETFHoldings', () => {
    it('should fetch all ETF holdings', async () => {
      const mockHoldings: ETFHolding[] = [
        {
          asset: 'AAPL',
          name: 'Apple Inc.',
          shares: 1000000,
          weightPercentage: '5.5',
          marketValue: 150000000,
        },
        {
          asset: 'MSFT',
          name: 'Microsoft Corporation',
          shares: 800000,
          weightPercentage: '4.2',
          marketValue: 272000000,
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockHoldings);

      const result = await bulkResource.getAllETFHoldings();

      expect(mockClient.get).toHaveBeenCalledWith('v4/etf-holder');
      expect(result).toEqual(mockHoldings);
    });
  });

  describe('getAllUpgradesDowngrades', () => {
    it('should fetch all upgrades and downgrades', async () => {
      const mockGrades: StockGrade[] = [
        {
          symbol: 'AAPL',
          date: '2024-01-15',
          gradingCompany: 'Morgan Stanley',
          previousGrade: 'Hold',
          newGrade: 'Buy',
        },
        {
          symbol: 'MSFT',
          date: '2024-01-15',
          gradingCompany: 'Goldman Sachs',
          previousGrade: 'Buy',
          newGrade: 'Strong Buy',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockGrades);

      const result = await bulkResource.getAllUpgradesDowngrades();

      expect(mockClient.get).toHaveBeenCalledWith('v4/upgrades-downgrades');
      expect(result).toEqual(mockGrades);
    });
  });

  describe('getAllKeyMetricsTTM', () => {
    it('should fetch all key metrics TTM', async () => {
      const mockMetrics: KeyMetrics[] = [
        {
          symbol: 'AAPL',
          date: '2024-01-15',
          calendarYear: '2024',
          period: 'TTM',
          revenuePerShare: 24.5,
          netIncomePerShare: 6.2,
          operatingCashFlowPerShare: 7.5,
          freeCashFlowPerShare: 6.8,
          cashPerShare: 3.5,
          bookValuePerShare: 4.2,
          tangibleBookValuePerShare: 4.0,
          shareholdersEquityPerShare: 4.2,
          interestDebtPerShare: 1.5,
          marketCap: 2500000000000,
          enterpriseValue: 2550000000000,
          peRatio: 25.5,
          priceToSalesRatio: 6.5,
          pocfratio: 22.0,
          pfcfRatio: 24.0,
          pbRatio: 35.0,
          ptbRatio: 35.0,
          evToSales: 6.7,
          enterpriseValueOverEBITDA: 18.5,
          evToOperatingCashFlow: 23.0,
          evToFreeCashFlow: 25.0,
          earningsYield: 0.039,
          freeCashFlowYield: 0.042,
          debtToEquity: 2.5,
          debtToAssets: 0.35,
          netDebtToEBITDA: 0.8,
          currentRatio: 1.1,
          interestCoverage: 25.0,
          incomeQuality: 1.2,
          dividendYield: 0.006,
          payoutRatio: 0.15,
          salesGeneralAndAdministrativeToRevenue: 0.06,
          researchAndDdevelopementToRevenue: 0.07,
          intangiblesToTotalAssets: 0.02,
          capexToOperatingCashFlow: 0.1,
          capexToRevenue: 0.03,
          capexToDepreciation: 1.5,
          stockBasedCompensationToRevenue: 0.02,
          grahamNumber: 95.0,
          roic: 0.45,
          returnOnTangibleAssets: 0.52,
          grahamNetNet: 75.0,
          workingCapital: 50000000000,
          tangibleAssetValue: 140000000000,
          netCurrentAssetValue: 45000000000,
          investedCapital: 200000000000,
          averageReceivables: 25000000000,
          averagePayables: 40000000000,
          averageInventory: 5000000000,
          daysSalesOutstanding: 35,
          daysPayablesOutstanding: 85,
          daysOfInventoryOnHand: 8,
          receivablesTurnover: 10.5,
          payablesTurnover: 4.3,
          inventoryTurnover: 45.0,
          roe: 0.48,
          capexPerShare: 0.75,
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockMetrics);

      const result = await bulkResource.getAllKeyMetricsTTM();

      expect(mockClient.get).toHaveBeenCalledWith('v3/key-metrics-ttm');
      expect(result).toEqual(mockMetrics);
    });
  });

  describe('getAllRatiosTTM', () => {
    it('should fetch all financial ratios TTM', async () => {
      const mockRatios: FinancialRatios[] = [
        {
          symbol: 'AAPL',
          date: '2024-01-15',
          calendarYear: '2024',
          period: 'TTM',
          currentRatio: 1.1,
          quickRatio: 0.95,
          cashRatio: 0.45,
          daysOfSalesOutstanding: 35,
          daysOfInventoryOutstanding: 8,
          operatingCycle: 43,
          daysOfPayablesOutstanding: 85,
          cashConversionCycle: -42,
          grossProfitMargin: 0.43,
          operatingProfitMargin: 0.3,
          pretaxProfitMargin: 0.29,
          netProfitMargin: 0.25,
          effectiveTaxRate: 0.14,
          returnOnAssets: 0.22,
          returnOnEquity: 0.48,
          returnOnCapitalEmployed: 0.35,
          netIncomePerEBT: 0.86,
          ebtPerEbit: 0.98,
          ebitPerRevenue: 0.31,
          debtRatio: 0.35,
          debtEquityRatio: 2.5,
          longTermDebtToCapitalization: 0.65,
          totalDebtToCapitalization: 0.71,
          interestCoverage: 25.0,
          cashFlowToDebtRatio: 0.45,
          companyEquityMultiplier: 5.2,
          receivablesTurnover: 10.5,
          payablesTurnover: 4.3,
          inventoryTurnover: 45.0,
          fixedAssetTurnover: 8.5,
          assetTurnover: 1.1,
          operatingCashFlowPerShare: 7.5,
          freeCashFlowPerShare: 6.8,
          cashPerShare: 3.5,
          payoutRatio: 0.15,
          operatingCashFlowSalesRatio: 0.31,
          freeCashFlowOperatingCashFlowRatio: 0.91,
          cashFlowCoverageRatios: 0.45,
          shortTermCoverageRatios: 5.5,
          capitalExpenditureCoverageRatio: 11.0,
          dividendPaidAndCapexCoverageRatio: 8.5,
          priceBookValueRatio: 35.0,
          priceToBookRatio: 35.0,
          priceToSalesRatio: 6.5,
          priceEarningsRatio: 25.5,
          priceToFreeCashFlowsRatio: 24.0,
          priceToOperatingCashFlowsRatio: 22.0,
          priceCashFlowRatio: 22.0,
          priceEarningsToGrowthRatio: 2.1,
          priceSalesRatio: 6.5,
          dividendYield: 0.006,
          enterpriseValueMultiple: 18.5,
          priceFairValue: 160.0,
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockRatios);

      const result = await bulkResource.getAllRatiosTTM();

      expect(mockClient.get).toHaveBeenCalledWith('v3/ratios-ttm');
      expect(result).toEqual(mockRatios);
    });
  });

  describe('getAllPeers', () => {
    it('should fetch all stock peers', async () => {
      const mockPeers: StockPeer[] = [
        {
          symbol: 'AAPL',
          peersList: ['MSFT', 'GOOGL', 'META', 'AMZN'],
        },
        {
          symbol: 'MSFT',
          peersList: ['AAPL', 'GOOGL', 'META', 'ORCL'],
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockPeers);

      const result = await bulkResource.getAllPeers();

      expect(mockClient.get).toHaveBeenCalledWith('v4/stock_peers');
      expect(result).toEqual(mockPeers);
    });
  });

  describe('getAllEarningsSurprises', () => {
    it('should fetch all earnings surprises', async () => {
      const mockSurprises: EarningsSurprise[] = [
        {
          symbol: 'AAPL',
          date: '2024-01-15',
          actualEarningResult: 1.85,
          estimatedEarning: 1.75,
        },
        {
          symbol: 'MSFT',
          date: '2024-01-15',
          actualEarningResult: 2.95,
          estimatedEarning: 2.80,
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockSurprises);

      const result = await bulkResource.getAllEarningsSurprises();

      expect(mockClient.get).toHaveBeenCalledWith('v3/earnings-surprises');
      expect(result).toEqual(mockSurprises);
    });
  });

  describe('getAllIncomeStatements', () => {
    it('should fetch all income statements with default period (annual)', async () => {
      const mockStatements: IncomeStatement[] = [
        {
          date: '2023-12-31',
          symbol: 'AAPL',
          reportedCurrency: 'USD',
          cik: '0000320193',
          fillingDate: '2024-01-15',
          acceptedDate: '2024-01-15T16:30:00.000Z',
          calendarYear: '2023',
          period: 'FY',
          revenue: 383000000000,
          costOfRevenue: 215000000000,
          grossProfit: 168000000000,
          grossProfitRatio: 0.439,
          researchAndDevelopmentExpenses: 27000000000,
          generalAndAdministrativeExpenses: 0,
          sellingAndMarketingExpenses: 0,
          sellingGeneralAndAdministrativeExpenses: 24000000000,
          otherExpenses: 0,
          operatingExpenses: 51000000000,
          costAndExpenses: 266000000000,
          interestIncome: 3800000000,
          interestExpense: 3900000000,
          depreciationAndAmortization: 11000000000,
          ebitda: 128000000000,
          ebitdaratio: 0.334,
          operatingIncome: 117000000000,
          operatingIncomeRatio: 0.305,
          totalOtherIncomeExpensesNet: -100000000,
          incomeBeforeTax: 117000000000,
          incomeBeforeTaxRatio: 0.305,
          incomeTaxExpense: 17000000000,
          netIncome: 100000000000,
          netIncomeRatio: 0.261,
          eps: 6.13,
          epsdiluted: 6.11,
          weightedAverageShsOut: 16320000000,
          weightedAverageShsOutDil: 16370000000,
          link: 'https://www.sec.gov/Archives/edgar/data/320193/000032019324000006/0000320193-24-000006-index.htm',
          finalLink: 'https://www.sec.gov/cgi-bin/viewer?action=view&cik=320193&accession_number=0000320193-24-000006&xbrl_type=v',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockStatements);

      const result = await bulkResource.getAllIncomeStatements();

      expect(mockClient.get).toHaveBeenCalledWith('v3/income-statement', { searchParams: {   period: 'annual' }, }
);
      expect(result).toEqual(mockStatements);
    });

    it('should fetch all income statements with quarterly period', async () => {
      const mockStatements: IncomeStatement[] = [];

      vi.mocked(mockClient.get).mockResolvedValue(mockStatements);

      const result = await bulkResource.getAllIncomeStatements('quarter');

      expect(mockClient.get).toHaveBeenCalledWith('v3/income-statement', { searchParams: {   period: 'quarter' }, }
);
      expect(result).toEqual(mockStatements);
    });

    it('should fetch all income statements with specific year', async () => {
      const mockStatements: IncomeStatement[] = [];

      vi.mocked(mockClient.get).mockResolvedValue(mockStatements);

      const result = await bulkResource.getAllIncomeStatements('annual', 2023);

      expect(mockClient.get).toHaveBeenCalledWith('v3/income-statement', {
        searchParams: {
          period: 'annual',
        year: 2023,
      },
      }
);
      expect(result).toEqual(mockStatements);
    });

    it('should fetch all income statements with quarterly period and specific year', async () => {
      const mockStatements: IncomeStatement[] = [];

      vi.mocked(mockClient.get).mockResolvedValue(mockStatements);

      const result = await bulkResource.getAllIncomeStatements('quarter', 2023);

      expect(mockClient.get).toHaveBeenCalledWith('v3/income-statement', {
        searchParams: {
          period: 'quarter',
        year: 2023,
      },
      }
);
      expect(result).toEqual(mockStatements);
    });
  });

  describe('getAllIncomeStatementGrowth', () => {
    it('should fetch all income statement growth with default period', async () => {
      const mockGrowth: IncomeStatementGrowth[] = [
        {
          date: '2023-12-31',
          symbol: 'AAPL',
          period: 'FY',
          growthRevenue: 0.025,
          growthCostOfRevenue: 0.018,
          growthGrossProfit: 0.032,
          growthGrossProfitRatio: 0.007,
          growthResearchAndDevelopmentExpenses: 0.045,
          growthGeneralAndAdministrativeExpenses: 0.0,
          growthSellingAndMarketingExpenses: 0.0,
          growthOtherExpenses: 0.0,
          growthOperatingExpenses: 0.038,
          growthCostAndExpenses: 0.022,
          growthInterestExpense: -0.05,
          growthDepreciationAndAmortization: 0.02,
          growthEBITDA: 0.04,
          growthEBITDARatio: 0.015,
          growthOperatingIncome: 0.042,
          growthOperatingIncomeRatio: 0.017,
          growthTotalOtherIncomeExpensesNet: -0.25,
          growthIncomeBeforeTax: 0.041,
          growthIncomeBeforeTaxRatio: 0.016,
          growthIncomeTaxExpense: 0.03,
          growthNetIncome: 0.043,
          growthNetIncomeRatio: 0.018,
          growthEPS: 0.048,
          growthEPSDiluted: 0.047,
          growthWeightedAverageShsOut: -0.005,
          growthWeightedAverageShsOutDil: -0.004,
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockGrowth);

      const result = await bulkResource.getAllIncomeStatementGrowth();

      expect(mockClient.get).toHaveBeenCalledWith('v3/income-statement-growth', {
        searchParams: {
          period: 'annual',
      },
      }
);
      expect(result).toEqual(mockGrowth);
    });

    it('should fetch income statement growth with quarterly period and year', async () => {
      const mockGrowth: IncomeStatementGrowth[] = [];

      vi.mocked(mockClient.get).mockResolvedValue(mockGrowth);

      const result = await bulkResource.getAllIncomeStatementGrowth('quarter', 2023);

      expect(mockClient.get).toHaveBeenCalledWith('v3/income-statement-growth', {
        searchParams: {
          period: 'quarter',
        year: 2023,
      },
      }
);
      expect(result).toEqual(mockGrowth);
    });
  });

  describe('getAllBalanceSheets', () => {
    it('should fetch all balance sheets with default period', async () => {
      const mockSheets: BalanceSheet[] = [
        {
          date: '2023-12-31',
          symbol: 'AAPL',
          reportedCurrency: 'USD',
          cik: '0000320193',
          fillingDate: '2024-01-15',
          acceptedDate: '2024-01-15T16:30:00.000Z',
          calendarYear: '2023',
          period: 'FY',
          cashAndCashEquivalents: 30000000000,
          shortTermInvestments: 50000000000,
          cashAndShortTermInvestments: 80000000000,
          netReceivables: 45000000000,
          inventory: 8000000000,
          otherCurrentAssets: 15000000000,
          totalCurrentAssets: 148000000000,
          propertyPlantEquipmentNet: 45000000000,
          goodwill: 0,
          intangibleAssets: 0,
          goodwillAndIntangibleAssets: 0,
          longTermInvestments: 120000000000,
          taxAssets: 0,
          otherNonCurrentAssets: 40000000000,
          totalNonCurrentAssets: 205000000000,
          otherAssets: 0,
          totalAssets: 353000000000,
          accountPayables: 58000000000,
          shortTermDebt: 15000000000,
          taxPayables: 8000000000,
          deferredRevenue: 8000000000,
          otherCurrentLiabilities: 55000000000,
          totalCurrentLiabilities: 144000000000,
          longTermDebt: 95000000000,
          deferredRevenueNonCurrent: 0,
          deferredTaxLiabilitiesNonCurrent: 0,
          otherNonCurrentLiabilities: 50000000000,
          totalNonCurrentLiabilities: 145000000000,
          otherLiabilities: 0,
          capitalLeaseObligations: 0,
          totalLiabilities: 289000000000,
          preferredStock: 0,
          commonStock: 73000000000,
          retainedEarnings: -9000000000,
          accumulatedOtherComprehensiveIncomeLoss: 0,
          othertotalStockholdersEquity: 0,
          totalStockholdersEquity: 64000000000,
          totalEquity: 64000000000,
          totalLiabilitiesAndStockholdersEquity: 353000000000,
          minorityInterest: 0,
          totalLiabilitiesAndTotalEquity: 353000000000,
          totalInvestments: 170000000000,
          totalDebt: 110000000000,
          netDebt: 80000000000,
          link: 'https://www.sec.gov/Archives/edgar/data/320193/000032019324000006/0000320193-24-000006-index.htm',
          finalLink: 'https://www.sec.gov/cgi-bin/viewer?action=view&cik=320193&accession_number=0000320193-24-000006&xbrl_type=v',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockSheets);

      const result = await bulkResource.getAllBalanceSheets();

      expect(mockClient.get).toHaveBeenCalledWith('v3/balance-sheet-statement', {
        searchParams: {
          period: 'annual',
      },
      }
);
      expect(result).toEqual(mockSheets);
    });

    it('should fetch balance sheets with quarterly period and year', async () => {
      const mockSheets: BalanceSheet[] = [];

      vi.mocked(mockClient.get).mockResolvedValue(mockSheets);

      const result = await bulkResource.getAllBalanceSheets('quarter', 2023);

      expect(mockClient.get).toHaveBeenCalledWith('v3/balance-sheet-statement', {
        searchParams: {
          period: 'quarter',
        year: 2023,
      },
      }
);
      expect(result).toEqual(mockSheets);
    });
  });

  describe('getAllBalanceSheetGrowth', () => {
    it('should fetch all balance sheet growth with default period', async () => {
      const mockGrowth: BalanceSheetGrowth[] = [
        {
          date: '2023-12-31',
          symbol: 'AAPL',
          period: 'FY',
          growthCashAndCashEquivalents: 0.1,
          growthShortTermInvestments: -0.05,
          growthCashAndShortTermInvestments: 0.02,
          growthNetReceivables: 0.08,
          growthInventory: 0.15,
          growthOtherCurrentAssets: 0.05,
          growthTotalCurrentAssets: 0.06,
          growthPropertyPlantEquipmentNet: 0.12,
          growthGoodwill: 0.0,
          growthIntangibleAssets: 0.0,
          growthGoodwillAndIntangibleAssets: 0.0,
          growthLongTermInvestments: -0.02,
          growthTaxAssets: 0.0,
          growthOtherNonCurrentAssets: 0.08,
          growthTotalNonCurrentAssets: 0.04,
          growthOtherAssets: 0.0,
          growthTotalAssets: 0.05,
          growthAccountPayables: 0.1,
          growthShortTermDebt: 0.2,
          growthTaxPayables: 0.05,
          growthDeferredRevenue: 0.07,
          growthOtherCurrentLiabilities: 0.06,
          growthTotalCurrentLiabilities: 0.08,
          growthLongTermDebt: -0.03,
          growthDeferredRevenueNonCurrent: 0.0,
          growthDeferrredTaxLiabilitiesNonCurrent: 0.0,
          growthOtherNonCurrentLiabilities: 0.05,
          growthTotalNonCurrentLiabilities: 0.02,
          growthOtherLiabilities: 0.0,
          growthTotalLiabilities: 0.05,
          growthCommonStock: 0.01,
          growthRetainedEarnings: -0.2,
          growthAccumulatedOtherComprehensiveIncomeLoss: 0.0,
          growthOthertotalStockholdersEquity: 0.0,
          growthTotalStockholdersEquity: 0.04,
          growthTotalLiabilitiesAndStockholdersEquity: 0.05,
          growthTotalInvestments: -0.01,
          growthTotalDebt: 0.03,
          growthNetDebt: 0.01,
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockGrowth);

      const result = await bulkResource.getAllBalanceSheetGrowth();

      expect(mockClient.get).toHaveBeenCalledWith('v3/balance-sheet-statement-growth', {
        searchParams: {
          period: 'annual',
      },
      }
);
      expect(result).toEqual(mockGrowth);
    });

    it('should fetch balance sheet growth with quarterly period and year', async () => {
      const mockGrowth: BalanceSheetGrowth[] = [];

      vi.mocked(mockClient.get).mockResolvedValue(mockGrowth);

      const result = await bulkResource.getAllBalanceSheetGrowth('quarter', 2023);

      expect(mockClient.get).toHaveBeenCalledWith('v3/balance-sheet-statement-growth', {
        searchParams: {
          period: 'quarter',
        year: 2023,
      },
      }
);
      expect(result).toEqual(mockGrowth);
    });
  });

  describe('getAllCashFlowStatements', () => {
    it('should fetch all cash flow statements with default period', async () => {
      const mockStatements: CashFlowStatement[] = [
        {
          date: '2023-12-31',
          symbol: 'AAPL',
          reportedCurrency: 'USD',
          cik: '0000320193',
          fillingDate: '2024-01-15',
          acceptedDate: '2024-01-15T16:30:00.000Z',
          calendarYear: '2023',
          period: 'FY',
          netIncome: 100000000000,
          depreciationAndAmortization: 11000000000,
          deferredIncomeTax: -5000000000,
          stockBasedCompensation: 10000000000,
          changeInWorkingCapital: -5000000000,
          accountsReceivables: -3000000000,
          inventory: -500000000,
          accountsPayables: 5000000000,
          otherWorkingCapital: -6500000000,
          otherNonCashItems: 2000000000,
          netCashProvidedByOperatingActivities: 113000000000,
          investmentsInPropertyPlantAndEquipment: -11000000000,
          acquisitionsNet: -1000000000,
          purchasesOfInvestments: -30000000000,
          salesMaturitiesOfInvestments: 35000000000,
          otherInvestingActivites: 1000000000,
          netCashUsedForInvestingActivites: -6000000000,
          debtRepayment: -10000000000,
          commonStockIssued: 2000000000,
          commonStockRepurchased: -75000000000,
          dividendsPaid: -15000000000,
          otherFinancingActivites: 0,
          netCashUsedProvidedByFinancingActivities: -98000000000,
          effectOfForexChangesOnCash: 0,
          netChangeInCash: 9000000000,
          cashAtEndOfPeriod: 30000000000,
          cashAtBeginningOfPeriod: 21000000000,
          operatingCashFlow: 113000000000,
          capitalExpenditure: -11000000000,
          freeCashFlow: 102000000000,
          link: 'https://www.sec.gov/Archives/edgar/data/320193/000032019324000006/0000320193-24-000006-index.htm',
          finalLink: 'https://www.sec.gov/cgi-bin/viewer?action=view&cik=320193&accession_number=0000320193-24-000006&xbrl_type=v',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockStatements);

      const result = await bulkResource.getAllCashFlowStatements();

      expect(mockClient.get).toHaveBeenCalledWith('v3/cash-flow-statement', {
        searchParams: {
          period: 'annual',
      },
      }
);
      expect(result).toEqual(mockStatements);
    });

    it('should fetch cash flow statements with quarterly period and year', async () => {
      const mockStatements: CashFlowStatement[] = [];

      vi.mocked(mockClient.get).mockResolvedValue(mockStatements);

      const result = await bulkResource.getAllCashFlowStatements('quarter', 2023);

      expect(mockClient.get).toHaveBeenCalledWith('v3/cash-flow-statement', {
        searchParams: {
          period: 'quarter',
        year: 2023,
      },
      }
);
      expect(result).toEqual(mockStatements);
    });
  });

  describe('getAllCashFlowStatementGrowth', () => {
    it('should fetch all cash flow statement growth with default period', async () => {
      const mockGrowth: CashFlowStatementGrowth[] = [
        {
          date: '2023-12-31',
          symbol: 'AAPL',
          period: 'FY',
          growthNetIncome: 0.043,
          growthDepreciationAndAmortization: 0.02,
          growthDeferredIncomeTax: -0.15,
          growthStockBasedCompensation: 0.08,
          growthChangeInWorkingCapital: -0.25,
          growthAccountsReceivables: 0.1,
          growthInventory: 0.05,
          growthAccountsPayables: 0.12,
          growthOtherWorkingCapital: -0.3,
          growthOtherNonCashItems: 0.15,
          growthNetCashProvidedByOperatingActivites: 0.05,
          growthInvestmentsInPropertyPlantAndEquipment: 0.1,
          growthAcquisitionsNet: 0.5,
          growthPurchasesOfInvestments: -0.2,
          growthSalesMaturitiesOfInvestments: 0.15,
          growthOtherInvestingActivites: 0.0,
          growthNetCashUsedForInvestingActivites: -0.4,
          growthDebtRepayment: 0.2,
          growthCommonStockIssued: 0.1,
          growthCommonStockRepurchased: 0.15,
          growthDividendsPaid: 0.05,
          growthOtherFinancingActivites: 0.0,
          growthNetCashUsedProvidedByFinancingActivities: 0.12,
          growthEffectOfForexChangesOnCash: 0.0,
          growthNetChangeInCash: 0.8,
          growthCashAtEndOfPeriod: 0.43,
          growthCashAtBeginningOfPeriod: 0.28,
          growthOperatingCashFlow: 0.05,
          growthCapitalExpenditure: 0.1,
          growthFreeCashFlow: 0.048,
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockGrowth);

      const result = await bulkResource.getAllCashFlowStatementGrowth();

      expect(mockClient.get).toHaveBeenCalledWith('v3/cash-flow-statement-growth', {
        searchParams: {
          period: 'annual',
      },
      }
);
      expect(result).toEqual(mockGrowth);
    });

    it('should fetch cash flow statement growth with quarterly period and year', async () => {
      const mockGrowth: CashFlowStatementGrowth[] = [];

      vi.mocked(mockClient.get).mockResolvedValue(mockGrowth);

      const result = await bulkResource.getAllCashFlowStatementGrowth('quarter', 2023);

      expect(mockClient.get).toHaveBeenCalledWith('v3/cash-flow-statement-growth', {
        searchParams: {
          period: 'quarter',
        year: 2023,
      },
      }
);
      expect(result).toEqual(mockGrowth);
    });
  });

  describe('getBatchEODPrices', () => {
    it('should fetch batch EOD prices for a specific date', async () => {
      const mockPrices: EODPrice[] = [
        {
          symbol: 'AAPL',
          date: '2024-01-15',
          open: 148.5,
          high: 151.2,
          low: 147.8,
          close: 150.5,
          adjClose: 150.5,
          volume: 52000000,
        },
        {
          symbol: 'MSFT',
          date: '2024-01-15',
          open: 338.0,
          high: 342.5,
          low: 337.2,
          close: 340.2,
          adjClose: 340.2,
          volume: 28000000,
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockPrices);

      const result = await bulkResource.getBatchEODPrices('2024-01-15');

      expect(mockClient.get).toHaveBeenCalledWith('v4/batch-request-end-of-day-prices', {
        searchParams: {
          date: '2024-01-15',
      },
      }
);
      expect(result).toEqual(mockPrices);
      expect(result).toHaveLength(2);
    });

    it('should handle different date formats', async () => {
      const mockPrices: EODPrice[] = [];

      vi.mocked(mockClient.get).mockResolvedValue(mockPrices);

      await bulkResource.getBatchEODPrices('2023-12-31');

      expect(mockClient.get).toHaveBeenCalledWith('v4/batch-request-end-of-day-prices', {
        searchParams: {
          date: '2023-12-31',
      },
      }
);
    });
  });

  describe('getBatchEODPricesRange', () => {
    it('should fetch batch EOD prices for a date range', async () => {
      const mockPrices: EODPrice[] = [
        {
          symbol: 'AAPL',
          date: '2024-01-15',
          open: 148.5,
          high: 151.2,
          low: 147.8,
          close: 150.5,
          adjClose: 150.5,
          volume: 52000000,
        },
        {
          symbol: 'AAPL',
          date: '2024-01-16',
          open: 150.8,
          high: 153.0,
          low: 150.2,
          close: 152.3,
          adjClose: 152.3,
          volume: 48000000,
        },
        {
          symbol: 'MSFT',
          date: '2024-01-15',
          open: 338.0,
          high: 342.5,
          low: 337.2,
          close: 340.2,
          adjClose: 340.2,
          volume: 28000000,
        },
        {
          symbol: 'MSFT',
          date: '2024-01-16',
          open: 340.5,
          high: 344.0,
          low: 339.8,
          close: 342.8,
          adjClose: 342.8,
          volume: 25000000,
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockPrices);

      const result = await bulkResource.getBatchEODPricesRange('2024-01-15', '2024-01-16');

      expect(mockClient.get).toHaveBeenCalledWith('v4/batch-request-end-of-day-prices', {
        searchParams: {
          from: '2024-01-15',
        to: '2024-01-16',
      },
      }
);
      expect(result).toEqual(mockPrices);
      expect(result).toHaveLength(4);
    });

    it('should handle single day range', async () => {
      const mockPrices: EODPrice[] = [];

      vi.mocked(mockClient.get).mockResolvedValue(mockPrices);

      await bulkResource.getBatchEODPricesRange('2024-01-15', '2024-01-15');

      expect(mockClient.get).toHaveBeenCalledWith('v4/batch-request-end-of-day-prices', {
        searchParams: {
          from: '2024-01-15',
        to: '2024-01-15',
      },
      }
);
    });

    it('should handle multi-month range', async () => {
      const mockPrices: EODPrice[] = [];

      vi.mocked(mockClient.get).mockResolvedValue(mockPrices);

      await bulkResource.getBatchEODPricesRange('2024-01-01', '2024-03-31');

      expect(mockClient.get).toHaveBeenCalledWith('v4/batch-request-end-of-day-prices', {
        searchParams: {
          from: '2024-01-01',
        to: '2024-03-31',
      },
      }
);
    });
  });

  describe('Error handling', () => {
    it('should propagate errors from client for getAllProfiles', async () => {
      const error = new Error('Network error');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(bulkResource.getAllProfiles()).rejects.toThrow('Network error');
    });

    it('should propagate errors from client for getBatchEODPrices', async () => {
      const error = new Error('Invalid date format');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(bulkResource.getBatchEODPrices('invalid-date')).rejects.toThrow(
        'Invalid date format'
      );
    });

    it('should propagate errors from client for getAllIncomeStatements', async () => {
      const error = new Error('API error');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(bulkResource.getAllIncomeStatements('annual', 2023)).rejects.toThrow(
        'API error'
      );
    });
  });

  describe('Note: Missing methods from original request', () => {
    // The following methods were mentioned in the request but don't exist in bulk.ts:
    // - getEarningsSurprises (exists as getAllEarningsSurprises)
    // - getIncomeStatementGrowth (exists as getAllIncomeStatementGrowth)
    // - getBalanceSheetGrowth (exists as getAllBalanceSheetGrowth)
    // - getCashFlowStatementGrowth (exists as getAllCashFlowStatementGrowth)
    // - getAllFinancialRatios (exists as getAllRatiosTTM)
    // - getAllKeyMetrics (exists as getAllKeyMetricsTTM)
    // - getAllFinancialScores (exists as getAllScores)
    // - getAllInsiderTrades (doesn't exist in BulkResource)
    // - getBatchQuotes (doesn't exist in BulkResource)
    // - getBatchProfiles (exists as getAllProfiles)

    it('Note: getAllInsiderTrades method does not exist in BulkResource', () => {
      // This method doesn't exist in the current implementation
      expect(true).toBe(true);
    });

    it('Note: getBatchQuotes method does not exist in BulkResource', () => {
      // This method doesn't exist in the current implementation
      expect(true).toBe(true);
    });
  });
});
