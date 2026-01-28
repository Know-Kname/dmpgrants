import winston from 'winston';

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Custom log format
const logFormat = printf(({ level, message, timestamp, requestId, ...metadata }) => {
  let msg = `${timestamp} [${level}]`;

  if (requestId) {
    msg += ` [${requestId}]`;
  }

  msg += `: ${message}`;

  // Add metadata if present
  const metaStr = Object.keys(metadata).length ? JSON.stringify(metadata, null, 2) : '';
  if (metaStr) {
    msg += ` ${metaStr}`;
  }

  return msg;
});

// Create Winston logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    errors({ stack: true }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    // Console transport
    new winston.transports.Console({
      format: combine(
        colorize(),
        logFormat
      )
    }),
    // Error log file
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Combined log file
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

// If in production, don't log to console
if (process.env.NODE_ENV === 'production') {
  logger.remove(winston.transports.Console);
}

export default logger;
