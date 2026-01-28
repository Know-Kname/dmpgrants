import { randomUUID } from 'crypto';

/**
 * Request ID Middleware
 * Adds a unique identifier to each request for logging and tracing
 * Useful for correlating logs across distributed systems
 */
export function requestIdMiddleware(req, res, next) {
  // Use existing request ID from header or generate new one
  const requestId = req.headers['x-request-id'] || randomUUID();

  // Attach to request object
  req.requestId = requestId;

  // Send in response header
  res.setHeader('X-Request-ID', requestId);

  next();
}
