import express from 'express';
import { query } from '../db/index.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateWorkOrder, validateUUIDParam } from '../middleware/validation.js';

const router = express.Router();
router.use(authenticateToken);

// Get all work orders
router.get('/', async (req, res) => {
  try {
    const result = await query(`
      SELECT wo.*, u.name as assigned_to_name, c.name as created_by_name
      FROM work_orders wo
      LEFT JOIN users u ON wo.assigned_to = u.id
      LEFT JOIN users c ON wo.created_by = c.id
      ORDER BY wo.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create work order
router.post('/', validateWorkOrder, async (req, res) => {
  try {
    const { title, description, type, priority, assignedTo, dueDate } = req.body;
    const result = await query(
      `INSERT INTO work_orders (title, description, type, priority, status, assigned_to, due_date, created_by)
       VALUES ($1, $2, $3, $4, 'pending', $5, $6, $7) RETURNING *`,
      [title, description, type, priority, assignedTo, dueDate, req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update work order
router.put('/:id', validateUUIDParam, validateWorkOrder, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, type, priority, status, assignedTo, dueDate, completedDate } = req.body;
    const result = await query(
      `UPDATE work_orders SET title = $1, description = $2, type = $3, priority = $4,
       status = $5, assigned_to = $6, due_date = $7, completed_date = $8, updated_at = CURRENT_TIMESTAMP
       WHERE id = $9 RETURNING *`,
      [title, description, type, priority, status, assignedTo, dueDate, completedDate, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete work order
router.delete('/:id', validateUUIDParam, async (req, res) => {
  try {
    await query('DELETE FROM work_orders WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
