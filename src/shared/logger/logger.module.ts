import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppLogger, WINSTON_LOGGER } from './app-logger.service';
import { createWinstonLogger } from './winston.factory';

@Global()
@Module({
  providers: [
    {
      provide: WINSTON_LOGGER,
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        createWinstonLogger({
          level: config.getOrThrow<string>('logger.level'),
          dir: config.getOrThrow<string>('logger.dir'),
          maxSize: config.getOrThrow<string>('logger.maxSize'),
          maxFiles: config.getOrThrow<string>('logger.maxFiles'),
          zippedArchive: config.getOrThrow<boolean>('logger.zippedArchive'),
          service: config.getOrThrow<string>('app.name'),
          isProduction: config.get<string>('app.env') === 'production',
        }),
    },
    AppLogger,
  ],
  exports: [AppLogger, WINSTON_LOGGER],
})
export class LoggerModule {}
