import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection cannot be established
});

// Handle pool errors
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle database client', err);
  // Don't exit the process, just log the error
});

// Handle connection errors
pool.on('connect', (client) => {
  // Optional: log successful connections in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Database client connected');
  }
});

/**
 * Enhanced query function with error handling
 * @param {string} text - SQL query text
 * @param {Array} params - Query parameters
 * @returns {Promise} Query result
 */
export const query = async (text, params) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;

    // Log slow queries in development (over 100ms)
    if (process.env.NODE_ENV === 'development' && duration > 100) {
      console.warn(`Slow query (${duration}ms):`, text.substring(0, 100));
    }

    return result;
  } catch (error) {
    // Enhanced error messages
    if (error.code === '23505') {
      error.message = 'A record with this value already exists';
    } else if (error.code === '23503') {
      error.message = 'Referenced record does not exist';
    } else if (error.code === '23502') {
      error.message = 'Required field is missing';
    } else if (error.code === '22P02') {
      error.message = 'Invalid data type provided';
    } else if (error.code === 'ECONNREFUSED') {
      error.message = 'Database connection failed';
    }

    throw error;
  }
};

/**
 * Get pool status for monitoring
 * @returns {Object} Pool status
 */
export const getPoolStatus = () => ({
  totalCount: pool.totalCount,
  idleCount: pool.idleCount,
  waitingCount: pool.waitingCount,
});

export default pool;
