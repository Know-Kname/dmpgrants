import express from 'express';
import { query } from '../db/index.js';
import { authenticateToken } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { validateInventory, validateUUIDParam } from '../middleware/validation.js';

const router = express.Router();
router.use(authenticateToken);

router.get('/', asyncHandler(async (req, res) => {
  const result = await query(`
    SELECT i.*, v.name as vendor_name
    FROM inventory i
    LEFT JOIN vendors v ON i.vendor_id = v.id
    ORDER BY i.name
  `);
  res.json(result.rows);
}));

router.post('/', validateInventory, asyncHandler(async (req, res) => {
  const { name, category, sku, quantity, reorderPoint, unitPrice, vendorId, location } = req.body;
  const vendorIdValue = vendorId || null;

  const result = await query(
    `INSERT INTO inventory (name, category, sku, quantity, reorder_point, unit_price, vendor_id, location)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [name, category, sku || null, quantity, reorderPoint, unitPrice, vendorIdValue, location || null]
  );
  res.status(201).json(result.rows[0]);
}));

router.put('/:id', validateUUIDParam, validateInventory, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, category, sku, quantity, reorderPoint, unitPrice, vendorId, location } = req.body;
  const vendorIdValue = vendorId || null;

  const result = await query(
    `UPDATE inventory SET name = $1, category = $2, sku = $3, quantity = $4,
     reorder_point = $5, unit_price = $6, vendor_id = $7, location = $8, updated_at = CURRENT_TIMESTAMP
     WHERE id = $9 RETURNING *`,
    [name, category, sku || null, quantity, reorderPoint, unitPrice, vendorIdValue, location || null, id]
  );
  res.json(result.rows[0]);
}));

router.delete('/:id', validateUUIDParam, asyncHandler(async (req, res) => {
  await query('DELETE FROM inventory WHERE id = $1', [req.params.id]);
  res.json({ success: true });
}));

export default router;
