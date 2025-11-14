import express from 'express';
import { query } from '../db/index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticateToken);

// Deposits
router.get('/deposits', async (req, res) => {
  try {
    const result = await query(`
      SELECT d.*, c.first_name, c.last_name, u.name as created_by_name
      FROM deposits d
      LEFT JOIN customers c ON d.customer_id = c.id
      LEFT JOIN users u ON d.created_by = u.id
      ORDER BY d.date DESC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/deposits', async (req, res) => {
  try {
    const { amount, date, method, reference, customerId, notes } = req.body;
    const result = await query(
      `INSERT INTO deposits (amount, date, method, reference, customer_id, notes, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [amount, date, method, reference, customerId, notes, req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Accounts Receivable
router.get('/receivables', async (req, res) => {
  try {
    const result = await query(`
      SELECT ar.*, c.first_name, c.last_name
      FROM accounts_receivable ar
      JOIN customers c ON ar.customer_id = c.id
      ORDER BY ar.due_date
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/receivables', async (req, res) => {
  try {
    const { customerId, invoiceNumber, amount, dueDate } = req.body;
    const result = await query(
      `INSERT INTO accounts_receivable (customer_id, invoice_number, amount, due_date, status)
       VALUES ($1, $2, $3, $4, 'pending') RETURNING *`,
      [customerId, invoiceNumber, amount, dueDate]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/receivables/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { amountPaid, status } = req.body;
    const result = await query(
      `UPDATE accounts_receivable SET amount_paid = $1, status = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3 RETURNING *`,
      [amountPaid, status, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Accounts Payable
router.get('/payables', async (req, res) => {
  try {
    const result = await query(`
      SELECT ap.*, v.name as vendor_name
      FROM accounts_payable ap
      JOIN vendors v ON ap.vendor_id = v.id
      ORDER BY ap.due_date
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/payables', async (req, res) => {
  try {
    const { vendorId, invoiceNumber, amount, dueDate } = req.body;
    const result = await query(
      `INSERT INTO accounts_payable (vendor_id, invoice_number, amount, due_date, status)
       VALUES ($1, $2, $3, $4, 'pending') RETURNING *`,
      [vendorId, invoiceNumber, amount, dueDate]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/payables/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { amountPaid, status } = req.body;
    const result = await query(
      `UPDATE accounts_payable SET amount_paid = $1, status = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3 RETURNING *`,
      [amountPaid, status, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
