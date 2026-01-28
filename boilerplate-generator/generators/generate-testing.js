#!/usr/bin/env node

/**
 * Testing Infrastructure Generator
 * Quickly set up Vitest + React Testing Library with best practices
 *
 * Usage:
 *   node generate-testing.js [output-dir]
 *   node generate-testing.js /path/to/project
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
const targetDir = args[0] || process.cwd();

// Color output helpers
const colors = {
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  blue: (text) => `\x1b[34m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  red: (text) => `\x1b[31m${text}\x1b[0m`,
};

// File templates
const templates = {
  vitestConfig: `import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.config.{js,ts}',
        'src/test/',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
`,

  setupTs: `import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() { return []; }
  unobserve() {}
} as any;

window.scrollTo = vi.fn();
`,

  utilsTsx: `import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

export function renderWithRouter(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { wrapper: BrowserRouter, ...options });
}

export function mockFetch(response: any, status: number = 200) {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: status >= 200 && status < 300,
      status,
      json: async () => response,
      headers: new Headers({ 'content-type': 'application/json' }),
    } as Response)
  );
}

export function mockFetchError(message: string = 'Network error') {
  global.fetch = vi.fn(() => Promise.reject(new Error(message)));
}

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
`,

  exampleTest: `import { describe, it, expect } from 'vitest';
import { renderWithRouter, screen } from '../test/utils';

describe('Example Test', () => {
  it('should pass', () => {
    expect(true).toBe(true);
  });
});
`,

  testingMd: `# Testing Guide

## Quick Start

\`\`\`bash
npm test              # Run all tests
npm test -- --watch   # Watch mode
npm run test:ui       # Interactive UI
npm run test:coverage # Coverage report
\`\`\`

## Writing Tests

### Component Tests
\`\`\`typescript
import { describe, it, expect } from 'vitest';
import { renderWithRouter, screen, userEvent } from '@/test/utils';

describe('MyComponent', () => {
  it('renders correctly', () => {
    renderWithRouter(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
\`\`\`

### API Tests
\`\`\`typescript
import { describe, it, expect } from 'vitest';
import { mockFetch } from '@/test/utils';

describe('API', () => {
  it('fetches data', async () => {
    mockFetch({ data: 'test' });
    const result = await fetchData();
    expect(result).toEqual({ data: 'test' });
  });
});
\`\`\`

## Best Practices
1. Test user behavior, not implementation
2. Use semantic queries (getByRole, getByLabelText)
3. Keep tests simple and focused
4. Mock external dependencies

## Coverage Goals
- Critical paths: 100%
- UI Components: 80%
- Utilities: 90%
- Overall: 70%+
`,
};

const dependencies = {
  devDependencies: {
    '@testing-library/react': '^14.1.2',
    '@testing-library/jest-dom': '^6.1.5',
    '@testing-library/user-event': '^14.5.1',
    '@vitest/ui': '^1.0.4',
    'jsdom': '^23.0.1',
    'vitest': '^1.0.4',
  },
};

async function ensureDir(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
  }
}

async function writeFile(filePath, content) {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, content, 'utf-8');
  console.log(colors.green('✓'), `Created ${path.relative(targetDir, filePath)}`);
}

async function updatePackageJson() {
  const pkgPath = path.join(targetDir, 'package.json');
  let pkg;

  try {
    const content = await fs.readFile(pkgPath, 'utf-8');
    pkg = JSON.parse(content);
  } catch {
    console.log(colors.yellow('⚠'), 'No package.json found, creating one...');
    pkg = { name: 'my-app', version: '1.0.0' };
  }

  // Add scripts
  pkg.scripts = pkg.scripts || {};
  pkg.scripts.test = 'vitest';
  pkg.scripts['test:ui'] = 'vitest --ui';
  pkg.scripts['test:coverage'] = 'vitest --coverage';

  // Add devDependencies
  pkg.devDependencies = { ...pkg.devDependencies, ...dependencies.devDependencies };

  await fs.writeFile(pkgPath, JSON.stringify(pkg, null, 2), 'utf-8');
  console.log(colors.green('✓'), 'Updated package.json');
}

async function generateTestingSetup() {
  console.log(colors.blue('\n🧪 Testing Infrastructure Generator\n'));

  try {
    // Create config files
    await writeFile(
      path.join(targetDir, 'vitest.config.ts'),
      templates.vitestConfig
    );

    // Create test setup
    await writeFile(
      path.join(targetDir, 'src/test/setup.ts'),
      templates.setupTs
    );

    await writeFile(
      path.join(targetDir, 'src/test/utils.tsx'),
      templates.utilsTsx
    );

    // Create example test
    await writeFile(
      path.join(targetDir, 'src/example.test.tsx'),
      templates.exampleTest
    );

    // Create documentation
    await writeFile(
      path.join(targetDir, 'TESTING.md'),
      templates.testingMd
    );

    // Update package.json
    await updatePackageJson();

    console.log(colors.green('\n✅ Testing infrastructure set up successfully!\n'));
    console.log(colors.blue('Next steps:'));
    console.log('  1. Run: npm install');
    console.log('  2. Run: npm test');
    console.log('  3. Read: TESTING.md\n');

  } catch (error) {
    console.error(colors.red('❌ Error:'), error.message);
    process.exit(1);
  }
}

generateTestingSetup();
