import express from 'express';
import { query } from '../db/index.js';
import { authenticateToken } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { validateContract, validateContractUpdate, validateUUIDParam } from '../middleware/validation.js';

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
    [contractNumber, type, customerId, totalAmount, signedDate, paymentPlan ? JSON.stringify(paymentPlan) : null]
  );

  const contract = contractResult.rows[0];
  const itemsValue = Array.isArray(items) ? items : [];

  // Insert contract items
  if (itemsValue.length > 0) {
    for (const item of itemsValue) {
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
  const totalAmountValue = totalAmount === '' || totalAmount === undefined ? null : totalAmount;
  const amountPaidValue = amountPaid === '' || amountPaid === undefined ? null : amountPaid;

  const result = await query(
    `UPDATE contracts SET total_amount = COALESCE($1, total_amount), amount_paid = COALESCE($2, amount_paid),
     status = COALESCE($3, status), payment_plan = COALESCE($4, payment_plan),
     updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *`,
    [
      totalAmountValue,
      amountPaidValue,
      status,
      paymentPlan ? JSON.stringify(paymentPlan) : null,
      id,
    ]
  );
  res.json(result.rows[0]);
}));

router.delete('/:id', validateUUIDParam, asyncHandler(async (req, res) => {
  await query('DELETE FROM contracts WHERE id = $1', [req.params.id]);
  res.json({ success: true });
}));

export default router;
