import { beforeAll, afterAll, beforeEach } from 'vitest';
import { query } from '../db/index.js';

// Mock environment variables for testing
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key-min-32-characters-long-for-security';
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || process.env.DATABASE_URL;
process.env.LOG_LEVEL = 'error'; // Suppress logs during tests

// Setup test database (if needed)
beforeAll(async () => {
  // You can add database setup here if needed
  // For example, running migrations or seeding test data
});

// Cleanup after all tests
afterAll(async () => {
  // Close database connections
  // Clean up any test data
});

// Reset state before each test
beforeEach(async () => {
  // You can reset specific tables or clear test data here
  // For example: await query('DELETE FROM users WHERE email LIKE $1', ['%test%']);
});
