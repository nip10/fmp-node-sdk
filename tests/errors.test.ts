import { describe, it, expect } from 'vitest';
import {
  FMPError,
  FMPAPIError,
  FMPValidationError,
} from '../src/index.js';

describe('Error Classes', () => {
  describe('FMPError', () => {
    it('should create base error', () => {
      const error = new FMPError('Test error');
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(FMPError);
      expect(error.name).toBe('FMPError');
      expect(error.message).toBe('Test error');
    });
  });

  describe('FMPAPIError', () => {
    it('should create API error with status', () => {
      const error = new FMPAPIError('API error', 500, 'Internal Server Error');
      expect(error).toBeInstanceOf(FMPError);
      expect(error).toBeInstanceOf(FMPAPIError);
      expect(error.name).toBe('FMPAPIError');
      expect(error.message).toBe('API error');
      expect(error.status).toBe(500);
      expect(error.statusText).toBe('Internal Server Error');
    });

    it('should create API error without status', () => {
      const error = new FMPAPIError('API error');
      expect(error.status).toBeUndefined();
      expect(error.statusText).toBeUndefined();
    });

    it('should create auth error with status 401', () => {
      const error = new FMPAPIError('Invalid API key', 401, 'Unauthorized');
      expect(error).toBeInstanceOf(FMPError);
      expect(error.name).toBe('FMPAPIError');
      expect(error.message).toBe('Invalid API key');
      expect(error.status).toBe(401);
    });

    it('should create rate limit error with status 429', () => {
      const error = new FMPAPIError('Rate limit exceeded', 429, 'Too Many Requests');
      expect(error).toBeInstanceOf(FMPError);
      expect(error.name).toBe('FMPAPIError');
      expect(error.message).toBe('Rate limit exceeded');
      expect(error.status).toBe(429);
    });
  });

  describe('FMPValidationError', () => {
    it('should create validation error', () => {
      const error = new FMPValidationError('Invalid input');
      expect(error).toBeInstanceOf(FMPError);
      expect(error.name).toBe('FMPValidationError');
      expect(error.message).toBe('Invalid input');
    });
  });
});
