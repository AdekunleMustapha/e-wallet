import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  host: process.env.DB_HOST as string,
  port: parseInt(process.env.DB_PORT ?? '3306', 10),
  username: process.env.DB_USERNAME as string,
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_NAME as string,
  poolSize: parseInt(process.env.DB_POOL_SIZE ?? '10', 10),
  logging: process.env.DB_LOGGING === 'true',
}));
