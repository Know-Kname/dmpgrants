import express from 'express';
import { query } from '../db/index.js';
import { authenticateToken } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { validateCustomer, validateUUIDParam } from '../middleware/validation.js';

const router = express.Router();
router.use(authenticateToken);

router.get('/', asyncHandler(async (req, res) => {
  const result = await query('SELECT * FROM customers ORDER BY last_name, first_name');
  res.json(result.rows);
}));

router.post('/', validateCustomer, asyncHandler(async (req, res) => {
  const { firstName, lastName, email, phone, address, city, state, zipCode, notes } = req.body;
  const result = await query(
    `INSERT INTO customers (first_name, last_name, email, phone, address, city, state, zip_code, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
    [firstName, lastName, email || null, phone || null, address || null, city || null, state || null, zipCode || null, notes || null]
  );
  res.status(201).json(result.rows[0]);
}));

router.put('/:id', validateUUIDParam, validateCustomer, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, phone, address, city, state, zipCode, notes } = req.body;
  const result = await query(
    `UPDATE customers SET first_name = $1, last_name = $2, email = $3, phone = $4,
     address = $5, city = $6, state = $7, zip_code = $8, notes = $9, updated_at = CURRENT_TIMESTAMP
     WHERE id = $10 RETURNING *`,
    [firstName, lastName, email || null, phone || null, address || null, city || null, state || null, zipCode || null, notes || null, id]
  );
  res.json(result.rows[0]);
}));

router.delete('/:id', validateUUIDParam, asyncHandler(async (req, res) => {
  await query('DELETE FROM customers WHERE id = $1', [req.params.id]);
  res.json({ success: true });
}));

export default router;
