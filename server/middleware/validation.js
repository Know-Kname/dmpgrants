/**
 * Input Validation Middleware
 * Using express-validator following 2025 best practices
 */

import { body, param, query, validationResult } from 'express-validator';
import { ValidationError } from '../utils/errors.js';

/**
 * Handle validation results
 * Returns user-friendly error messages
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      field: err.path,
      message: err.msg,
      value: err.value,
    }));

    throw new ValidationError(
      JSON.stringify({
        message: 'Validation failed',
        errors: formattedErrors,
      })
    );
  }

  next();
};

/**
 * Work Order Validation Rules
 */
export const validateWorkOrder = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 255 })
    .withMessage('Title must be between 3 and 255 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must not exceed 2000 characters'),

  body('type')
    .notEmpty()
    .withMessage('Type is required')
    .isIn(['maintenance', 'burial_prep', 'grounds', 'repair', 'other'])
    .withMessage('Invalid work order type'),

  body('priority')
    .notEmpty()
    .withMessage('Priority is required')
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Invalid priority level'),

  body('assignedTo')
    .optional()
    .isUUID()
    .withMessage('Invalid user ID format'),

  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format'),

  validate,
];

/**
 * Grant Validation Rules
 */
export const validateGrant = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 255 })
    .withMessage('Title must be between 3 and 255 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 5000 })
    .withMessage('Description must not exceed 5000 characters'),

  body('type')
    .notEmpty()
    .withMessage('Type is required')
    .isIn(['grant', 'benefit', 'opportunity'])
    .withMessage('Invalid grant type'),

  body('source')
    .trim()
    .notEmpty()
    .withMessage('Source organization is required')
    .isLength({ min: 2, max: 255 })
    .withMessage('Source must be between 2 and 255 characters'),

  body('amount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Amount must be a positive number'),

  body('deadline')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format'),

  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['available', 'applied', 'approved', 'denied', 'received'])
    .withMessage('Invalid status'),

  body('applicationDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format'),

  validate,
];

/**
 * Inventory Validation Rules
 */
export const validateInventory = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Item name is required')
    .isLength({ min: 2, max: 255 })
    .withMessage('Name must be between 2 and 255 characters'),

  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isIn(['casket', 'urn', 'vault', 'marker', 'supplies', 'other'])
    .withMessage('Invalid category'),

  body('quantity')
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer'),

  body('reorderPoint')
    .isInt({ min: 0 })
    .withMessage('Reorder point must be a non-negative integer'),

  body('unitPrice')
    .isFloat({ min: 0 })
    .withMessage('Unit price must be a positive number'),

  body('vendorId')
    .optional()
    .isUUID()
    .withMessage('Invalid vendor ID format'),

  validate,
];

/**
 * Burial Validation Rules
 */
export const validateBurial = [
  body('deceasedFirstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 1, max: 255 })
    .withMessage('First name must be between 1 and 255 characters'),

  body('deceasedLastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 1, max: 255 })
    .withMessage('Last name must be between 1 and 255 characters'),

  body('burialDate')
    .notEmpty()
    .withMessage('Burial date is required')
    .isISO8601()
    .withMessage('Invalid date format'),

  body('plotLocation')
    .trim()
    .notEmpty()
    .withMessage('Plot location is required'),

  body('section')
    .trim()
    .notEmpty()
    .withMessage('Section is required'),

  body('lot')
    .trim()
    .notEmpty()
    .withMessage('Lot is required'),

  body('grave')
    .trim()
    .notEmpty()
    .withMessage('Grave is required'),

  body('contactEmail')
    .optional()
    .isEmail()
    .withMessage('Invalid email format'),

  body('contactPhone')
    .optional()
    .matches(/^[\d\s\-\+\(\)]+$/)
    .withMessage('Invalid phone number format'),

  validate,
];

/**
 * Customer Validation Rules
 */
export const validateCustomer = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 1, max: 255 })
    .withMessage('First name must be between 1 and 255 characters'),

  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 1, max: 255 })
    .withMessage('Last name must be between 1 and 255 characters'),

  body('email')
    .optional()
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),

  body('phone')
    .optional()
    .matches(/^[\d\s\-\+\(\)]+$/)
    .withMessage('Invalid phone number format'),

  body('zipCode')
    .optional()
    .matches(/^\d{5}(-\d{4})?$/)
    .withMessage('Invalid ZIP code format'),

  validate,
];

/**
 * UUID Param Validation
 */
export const validateUUIDParam = [
  param('id')
    .isUUID()
    .withMessage('Invalid ID format'),

  validate,
];
