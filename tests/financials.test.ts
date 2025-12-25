import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FinancialsResource } from '../src/resources/financials.js';
import { Period } from '../src/types/index.js';
import type { FMPClient } from '../src/client.js';
import type {
  IncomeStatement,
  BalanceSheet,
  CashFlowStatement,
  FinancialRatios,
  KeyMetrics,
  FinancialScores,
  OwnerEarnings,
  FinancialGrowth,
  ReportDate,
  LatestFinancialStatement,
  FinancialReportDownload,
} from '../src/types/index.js';

describe('FinancialsResource', () => {
  let financials: FinancialsResource;
  let mockClient: FMPClient;

  beforeEach(() => {
    mockClient = {
      get: vi.fn(),
    } as unknown as FMPClient;
    financials = new FinancialsResource(mockClient);
  });

  describe('getIncomeStatement', () => {
    it('should fetch income statement with default parameters', async () => {
      const mockData: IncomeStatement[] = [
        {
          date: '2023-12-31',
          symbol: 'AAPL',
          reportedCurrency: 'USD',
          cik: '0000320193',
          fillingDate: '2024-01-01',
          acceptedDate: '2024-01-01T12:00:00.000Z',
          calendarYear: '2023',
          period: 'FY',
          revenue: 383285000000,
          costOfRevenue: 214137000000,
          grossProfit: 169148000000,
          grossProfitRatio: 0.4413,
          researchAndDevelopmentExpenses: 29915000000,
          generalAndAdministrativeExpenses: 0,
          sellingAndMarketingExpenses: 0,
          sellingGeneralAndAdministrativeExpenses: 24932000000,
          otherExpenses: 0,
          operatingExpenses: 54847000000,
          costAndExpenses: 268984000000,
          interestIncome: 3750000000,
          interestExpense: 3933000000,
          depreciationAndAmortization: 11519000000,
          ebitda: 125820000000,
          ebitdaratio: 0.3283,
          operatingIncome: 114301000000,
          operatingIncomeRatio: 0.2982,
          totalOtherIncomeExpensesNet: -565000000,
          incomeBeforeTax: 113736000000,
          incomeBeforeTaxRatio: 0.2968,
          incomeTaxExpense: 16741000000,
          netIncome: 96995000000,
          netIncomeRatio: 0.253,
          eps: 6.16,
          epsdiluted: 6.13,
          weightedAverageShsOut: 15744231000,
          weightedAverageShsOutDil: 15812547000,
          link: 'https://www.sec.gov/cgi-bin/viewer?action=view&cik=320193&accession_number=0000320193-24-000081&xbrl_type=v',
          finalLink:
            'https://www.sec.gov/cgi-bin/viewer?action=view&cik=320193&accession_number=0000320193-24-000081&xbrl_type=v',
        },
      ];

      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      const result = await financials.getIncomeStatement('AAPL');

      expect(mockClient.get).toHaveBeenCalledWith('income-statement', {
        searchParams: { symbol: 'AAPL', period: 'annual' },
      });
      expect(result).toEqual(mockData);
    });

    it('should fetch income statement with quarterly period', async () => {
      const mockData: IncomeStatement[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await financials.getIncomeStatement('AAPL', Period.Quarter);

      expect(mockClient.get).toHaveBeenCalledWith('income-statement', {
        searchParams: { symbol: 'AAPL', period: 'quarter' },
      });
    });

    it('should fetch income statement with limit', async () => {
      const mockData: IncomeStatement[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await financials.getIncomeStatement('AAPL', Period.Annual, 5);

      expect(mockClient.get).toHaveBeenCalledWith('income-statement', {
        searchParams: { symbol: 'AAPL', period: 'annual', limit: 5 },
      });
    });

    it('should normalize symbol to uppercase', async () => {
      const mockData: IncomeStatement[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await financials.getIncomeStatement('aapl');

      expect(mockClient.get).toHaveBeenCalledWith('income-statement', {
        searchParams: { symbol: 'AAPL', period: 'annual' },
      });
    });

    it('should handle API errors', async () => {
      const error = new Error('API Error');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(financials.getIncomeStatement('AAPL')).rejects.toThrow('API Error');
    });
  });

  describe('getBalanceSheet', () => {
    it('should fetch balance sheet with default parameters', async () => {
      const mockData: BalanceSheet[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await financials.getBalanceSheet('MSFT');

      expect(mockClient.get).toHaveBeenCalledWith('balance-sheet-statement', {
        searchParams: { symbol: 'MSFT', period: 'annual' },
      });
    });

    it('should fetch balance sheet with quarterly period', async () => {
      const mockData: BalanceSheet[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await financials.getBalanceSheet('MSFT', Period.Quarter);

      expect(mockClient.get).toHaveBeenCalledWith('balance-sheet-statement', {
        searchParams: { symbol: 'MSFT', period: 'quarter' },
      });
    });

    it('should fetch balance sheet with limit', async () => {
      const mockData: BalanceSheet[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await financials.getBalanceSheet('MSFT', Period.Annual, 10);

      expect(mockClient.get).toHaveBeenCalledWith('balance-sheet-statement', {
        searchParams: { symbol: 'MSFT', period: 'annual', limit: 10 },
      });
    });

    it('should normalize symbol to uppercase', async () => {
      const mockData: BalanceSheet[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await financials.getBalanceSheet('msft');

      expect(mockClient.get).toHaveBeenCalledWith('balance-sheet-statement', {
        searchParams: { symbol: 'MSFT', period: 'annual' },
      });
    });
  });

  describe('getCashFlowStatement', () => {
    it('should fetch cash flow statement with default parameters', async () => {
      const mockData: CashFlowStatement[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await financials.getCashFlowStatement('GOOGL');

      expect(mockClient.get).toHaveBeenCalledWith('cash-flow-statement', {
        searchParams: { symbol: 'GOOGL', period: 'annual' },
      });
    });

    it('should fetch cash flow statement with quarterly period', async () => {
      const mockData: CashFlowStatement[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await financials.getCashFlowStatement('GOOGL', Period.Quarter);

      expect(mockClient.get).toHaveBeenCalledWith('cash-flow-statement', {
        searchParams: { symbol: 'GOOGL', period: 'quarter' },
      });
    });

    it('should fetch cash flow statement with limit', async () => {
      const mockData: CashFlowStatement[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await financials.getCashFlowStatement('GOOGL', Period.Annual, 3);

      expect(mockClient.get).toHaveBeenCalledWith('cash-flow-statement', {
        searchParams: { symbol: 'GOOGL', period: 'annual', limit: 3 },
      });
    });

    it('should normalize symbol to uppercase', async () => {
      const mockData: CashFlowStatement[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await financials.getCashFlowStatement('googl');

      expect(mockClient.get).toHaveBeenCalledWith('cash-flow-statement', {
        searchParams: { symbol: 'GOOGL', period: 'annual' },
      });
    });
  });

  describe('TTM methods', () => {
    describe('getIncomeStatementTTM', () => {
      it('should fetch TTM income statement', async () => {
        const mockData: IncomeStatement[] = [];
        vi.mocked(mockClient.get).mockResolvedValue(mockData);

        await financials.getIncomeStatementTTM('AAPL');

        expect(mockClient.get).toHaveBeenCalledWith('income-statement-ttm', {
          searchParams: { symbol: 'AAPL' },
        });
      });

      it('should normalize symbol to uppercase', async () => {
        const mockData: IncomeStatement[] = [];
        vi.mocked(mockClient.get).mockResolvedValue(mockData);

        await financials.getIncomeStatementTTM('aapl');

        expect(mockClient.get).toHaveBeenCalledWith('income-statement-ttm', {
          searchParams: { symbol: 'AAPL' },
        });
      });
    });

    describe('getBalanceSheetTTM', () => {
      it('should fetch TTM balance sheet', async () => {
        const mockData: BalanceSheet[] = [];
        vi.mocked(mockClient.get).mockResolvedValue(mockData);

        await financials.getBalanceSheetTTM('MSFT');

        expect(mockClient.get).toHaveBeenCalledWith('balance-sheet-statement-ttm', {
          searchParams: { symbol: 'MSFT' },
        });
      });
    });

    describe('getCashFlowStatementTTM', () => {
      it('should fetch TTM cash flow statement', async () => {
        const mockData: CashFlowStatement[] = [];
        vi.mocked(mockClient.get).mockResolvedValue(mockData);

        await financials.getCashFlowStatementTTM('GOOGL');

        expect(mockClient.get).toHaveBeenCalledWith('cash-flow-statement-ttm', {
          searchParams: { symbol: 'GOOGL' },
        });
      });
    });
  });

  describe('getRatios', () => {
    it('should fetch financial ratios with default parameters', async () => {
      const mockData: FinancialRatios[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await financials.getRatios('TSLA');

      expect(mockClient.get).toHaveBeenCalledWith('ratios', {
        searchParams: { symbol: 'TSLA', period: 'annual' },
      });
    });

    it('should fetch financial ratios with quarterly period', async () => {
      const mockData: FinancialRatios[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await financials.getRatios('TSLA', Period.Quarter);

      expect(mockClient.get).toHaveBeenCalledWith('ratios', {
        searchParams: { symbol: 'TSLA', period: 'quarter' },
      });
    });

    it('should fetch financial ratios with limit', async () => {
      const mockData: FinancialRatios[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await financials.getRatios('TSLA', Period.Annual, 7);

      expect(mockClient.get).toHaveBeenCalledWith('ratios', {
        searchParams: { symbol: 'TSLA', period: 'annual', limit: 7 },
      });
    });

    it('should normalize symbol to uppercase', async () => {
      const mockData: FinancialRatios[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await financials.getRatios('tsla');

      expect(mockClient.get).toHaveBeenCalledWith('ratios', {
        searchParams: { symbol: 'TSLA', period: 'annual' },
      });
    });
  });

  describe('getRatiosTTM', () => {
    it('should fetch TTM financial ratios', async () => {
      const mockData: FinancialRatios[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await financials.getRatiosTTM('NVDA');

      expect(mockClient.get).toHaveBeenCalledWith('ratios-ttm', {
        searchParams: { symbol: 'NVDA' },
      });
    });

    it('should normalize symbol to uppercase', async () => {
      const mockData: FinancialRatios[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await financials.getRatiosTTM('nvda');

      expect(mockClient.get).toHaveBeenCalledWith('ratios-ttm', {
        searchParams: { symbol: 'NVDA' },
      });
    });
  });

  describe('getKeyMetrics', () => {
    it('should fetch key metrics with default parameters', async () => {
      const mockData: KeyMetrics[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await financials.getKeyMetrics('AMZN');

      expect(mockClient.get).toHaveBeenCalledWith('key-metrics', {
        searchParams: { symbol: 'AMZN', period: 'annual' },
      });
    });

    it('should fetch key metrics with quarterly period', async () => {
      const mockData: KeyMetrics[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await financials.getKeyMetrics('AMZN', Period.Quarter);

      expect(mockClient.get).toHaveBeenCalledWith('key-metrics', {
        searchParams: { symbol: 'AMZN', period: 'quarter' },
      });
    });

    it('should fetch key metrics with limit', async () => {
      const mockData: KeyMetrics[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await financials.getKeyMetrics('AMZN', Period.Annual, 4);

      expect(mockClient.get).toHaveBeenCalledWith('key-metrics', {
        searchParams: { symbol: 'AMZN', period: 'annual', limit: 4 },
      });
    });

    it('should normalize symbol to uppercase', async () => {
      const mockData: KeyMetrics[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await financials.getKeyMetrics('amzn');

      expect(mockClient.get).toHaveBeenCalledWith('key-metrics', {
        searchParams: { symbol: 'AMZN', period: 'annual' },
      });
    });
  });

  describe('getKeyMetricsTTM', () => {
    it('should fetch TTM key metrics', async () => {
      const mockData: KeyMetrics[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await financials.getKeyMetricsTTM('META');

      expect(mockClient.get).toHaveBeenCalledWith('key-metrics-ttm', {
        searchParams: { symbol: 'META' },
      });
    });

    it('should normalize symbol to uppercase', async () => {
      const mockData: KeyMetrics[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await financials.getKeyMetricsTTM('meta');

      expect(mockClient.get).toHaveBeenCalledWith('key-metrics-ttm', {
        searchParams: { symbol: 'META' },
      });
    });
  });

  describe('getEnterpriseValues', () => {
    it('should fetch enterprise values with default parameters', async () => {
      const mockData: Record<string, unknown>[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await financials.getEnterpriseValues('NFLX');

      expect(mockClient.get).toHaveBeenCalledWith('enterprise-values', {
        searchParams: { symbol: 'NFLX', period: 'annual' },
      });
    });

    it('should fetch enterprise values with quarterly period', async () => {
      const mockData: Record<string, unknown>[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await financials.getEnterpriseValues('NFLX', Period.Quarter);

      expect(mockClient.get).toHaveBeenCalledWith('enterprise-values', {
        searchParams: { symbol: 'NFLX', period: 'quarter' },
      });
    });

    it('should fetch enterprise values with limit', async () => {
      const mockData: Record<string, unknown>[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await financials.getEnterpriseValues('NFLX', Period.Annual, 6);

      expect(mockClient.get).toHaveBeenCalledWith('enterprise-values', {
        searchParams: { symbol: 'NFLX', period: 'annual', limit: 6 },
      });
    });
  });

  describe('Growth methods', () => {
    describe('getIncomeStatementGrowth', () => {
      it('should fetch income statement growth with default parameters', async () => {
        const mockData: Record<string, unknown>[] = [];
        vi.mocked(mockClient.get).mockResolvedValue(mockData);

        await financials.getIncomeStatementGrowth('AAPL');

        expect(mockClient.get).toHaveBeenCalledWith('income-statement-growth', {
          searchParams: { symbol: 'AAPL', period: 'annual' },
        });
      });

      it('should fetch income statement growth with quarterly period and limit', async () => {
        const mockData: Record<string, unknown>[] = [];
        vi.mocked(mockClient.get).mockResolvedValue(mockData);

        await financials.getIncomeStatementGrowth('AAPL', Period.Quarter, 8);

        expect(mockClient.get).toHaveBeenCalledWith('income-statement-growth', {
          searchParams: { symbol: 'AAPL', period: 'quarter', limit: 8 },
        });
      });
    });

    describe('getBalanceSheetGrowth', () => {
      it('should fetch balance sheet growth with default parameters', async () => {
        const mockData: Record<string, unknown>[] = [];
        vi.mocked(mockClient.get).mockResolvedValue(mockData);

        await financials.getBalanceSheetGrowth('MSFT');

        expect(mockClient.get).toHaveBeenCalledWith('balance-sheet-statement-growth', {
          searchParams: { symbol: 'MSFT', period: 'annual' },
        });
      });

      it('should fetch balance sheet growth with quarterly period and limit', async () => {
        const mockData: Record<string, unknown>[] = [];
        vi.mocked(mockClient.get).mockResolvedValue(mockData);

        await financials.getBalanceSheetGrowth('MSFT', Period.Quarter, 12);

        expect(mockClient.get).toHaveBeenCalledWith('balance-sheet-statement-growth', {
          searchParams: { symbol: 'MSFT', period: 'quarter', limit: 12 },
        });
      });
    });

    describe('getCashFlowStatementGrowth', () => {
      it('should fetch cash flow statement growth with default parameters', async () => {
        const mockData: Record<string, unknown>[] = [];
        vi.mocked(mockClient.get).mockResolvedValue(mockData);

        await financials.getCashFlowStatementGrowth('GOOGL');

        expect(mockClient.get).toHaveBeenCalledWith('cash-flow-statement-growth', {
          searchParams: { symbol: 'GOOGL', period: 'annual' },
        });
      });

      it('should fetch cash flow statement growth with quarterly period and limit', async () => {
        const mockData: Record<string, unknown>[] = [];
        vi.mocked(mockClient.get).mockResolvedValue(mockData);

        await financials.getCashFlowStatementGrowth('GOOGL', Period.Quarter, 5);

        expect(mockClient.get).toHaveBeenCalledWith('cash-flow-statement-growth', {
          searchParams: { symbol: 'GOOGL', period: 'quarter', limit: 5 },
        });
      });
    });
  });

  describe('Revenue segmentation', () => {
    describe('getRevenueByProduct', () => {
      it('should fetch revenue by product with default period', async () => {
        const mockData: Record<string, unknown>[] = [];
        vi.mocked(mockClient.get).mockResolvedValue(mockData);

        await financials.getRevenueByProduct('AAPL');

        expect(mockClient.get).toHaveBeenCalledWith('revenue-product-segmentation', {
          searchParams: { symbol: 'AAPL', period: 'annual', structure: 'flat' },
        });
      });

      it('should fetch revenue by product with quarterly period', async () => {
        const mockData: Record<string, unknown>[] = [];
        vi.mocked(mockClient.get).mockResolvedValue(mockData);

        await financials.getRevenueByProduct('AAPL', Period.Quarter);

        expect(mockClient.get).toHaveBeenCalledWith('revenue-product-segmentation', {
          searchParams: { symbol: 'AAPL', period: 'quarter', structure: 'flat' },
        });
      });

      it('should normalize symbol to uppercase', async () => {
        const mockData: Record<string, unknown>[] = [];
        vi.mocked(mockClient.get).mockResolvedValue(mockData);

        await financials.getRevenueByProduct('aapl');

        expect(mockClient.get).toHaveBeenCalledWith('revenue-product-segmentation', {
          searchParams: { symbol: 'AAPL', period: 'annual', structure: 'flat' },
        });
      });
    });

    describe('getRevenueByGeography', () => {
      it('should fetch revenue by geography with default period', async () => {
        const mockData: Record<string, unknown>[] = [];
        vi.mocked(mockClient.get).mockResolvedValue(mockData);

        await financials.getRevenueByGeography('MSFT');

        expect(mockClient.get).toHaveBeenCalledWith('revenue-geographic-segmentation', {
          searchParams: { symbol: 'MSFT', period: 'annual', structure: 'flat' },
        });
      });

      it('should fetch revenue by geography with quarterly period', async () => {
        const mockData: Record<string, unknown>[] = [];
        vi.mocked(mockClient.get).mockResolvedValue(mockData);

        await financials.getRevenueByGeography('MSFT', Period.Quarter);

        expect(mockClient.get).toHaveBeenCalledWith('revenue-geographic-segmentation', {
          searchParams: { symbol: 'MSFT', period: 'quarter', structure: 'flat' },
        });
      });

      it('should normalize symbol to uppercase', async () => {
        const mockData: Record<string, unknown>[] = [];
        vi.mocked(mockClient.get).mockResolvedValue(mockData);

        await financials.getRevenueByGeography('msft');

        expect(mockClient.get).toHaveBeenCalledWith('revenue-geographic-segmentation', {
          searchParams: { symbol: 'MSFT', period: 'annual', structure: 'flat' },
        });
      });
    });
  });

  describe('getFinancialScores', () => {
    it('should fetch financial scores', async () => {
      const mockData: FinancialScores[] = [
        {
          symbol: 'AAPL',
          altmanZScore: 3.5,
          piotroskiScore: 7,
          workingCapital: 50000000000,
          totalAssets: 350000000000,
          retainedEarnings: 100000000000,
          ebit: 110000000000,
          marketCap: 2800000000000,
          totalLiabilities: 290000000000,
          revenue: 380000000000,
        },
      ];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      const result = await financials.getFinancialScores('AAPL');

      expect(mockClient.get).toHaveBeenCalledWith('financial-scores', {
        searchParams: { symbol: 'AAPL' },
      });
      expect(result).toEqual(mockData);
    });

    it('should normalize symbol to uppercase', async () => {
      const mockData: FinancialScores[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await financials.getFinancialScores('aapl');

      expect(mockClient.get).toHaveBeenCalledWith('financial-scores', {
        searchParams: { symbol: 'AAPL' },
      });
    });

    it('should handle API errors', async () => {
      const error = new Error('Not found');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(financials.getFinancialScores('INVALID')).rejects.toThrow('Not found');
    });
  });

  describe('getOwnerEarnings', () => {
    it('should fetch owner earnings without limit', async () => {
      const mockData: OwnerEarnings[] = [
        {
          symbol: 'AAPL',
          date: '2023-12-31',
          averagePPE: 40000000000,
          maintenanceCapex: 8000000000,
          ownersEarnings: 88000000000,
          growthCapex: 4000000000,
          ownersEarningsPerShare: 5.58,
        },
      ];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      const result = await financials.getOwnerEarnings('AAPL');

      expect(mockClient.get).toHaveBeenCalledWith('owner-earnings', {
        searchParams: { symbol: 'AAPL' },
      });
      expect(result).toEqual(mockData);
    });

    it('should fetch owner earnings with limit', async () => {
      const mockData: OwnerEarnings[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await financials.getOwnerEarnings('AAPL', 10);

      expect(mockClient.get).toHaveBeenCalledWith('owner-earnings', {
        searchParams: { symbol: 'AAPL', limit: 10 },
      });
    });

    it('should normalize symbol to uppercase', async () => {
      const mockData: OwnerEarnings[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await financials.getOwnerEarnings('aapl');

      expect(mockClient.get).toHaveBeenCalledWith('owner-earnings', {
        searchParams: { symbol: 'AAPL' },
      });
    });
  });

  describe('getFinancialGrowth', () => {
    it('should fetch financial growth with default parameters', async () => {
      const mockData: FinancialGrowth[] = [
        {
          date: '2023-12-31',
          symbol: 'AAPL',
          period: 'FY',
          calendarYear: '2023',
          revenueGrowth: 0.0784,
          grossProfitGrowth: 0.0815,
          ebitgrowth: 0.0925,
          operatingIncomeGrowth: 0.0935,
          netIncomeGrowth: 0.0765,
          epsgrowth: 0.0834,
          epsdilutedGrowth: 0.0828,
          weightedAverageSharesGrowth: -0.0064,
          weightedAverageSharesDilutedGrowth: -0.0065,
          dividendsperShareGrowth: 0.0455,
          operatingCashFlowGrowth: 0.0512,
          freeCashFlowGrowth: 0.0498,
          tenYRevenueGrowthPerShare: 0.1234,
          fiveYRevenueGrowthPerShare: 0.0956,
          threeYRevenueGrowthPerShare: 0.0812,
          tenYOperatingCFGrowthPerShare: 0.1156,
          fiveYOperatingCFGrowthPerShare: 0.0887,
          threeYOperatingCFGrowthPerShare: 0.0723,
          tenYNetIncomeGrowthPerShare: 0.1089,
          fiveYNetIncomeGrowthPerShare: 0.0845,
          threeYNetIncomeGrowthPerShare: 0.0701,
          tenYShareholdersEquityGrowthPerShare: 0.0912,
          fiveYShareholdersEquityGrowthPerShare: 0.0734,
          threeYShareholdersEquityGrowthPerShare: 0.0623,
          tenYDividendperShareGrowthPerShare: 0.0567,
          fiveYDividendperShareGrowthPerShare: 0.0445,
          threeYDividendperShareGrowthPerShare: 0.0398,
          receivablesGrowth: 0.0234,
          inventoryGrowth: 0.0156,
          assetGrowth: 0.0512,
          bookValueperShareGrowth: 0.0445,
          debtGrowth: 0.0289,
          rdexpenseGrowth: 0.0712,
          sgaexpensesGrowth: 0.0534,
        },
      ];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      const result = await financials.getFinancialGrowth('AAPL');

      expect(mockClient.get).toHaveBeenCalledWith('financial-growth', {
        searchParams: { symbol: 'AAPL', period: 'annual' },
      });
      expect(result).toEqual(mockData);
    });

    it('should fetch financial growth with quarterly period', async () => {
      const mockData: FinancialGrowth[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await financials.getFinancialGrowth('AAPL', Period.Quarter);

      expect(mockClient.get).toHaveBeenCalledWith('financial-growth', {
        searchParams: { symbol: 'AAPL', period: 'quarter' },
      });
    });

    it('should fetch financial growth with limit', async () => {
      const mockData: FinancialGrowth[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await financials.getFinancialGrowth('AAPL', Period.Annual, 5);

      expect(mockClient.get).toHaveBeenCalledWith('financial-growth', {
        searchParams: { symbol: 'AAPL', period: 'annual', limit: 5 },
      });
    });

    it('should normalize symbol to uppercase', async () => {
      const mockData: FinancialGrowth[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await financials.getFinancialGrowth('aapl');

      expect(mockClient.get).toHaveBeenCalledWith('financial-growth', {
        searchParams: { symbol: 'AAPL', period: 'annual' },
      });
    });
  });

  describe('getReportDates', () => {
    it('should fetch report dates', async () => {
      const mockData: ReportDate[] = [
        {
          symbol: 'AAPL',
          date: '2023-12-31',
          period: 'FY',
          linkXlsx:
            'https://financialmodelingprep.com/api/v4/financial-reports-xlsx?symbol=AAPL&year=2023&period=FY',
          linkJson:
            'https://financialmodelingprep.com/api/v4/financial-reports-json?symbol=AAPL&year=2023&period=FY',
        },
        {
          symbol: 'AAPL',
          date: '2023-09-30',
          period: 'Q4',
          linkXlsx:
            'https://financialmodelingprep.com/api/v4/financial-reports-xlsx?symbol=AAPL&year=2023&period=Q4',
          linkJson:
            'https://financialmodelingprep.com/api/v4/financial-reports-json?symbol=AAPL&year=2023&period=Q4',
        },
      ];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      const result = await financials.getReportDates('AAPL');

      expect(mockClient.get).toHaveBeenCalledWith('financial-reports-dates', {
        searchParams: { symbol: 'AAPL' },
      });
      expect(result).toEqual(mockData);
    });

    it('should normalize symbol to uppercase', async () => {
      const mockData: ReportDate[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await financials.getReportDates('aapl');

      expect(mockClient.get).toHaveBeenCalledWith('financial-reports-dates', {
        searchParams: { symbol: 'AAPL' },
      });
    });
  });

  describe('As-reported methods', () => {
    describe('getAsReportedIncomeStatement', () => {
      it('should fetch as-reported income statement with default parameters', async () => {
        const mockData: Record<string, unknown>[] = [];
        vi.mocked(mockClient.get).mockResolvedValue(mockData);

        await financials.getAsReportedIncomeStatement('AAPL');

        expect(mockClient.get).toHaveBeenCalledWith('income-statement-as-reported', {
          searchParams: { symbol: 'AAPL', period: 'annual' },
        });
      });

      it('should fetch as-reported income statement with quarterly period', async () => {
        const mockData: Record<string, unknown>[] = [];
        vi.mocked(mockClient.get).mockResolvedValue(mockData);

        await financials.getAsReportedIncomeStatement('AAPL', Period.Quarter);

        expect(mockClient.get).toHaveBeenCalledWith('income-statement-as-reported', {
          searchParams: { symbol: 'AAPL', period: 'quarter' },
        });
      });

      it('should fetch as-reported income statement with limit', async () => {
        const mockData: Record<string, unknown>[] = [];
        vi.mocked(mockClient.get).mockResolvedValue(mockData);

        await financials.getAsReportedIncomeStatement('AAPL', Period.Annual, 3);

        expect(mockClient.get).toHaveBeenCalledWith('income-statement-as-reported', {
          searchParams: { symbol: 'AAPL', period: 'annual', limit: 3 },
        });
      });

      it('should normalize symbol to uppercase', async () => {
        const mockData: Record<string, unknown>[] = [];
        vi.mocked(mockClient.get).mockResolvedValue(mockData);

        await financials.getAsReportedIncomeStatement('aapl');

        expect(mockClient.get).toHaveBeenCalledWith('income-statement-as-reported', {
          searchParams: { symbol: 'AAPL', period: 'annual' },
        });
      });
    });

    describe('getAsReportedBalanceSheet', () => {
      it('should fetch as-reported balance sheet with default parameters', async () => {
        const mockData: Record<string, unknown>[] = [];
        vi.mocked(mockClient.get).mockResolvedValue(mockData);

        await financials.getAsReportedBalanceSheet('MSFT');

        expect(mockClient.get).toHaveBeenCalledWith('balance-sheet-statement-as-reported', {
          searchParams: { symbol: 'MSFT', period: 'annual' },
        });
      });

      it('should fetch as-reported balance sheet with quarterly period and limit', async () => {
        const mockData: Record<string, unknown>[] = [];
        vi.mocked(mockClient.get).mockResolvedValue(mockData);

        await financials.getAsReportedBalanceSheet('MSFT', Period.Quarter, 8);

        expect(mockClient.get).toHaveBeenCalledWith('balance-sheet-statement-as-reported', {
          searchParams: { symbol: 'MSFT', period: 'quarter', limit: 8 },
        });
      });

      it('should normalize symbol to uppercase', async () => {
        const mockData: Record<string, unknown>[] = [];
        vi.mocked(mockClient.get).mockResolvedValue(mockData);

        await financials.getAsReportedBalanceSheet('msft');

        expect(mockClient.get).toHaveBeenCalledWith('balance-sheet-statement-as-reported', {
          searchParams: { symbol: 'MSFT', period: 'annual' },
        });
      });
    });

    describe('getAsReportedCashFlow', () => {
      it('should fetch as-reported cash flow with default parameters', async () => {
        const mockData: Record<string, unknown>[] = [];
        vi.mocked(mockClient.get).mockResolvedValue(mockData);

        await financials.getAsReportedCashFlow('GOOGL');

        expect(mockClient.get).toHaveBeenCalledWith('cash-flow-statement-as-reported', {
          searchParams: { symbol: 'GOOGL', period: 'annual' },
        });
      });

      it('should fetch as-reported cash flow with quarterly period and limit', async () => {
        const mockData: Record<string, unknown>[] = [];
        vi.mocked(mockClient.get).mockResolvedValue(mockData);

        await financials.getAsReportedCashFlow('GOOGL', Period.Quarter, 12);

        expect(mockClient.get).toHaveBeenCalledWith('cash-flow-statement-as-reported', {
          searchParams: { symbol: 'GOOGL', period: 'quarter', limit: 12 },
        });
      });

      it('should normalize symbol to uppercase', async () => {
        const mockData: Record<string, unknown>[] = [];
        vi.mocked(mockClient.get).mockResolvedValue(mockData);

        await financials.getAsReportedCashFlow('googl');

        expect(mockClient.get).toHaveBeenCalledWith('cash-flow-statement-as-reported', {
          searchParams: { symbol: 'GOOGL', period: 'annual' },
        });
      });
    });

    describe('getAsReportedFull', () => {
      it('should fetch full as-reported financials with default period', async () => {
        const mockData: Record<string, unknown> = {
          symbol: 'AAPL',
          date: '2023-12-31',
          revenue: 383285000000,
        };
        vi.mocked(mockClient.get).mockResolvedValue(mockData);

        const result = await financials.getAsReportedFull('AAPL');

        expect(mockClient.get).toHaveBeenCalledWith('financial-statement-full-as-reported', {
          searchParams: { symbol: 'AAPL', period: 'annual' },
        });
        expect(result).toEqual(mockData);
      });

      it('should fetch full as-reported financials with quarterly period', async () => {
        const mockData: Record<string, unknown> = {};
        vi.mocked(mockClient.get).mockResolvedValue(mockData);

        await financials.getAsReportedFull('AAPL', Period.Quarter);

        expect(mockClient.get).toHaveBeenCalledWith('financial-statement-full-as-reported', {
          searchParams: { symbol: 'AAPL', period: 'quarter' },
        });
      });

      it('should normalize symbol to uppercase', async () => {
        const mockData: Record<string, unknown> = {};
        vi.mocked(mockClient.get).mockResolvedValue(mockData);

        await financials.getAsReportedFull('aapl');

        expect(mockClient.get).toHaveBeenCalledWith('financial-statement-full-as-reported', {
          searchParams: { symbol: 'AAPL', period: 'annual' },
        });
      });
    });

    describe('getLatestFinancialStatement', () => {
      it('should fetch latest financial statement with default period', async () => {
        const mockData: LatestFinancialStatement[] = [
          {
            date: '2023-12-31',
            symbol: 'AAPL',
            period: 'FY',
            documenttype: '10-K',
            reportedCurrency: 'USD',
            cik: '0000320193',
            fillingDate: '2024-01-01',
            acceptedDate: '2024-01-01T12:00:00.000Z',
            calendarYear: '2023',
            revenue: 383285000000,
          },
        ];
        vi.mocked(mockClient.get).mockResolvedValue(mockData);

        const result = await financials.getLatestFinancialStatement('AAPL');

        expect(mockClient.get).toHaveBeenCalledWith('financial-statement-full-as-reported', {
          searchParams: { symbol: 'AAPL', period: 'annual' },
        });
        expect(result).toEqual(mockData);
      });

      it('should fetch latest financial statement with quarterly period', async () => {
        const mockData: LatestFinancialStatement[] = [];
        vi.mocked(mockClient.get).mockResolvedValue(mockData);

        await financials.getLatestFinancialStatement('AAPL', Period.Quarter);

        expect(mockClient.get).toHaveBeenCalledWith('financial-statement-full-as-reported', {
          searchParams: { symbol: 'AAPL', period: 'quarter' },
        });
      });

      it('should normalize symbol to uppercase', async () => {
        const mockData: LatestFinancialStatement[] = [];
        vi.mocked(mockClient.get).mockResolvedValue(mockData);

        await financials.getLatestFinancialStatement('aapl');

        expect(mockClient.get).toHaveBeenCalledWith('financial-statement-full-as-reported', {
          searchParams: { symbol: 'AAPL', period: 'annual' },
        });
      });
    });
  });

  describe('Financial report download methods', () => {
    describe('getFinancialReportJSON', () => {
      it('should fetch financial report in JSON format', async () => {
        const mockData: Record<string, unknown> = {
          symbol: 'AAPL',
          year: 2023,
          period: 'FY',
          data: {},
        };
        vi.mocked(mockClient.get).mockResolvedValue(mockData);

        const result = await financials.getFinancialReportJSON('AAPL', 2023, 'FY');

        expect(mockClient.get).toHaveBeenCalledWith('financial-reports-json', {
          searchParams: { symbol: 'AAPL', year: 2023, period: 'FY' },
        });
        expect(result).toEqual(mockData);
      });

      it('should fetch financial report for quarterly period', async () => {
        const mockData: Record<string, unknown> = {};
        vi.mocked(mockClient.get).mockResolvedValue(mockData);

        await financials.getFinancialReportJSON('MSFT', 2023, 'Q1');

        expect(mockClient.get).toHaveBeenCalledWith('financial-reports-json', {
          searchParams: { symbol: 'MSFT', year: 2023, period: 'Q1' },
        });
      });

      it('should normalize symbol to uppercase', async () => {
        const mockData: Record<string, unknown> = {};
        vi.mocked(mockClient.get).mockResolvedValue(mockData);

        await financials.getFinancialReportJSON('aapl', 2023, 'FY');

        expect(mockClient.get).toHaveBeenCalledWith('financial-reports-json', {
          searchParams: { symbol: 'AAPL', year: 2023, period: 'FY' },
        });
      });

      it('should handle different quarterly periods', async () => {
        const mockData: Record<string, unknown> = {};
        vi.mocked(mockClient.get).mockResolvedValue(mockData);

        await financials.getFinancialReportJSON('GOOGL', 2022, 'Q4');

        expect(mockClient.get).toHaveBeenCalledWith('financial-reports-json', {
          searchParams: { symbol: 'GOOGL', year: 2022, period: 'Q4' },
        });
      });

      it('should handle API errors', async () => {
        const error = new Error('Report not found');
        vi.mocked(mockClient.get).mockRejectedValue(error);

        await expect(financials.getFinancialReportJSON('AAPL', 2023, 'FY')).rejects.toThrow(
          'Report not found'
        );
      });
    });

    describe('getFinancialReportXLSX', () => {
      it('should fetch financial report download URL in XLSX format', async () => {
        const mockData: FinancialReportDownload = {
          url: 'https://financialmodelingprep.com/api/v4/financial-reports-xlsx?symbol=AAPL&year=2023&period=FY&apikey=xxx',
        };
        vi.mocked(mockClient.get).mockResolvedValue(mockData);

        const result = await financials.getFinancialReportXLSX('AAPL', 2023, 'FY');

        expect(mockClient.get).toHaveBeenCalledWith('financial-reports-xlsx', {
          searchParams: { symbol: 'AAPL', year: 2023, period: 'FY' },
        });
        expect(result).toEqual(mockData);
        expect(result.url).toBeDefined();
      });

      it('should fetch XLSX report for quarterly period', async () => {
        const mockData: FinancialReportDownload = {
          url: 'https://example.com/report.xlsx',
        };
        vi.mocked(mockClient.get).mockResolvedValue(mockData);

        await financials.getFinancialReportXLSX('MSFT', 2023, 'Q2');

        expect(mockClient.get).toHaveBeenCalledWith('financial-reports-xlsx', {
          searchParams: { symbol: 'MSFT', year: 2023, period: 'Q2' },
        });
      });

      it('should normalize symbol to uppercase', async () => {
        const mockData: FinancialReportDownload = {
          url: 'https://example.com/report.xlsx',
        };
        vi.mocked(mockClient.get).mockResolvedValue(mockData);

        await financials.getFinancialReportXLSX('aapl', 2023, 'FY');

        expect(mockClient.get).toHaveBeenCalledWith('financial-reports-xlsx', {
          searchParams: { symbol: 'AAPL', year: 2023, period: 'FY' },
        });
      });

      it('should handle different years', async () => {
        const mockData: FinancialReportDownload = {
          url: 'https://example.com/report.xlsx',
        };
        vi.mocked(mockClient.get).mockResolvedValue(mockData);

        await financials.getFinancialReportXLSX('TSLA', 2021, 'Q3');

        expect(mockClient.get).toHaveBeenCalledWith('financial-reports-xlsx', {
          searchParams: { symbol: 'TSLA', year: 2021, period: 'Q3' },
        });
      });

      it('should handle API errors', async () => {
        const error = new Error('Report not available');
        vi.mocked(mockClient.get).mockRejectedValue(error);

        await expect(financials.getFinancialReportXLSX('AAPL', 2023, 'FY')).rejects.toThrow(
          'Report not available'
        );
      });
    });
  });

  describe('Error handling', () => {
    it('should propagate errors from client on getIncomeStatement', async () => {
      const error = new Error('Network error');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(financials.getIncomeStatement('AAPL')).rejects.toThrow('Network error');
    });

    it('should propagate errors from client on getBalanceSheet', async () => {
      const error = new Error('Timeout error');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(financials.getBalanceSheet('MSFT')).rejects.toThrow('Timeout error');
    });

    it('should propagate errors from client on getCashFlowStatement', async () => {
      const error = new Error('Rate limit exceeded');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(financials.getCashFlowStatement('GOOGL')).rejects.toThrow(
        'Rate limit exceeded'
      );
    });

    it('should propagate errors from client on getKeyMetrics', async () => {
      const error = new Error('Invalid symbol');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(financials.getKeyMetrics('INVALID')).rejects.toThrow('Invalid symbol');
    });

    it('should propagate errors from client on getFinancialGrowth', async () => {
      const error = new Error('Service unavailable');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(financials.getFinancialGrowth('AAPL')).rejects.toThrow('Service unavailable');
    });
  });

  describe('Symbol normalization edge cases', () => {
    it('should handle symbols with mixed case', async () => {
      const mockData: IncomeStatement[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await financials.getIncomeStatement('AaPl');

      expect(mockClient.get).toHaveBeenCalledWith('income-statement', {
        searchParams: { symbol: 'AAPL', period: 'annual' },
      });
    });

    it('should handle symbols with special characters', async () => {
      const mockData: IncomeStatement[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await financials.getIncomeStatement('brk.b');

      expect(mockClient.get).toHaveBeenCalledWith('income-statement', {
        searchParams: { symbol: 'BRK.B', period: 'annual' },
      });
    });

    it('should handle already uppercase symbols', async () => {
      const mockData: BalanceSheet[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await financials.getBalanceSheet('MSFT');

      expect(mockClient.get).toHaveBeenCalledWith('balance-sheet-statement', {
        searchParams: { symbol: 'MSFT', period: 'annual' },
      });
    });
  });

  describe('Period parameter combinations', () => {
    it('should handle annual period with zero limit', async () => {
      const mockData: IncomeStatement[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await financials.getIncomeStatement('AAPL', Period.Annual, 0);

      // When limit is 0 (falsy), it should not be included in params
      expect(mockClient.get).toHaveBeenCalledWith('income-statement', {
        searchParams: { symbol: 'AAPL', period: 'annual' },
      });
    });

    it('should handle quarter period with large limit', async () => {
      const mockData: CashFlowStatement[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await financials.getCashFlowStatement('GOOGL', Period.Quarter, 100);

      expect(mockClient.get).toHaveBeenCalledWith('cash-flow-statement', {
        searchParams: { symbol: 'GOOGL', period: 'quarter', limit: 100 },
      });
    });

    it('should handle annual period with limit of 1', async () => {
      const mockData: KeyMetrics[] = [];
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await financials.getKeyMetrics('TSLA', Period.Annual, 1);

      expect(mockClient.get).toHaveBeenCalledWith('key-metrics', {
        searchParams: { symbol: 'TSLA', period: 'annual', limit: 1 },
      });
    });
  });

  describe('Report year and period combinations', () => {
    it('should handle FY period for annual reports', async () => {
      const mockData: Record<string, unknown> = {};
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await financials.getFinancialReportJSON('AAPL', 2023, 'FY');

      expect(mockClient.get).toHaveBeenCalledWith('financial-reports-json', {
        searchParams: { symbol: 'AAPL', year: 2023, period: 'FY' },
      });
    });

    it('should handle Q1 period', async () => {
      const mockData: FinancialReportDownload = { url: 'https://example.com' };
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await financials.getFinancialReportXLSX('MSFT', 2023, 'Q1');

      expect(mockClient.get).toHaveBeenCalledWith('financial-reports-xlsx', {
        searchParams: { symbol: 'MSFT', year: 2023, period: 'Q1' },
      });
    });

    it('should handle Q2 period', async () => {
      const mockData: Record<string, unknown> = {};
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await financials.getFinancialReportJSON('GOOGL', 2022, 'Q2');

      expect(mockClient.get).toHaveBeenCalledWith('financial-reports-json', {
        searchParams: { symbol: 'GOOGL', year: 2022, period: 'Q2' },
      });
    });

    it('should handle Q3 period', async () => {
      const mockData: FinancialReportDownload = { url: 'https://example.com' };
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await financials.getFinancialReportXLSX('TSLA', 2021, 'Q3');

      expect(mockClient.get).toHaveBeenCalledWith('financial-reports-xlsx', {
        searchParams: { symbol: 'TSLA', year: 2021, period: 'Q3' },
      });
    });

    it('should handle Q4 period', async () => {
      const mockData: Record<string, unknown> = {};
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await financials.getFinancialReportJSON('AMZN', 2020, 'Q4');

      expect(mockClient.get).toHaveBeenCalledWith('financial-reports-json', {
        searchParams: { symbol: 'AMZN', year: 2020, period: 'Q4' },
      });
    });

    it('should handle historical years', async () => {
      const mockData: Record<string, unknown> = {};
      vi.mocked(mockClient.get).mockResolvedValue(mockData);

      await financials.getFinancialReportJSON('IBM', 2015, 'FY');

      expect(mockClient.get).toHaveBeenCalledWith('financial-reports-json', {
        searchParams: { symbol: 'IBM', year: 2015, period: 'FY' },
      });
    });
  });
});
