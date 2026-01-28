# 🧪 Testing Infrastructure Generator

**Instantly add production-ready testing to any React/TypeScript project**

## Why Use This?

Setting up testing infrastructure is time-consuming and error-prone. This generator gives you:
- ✅ **2 minutes** vs 2-3 hours manual setup
- ✅ **Best practices** baked in (Vitest + React Testing Library)
- ✅ **Type-safe** tests with full TypeScript support
- ✅ **Example tests** to learn from
- ✅ **Zero config** - works immediately

---

## Quick Start

### Option 1: Via CLI (Recommended)
```bash
cd boilerplate-generator
npm run cli
# Select option 4: Testing Setup
```

### Option 2: Direct Script
```bash
# From boilerplate-generator directory
node generators/generate-testing.js /path/to/your/project

# Or generate in current directory
node generators/generate-testing.js
```

### Option 3: Standalone
```bash
# Copy the generator to your project
cp generators/generate-testing.js ~/my-project/
cd ~/my-project
node generate-testing.js
```

---

## What Gets Generated

```
your-project/
├── vitest.config.ts          # Vitest configuration
├── src/
│   ├── test/
│   │   ├── setup.ts          # Global test setup
│   │   └── utils.tsx         # Test helpers & mocks
│   └── example.test.tsx      # Example test file
├── TESTING.md                # Usage documentation
└── package.json              # Updated with scripts & deps
```

---

## Generated Features

### 1. Vitest Configuration
- Fast, Vite-native test runner (10-20x faster than Jest)
- Coverage reporting with v8
- TypeScript support out of the box
- jsdom environment for DOM testing

### 2. Test Utilities
```typescript
// Render with providers
renderWithRouter(<MyComponent />);

// Mock API responses
mockFetch({ data: 'test' }, 200);

// Mock errors
mockFetchError('Network error');

// All Testing Library utilities
screen, userEvent, waitFor, etc.
```

### 3. NPM Scripts
```bash
npm test              # Run all tests
npm test -- --watch   # Watch mode
npm run test:ui       # Interactive UI
npm run test:coverage # Coverage report
```

### 4. Example Test
Shows best practices for:
- Component rendering
- User interactions
- API mocking
- Async testing

---

## Dependencies Added

**Automatically added to `package.json`:**
```json
{
  "devDependencies": {
    "@testing-library/react": "^14.1.2",
    "@testing-library/jest-dom": "^6.1.5",
    "@testing-library/user-event": "^14.5.1",
    "@vitest/ui": "^1.0.4",
    "jsdom": "^23.0.1",
    "vitest": "^1.0.4"
  }
}
```

**Total install size:** ~50MB (minimal overhead)

---

## Usage After Generation

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Tests
```bash
npm test
```

### 3. Write Your First Test
```typescript
// src/components/Button.test.tsx
import { describe, it, expect } from 'vitest';
import { renderWithRouter, screen, userEvent } from '@/test/utils';
import Button from './Button';

describe('Button', () => {
  it('handles click events', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    renderWithRouter(<Button onClick={handleClick}>Click me</Button>);

    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledOnce();
  });
});
```

---

## Customization

### Add Custom Providers
```typescript
// src/test/utils.tsx
export function renderWithProviders(ui, options) {
  function Wrapper({ children }) {
    return (
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    );
  }
  return render(ui, { wrapper: Wrapper, ...options });
}
```

### Add Global Mocks
```typescript
// src/test/setup.ts
global.fetch = vi.fn();
global.localStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  // ...
};
```

### Configure Coverage Thresholds
```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
});
```

---

## Best Practices Included

✅ **Test user behavior, not implementation**
```typescript
// Good ✓
await user.click(screen.getByRole('button', { name: 'Submit' }));
expect(screen.getByText('Success')).toBeInTheDocument();

// Bad ✗
expect(component.state.isSubmitting).toBe(false);
```

✅ **Use semantic queries**
```typescript
// Good ✓
screen.getByRole('button', { name: 'Submit' })
screen.getByLabelText('Email')

// Bad ✗
screen.getByTestId('submit-btn')
container.querySelector('.btn')
```

✅ **Keep tests simple and focused**
- One concept per test
- Clear descriptive names
- Minimal setup/teardown

---

## Troubleshooting

### Tests won't run
```bash
# Make sure dependencies are installed
npm install

# Check vitest is in node_modules
ls node_modules/.bin/vitest
```

### TypeScript errors
```bash
# Ensure @types packages are installed
npm install -D @types/react @types/react-dom
```

### DOM not available
```typescript
// Make sure jsdom is configured in vitest.config.ts
export default defineConfig({
  test: {
    environment: 'jsdom', // ← This line
  },
});
```

---

## Integration with CI/CD

### GitHub Actions
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm test
      - run: npm run test:coverage
```

### Pre-commit Hook
```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm test -- --run"
    }
  }
}
```

---

## Comparison with Manual Setup

| Task | Manual | With Generator | Savings |
|------|--------|---------------|---------|
| Install dependencies | 20 min | 2 min | 90% |
| Configure Vitest | 30 min | 0 min | 100% |
| Setup test utilities | 45 min | 0 min | 100% |
| Write example tests | 30 min | 0 min | 100% |
| Documentation | 20 min | 0 min | 100% |
| **TOTAL** | **2-3 hours** | **2 minutes** | **98%** |

---

## Advanced Usage

### Generate for Multiple Projects
```bash
# Generate for all projects in workspace
for dir in packages/*; do
  node generators/generate-testing.js "$dir"
done
```

### Custom Template
```javascript
// Edit generate-testing.js to customize templates
const templates = {
  vitestConfig: `// Your custom config`,
  // ...
};
```

### Backend Testing (Node.js)
```javascript
// The generator works for backend too!
// Just skip the React Testing Library imports
// Use supertest for API testing
```

---

## Support & Feedback

**Found a bug?** Open an issue at your repo
**Want a feature?** PRs welcome!
**Questions?** Check TESTING.md in generated project

---

## License

MIT - Use freely in any project, commercial or personal.
