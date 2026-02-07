/**
 * Input Validation Middleware
 * Using express-validator following 2025 best practices
 */

import { body, param, validationResult } from 'express-validator';
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
      location: err.location,
    }));

    throw new ValidationError('Validation failed', formattedErrors);
  }

  next();
};

/**
 * Auth Validation Rules
 */
export const validateLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  validate,
];

export const validateRegister = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required'),
  body('role')
    .optional({ values: 'falsy' })
    .isIn(['admin', 'manager', 'staff'])
    .withMessage('Invalid role'),
  validate,
];

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
    .optional({ values: 'falsy' })
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
    .optional({ values: 'falsy' })
    .isUUID()
    .withMessage('Invalid user ID format'),

  body('dueDate')
    .optional({ values: 'falsy' })
    .isISO8601()
    .withMessage('Invalid date format'),

  body('status')
    .optional({ values: 'falsy' })
    .isIn(['pending', 'in_progress', 'completed', 'cancelled'])
    .withMessage('Invalid status'),

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
    .optional({ values: 'falsy' })
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
    .optional({ values: 'falsy' })
    .isFloat({ min: 0 })
    .withMessage('Amount must be a positive number'),

  body('deadline')
    .optional({ values: 'falsy' })
    .isISO8601()
    .withMessage('Invalid date format'),

  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['available', 'applied', 'approved', 'denied', 'received'])
    .withMessage('Invalid status'),

  body('applicationDate')
    .optional({ values: 'falsy' })
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
    .optional({ values: 'falsy' })
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
    .optional({ values: 'falsy' })
    .isEmail()
    .withMessage('Invalid email format'),

  body('contactPhone')
    .optional({ values: 'falsy' })
    .matches(/^[\d\s\-+()]+$/)
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
    .optional({ values: 'falsy' })
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),

  body('phone')
    .optional({ values: 'falsy' })
    .matches(/^[\d\s\-+()]+$/)
    .withMessage('Invalid phone number format'),

  body('zipCode')
    .optional({ values: 'falsy' })
    .matches(/^\d{5}(-\d{4})?$/)
    .withMessage('Invalid ZIP code format'),

  validate,
];

/**
 * Financial Validation Rules
 */
export const validateDeposit = [
  body('amount')
    .isFloat({ min: 0 })
    .withMessage('Amount must be a positive number'),
  body('date')
    .notEmpty()
    .withMessage('Date is required')
    .isISO8601()
    .withMessage('Invalid date format'),
  body('method')
    .notEmpty()
    .withMessage('Payment method is required')
    .isIn(['cash', 'check', 'credit_card', 'wire', 'other'])
    .withMessage('Invalid payment method'),
  body('customerId')
    .optional({ values: 'falsy' })
    .isUUID()
    .withMessage('Invalid customer ID format'),
  validate,
];

export const validateReceivable = [
  body('customerId')
    .notEmpty()
    .withMessage('Customer is required')
    .isUUID()
    .withMessage('Invalid customer ID format'),
  body('invoiceNumber')
    .trim()
    .notEmpty()
    .withMessage('Invoice number is required'),
  body('amount')
    .isFloat({ min: 0 })
    .withMessage('Amount must be a positive number'),
  body('dueDate')
    .notEmpty()
    .withMessage('Due date is required')
    .isISO8601()
    .withMessage('Invalid date format'),
  validate,
];

export const validateReceivableUpdate = [
  body('amountPaid')
    .optional({ values: 'falsy' })
    .isFloat({ min: 0 })
    .withMessage('Amount paid must be a positive number'),
  body('status')
    .optional({ values: 'falsy' })
    .isIn(['pending', 'partial', 'paid', 'overdue'])
    .withMessage('Invalid status'),
  validate,
];

export const validatePayable = [
  body('vendorId')
    .notEmpty()
    .withMessage('Vendor is required')
    .isUUID()
    .withMessage('Invalid vendor ID format'),
  body('invoiceNumber')
    .trim()
    .notEmpty()
    .withMessage('Invoice number is required'),
  body('amount')
    .isFloat({ min: 0 })
    .withMessage('Amount must be a positive number'),
  body('dueDate')
    .notEmpty()
    .withMessage('Due date is required')
    .isISO8601()
    .withMessage('Invalid date format'),
  validate,
];

export const validatePayableUpdate = [
  body('amountPaid')
    .optional({ values: 'falsy' })
    .isFloat({ min: 0 })
    .withMessage('Amount paid must be a positive number'),
  body('status')
    .optional({ values: 'falsy' })
    .isIn(['pending', 'partial', 'paid', 'overdue'])
    .withMessage('Invalid status'),
  validate,
];

/**
 * Contract Validation Rules
 */
export const validateContract = [
  body('contractNumber')
    .trim()
    .notEmpty()
    .withMessage('Contract number is required'),
  body('type')
    .notEmpty()
    .withMessage('Contract type is required')
    .isIn(['pre_need', 'at_need'])
    .withMessage('Invalid contract type'),
  body('customerId')
    .notEmpty()
    .withMessage('Customer is required')
    .isUUID()
    .withMessage('Invalid customer ID format'),
  body('totalAmount')
    .isFloat({ min: 0 })
    .withMessage('Total amount must be a positive number'),
  body('signedDate')
    .notEmpty()
    .withMessage('Signed date is required')
    .isISO8601()
    .withMessage('Invalid date format'),
  body('paymentPlan')
    .optional({ values: 'falsy' })
    .custom((value) => value !== null && typeof value === 'object')
    .withMessage('Payment plan must be an object'),
  body('items')
    .optional({ values: 'falsy' })
    .isArray()
    .withMessage('Items must be an array'),
  body('items.*.description')
    .optional({ values: 'falsy' })
    .trim()
    .notEmpty()
    .withMessage('Item description is required'),
  body('items.*.amount')
    .optional({ values: 'falsy' })
    .isFloat({ min: 0 })
    .withMessage('Item amount must be a positive number'),
  validate,
];

export const validateContractUpdate = [
  body('totalAmount')
    .optional({ values: 'falsy' })
    .isFloat({ min: 0 })
    .withMessage('Total amount must be a positive number'),
  body('amountPaid')
    .optional({ values: 'falsy' })
    .isFloat({ min: 0 })
    .withMessage('Amount paid must be a positive number'),
  body('status')
    .optional({ values: 'falsy' })
    .isIn(['active', 'paid', 'cancelled', 'transferred'])
    .withMessage('Invalid status'),
  body('paymentPlan')
    .optional({ values: 'falsy' })
    .custom((value) => value !== null && typeof value === 'object')
    .withMessage('Payment plan must be an object'),
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
