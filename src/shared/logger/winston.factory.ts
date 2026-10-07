import { join } from 'path';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

export interface WinstonFactoryOptions {
  level: string;
  dir: string;
  maxSize: string;
  maxFiles: string;
  zippedArchive: boolean;
  service: string;
  isProduction: boolean;
}

/**
 * Keys that must never reach a log file in a fintech system.
 * Matching is case-insensitive and applies at any depth.
 */
const REDACTED_KEYS = new Set([
  'password',
  'pin',
  'token',
  'accesstoken',
  'refreshtoken',
  'authorization',
  'cvv',
  'cardnumber',
  'pan',
  'secret',
  'apikey',
  'bvn',
  'nin',
]);

const redact = winston.format((info) => {
  const walk = (value: unknown, depth = 0): unknown => {
    if (depth > 6 || value === null || typeof value !== 'object') return value;
    if (Array.isArray(value)) return value.map((v) => walk(v, depth + 1));
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = REDACTED_KEYS.has(k.toLowerCase()) ? '[REDACTED]' : walk(v, depth + 1);
    }
    return out;
  };
  return walk(info) as winston.Logform.TransformableInfo;
});

export function createWinstonLogger(opts: WinstonFactoryOptions): winston.Logger {
  const baseFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    winston.format.errors({ stack: true }),
    redact(),
  );

  const jsonFormat = winston.format.combine(baseFormat, winston.format.json());

  const consoleFormat = winston.format.combine(
    baseFormat,
    winston.format.colorize({ all: false, level: true }),
    winston.format.printf(({ timestamp, level, message, context, stack, ...meta }) => {
      const ctx = context ? ` [${String(context)}]` : '';
      const extra = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
      return `${timestamp} ${level}${ctx} ${String(message)}${extra}${stack ? `\n${String(stack)}` : ''}`;
    }),
  );

  const rotate = (filename: string, level?: string) =>
    new winston.transports.DailyRotateFile({
      dirname: join(process.cwd(), opts.dir),
      filename: `${filename}-%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      zippedArchive: opts.zippedArchive,
      maxSize: opts.maxSize,
      maxFiles: opts.maxFiles,
      level,
      format: jsonFormat,
    });

  return winston.createLogger({
    level: opts.level,
    defaultMeta: { service: opts.service },
    transports: [
      // Everything at or above LOG_LEVEL
      rotate('combined'),
      // Errors only, so they are easy to find and alert on
      rotate('error', 'error'),
      new winston.transports.Console({
        format: opts.isProduction ? jsonFormat : consoleFormat,
      }),
    ],
    exceptionHandlers: [rotate('exceptions')],
    rejectionHandlers: [rotate('rejections')],
    exitOnError: false,
  });
}
