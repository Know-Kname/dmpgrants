import express from 'express';
import { query } from '../db/index.js';
import { authenticateToken } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { validateUUIDParam, validateWorkOrder } from '../middleware/validation.js';

const router = express.Router();
router.use(authenticateToken);

// Get all work orders
router.get('/', asyncHandler(async (req, res) => {
  const result = await query(`
    SELECT wo.*, u.name as assigned_to_name, c.name as created_by_name
    FROM work_orders wo
    LEFT JOIN users u ON wo.assigned_to = u.id
    LEFT JOIN users c ON wo.created_by = c.id
    ORDER BY wo.created_at DESC
  `);
  res.json(result.rows);
}));

// Create work order
router.post('/', validateWorkOrder, asyncHandler(async (req, res) => {
  const { title, description, type, priority, assignedTo, dueDate } = req.body;
  const assignedToValue = assignedTo || null;
  const dueDateValue = dueDate || null;

  const result = await query(
    `INSERT INTO work_orders (title, description, type, priority, status, assigned_to, due_date, created_by)
     VALUES ($1, $2, $3, $4, 'pending', $5, $6, $7) RETURNING *`,
    [title, description, type, priority, assignedToValue, dueDateValue, req.user.id]
  );
  res.status(201).json(result.rows[0]);
}));

// Update work order
router.put('/:id', validateUUIDParam, validateWorkOrder, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, type, priority, status, assignedTo, dueDate, completedDate } = req.body;
  const assignedToValue = assignedTo || null;
  const dueDateValue = dueDate || null;
  const completedDateValue = completedDate || null;

  const result = await query(
    `UPDATE work_orders SET title = $1, description = $2, type = $3, priority = $4,
     status = COALESCE($5, status), assigned_to = $6, due_date = $7, completed_date = $8, updated_at = CURRENT_TIMESTAMP
     WHERE id = $9 RETURNING *`,
    [title, description, type, priority, status, assignedToValue, dueDateValue, completedDateValue, id]
  );
  res.json(result.rows[0]);
}));

// Delete work order
router.delete('/:id', validateUUIDParam, asyncHandler(async (req, res) => {
  await query('DELETE FROM work_orders WHERE id = $1', [req.params.id]);
  res.json({ success: true });
}));

export default router;
