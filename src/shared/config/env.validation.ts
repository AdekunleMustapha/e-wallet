import * as Joi from 'joi';

/**
 * Validates process.env at boot. The app refuses to start with a bad config,
 * which is what you want for a money-handling service.
 */
export const envValidationSchema = Joi.object({
  // APP
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'staging', 'production')
    .default('development'),
  PORT: Joi.number().port().default(3000),
  APP_NAME: Joi.string().default('fintech-backend'),

  // DATABASE
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().port().default(3306),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().allow('').required(),
  DB_NAME: Joi.string().required(),
  DB_POOL_SIZE: Joi.number().integer().min(1).default(10),
  DB_LOGGING: Joi.boolean().default(false),

  // CACHE
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().port().default(6379),
  REDIS_PASSWORD: Joi.string().allow('').default(''),
  REDIS_DB: Joi.number().integer().min(0).default(0),
  REDIS_KEY_PREFIX: Joi.string().allow('').default('fintech:'),
  REDIS_TLS: Joi.boolean().default(false),

  // LOGS
  LOG_LEVEL: Joi.string()
    .valid('error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly')
    .default('info'),
  LOG_DIR: Joi.string().default('logs'),
  LOG_MAX_SIZE: Joi.string().default('20m'),
  LOG_MAX_FILES: Joi.string().default('14d'),
  LOG_ZIPPED_ARCHIVE: Joi.boolean().default(true),

  // SECURITY
  NIN_PEPPER: Joi.string().when('NODE_ENV', {
    is: 'development',
    then: Joi.string().allow('').required(),
    otherwise: Joi.string().min(32).required()
  }),
  BVN_PEPPER: Joi.string().when('NODE_ENV', {
    is: 'development',
    then: Joi.string().allow('').required(),
    otherwise: Joi.string().min(32).required()
  }),

  // MAIL
  host: Joi.string().when('NODE_ENV', {
    is: 'development',
    then: Joi.string().optional().default("SMTP"),
    otherwise: Joi.string().required()
  }),
  port: Joi.number().when('NODE_ENV', {
    is: 'development',
    then: Joi.number().optional().default(587),
    otherwise: Joi.number().required()
  }),
  password: Joi.string().when('NODE_ENV', {
    is: 'development',
    then: Joi.string().allow('').required(),
    otherwise: Joi.string().required()
  }),
  from: Joi.string().when('NODE_ENV', {
    is: 'development',
    then: Joi.string().optional().default("no-reply@e-wallet.com"),
    otherwise: Joi.string().required()
  }),
  user: Joi.string().when('NODE_ENV', {
    is: 'development',
    then: Joi.string().optional(),
    otherwise: Joi.string().required()
  }),

  //IDENTITY
  IDENTITY_BASE_URL: Joi.string().when('NODE_ENV', {
    is: 'development',
    then: Joi.string().optional(),
    otherwise: Joi.string().required()
  }),
  IDENTITY_API_KEY: Joi.string().when('NODE_ENV', {
    is: 'development',
    then: Joi.string().optional(),
    otherwise: Joi.string().required()
  }),
  IDENTITY_API_TIMEOUT_MS: Joi.number().when('NODE_ENV', {
    is: 'development',
    then: Joi.number().optional().default(5000),
    otherwise: Joi.number().required()
  })

});
