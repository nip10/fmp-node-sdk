import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EconomicsResource } from '../src/resources/economics.js';
import type { FMPClient } from '../src/client.js';
import type { TreasuryRate, EconomicIndicator, MarketRiskPremium } from '../src/types/index.js';

describe('EconomicsResource', () => {
  let economics: EconomicsResource;
  let mockClient: FMPClient;

  // Mock data
  const mockTreasuryRates: TreasuryRate[] = [
    {
      date: '2024-01-15',
      month1: '5.41',
      month2: '5.38',
      month3: '5.35',
      month6: '5.28',
      year1: '5.15',
      year2: '4.89',
      year3: '4.65',
      year5: '4.38',
      year7: '4.28',
      year10: '4.15',
      year20: '4.45',
      year30: '4.35',
    },
    {
      date: '2024-01-14',
      month1: '5.40',
      month2: '5.37',
      month3: '5.34',
      month6: '5.27',
      year1: '5.14',
      year2: '4.88',
      year3: '4.64',
      year5: '4.37',
      year7: '4.27',
      year10: '4.14',
      year20: '4.44',
      year30: '4.34',
    },
  ];

  const mockEconomicIndicators: EconomicIndicator[] = [
    {
      date: '2024-01-01',
      value: 27000.5,
    },
    {
      date: '2023-10-01',
      value: 26800.3,
    },
  ];

  const mockMarketRiskPremiums: MarketRiskPremium[] = [
    {
      country: 'United States',
      continent: 'North America',
      totalEquityRiskPremium: 5.96,
      countryRiskPremium: 0.0,
    },
    {
      country: 'Germany',
      continent: 'Europe',
      totalEquityRiskPremium: 6.24,
      countryRiskPremium: 0.28,
    },
  ];

  beforeEach(() => {
    // Create a mock client
    mockClient = {
      get: vi.fn(),
    } as unknown as FMPClient;

    economics = new EconomicsResource(mockClient);
  });

  describe('getTreasuryRates', () => {
    it('should fetch treasury rates without parameters', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockTreasuryRates);

      const result = await economics.getTreasuryRates();

      expect(mockClient.get).toHaveBeenCalledWith('v4/treasury', { searchParams: {} });
      expect(result).toEqual(mockTreasuryRates);
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('date');
      expect(result[0]).toHaveProperty('year10');
    });

    it('should fetch treasury rates with from date only', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockTreasuryRates);

      const result = await economics.getTreasuryRates('2024-01-01');

      expect(mockClient.get).toHaveBeenCalledWith('v4/treasury', {
        searchParams: {
          from: '2024-01-01',
      },
      }
);
      expect(result).toEqual(mockTreasuryRates);
    });

    it('should fetch treasury rates with to date only', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockTreasuryRates);

      const result = await economics.getTreasuryRates(undefined, '2024-01-31');

      expect(mockClient.get).toHaveBeenCalledWith('v4/treasury', {
        searchParams: {
          to: '2024-01-31',
      },
      }
);
      expect(result).toEqual(mockTreasuryRates);
    });

    it('should fetch treasury rates with both from and to dates', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockTreasuryRates);

      const result = await economics.getTreasuryRates('2024-01-01', '2024-01-31');

      expect(mockClient.get).toHaveBeenCalledWith('v4/treasury', {
        searchParams: {
          from: '2024-01-01',
        to: '2024-01-31',
      },
      }
);
      expect(result).toEqual(mockTreasuryRates);
    });

    it('should handle empty array response', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      const result = await economics.getTreasuryRates();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should handle API errors', async () => {
      const error = new Error('API Error');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(economics.getTreasuryRates()).rejects.toThrow('API Error');
    });

    it('should handle date format validation by API', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockTreasuryRates);

      // Test with various date formats - API should handle validation
      await economics.getTreasuryRates('2024-01-01', '2024-12-31');
      expect(mockClient.get).toHaveBeenCalledWith('v4/treasury', {
        searchParams: {
          from: '2024-01-01',
        to: '2024-12-31',
      },
      }
);
    });
  });

  describe('getIndicator', () => {
    it('should fetch GDP indicator without date range', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockEconomicIndicators);

      const result = await economics.getIndicator('GDP');

      expect(mockClient.get).toHaveBeenCalledWith('v4/economic', {
        searchParams: {
          name: 'GDP',
      },
      }
);
      expect(result).toEqual(mockEconomicIndicators);
    });

    it('should fetch real GDP indicator with from date', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockEconomicIndicators);

      const result = await economics.getIndicator('realGDP', '2023-01-01');

      expect(mockClient.get).toHaveBeenCalledWith('v4/economic', {
        searchParams: {
          name: 'realGDP',
        from: '2023-01-01',
      },
      }
);
      expect(result).toEqual(mockEconomicIndicators);
    });

    it('should fetch CPI indicator with to date', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockEconomicIndicators);

      const result = await economics.getIndicator('CPI', undefined, '2024-12-31');

      expect(mockClient.get).toHaveBeenCalledWith('v4/economic', {
        searchParams: {
          name: 'CPI',
        to: '2024-12-31',
      },
      }
);
      expect(result).toEqual(mockEconomicIndicators);
    });

    it('should fetch inflation rate with both dates', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockEconomicIndicators);

      const result = await economics.getIndicator('inflationRate', '2023-01-01', '2024-12-31');

      expect(mockClient.get).toHaveBeenCalledWith('v4/economic', {
        searchParams: {
          name: 'inflationRate',
        from: '2023-01-01',
        to: '2024-12-31',
      },
      }
);
      expect(result).toEqual(mockEconomicIndicators);
    });

    it('should fetch all valid economic indicators', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockEconomicIndicators);

      const indicators = [
        'GDP',
        'realGDP',
        'nominalPotentialGDP',
        'realGDPPerCapita',
        'federalFunds',
        'CPI',
        'inflationRate',
        'inflation',
        'retailSales',
        'consumerSentiment',
        'durableGoods',
        'unemploymentRate',
        'totalNonfarmPayroll',
        'initialClaims',
        'industrialProductionTotalIndex',
        'newPrivatelyOwnedHousingUnitsStartedTotalUnits',
        'totalVehicleSales',
        'retailMoneyFunds',
        'smoothedUSRecessionProbabilities',
        'businessInventories',
        'housingInventory',
        'nonresidentialInvestment',
        'federalSurplusDeficit',
      ] as const;

      for (const indicator of indicators) {
        vi.mocked(mockClient.get).mockClear();
        await economics.getIndicator(indicator);
        expect(mockClient.get).toHaveBeenCalledWith('v4/economic', {
          searchParams: {
            name: indicator,
        },
        }
);
      }
    });

    it('should handle empty array response', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      const result = await economics.getIndicator('GDP');

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should handle API errors', async () => {
      const error = new Error('Invalid indicator name');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(economics.getIndicator('GDP')).rejects.toThrow('Invalid indicator name');
    });
  });

  describe('getGDP', () => {
    it('should fetch GDP data without dates', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockEconomicIndicators);

      const result = await economics.getGDP();

      expect(mockClient.get).toHaveBeenCalledWith('v4/economic', {
        searchParams: {
          name: 'GDP',
      },
      }
);
      expect(result).toEqual(mockEconomicIndicators);
    });

    it('should fetch GDP data with from date', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockEconomicIndicators);

      const result = await economics.getGDP('2023-01-01');

      expect(mockClient.get).toHaveBeenCalledWith('v4/economic', {
        searchParams: {
          name: 'GDP',
        from: '2023-01-01',
      },
      }
);
      expect(result).toEqual(mockEconomicIndicators);
    });

    it('should fetch GDP data with both dates', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockEconomicIndicators);

      const result = await economics.getGDP('2023-01-01', '2024-12-31');

      expect(mockClient.get).toHaveBeenCalledWith('v4/economic', {
        searchParams: {
          name: 'GDP',
        from: '2023-01-01',
        to: '2024-12-31',
      },
      }
);
      expect(result).toEqual(mockEconomicIndicators);
    });
  });

  describe('getCPI', () => {
    it('should fetch CPI data without dates', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockEconomicIndicators);

      const result = await economics.getCPI();

      expect(mockClient.get).toHaveBeenCalledWith('v4/economic', {
        searchParams: {
          name: 'CPI',
      },
      }
);
      expect(result).toEqual(mockEconomicIndicators);
    });

    it('should fetch CPI data with from date', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockEconomicIndicators);

      const result = await economics.getCPI('2023-01-01');

      expect(mockClient.get).toHaveBeenCalledWith('v4/economic', {
        searchParams: {
          name: 'CPI',
        from: '2023-01-01',
      },
      }
);
      expect(result).toEqual(mockEconomicIndicators);
    });

    it('should fetch CPI data with both dates', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockEconomicIndicators);

      const result = await economics.getCPI('2023-01-01', '2024-12-31');

      expect(mockClient.get).toHaveBeenCalledWith('v4/economic', {
        searchParams: {
          name: 'CPI',
        from: '2023-01-01',
        to: '2024-12-31',
      },
      }
);
      expect(result).toEqual(mockEconomicIndicators);
    });
  });

  describe('getInflationRate', () => {
    it('should fetch inflation rate data without dates', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockEconomicIndicators);

      const result = await economics.getInflationRate();

      expect(mockClient.get).toHaveBeenCalledWith('v4/economic', {
        searchParams: {
          name: 'inflationRate',
      },
      }
);
      expect(result).toEqual(mockEconomicIndicators);
    });

    it('should fetch inflation rate data with from date', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockEconomicIndicators);

      const result = await economics.getInflationRate('2023-01-01');

      expect(mockClient.get).toHaveBeenCalledWith('v4/economic', {
        searchParams: {
          name: 'inflationRate',
        from: '2023-01-01',
      },
      }
);
      expect(result).toEqual(mockEconomicIndicators);
    });

    it('should fetch inflation rate data with both dates', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockEconomicIndicators);

      const result = await economics.getInflationRate('2023-01-01', '2024-12-31');

      expect(mockClient.get).toHaveBeenCalledWith('v4/economic', {
        searchParams: {
          name: 'inflationRate',
        from: '2023-01-01',
        to: '2024-12-31',
      },
      }
);
      expect(result).toEqual(mockEconomicIndicators);
    });
  });

  describe('getUnemploymentRate', () => {
    it('should fetch unemployment rate data without dates', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockEconomicIndicators);

      const result = await economics.getUnemploymentRate();

      expect(mockClient.get).toHaveBeenCalledWith('v4/economic', {
        searchParams: {
          name: 'unemploymentRate',
      },
      }
);
      expect(result).toEqual(mockEconomicIndicators);
    });

    it('should fetch unemployment rate data with from date', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockEconomicIndicators);

      const result = await economics.getUnemploymentRate('2023-01-01');

      expect(mockClient.get).toHaveBeenCalledWith('v4/economic', {
        searchParams: {
          name: 'unemploymentRate',
        from: '2023-01-01',
      },
      }
);
      expect(result).toEqual(mockEconomicIndicators);
    });

    it('should fetch unemployment rate data with both dates', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockEconomicIndicators);

      const result = await economics.getUnemploymentRate('2023-01-01', '2024-12-31');

      expect(mockClient.get).toHaveBeenCalledWith('v4/economic', {
        searchParams: {
          name: 'unemploymentRate',
        from: '2023-01-01',
        to: '2024-12-31',
      },
      }
);
      expect(result).toEqual(mockEconomicIndicators);
    });
  });

  describe('getFederalFundsRate', () => {
    it('should fetch federal funds rate data without dates', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockEconomicIndicators);

      const result = await economics.getFederalFundsRate();

      expect(mockClient.get).toHaveBeenCalledWith('v4/economic', {
        searchParams: {
          name: 'federalFunds',
      },
      }
);
      expect(result).toEqual(mockEconomicIndicators);
    });

    it('should fetch federal funds rate data with from date', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockEconomicIndicators);

      const result = await economics.getFederalFundsRate('2023-01-01');

      expect(mockClient.get).toHaveBeenCalledWith('v4/economic', {
        searchParams: {
          name: 'federalFunds',
        from: '2023-01-01',
      },
      }
);
      expect(result).toEqual(mockEconomicIndicators);
    });

    it('should fetch federal funds rate data with both dates', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockEconomicIndicators);

      const result = await economics.getFederalFundsRate('2023-01-01', '2024-12-31');

      expect(mockClient.get).toHaveBeenCalledWith('v4/economic', {
        searchParams: {
          name: 'federalFunds',
        from: '2023-01-01',
        to: '2024-12-31',
      },
      }
);
      expect(result).toEqual(mockEconomicIndicators);
    });
  });

  describe('getMarketRiskPremium', () => {
    it('should fetch market risk premium data', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockMarketRiskPremiums);

      const result = await economics.getMarketRiskPremium();

      expect(mockClient.get).toHaveBeenCalledWith('v4/market_risk_premium');
      expect(result).toEqual(mockMarketRiskPremiums);
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('country');
      expect(result[0]).toHaveProperty('totalEquityRiskPremium');
      expect(result[0]).toHaveProperty('countryRiskPremium');
    });

    it('should handle empty array response', async () => {
      vi.mocked(mockClient.get).mockResolvedValue([]);

      const result = await economics.getMarketRiskPremium();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should handle API errors', async () => {
      const error = new Error('Service unavailable');
      vi.mocked(mockClient.get).mockRejectedValue(error);

      await expect(economics.getMarketRiskPremium()).rejects.toThrow('Service unavailable');
    });

    it('should verify market risk premium structure', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockMarketRiskPremiums);

      const result = await economics.getMarketRiskPremium();

      result.forEach((premium) => {
        expect(premium).toHaveProperty('country');
        expect(premium).toHaveProperty('continent');
        expect(premium).toHaveProperty('totalEquityRiskPremium');
        expect(premium).toHaveProperty('countryRiskPremium');
        expect(typeof premium.country).toBe('string');
        expect(typeof premium.continent).toBe('string');
        expect(typeof premium.totalEquityRiskPremium).toBe('number');
        expect(typeof premium.countryRiskPremium).toBe('number');
      });
    });
  });

  describe('Error Handling', () => {
    it('should propagate network errors', async () => {
      const networkError = new Error('Network timeout');
      vi.mocked(mockClient.get).mockRejectedValue(networkError);

      await expect(economics.getTreasuryRates()).rejects.toThrow('Network timeout');
      await expect(economics.getIndicator('GDP')).rejects.toThrow('Network timeout');
      await expect(economics.getMarketRiskPremium()).rejects.toThrow('Network timeout');
    });

    it('should propagate authentication errors', async () => {
      const authError = new Error('Unauthorized');
      vi.mocked(mockClient.get).mockRejectedValue(authError);

      await expect(economics.getTreasuryRates()).rejects.toThrow('Unauthorized');
      await expect(economics.getIndicator('CPI')).rejects.toThrow('Unauthorized');
    });

    it('should propagate rate limit errors', async () => {
      const rateLimitError = new Error('Rate limit exceeded');
      vi.mocked(mockClient.get).mockRejectedValue(rateLimitError);

      await expect(economics.getTreasuryRates()).rejects.toThrow('Rate limit exceeded');
      await expect(economics.getIndicator('inflationRate')).rejects.toThrow('Rate limit exceeded');
    });

    it('should handle malformed response data', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(null as unknown as TreasuryRate[]);

      const result = await economics.getTreasuryRates();

      expect(result).toBeNull();
    });

    it('should handle invalid date parameters passed through', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockTreasuryRates);

      // Invalid dates should be passed to API for validation
      await economics.getTreasuryRates('invalid-date', 'also-invalid');

      expect(mockClient.get).toHaveBeenCalledWith('v4/treasury', {
        searchParams: {
          from: 'invalid-date',
        to: 'also-invalid',
      },
      }
);
    });
  });

  describe('Response Data Structure', () => {
    it('should return treasury rates with correct structure', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockTreasuryRates);

      const result = await economics.getTreasuryRates();

      expect(result).toHaveLength(2);
      result.forEach((rate) => {
        expect(rate).toHaveProperty('date');
        expect(rate).toHaveProperty('month1');
        expect(rate).toHaveProperty('month2');
        expect(rate).toHaveProperty('month3');
        expect(rate).toHaveProperty('month6');
        expect(rate).toHaveProperty('year1');
        expect(rate).toHaveProperty('year2');
        expect(rate).toHaveProperty('year3');
        expect(rate).toHaveProperty('year5');
        expect(rate).toHaveProperty('year7');
        expect(rate).toHaveProperty('year10');
        expect(rate).toHaveProperty('year20');
        expect(rate).toHaveProperty('year30');
      });
    });

    it('should return economic indicators with correct structure', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockEconomicIndicators);

      const result = await economics.getIndicator('GDP');

      expect(result).toHaveLength(2);
      result.forEach((indicator) => {
        expect(indicator).toHaveProperty('date');
        expect(indicator).toHaveProperty('value');
        expect(typeof indicator.date).toBe('string');
        expect(typeof indicator.value).toBe('number');
      });
    });

    it('should return market risk premium with correct structure', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockMarketRiskPremiums);

      const result = await economics.getMarketRiskPremium();

      expect(result).toHaveLength(2);
      result.forEach((premium) => {
        expect(premium).toHaveProperty('country');
        expect(premium).toHaveProperty('continent');
        expect(premium).toHaveProperty('totalEquityRiskPremium');
        expect(premium).toHaveProperty('countryRiskPremium');
      });
    });
  });

  describe('Type Safety', () => {
    it('should enforce economic indicator name type', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockEconomicIndicators);

      // TypeScript should enforce valid indicator names at compile time
      // These should all compile successfully
      await economics.getIndicator('GDP');
      await economics.getIndicator('realGDP');
      await economics.getIndicator('nominalPotentialGDP');
      await economics.getIndicator('realGDPPerCapita');
      await economics.getIndicator('federalFunds');
      await economics.getIndicator('CPI');
      await economics.getIndicator('inflationRate');
      await economics.getIndicator('inflation');
      await economics.getIndicator('retailSales');
      await economics.getIndicator('consumerSentiment');
      await economics.getIndicator('durableGoods');
      await economics.getIndicator('unemploymentRate');
      await economics.getIndicator('totalNonfarmPayroll');
      await economics.getIndicator('initialClaims');
      await economics.getIndicator('industrialProductionTotalIndex');
      await economics.getIndicator('newPrivatelyOwnedHousingUnitsStartedTotalUnits');
      await economics.getIndicator('totalVehicleSales');
      await economics.getIndicator('retailMoneyFunds');
      await economics.getIndicator('smoothedUSRecessionProbabilities');
      await economics.getIndicator('businessInventories');
      await economics.getIndicator('housingInventory');
      await economics.getIndicator('nonresidentialInvestment');
      await economics.getIndicator('federalSurplusDeficit');

      // Count should match number of indicators tested
      expect(mockClient.get).toHaveBeenCalledTimes(23);
    });
  });

  describe('Edge Cases', () => {
    it('should handle concurrent requests', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockTreasuryRates);

      const promises = [
        economics.getTreasuryRates(),
        economics.getIndicator('GDP'),
        economics.getMarketRiskPremium(),
      ];

      await Promise.all(promises);

      expect(mockClient.get).toHaveBeenCalledTimes(3);
    });

    it('should handle rapid successive calls', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockEconomicIndicators);

      await economics.getGDP();
      await economics.getCPI();
      await economics.getInflationRate();
      await economics.getUnemploymentRate();
      await economics.getFederalFundsRate();

      expect(mockClient.get).toHaveBeenCalledTimes(5);
    });

    it('should handle very long date ranges', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockTreasuryRates);

      await economics.getTreasuryRates('1990-01-01', '2024-12-31');

      expect(mockClient.get).toHaveBeenCalledWith('v4/treasury', {
        searchParams: {
          from: '1990-01-01',
        to: '2024-12-31',
      },
      }
);
    });

    it('should handle same from and to dates', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockTreasuryRates);

      await economics.getTreasuryRates('2024-01-15', '2024-01-15');

      expect(mockClient.get).toHaveBeenCalledWith('v4/treasury', {
        searchParams: {
          from: '2024-01-15',
        to: '2024-01-15',
      },
      }
);
    });

    it('should handle reversed date ranges', async () => {
      vi.mocked(mockClient.get).mockResolvedValue(mockTreasuryRates);

      // API should handle validation of reversed dates
      await economics.getTreasuryRates('2024-12-31', '2024-01-01');

      expect(mockClient.get).toHaveBeenCalledWith('v4/treasury', {
        searchParams: {
          from: '2024-12-31',
        to: '2024-01-01',
      },
      }
);
    });
  });
});
