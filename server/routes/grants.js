import express from 'express';
import { query } from '../db/index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticateToken);

router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 1000; // Default to high limit for backwards compatibility
    const offset = (page - 1) * limit;

    // Get total count
    const countResult = await query('SELECT COUNT(*) FROM grants');
    const totalCount = parseInt(countResult.rows[0].count);

    // Get paginated results
    const result = await query(
      'SELECT * FROM grants ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    res.json({
      data: result.rows,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasMore: offset + result.rows.length < totalCount
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, description, type, source, amount, deadline, status, applicationDate, notes } = req.body;
    const result = await query(
      `INSERT INTO grants (title, description, type, source, amount, deadline, status, application_date, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [title, description, type, source, amount, deadline, status, applicationDate, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, type, source, amount, deadline, status, applicationDate, notes } = req.body;
    const result = await query(
      `UPDATE grants SET title = $1, description = $2, type = $3, source = $4,
       amount = $5, deadline = $6, status = $7, application_date = $8, notes = $9,
       updated_at = CURRENT_TIMESTAMP WHERE id = $10 RETURNING *`,
      [title, description, type, source, amount, deadline, status, applicationDate, notes, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await query('DELETE FROM grants WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
