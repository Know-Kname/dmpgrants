import express from 'express';
import { query } from '../db/index.js';
import { authenticateToken } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { validateGrant, validateUUIDParam } from '../middleware/validation.js';
import { NotFoundError } from '../utils/errors.js';
import {
  parsePaginationParams,
  parseFilterParams,
  parseSortParams,
  parseSearchParam,
  buildSearchClause,
  createPaginatedResponse,
} from '../utils/pagination.js';

const router = express.Router();
router.use(authenticateToken);

// Allowed filter and sort fields
const ALLOWED_FILTERS = ['status', 'type'];
const ALLOWED_SORT_FIELDS = ['created_at', 'title', 'amount', 'deadline', 'status'];
const SEARCH_FIELDS = ['title', 'description', 'source'];

router.get('/', asyncHandler(async (req, res) => {
  // Check if pagination is requested
  const isPaginated = req.query.page !== undefined || req.query.limit !== undefined;

  if (!isPaginated) {
    // Backward compatible: return all results
    const result = await query('SELECT * FROM grants ORDER BY created_at DESC');
    return res.json(result.rows);
  }

  // Parse query parameters
  const { page, limit, offset } = parsePaginationParams(req.query);
  const filters = parseFilterParams(req.query, ALLOWED_FILTERS);
  const { sort, order } = parseSortParams(req.query, 'created_at', 'DESC', ALLOWED_SORT_FIELDS);
  const search = parseSearchParam(req.query);

  // Build query
  const whereClauses = [];
  const params = [];
  let paramIndex = 1;

  // Add search clause
  if (search) {
    const searchResult = buildSearchClause(search, SEARCH_FIELDS, paramIndex);
    if (searchResult.clause) {
      whereClauses.push(searchResult.clause);
      params.push(...searchResult.params);
      paramIndex = searchResult.nextParam;
    }
  }

  // Add filter clauses
  for (const [key, value] of Object.entries(filters)) {
    whereClauses.push(`${key} = $${paramIndex}`);
    params.push(value);
    paramIndex++;
  }

  const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  // Get total count
  const countQuery = `SELECT COUNT(*) FROM grants ${whereClause}`;
  const countResult = await query(countQuery, params);
  const total = parseInt(countResult.rows[0].count, 10);

  // Get paginated data
  const dataQuery = `
    SELECT * FROM grants
    ${whereClause}
    ORDER BY ${sort} ${order}
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
  `;
  const dataResult = await query(dataQuery, [...params, limit, offset]);

  // Return paginated response
  res.json(createPaginatedResponse(dataResult.rows, total, page, limit));
}));

router.post('/', validateGrant, asyncHandler(async (req, res) => {
  const { title, description, type, source, amount, deadline, status, applicationDate, notes } = req.body;
  const result = await query(
    `INSERT INTO grants (title, description, type, source, amount, deadline, status, application_date, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
    [title, description, type, source, amount, deadline, status, applicationDate, notes]
  );
  res.status(201).json(result.rows[0]);
}));

router.put('/:id', validateUUIDParam, validateGrant, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, type, source, amount, deadline, status, applicationDate, notes } = req.body;
  const result = await query(
    `UPDATE grants SET title = $1, description = $2, type = $3, source = $4,
     amount = $5, deadline = $6, status = $7, application_date = $8, notes = $9,
     updated_at = CURRENT_TIMESTAMP WHERE id = $10 RETURNING *`,
    [title, description, type, source, amount, deadline, status, applicationDate, notes, id]
  );
  if (result.rows.length === 0) {
    throw new NotFoundError('Grant');
  }
  res.json(result.rows[0]);
}));

router.delete('/:id', validateUUIDParam, asyncHandler(async (req, res) => {
  const result = await query('DELETE FROM grants WHERE id = $1 RETURNING id', [req.params.id]);
  if (result.rows.length === 0) {
    throw new NotFoundError('Grant');
  }
  res.json({ success: true });
}));

export default router;
