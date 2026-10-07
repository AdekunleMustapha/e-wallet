import { join } from 'path';
import { DataSourceOptions } from 'typeorm';

export interface DbEnv {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  poolSize: number;
  logging: boolean;
}

/**
 * Single source of truth for TypeORM options. Used by both the Nest runtime
 * (DatabaseModule) and the migration CLI (data-source.ts) so they cannot drift.
 *
 * Schema changes go through migrations only: `synchronize` is permanently off.
 */
export function buildTypeOrmOptions(env: DbEnv): DataSourceOptions {
  return {
    type: 'mysql',
    host: env.host,
    port: env.port,
    username: env.username,
    password: env.password,
    database: env.database,
    // Money values must round-trip exactly. mysql2 returns DECIMAL as strings by
    // default (never floats); these keep BIGINT/big numbers lossless as well.
    supportBigNumbers: true,
    bigNumberStrings: true,
    timezone: 'Z', // store and read everything in UTC
    charset: 'utf8mb4',
    connectorPackage: 'mysql2',
    extra: { connectionLimit: env.poolSize },
    logging: env.logging ? ['query', 'error', 'migration'] : ['error', 'migration'],
    synchronize: false,
    migrationsRun: false, // run explicitly with `npm run migration:run`
    migrationsTableName: 'migrations',
    entities: [join(__dirname, '..', '..', '**', '*.orm-entity.{ts,js}')],
    migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
  };
}
