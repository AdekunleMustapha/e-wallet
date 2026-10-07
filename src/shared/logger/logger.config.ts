import { registerAs } from '@nestjs/config';

export default registerAs('logger', () => ({
  level: process.env.LOG_LEVEL ?? 'info',
  dir: process.env.LOG_DIR ?? 'logs',
  maxSize: process.env.LOG_MAX_SIZE ?? '20m',
  maxFiles: process.env.LOG_MAX_FILES ?? '14d',
  zippedArchive: (process.env.LOG_ZIPPED_ARCHIVE ?? 'true') === 'true',
}));
