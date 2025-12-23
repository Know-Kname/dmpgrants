/**
 * Shared Constants
 * Central location for all application constants
 */

export const WORK_ORDER_TYPES = {
  MAINTENANCE: 'maintenance',
  BURIAL_PREP: 'burial_prep',
  GROUNDS: 'grounds',
  REPAIR: 'repair',
  OTHER: 'other',
} as const;

export const WORK_ORDER_TYPE_OPTIONS = [
  { value: WORK_ORDER_TYPES.MAINTENANCE, label: 'Maintenance' },
  { value: WORK_ORDER_TYPES.BURIAL_PREP, label: 'Burial Prep' },
  { value: WORK_ORDER_TYPES.GROUNDS, label: 'Grounds' },
  { value: WORK_ORDER_TYPES.REPAIR, label: 'Repair' },
  { value: WORK_ORDER_TYPES.OTHER, label: 'Other' },
] as const;

export const WORK_ORDER_STATUSES = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const WORK_ORDER_STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: WORK_ORDER_STATUSES.PENDING, label: 'Pending' },
  { value: WORK_ORDER_STATUSES.IN_PROGRESS, label: 'In Progress' },
  { value: WORK_ORDER_STATUSES.COMPLETED, label: 'Completed' },
  { value: WORK_ORDER_STATUSES.CANCELLED, label: 'Cancelled' },
] as const;

export const WORK_ORDER_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
} as const;

export const WORK_ORDER_PRIORITY_OPTIONS = [
  { value: WORK_ORDER_PRIORITIES.LOW, label: 'Low' },
  { value: WORK_ORDER_PRIORITIES.MEDIUM, label: 'Medium' },
  { value: WORK_ORDER_PRIORITIES.HIGH, label: 'High' },
  { value: WORK_ORDER_PRIORITIES.URGENT, label: 'Urgent' },
] as const;

export const GRANT_TYPES = {
  GRANT: 'grant',
  BENEFIT: 'benefit',
  OPPORTUNITY: 'opportunity',
} as const;

export const GRANT_TYPE_OPTIONS = [
  { value: GRANT_TYPES.GRANT, label: 'Grant' },
  { value: GRANT_TYPES.BENEFIT, label: 'Benefit' },
  { value: GRANT_TYPES.OPPORTUNITY, label: 'Opportunity' },
] as const;

export const GRANT_STATUSES = {
  AVAILABLE: 'available',
  APPLIED: 'applied',
  APPROVED: 'approved',
  DENIED: 'denied',
  RECEIVED: 'received',
} as const;

export const GRANT_STATUS_OPTIONS = [
  { value: GRANT_STATUSES.AVAILABLE, label: 'Available' },
  { value: GRANT_STATUSES.APPLIED, label: 'Applied' },
  { value: GRANT_STATUSES.APPROVED, label: 'Approved' },
  { value: GRANT_STATUSES.DENIED, label: 'Denied' },
  { value: GRANT_STATUSES.RECEIVED, label: 'Received' },
] as const;

export const INVENTORY_CATEGORIES = {
  CASKET: 'casket',
  URN: 'urn',
  VAULT: 'vault',
  MARKER: 'marker',
  SUPPLIES: 'supplies',
  OTHER: 'other',
} as const;

export const INVENTORY_CATEGORY_OPTIONS = [
  { value: INVENTORY_CATEGORIES.CASKET, label: 'Casket' },
  { value: INVENTORY_CATEGORIES.URN, label: 'Urn' },
  { value: INVENTORY_CATEGORIES.VAULT, label: 'Vault' },
  { value: INVENTORY_CATEGORIES.MARKER, label: 'Marker' },
  { value: INVENTORY_CATEGORIES.SUPPLIES, label: 'Supplies' },
  { value: INVENTORY_CATEGORIES.OTHER, label: 'Other' },
] as const;

export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  STAFF: 'staff',
} as const;

export const AR_STATUSES = {
  PENDING: 'pending',
  PAID: 'paid',
  OVERDUE: 'overdue',
  CANCELLED: 'cancelled',
} as const;

export const AP_STATUSES = {
  PENDING: 'pending',
  PAID: 'paid',
  OVERDUE: 'overdue',
  CANCELLED: 'cancelled',
} as const;

export const CONTRACT_STATUSES = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

// Type exports for use in TypeScript
export type WorkOrderType = typeof WORK_ORDER_TYPES[keyof typeof WORK_ORDER_TYPES];
export type WorkOrderStatus = typeof WORK_ORDER_STATUSES[keyof typeof WORK_ORDER_STATUSES];
export type WorkOrderPriority = typeof WORK_ORDER_PRIORITIES[keyof typeof WORK_ORDER_PRIORITIES];
export type GrantType = typeof GRANT_TYPES[keyof typeof GRANT_TYPES];
export type GrantStatus = typeof GRANT_STATUSES[keyof typeof GRANT_STATUSES];
export type InventoryCategory = typeof INVENTORY_CATEGORIES[keyof typeof INVENTORY_CATEGORIES];
export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
export type ARStatus = typeof AR_STATUSES[keyof typeof AR_STATUSES];
export type APStatus = typeof AP_STATUSES[keyof typeof AP_STATUSES];
export type ContractStatus = typeof CONTRACT_STATUSES[keyof typeof CONTRACT_STATUSES];
