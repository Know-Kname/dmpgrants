/**
 * Shared Server Constants
 * Central location for all server-side application constants
 */

export const WORK_ORDER_TYPES = [
  'maintenance',
  'burial_prep',
  'grounds',
  'repair',
  'other',
];

export const WORK_ORDER_STATUSES = [
  'pending',
  'in_progress',
  'completed',
  'cancelled',
];

export const WORK_ORDER_PRIORITIES = [
  'low',
  'medium',
  'high',
  'urgent',
];

export const GRANT_TYPES = [
  'grant',
  'benefit',
  'opportunity',
];

export const GRANT_STATUSES = [
  'available',
  'applied',
  'approved',
  'denied',
  'received',
];

export const INVENTORY_CATEGORIES = [
  'casket',
  'urn',
  'vault',
  'marker',
  'supplies',
  'other',
];

export const USER_ROLES = [
  'admin',
  'manager',
  'staff',
];

export const AR_STATUSES = [
  'pending',
  'paid',
  'overdue',
  'cancelled',
];

export const AP_STATUSES = [
  'pending',
  'paid',
  'overdue',
  'cancelled',
];

export const CONTRACT_STATUSES = [
  'active',
  'completed',
  'cancelled',
];

// Helper functions for validation
export const isValidWorkOrderType = (type) => WORK_ORDER_TYPES.includes(type);
export const isValidWorkOrderStatus = (status) => WORK_ORDER_STATUSES.includes(status);
export const isValidWorkOrderPriority = (priority) => WORK_ORDER_PRIORITIES.includes(priority);
export const isValidGrantType = (type) => GRANT_TYPES.includes(type);
export const isValidGrantStatus = (status) => GRANT_STATUSES.includes(status);
export const isValidInventoryCategory = (category) => INVENTORY_CATEGORIES.includes(category);
export const isValidUserRole = (role) => USER_ROLES.includes(role);
export const isValidARStatus = (status) => AR_STATUSES.includes(status);
export const isValidAPStatus = (status) => AP_STATUSES.includes(status);
export const isValidContractStatus = (status) => CONTRACT_STATUSES.includes(status);
