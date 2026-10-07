import { Inject, Injectable, LoggerService } from '@nestjs/common';
import type { Logger as WinstonLogger } from 'winston';

export const WINSTON_LOGGER = Symbol('WINSTON_LOGGER');

/**
 * Adapter that lets Nest (and your own code) log through winston.
 * Usage: constructor(private readonly logger: AppLogger) {}
 *        this.logger.log('wallet funded', WalletService.name, { walletId });
 */
@Injectable()
export class AppLogger implements LoggerService {
  constructor(@Inject(WINSTON_LOGGER) private readonly winston: WinstonLogger) {}

  log(message: unknown, context?: string, meta?: Record<string, unknown>) {
    this.winston.info(this.toMessage(message), { context, ...meta });
  }

  error(message: unknown, trace?: string, context?: string, meta?: Record<string, unknown>) {
    this.winston.error(this.toMessage(message), { context, stack: trace, ...meta });
  }

  warn(message: unknown, context?: string, meta?: Record<string, unknown>) {
    this.winston.warn(this.toMessage(message), { context, ...meta });
  }

  debug(message: unknown, context?: string, meta?: Record<string, unknown>) {
    this.winston.debug(this.toMessage(message), { context, ...meta });
  }

  verbose(message: unknown, context?: string, meta?: Record<string, unknown>) {
    this.winston.verbose(this.toMessage(message), { context, ...meta });
  }

  private toMessage(message: unknown): string {
    return typeof message === 'string' ? message : JSON.stringify(message);
  }
}
