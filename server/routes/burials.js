import express from 'express';
import { query } from '../db/index.js';
import { authenticateToken } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { validateBurial, validateUUIDParam } from '../middleware/validation.js';
import { NotFoundError } from '../utils/errors.js';

const router = express.Router();
router.use(authenticateToken);

router.get('/', asyncHandler(async (req, res) => {
  const result = await query('SELECT * FROM burials ORDER BY burial_date DESC');
  res.json(result.rows);
}));

router.post('/', validateBurial, asyncHandler(async (req, res) => {
  const {
    deceasedFirstName, deceasedLastName, deceasedMiddleName,
    dateOfBirth, dateOfDeath, burialDate, plotLocation,
    section, lot, grave, contactName, contactPhone,
    contactEmail, permitNumber, notes
  } = req.body;

  const result = await query(
    `INSERT INTO burials (
      deceased_first_name, deceased_last_name, deceased_middle_name,
      date_of_birth, date_of_death, burial_date, plot_location,
      section, lot, grave, contact_name, contact_phone,
      contact_email, permit_number, notes
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *`,
    [
      deceasedFirstName, deceasedLastName, deceasedMiddleName,
      dateOfBirth || null, dateOfDeath || null, burialDate, plotLocation,
      section, lot, grave, contactName || null, contactPhone || null,
      contactEmail || null, permitNumber || null, notes || null
    ]
  );
  res.status(201).json(result.rows[0]);
}));

router.put('/:id', validateUUIDParam, validateBurial, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    deceasedFirstName, deceasedLastName, deceasedMiddleName,
    dateOfBirth, dateOfDeath, burialDate, plotLocation,
    section, lot, grave, contactName, contactPhone,
    contactEmail, permitNumber, notes
  } = req.body;

  const result = await query(
    `UPDATE burials SET
      deceased_first_name = $1, deceased_last_name = $2, deceased_middle_name = $3,
      date_of_birth = $4, date_of_death = $5, burial_date = $6, plot_location = $7,
      section = $8, lot = $9, grave = $10, contact_name = $11, contact_phone = $12,
      contact_email = $13, permit_number = $14, notes = $15, updated_at = CURRENT_TIMESTAMP
     WHERE id = $16 RETURNING *`,
    [
      deceasedFirstName, deceasedLastName, deceasedMiddleName,
      dateOfBirth || null, dateOfDeath || null, burialDate, plotLocation,
      section, lot, grave, contactName || null, contactPhone || null,
      contactEmail || null, permitNumber || null, notes || null, id
    ]
  );
  if (result.rows.length === 0) {
    throw new NotFoundError('Burial record');
  }
  res.json(result.rows[0]);
}));

router.delete('/:id', validateUUIDParam, asyncHandler(async (req, res) => {
  const result = await query('DELETE FROM burials WHERE id = $1 RETURNING id', [req.params.id]);
  if (result.rows.length === 0) {
    throw new NotFoundError('Burial record');
  }
  res.json({ success: true });
}));

export default router;
