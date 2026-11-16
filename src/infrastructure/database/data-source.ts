import 'reflect-metadata';
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { buildTypeOrmOptions } from './typeorm.options';

/**
 * Entry point for the TypeORM CLI (see the migration:* scripts in package.json).
 * Reads .env directly so migrations can run without booting Nest.
 */
export default new DataSource(
  buildTypeOrmOptions({
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    username: process.env.DB_USERNAME ?? 'e_wallet_user',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_NAME ?? 'e-wallet',
    poolSize: parseInt(process.env.DB_POOL_SIZE ?? '10', 10),
    logging: process.env.DB_LOGGING === 'true',
  }),
);
