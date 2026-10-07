import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  env: process.env.NODE_ENV ?? 'development',
  name: process.env.APP_NAME ?? 'fintech-backend',
  port: parseInt(process.env.PORT ?? '3000', 10),
}));
