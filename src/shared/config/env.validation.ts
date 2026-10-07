import * as Joi from 'joi';

/**
 * Validates process.env at boot. The app refuses to start with a bad config,
 * which is what you want for a money-handling service.
 */
export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'staging', 'production')
    .default('development'),
  PORT: Joi.number().port().default(3000),
  APP_NAME: Joi.string().default('fintech-backend'),

  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().port().default(3306),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().allow('').required(),
  DB_NAME: Joi.string().required(),
  DB_POOL_SIZE: Joi.number().integer().min(1).default(10),
  DB_LOGGING: Joi.boolean().default(false),

  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().port().default(6379),
  REDIS_PASSWORD: Joi.string().allow('').default(''),
  REDIS_DB: Joi.number().integer().min(0).default(0),
  REDIS_KEY_PREFIX: Joi.string().allow('').default('fintech:'),
  REDIS_TLS: Joi.boolean().default(false),

  LOG_LEVEL: Joi.string()
    .valid('error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly')
    .default('info'),
  LOG_DIR: Joi.string().default('logs'),
  LOG_MAX_SIZE: Joi.string().default('20m'),
  LOG_MAX_FILES: Joi.string().default('14d'),
  LOG_ZIPPED_ARCHIVE: Joi.boolean().default(true),
});
