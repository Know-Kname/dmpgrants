import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import compression from 'compression';

import authRoutes from './routes/auth.js';
import workOrderRoutes from './routes/workOrders.js';
import inventoryRoutes from './routes/inventory.js';
import financialRoutes from './routes/financial.js';
import burialsRoutes from './routes/burials.js';
import contractsRoutes from './routes/contracts.js';
import grantsRoutes from './routes/grants.js';
import customersRoutes from './routes/customers.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable for development, enable in production
  crossOriginEmbedderPolicy: false
}));

// Compression middleware for response optimization
app.use(compression());

// CORS
app.use(cors());

// Body parser
app.use(express.json());

// Rate limiting - General API limit
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts per windowMs
  message: 'Too many login attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
});

// Apply general rate limiter to all API routes
app.use('/api/', generalLimiter);

// Routes (auth has additional stricter rate limiting)
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/work-orders', workOrderRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/financial', financialRoutes);
app.use('/api/burials', burialsRoutes);
app.use('/api/contracts', contractsRoutes);
app.use('/api/grants', grantsRoutes);
app.use('/api/customers', customersRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'DMP Cemetery API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
