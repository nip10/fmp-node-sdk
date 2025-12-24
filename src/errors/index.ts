/**
 * Base error class for all FMP SDK errors
 */
export class FMPError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FMPError';
    Object.setPrototypeOf(this, FMPError.prototype);
  }
}

/**
 * Error thrown when API request fails
 */
export class FMPAPIError extends FMPError {
  public readonly status?: number;
  public readonly statusText?: string;

  constructor(message: string, status?: number, statusText?: string) {
    super(message);
    this.name = 'FMPAPIError';
    this.status = status;
    this.statusText = statusText;
    Object.setPrototypeOf(this, FMPAPIError.prototype);
  }
}

/**
 * Error thrown when validation fails
 */
export class FMPValidationError extends FMPError {
  constructor(message: string) {
    super(message);
    this.name = 'FMPValidationError';
    Object.setPrototypeOf(this, FMPValidationError.prototype);
  }
}
