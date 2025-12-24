# Contributing to FMP Node SDK

Thank you for your interest in contributing to FMP Node SDK! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Adding New Endpoints](#adding-new-endpoints)

## Code of Conduct

Please be respectful and constructive in all interactions with maintainers and other contributors. We are committed to providing a welcoming and inclusive environment for everyone.

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/fmp-node-sdk.git
   cd fmp-node-sdk
   ```
3. Add the upstream repository:
   ```bash
   git remote add upstream https://github.com/nip10/fmp-node-sdk.git
   ```

## Development Setup

### Prerequisites

- Node.js 18+ (we recommend using [nvm](https://github.com/nvm-sh/nvm))
- pnpm 8+ (install with `npm install -g pnpm`)
- A Financial Modeling Prep API key (get one at https://site.financialmodelingprep.com/developer/docs)

### Installation

```bash
# Install dependencies
pnpm install

# Create .env file for testing (optional)
echo "FMP_API_KEY=your_api_key_here" > .env
```

### Available Scripts

```bash
# Build the package
pnpm build

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm coverage

# Run tests with UI
pnpm test:ui

# Lint code
pnpm lint

# Format code
pnpm format

# Check package exports
pnpm check-exports
```

## Project Structure

```
fmp-node-sdk/
├── src/
│   ├── client.ts           # HTTP client wrapper
│   ├── fmp.ts             # Main SDK class
│   ├── index.ts           # Public exports
│   ├── errors/            # Error classes
│   │   └── index.ts
│   ├── resources/         # API resource classes
│   │   ├── analyst.ts
│   │   ├── bulk.ts
│   │   ├── commodities.ts
│   │   ├── company.ts
│   │   ├── cot.ts
│   │   ├── economics.ts
│   │   ├── esg.ts
│   │   ├── etf.ts
│   │   ├── events.ts
│   │   ├── financials.ts
│   │   ├── fundraisers.ts
│   │   ├── indexes.ts
│   │   ├── insider.ts
│   │   ├── market.ts
│   │   ├── news.ts
│   │   ├── performance.ts
│   │   ├── search.ts
│   │   ├── sec.ts
│   │   ├── technical.ts
│   │   └── valuation.ts
│   └── types/             # TypeScript type definitions
│       ├── index.ts       # Common types
│       ├── analyst.ts
│       ├── bulk.ts
│       ├── commodities.ts
│       ├── company.ts
│       ├── cot.ts
│       ├── economics.ts
│       ├── esg.ts
│       ├── etf.ts
│       ├── events.ts
│       ├── financials.ts
│       ├── fundraisers.ts
│       ├── indexes.ts
│       ├── insider.ts
│       ├── market.ts
│       ├── news.ts
│       ├── performance.ts
│       ├── search.ts
│       ├── sec.ts
│       ├── technical.ts
│       └── valuation.ts
├── tests/                 # Test files
├── examples/              # Usage examples
├── dist/                  # Build output (gitignored)
├── API_COVERAGE.md        # API endpoint coverage tracking
└── README.md
```

## Development Workflow

### Creating a New Branch

```bash
# Update your local main branch
git checkout main
git pull upstream main

# Create a new feature branch
git checkout -b feature/your-feature-name
```

### Making Changes

1. Make your changes in the appropriate files
2. Add tests for any new functionality
3. Update documentation (README.md, API_COVERAGE.md, etc.)
4. Run tests and linting:
   ```bash
   pnpm test
   pnpm lint
   pnpm format
   ```

### Committing Changes

We use conventional commits for clear commit messages:

```bash
# Format: <type>(<scope>): <subject>

# Examples:
git commit -m "feat(company): add new endpoint for executive compensation"
git commit -m "fix(client): handle rate limit errors correctly"
git commit -m "docs(readme): update installation instructions"
git commit -m "test(financials): add tests for income statement"
```

**Commit Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `test`: Adding or updating tests
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `chore`: Maintenance tasks

## Coding Standards

### TypeScript

- Use TypeScript strict mode
- Provide complete type definitions for all public APIs
- Avoid using `any` - use proper types or `unknown` if necessary
- Document complex types with JSDoc comments

### Code Style

We use ESLint and Prettier for code formatting:

```bash
# Format all files
pnpm format

# Check linting
pnpm lint
```

**Key Guidelines:**
- Use async/await instead of callbacks
- Use descriptive variable and function names
- Keep functions focused and small
- Add JSDoc comments for public methods
- Use `const` over `let` when possible
- Prefer functional programming patterns

### Example Code

```typescript
/**
 * Get company profile information
 * @param symbol - Stock symbol (e.g., "AAPL")
 * @returns Array of company profiles
 */
async getProfile(symbol: string): Promise<CompanyProfile[]> {
  return this.client.get<CompanyProfile[]>(`v3/profile/${symbol.toUpperCase()}`);
}
```

## Testing

We use Vitest for testing. All new features should include tests.

### Writing Tests

```typescript
import { describe, it, expect } from 'vitest';
import { FMP } from '../src/index.js';

describe('CompanyResource', () => {
  it('should get company profile', async () => {
    const fmp = new FMP({ apiKey: 'demo' });
    const profile = await fmp.company.getProfile('AAPL');

    expect(profile).toBeDefined();
    expect(Array.isArray(profile)).toBe(true);
  });
});
```

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm coverage

# Run specific test file
pnpm test src/tests/company.test.ts
```

### Test Coverage

- Aim for at least 80% code coverage
- Test both success and error cases
- Test edge cases and boundary conditions
- Mock external API calls when appropriate

## Pull Request Process

### Before Submitting

1. Ensure all tests pass: `pnpm test`
2. Ensure code is formatted: `pnpm format`
3. Ensure no linting errors: `pnpm lint`
4. Update documentation if needed
5. Add your changes to API_COVERAGE.md if adding new endpoints

### Submitting a Pull Request

1. Push your branch to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

2. Go to the [repository](https://github.com/nip10/fmp-node-sdk) and create a Pull Request

3. Fill out the PR template with:
   - Clear description of changes
   - Link to related issues
   - Screenshots/examples if applicable
   - Testing performed

4. Wait for review and address any feedback

### PR Review Process

- All PRs require at least one approval
- CI tests must pass
- Code coverage should not decrease significantly
- Breaking changes require discussion and major version bump

## Adding New Endpoints

When adding new FMP API endpoints:

### 1. Create/Update Type Definitions

Add types to the appropriate file in `src/types/`:

```typescript
// src/types/company.ts
export interface NewDataType {
  symbol: string;
  // ... other fields
}
```

### 2. Add Method to Resource Class

Add the method to the appropriate resource class in `src/resources/`:

```typescript
// src/resources/company.ts
/**
 * Get new data
 * @param symbol - Stock symbol
 */
async getNewData(symbol: string): Promise<NewDataType[]> {
  return this.client.get<NewDataType[]>(`v3/new-endpoint/${symbol.toUpperCase()}`);
}
```

### 3. Export Types

Add type exports to `src/index.ts`:

```typescript
export type { NewDataType } from './types/company.js';
```

### 4. Add Tests

Create tests in `tests/`:

```typescript
describe('CompanyResource - getNewData', () => {
  it('should fetch new data successfully', async () => {
    // Test implementation
  });
});
```

### 5. Update Documentation

- Update README.md with usage examples
- Update API_COVERAGE.md to mark the endpoint as implemented
- Add example to `examples/` if it demonstrates important functionality

### 6. Update Changelog

Add your changes to the changelog using changesets:

```bash
pnpm changeset
```

## Questions?

If you have questions:

1. Check existing [issues](https://github.com/nip10/fmp-node-sdk/issues)
2. Review the [README](README.md) and [API_COVERAGE.md](API_COVERAGE.md)
3. Open a new issue with your question

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
