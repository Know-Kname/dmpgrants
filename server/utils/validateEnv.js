import Joi from 'joi';

/**
 * Environment variable validation schema
 * Ensures all required environment variables are present and valid
 */
const envSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

  PORT: Joi.number()
    .port()
    .default(3000),

  DATABASE_URL: Joi.string()
    .uri()
    .required()
    .messages({
      'any.required': 'DATABASE_URL is required. Please set it in your .env file.',
      'string.uri': 'DATABASE_URL must be a valid PostgreSQL connection string.',
    }),

  JWT_SECRET: Joi.string()
    .min(32)
    .required()
    .messages({
      'any.required': 'JWT_SECRET is required. Please set it in your .env file.',
      'string.min': 'JWT_SECRET must be at least 32 characters for security.',
    }),

  LOG_LEVEL: Joi.string()
    .valid('error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly')
    .default('info'),

  ALLOWED_ORIGINS: Joi.string()
    .optional()
    .description('Comma-separated list of allowed CORS origins for production'),
}).unknown(); // Allow other env variables

/**
 * Validates environment variables on application startup
 * Exits the process if validation fails
 */
export function validateEnv() {
  const { error, value } = envSchema.validate(process.env, {
    abortEarly: false, // Show all errors at once
    stripUnknown: false, // Keep other env vars
  });

  if (error) {
    const errorMessages = error.details.map(detail => detail.message).join('\n  - ');

    console.error('❌ Environment variable validation failed:');
    console.error(`  - ${errorMessages}`);
    console.error('\n💡 Please check your .env file and ensure all required variables are set.');

    process.exit(1);
  }

  // Log successful validation in development
  if (process.env.NODE_ENV === 'development') {
    console.log('✅ Environment variables validated successfully');
  }

  return value;
}
