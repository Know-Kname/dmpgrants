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
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),

  body('password')
    .isString()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ max: 128 })
    .withMessage('Password must be 128 characters or less'),

  validate,
];

export const validateRegister = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),

  body('password')
    .isString()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be between 8 and 128 characters'),

  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 255 })
    .withMessage('Name must be between 2 and 255 characters'),

  body('role')
    .optional()
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
    .optional({ checkFalsy: true })
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
    .optional({ checkFalsy: true })
    .isUUID()
    .withMessage('Invalid user ID format'),

  body('dueDate')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('Invalid date format'),

  body('status')
    .optional({ checkFalsy: true })
    .isIn(['pending', 'in_progress', 'completed', 'cancelled'])
    .withMessage('Invalid status'),

  body('completedDate')
    .optional({ checkFalsy: true })
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
    .optional({ checkFalsy: true })
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
    .optional({ checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage('Amount must be a positive number'),

  body('deadline')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('Invalid date format'),

  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['available', 'applied', 'approved', 'denied', 'received'])
    .withMessage('Invalid status'),

  body('applicationDate')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('Invalid date format'),

  body('notes')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 5000 })
    .withMessage('Notes must not exceed 5000 characters'),

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

  body('sku')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage('SKU must be 100 characters or less'),

  body('vendorId')
    .optional({ checkFalsy: true })
    .isUUID()
    .withMessage('Invalid vendor ID format'),

  body('location')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 255 })
    .withMessage('Location must be 255 characters or less'),

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

  body('dateOfBirth')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('Invalid date format'),

  body('dateOfDeath')
    .optional({ checkFalsy: true })
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
    .optional({ checkFalsy: true })
    .isEmail()
    .withMessage('Invalid email format'),

  body('contactPhone')
    .optional({ checkFalsy: true })
    .matches(/^[\d\s\-\+\(\)]+$/)
    .withMessage('Invalid phone number format'),

  body('permitNumber')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 255 })
    .withMessage('Permit number must be 255 characters or less'),

  body('notes')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 5000 })
    .withMessage('Notes must not exceed 5000 characters'),

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
    .optional({ checkFalsy: true })
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),

  body('phone')
    .optional({ checkFalsy: true })
    .matches(/^[\d\s\-\+\(\)]+$/)
    .withMessage('Invalid phone number format'),

  body('address')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 255 })
    .withMessage('Address must be 255 characters or less'),

  body('city')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage('City must be 100 characters or less'),

  body('state')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage('State must be 100 characters or less'),

  body('zipCode')
    .optional({ checkFalsy: true })
    .matches(/^\d{5}(-\d{4})?$/)
    .withMessage('Invalid ZIP code format'),

  body('notes')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 5000 })
    .withMessage('Notes must not exceed 5000 characters'),

  validate,
];

/**
 * Financial Validation Rules
 */
export const validateDeposit = [
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be greater than 0'),

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

  body('reference')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 255 })
    .withMessage('Reference must be 255 characters or less'),

  body('customerId')
    .optional({ checkFalsy: true })
    .isUUID()
    .withMessage('Invalid customer ID format'),

  body('notes')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 5000 })
    .withMessage('Notes must not exceed 5000 characters'),

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
    .withMessage('Invoice number is required')
    .isLength({ max: 100 })
    .withMessage('Invoice number must be 100 characters or less'),

  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be greater than 0'),

  body('dueDate')
    .notEmpty()
    .withMessage('Due date is required')
    .isISO8601()
    .withMessage('Invalid date format'),

  validate,
];

export const validateReceivableUpdate = [
  body('amountPaid')
    .optional({ checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage('Amount paid must be 0 or greater'),

  body('status')
    .optional({ checkFalsy: true })
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
    .withMessage('Invoice number is required')
    .isLength({ max: 100 })
    .withMessage('Invoice number must be 100 characters or less'),

  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be greater than 0'),

  body('dueDate')
    .notEmpty()
    .withMessage('Due date is required')
    .isISO8601()
    .withMessage('Invalid date format'),

  validate,
];

export const validatePayableUpdate = [
  body('amountPaid')
    .optional({ checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage('Amount paid must be 0 or greater'),

  body('status')
    .optional({ checkFalsy: true })
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
    .withMessage('Contract number is required')
    .isLength({ max: 100 })
    .withMessage('Contract number must be 100 characters or less'),

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
    .isFloat({ min: 0.01 })
    .withMessage('Total amount must be greater than 0'),

  body('signedDate')
    .notEmpty()
    .withMessage('Signed date is required')
    .isISO8601()
    .withMessage('Invalid date format'),

  body('paymentPlan')
    .optional({ checkFalsy: true })
    .isObject()
    .withMessage('Payment plan must be an object'),

  body('items')
    .optional({ checkFalsy: true })
    .isArray()
    .withMessage('Items must be an array'),

  body('items.*.description')
    .trim()
    .notEmpty()
    .withMessage('Item description is required')
    .isLength({ max: 255 })
    .withMessage('Item description must be 255 characters or less'),

  body('items.*.amount')
    .isFloat({ min: 0 })
    .withMessage('Item amount must be 0 or greater'),

  validate,
];

export const validateContractUpdate = [
  body('totalAmount')
    .optional({ checkFalsy: true })
    .isFloat({ min: 0.01 })
    .withMessage('Total amount must be greater than 0'),

  body('amountPaid')
    .optional({ checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage('Amount paid must be 0 or greater'),

  body('status')
    .optional({ checkFalsy: true })
    .isIn(['active', 'paid', 'cancelled', 'transferred'])
    .withMessage('Invalid contract status'),

  body('paymentPlan')
    .optional({ checkFalsy: true })
    .isObject()
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
