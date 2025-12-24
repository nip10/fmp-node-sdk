import { FMPValidationError } from '../errors/index.js';

/**
 * Regular expression for YYYY-MM-DD date format
 */
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Validate date string format (YYYY-MM-DD)
 * @param date - Date string to validate
 * @param paramName - Parameter name for error messages
 * @throws {FMPValidationError} If date format is invalid
 */
export function validateDate(date: string, paramName = 'date'): void {
  if (!DATE_REGEX.test(date)) {
    throw new FMPValidationError(
      `${paramName} must be in YYYY-MM-DD format, received: ${date}`
    );
  }

  // Check if date is actually valid (not 2024-99-99)
  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) {
    throw new FMPValidationError(`${paramName} is not a valid date: ${date}`);
  }
}

/**
 * Validate symbol is not empty
 * @param symbol - Stock symbol to validate
 * @throws {FMPValidationError} If symbol is empty or invalid
 */
export function validateSymbol(symbol: string): void {
  if (!symbol?.trim()) {
    throw new FMPValidationError('Symbol cannot be empty');
  }
}

/**
 * Validate date range (both dates and logical order)
 * @param from - Start date (optional)
 * @param to - End date (optional)
 * @throws {FMPValidationError} If dates are invalid or range is illogical
 */
export function validateDateRange(from?: string, to?: string): void {
  if (from) {
    validateDate(from, 'from');
  }

  if (to) {
    validateDate(to, 'to');
  }

  // Check logical order if both provided
  if (from && to && from > to) {
    throw new FMPValidationError(
      `'from' date (${from}) cannot be after 'to' date (${to})`
    );
  }
}
