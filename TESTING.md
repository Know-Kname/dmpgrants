# Testing Guide

## Quick Start

```bash
# Run all tests
npm test

# Run tests in watch mode (recommended during development)
npm test -- --watch

# Run tests with UI (interactive browser interface)
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

## Test Structure

```
├── src/
│   ├── test/
│   │   ├── setup.ts           # Global test setup
│   │   └── utils.tsx          # Test utilities & helpers
│   ├── lib/
│   │   ├── api.test.ts        # API client tests
│   │   └── auth.test.tsx      # Auth hook tests
│   └── components/
│       └── *.test.tsx         # Component tests
└── server/
    ├── test/
    │   └── setup.js           # Backend test setup
    └── routes/
        └── *.test.js          # API endpoint tests
```

## Writing Tests

### Frontend Component Tests

```typescript
import { describe, it, expect } from 'vitest';
import { renderWithProviders, screen, userEvent } from '@/test/utils';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    renderWithProviders(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('should handle user interactions', async () => {
    const user = userEvent.setup();
    renderWithProviders(<MyComponent />);

    await user.click(screen.getByRole('button'));
    expect(screen.getByText('Clicked')).toBeInTheDocument();
  });
});
```

### Backend API Tests

```javascript
import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app from '../index.js';

describe('GET /api/endpoint', () => {
  it('should return data', async () => {
    const response = await request(app).get('/api/endpoint');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
  });
});
```

## Test Utilities

### `renderWithProviders(component)`
Renders a component with all necessary providers (Router, Auth, Toast, etc.)

### `mockFetch(response, status)`
Mock successful fetch responses

### `mockFetchError(message)`
Mock fetch errors

## Best Practices

1. **Test user behavior, not implementation**
   ```typescript
   // ✅ Good - tests user interaction
   await user.click(screen.getByRole('button', { name: 'Submit' }));
   expect(screen.getByText('Success')).toBeInTheDocument();

   // ❌ Bad - tests implementation details
   expect(component.state.isSubmitting).toBe(false);
   ```

2. **Use semantic queries**
   ```typescript
   // ✅ Good - accessible and robust
   screen.getByRole('button', { name: 'Submit' })
   screen.getByLabelText('Email')

   // ❌ Bad - fragile
   screen.getByTestId('submit-btn')
   container.querySelector('.submit-button')
   ```

3. **Keep tests simple and focused**
   - One concept per test
   - Clear test names describing the behavior
   - Minimal setup/teardown

4. **Mock external dependencies**
   - Database calls
   - API requests
   - File system operations
   - Time-based functions

## Coverage Goals

- **Critical paths**: 100% (Auth, API, Payment)
- **UI Components**: 80%
- **Utilities**: 90%
- **Overall**: 70%+

Run `npm run test:coverage` to see current coverage.

## CI/CD Integration

Tests automatically run on:
- Pre-commit (via git hooks)
- Pull requests
- Main branch pushes

Ensure all tests pass before merging.
