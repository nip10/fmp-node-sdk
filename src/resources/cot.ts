import type { FMPClient } from '../client.js';
import type { COTReport, COTAnalysis, COTSymbol } from '../types/index.js';

/**
 * Commitment of Traders (COT) resource
 */
export class COTResource {
  constructor(private readonly client: FMPClient) {}

  /**
   * Get COT report for a symbol
   * @param symbol - Trading symbol
   * @param from - Start date (YYYY-MM-DD)
   * @param to - End date (YYYY-MM-DD)
   */
  async getReport(symbol: string, from?: string, to?: string): Promise<COTReport[]> {
    const params: Record<string, string> = { symbol: symbol.toUpperCase() };
    if (from) params.from = from;
    if (to) params.to = to;

    return this.client.get<COTReport[]>('v4/commitment_of_traders_report', { searchParams: params });
  }

  /**
   * Get COT analysis for a symbol
   * @param symbol - Trading symbol
   * @param from - Start date (YYYY-MM-DD)
   * @param to - End date (YYYY-MM-DD)
   */
  async getAnalysis(symbol: string, from?: string, to?: string): Promise<COTAnalysis[]> {
    const params: Record<string, string> = { symbol: symbol.toUpperCase() };
    if (from) params.from = from;
    if (to) params.to = to;

    return this.client.get<COTAnalysis[]>('v4/commitment_of_traders_report_analysis', { searchParams: params });
  }

  /**
   * Get list of available COT symbols
   */
  async getSymbols(): Promise<COTSymbol[]> {
    return this.client.get<COTSymbol[]>('v4/commitment_of_traders_report/list');
  }
}
