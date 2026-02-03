import { randomUUID } from 'crypto';

export const requestContext = (req, res, next) => {
  const incomingRequestId = req.headers['x-request-id'];
  const requestId = typeof incomingRequestId === 'string' && incomingRequestId.length > 0
    ? incomingRequestId
    : randomUUID();

  req.requestId = requestId;
  req.requestStart = Date.now();

  res.setHeader('x-request-id', requestId);
  next();
};
