import express from 'express';
import { query } from '../db/index.js';
import { authenticateToken } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { validateContract, validateContractUpdate, validateUUIDParam } from '../middleware/validation.js';
import { NotFoundError } from '../utils/errors.js';

const router = express.Router();
router.use(authenticateToken);

router.get('/', asyncHandler(async (req, res) => {
  const result = await query(`
    SELECT c.*, cu.first_name, cu.last_name,
      (SELECT json_agg(ci.*) FROM contract_items ci WHERE ci.contract_id = c.id) as items
    FROM contracts c
    JOIN customers cu ON c.customer_id = cu.id
    ORDER BY c.created_at DESC
  `);
  res.json(result.rows);
}));

router.post('/', validateContract, asyncHandler(async (req, res) => {
  const { contractNumber, type, customerId, totalAmount, signedDate, paymentPlan, items } = req.body;

  const contractResult = await query(
    `INSERT INTO contracts (contract_number, type, customer_id, total_amount, signed_date, payment_plan, status)
     VALUES ($1, $2, $3, $4, $5, $6, 'active') RETURNING *`,
    [contractNumber, type, customerId, totalAmount, signedDate, JSON.stringify(paymentPlan || null)]
  );

  const contract = contractResult.rows[0];

  // Insert contract items
  if (items && items.length > 0) {
    for (const item of items) {
      await query(
        'INSERT INTO contract_items (contract_id, description, amount) VALUES ($1, $2, $3)',
        [contract.id, item.description, item.amount]
      );
    }
  }

  res.status(201).json(contract);
}));

router.put('/:id', validateUUIDParam, validateContractUpdate, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { totalAmount, amountPaid, status, paymentPlan } = req.body;
  const result = await query(
    `UPDATE contracts SET total_amount = $1, amount_paid = $2, status = $3,
     payment_plan = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *`,
    [totalAmount, amountPaid, status, JSON.stringify(paymentPlan || null), id]
  );
  if (result.rows.length === 0) {
    throw new NotFoundError('Contract');
  }
  res.json(result.rows[0]);
}));

router.delete('/:id', validateUUIDParam, asyncHandler(async (req, res) => {
  const result = await query('DELETE FROM contracts WHERE id = $1 RETURNING id', [req.params.id]);
  if (result.rows.length === 0) {
    throw new NotFoundError('Contract');
  }
  res.json({ success: true });
}));

export default router;
