import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['server/tests/**/*.test.{js,ts}'],
    coverage: {
      reporter: ['text', 'html', 'json'],
    },
  },
});
