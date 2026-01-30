import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import compression from 'compression';
import helmet from 'helmet';

import authRoutes from './routes/auth.js';
import workOrderRoutes from './routes/workOrders.js';
import inventoryRoutes from './routes/inventory.js';
import financialRoutes from './routes/financial.js';
import burialsRoutes from './routes/burials.js';
import contractsRoutes from './routes/contracts.js';
import grantsRoutes from './routes/grants.js';
import customersRoutes from './routes/customers.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const rawOrigins = process.env.CORS_ORIGINS || process.env.CORS_ORIGIN;
const allowedOrigins = rawOrigins
  ? rawOrigins.split(',').map((origin) => origin.trim()).filter(Boolean)
  : [];

const corsOptions = allowedOrigins.length
  ? {
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
          return;
        }
        callback(new Error('Not allowed by CORS'));
      },
      credentials: true,
    }
  : { origin: true, credentials: true };

app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(helmet());
app.use(compression());
app.use(cors(corsOptions));
app.use(express.json({ limit: '1mb' }));

// Routes
app.use('/api/auth', authRoutes);
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

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
