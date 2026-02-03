import cors from 'cors';
import express from 'express';

import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { normalizeRequest } from './middleware/normalizeRequest.js';
import { requestContext } from './middleware/requestContext.js';
import authRoutes from './routes/auth.js';
import workOrderRoutes from './routes/workOrders.js';
import inventoryRoutes from './routes/inventory.js';
import financialRoutes from './routes/financial.js';
import burialsRoutes from './routes/burials.js';
import contractsRoutes from './routes/contracts.js';
import grantsRoutes from './routes/grants.js';
import customersRoutes from './routes/customers.js';

const app = express();

app.use(cors());
app.use(requestContext);
app.use(express.json());
app.use(normalizeRequest);

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

export default app;
