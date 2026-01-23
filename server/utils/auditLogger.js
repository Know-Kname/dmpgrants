/**
 * Audit Logger Utility
 * Logs sensitive operations for security and compliance tracking
 */

export const AuditAction = {
  // Authentication
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILED: 'LOGIN_FAILED',
  LOGOUT: 'LOGOUT',
  TOKEN_REFRESH: 'TOKEN_REFRESH',

  // User Management
  USER_CREATED: 'USER_CREATED',
  USER_UPDATED: 'USER_UPDATED',
  USER_DELETED: 'USER_DELETED',
  PASSWORD_CHANGED: 'PASSWORD_CHANGED',

  // Data Operations
  WORK_ORDER_CREATED: 'WORK_ORDER_CREATED',
  WORK_ORDER_UPDATED: 'WORK_ORDER_UPDATED',
  WORK_ORDER_DELETED: 'WORK_ORDER_DELETED',
  GRANT_CREATED: 'GRANT_CREATED',
  GRANT_UPDATED: 'GRANT_UPDATED',
  GRANT_DELETED: 'GRANT_DELETED',

  // Financial
  PAYMENT_RECORDED: 'PAYMENT_RECORDED',
  PAYMENT_DELETED: 'PAYMENT_DELETED',
  DEPOSIT_CREATED: 'DEPOSIT_CREATED',

  // Burial Records
  BURIAL_CREATED: 'BURIAL_CREATED',
  BURIAL_UPDATED: 'BURIAL_UPDATED',
  BURIAL_DELETED: 'BURIAL_DELETED',

  // Contract
  CONTRACT_CREATED: 'CONTRACT_CREATED',
  CONTRACT_UPDATED: 'CONTRACT_UPDATED',
  CONTRACT_DELETED: 'CONTRACT_DELETED',
};

/**
 * Log an audit event
 * @param {string} action - Action type from AuditAction enum
 * @param {object} data - Additional data about the action
 * @param {object} user - User performing the action
 * @param {string} ipAddress - IP address of the request
 */
export function logAudit(action, data = {}, user = null, ipAddress = 'unknown') {
  const auditEntry = {
    timestamp: new Date().toISOString(),
    action,
    userId: user?.id || null,
    userEmail: user?.email || null,
    ipAddress,
    data,
  };

  // Log to console (in production, this should go to a proper logging service or database)
  console.log('[AUDIT]', JSON.stringify(auditEntry));

  // TODO: In production, save to database audit_logs table
  // await query('INSERT INTO audit_logs (action, user_id, ip_address, data) VALUES ($1, $2, $3, $4)',
  //   [action, user?.id, ipAddress, JSON.stringify(data)]);

  return auditEntry;
}

/**
 * Express middleware to extract IP address from request
 */
export function getClientIp(req) {
  return req.headers['x-forwarded-for']?.split(',')[0].trim() ||
         req.headers['x-real-ip'] ||
         req.connection?.remoteAddress ||
         req.socket?.remoteAddress ||
         'unknown';
}
