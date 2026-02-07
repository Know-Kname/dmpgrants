import express from 'express';
import { query } from '../db/index.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateInventory, validateUUIDParam } from '../middleware/validation.js';

const router = express.Router();
router.use(authenticateToken);

router.get('/', async (req, res) => {
  try {
    const result = await query(`
      SELECT i.*, v.name as vendor_name
      FROM inventory i
      LEFT JOIN vendors v ON i.vendor_id = v.id
      ORDER BY i.name
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', validateInventory, async (req, res) => {
  try {
    const { name, category, sku, quantity, reorderPoint, unitPrice, vendorId, location } = req.body;
    const result = await query(
      `INSERT INTO inventory (name, category, sku, quantity, reorder_point, unit_price, vendor_id, location)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [name, category, sku, quantity, reorderPoint, unitPrice, vendorId, location]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', validateUUIDParam, validateInventory, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, sku, quantity, reorderPoint, unitPrice, vendorId, location } = req.body;
    const result = await query(
      `UPDATE inventory SET name = $1, category = $2, sku = $3, quantity = $4,
       reorder_point = $5, unit_price = $6, vendor_id = $7, location = $8, updated_at = CURRENT_TIMESTAMP
       WHERE id = $9 RETURNING *`,
      [name, category, sku, quantity, reorderPoint, unitPrice, vendorId, location, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', validateUUIDParam, async (req, res) => {
  try {
    await query('DELETE FROM inventory WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
