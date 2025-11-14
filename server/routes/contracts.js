import express from 'express';
import { query } from '../db/index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticateToken);

router.get('/', async (req, res) => {
  try {
    const result = await query(`
      SELECT c.*, cu.first_name, cu.last_name,
        (SELECT json_agg(ci.*) FROM contract_items ci WHERE ci.contract_id = c.id) as items
      FROM contracts c
      JOIN customers cu ON c.customer_id = cu.id
      ORDER BY c.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { contractNumber, type, customerId, totalAmount, signedDate, paymentPlan, items } = req.body;

    const contractResult = await query(
      `INSERT INTO contracts (contract_number, type, customer_id, total_amount, signed_date, payment_plan, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'active') RETURNING *`,
      [contractNumber, type, customerId, totalAmount, signedDate, JSON.stringify(paymentPlan)]
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
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { totalAmount, amountPaid, status, paymentPlan } = req.body;
    const result = await query(
      `UPDATE contracts SET total_amount = $1, amount_paid = $2, status = $3,
       payment_plan = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *`,
      [totalAmount, amountPaid, status, JSON.stringify(paymentPlan), id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await query('DELETE FROM contracts WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
