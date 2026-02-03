import express from 'express';
import { query } from '../db/index.js';
import { authenticateToken } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import {
  validateDeposit,
  validatePayable,
  validatePayableUpdate,
  validateReceivable,
  validateReceivableUpdate,
  validateUUIDParam,
} from '../middleware/validation.js';
import { NotFoundError } from '../utils/errors.js';

const router = express.Router();
router.use(authenticateToken);

// Deposits
router.get('/deposits', asyncHandler(async (req, res) => {
  const result = await query(`
    SELECT d.*, c.first_name, c.last_name, u.name as created_by_name
    FROM deposits d
    LEFT JOIN customers c ON d.customer_id = c.id
    LEFT JOIN users u ON d.created_by = u.id
    ORDER BY d.date DESC
  `);
  res.json(result.rows);
}));

router.post('/deposits', validateDeposit, asyncHandler(async (req, res) => {
  const { amount, date, method, reference, customerId, notes } = req.body;
  const result = await query(
    `INSERT INTO deposits (amount, date, method, reference, customer_id, notes, created_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [amount, date, method, reference || null, customerId || null, notes || null, req.user.id]
  );
  res.status(201).json(result.rows[0]);
}));

// Accounts Receivable
router.get('/receivables', asyncHandler(async (req, res) => {
  const result = await query(`
    SELECT ar.*, c.first_name, c.last_name
    FROM accounts_receivable ar
    JOIN customers c ON ar.customer_id = c.id
    ORDER BY ar.due_date
  `);
  res.json(result.rows);
}));

router.post('/receivables', validateReceivable, asyncHandler(async (req, res) => {
  const { customerId, invoiceNumber, amount, dueDate } = req.body;
  const result = await query(
    `INSERT INTO accounts_receivable (customer_id, invoice_number, amount, due_date, status)
     VALUES ($1, $2, $3, $4, 'pending') RETURNING *`,
    [customerId, invoiceNumber, amount, dueDate]
  );
  res.status(201).json(result.rows[0]);
}));

router.put('/receivables/:id', validateUUIDParam, validateReceivableUpdate, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { amountPaid, status } = req.body;
  const result = await query(
    `UPDATE accounts_receivable SET amount_paid = $1, status = $2, updated_at = CURRENT_TIMESTAMP
     WHERE id = $3 RETURNING *`,
    [amountPaid, status, id]
  );
  if (result.rows.length === 0) {
    throw new NotFoundError('Accounts receivable');
  }
  res.json(result.rows[0]);
}));

// Accounts Payable
router.get('/payables', asyncHandler(async (req, res) => {
  const result = await query(`
    SELECT ap.*, v.name as vendor_name
    FROM accounts_payable ap
    JOIN vendors v ON ap.vendor_id = v.id
    ORDER BY ap.due_date
  `);
  res.json(result.rows);
}));

router.post('/payables', validatePayable, asyncHandler(async (req, res) => {
  const { vendorId, invoiceNumber, amount, dueDate } = req.body;
  const result = await query(
    `INSERT INTO accounts_payable (vendor_id, invoice_number, amount, due_date, status)
     VALUES ($1, $2, $3, $4, 'pending') RETURNING *`,
    [vendorId, invoiceNumber, amount, dueDate]
  );
  res.status(201).json(result.rows[0]);
}));

router.put('/payables/:id', validateUUIDParam, validatePayableUpdate, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { amountPaid, status } = req.body;
  const result = await query(
    `UPDATE accounts_payable SET amount_paid = $1, status = $2, updated_at = CURRENT_TIMESTAMP
     WHERE id = $3 RETURNING *`,
    [amountPaid, status, id]
  );
  if (result.rows.length === 0) {
    throw new NotFoundError('Accounts payable');
  }
  res.json(result.rows[0]);
}));

export default router;
