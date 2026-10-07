import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './infrastructure/cache/redis.module';
import redisConfig from './infrastructure/cache/redis.config';
import databaseConfig from './infrastructure/database/database.config';
import { DatabaseModule } from './infrastructure/database/database.module';
import { HealthModule } from './modules/health/health.module';
import { WalletModule } from './modules/wallet/wallet.module';
import appConfig from './shared/config/app.config';
import { envValidationSchema } from './shared/config/env.validation';
import loggerConfig from './shared/logger/logger.config';
import { LoggerModule } from './shared/logger/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, redisConfig, loggerConfig],
      validationSchema: envValidationSchema,
      validationOptions: { abortEarly: false },
    }),
    LoggerModule,
    DatabaseModule,
    RedisModule,
    HealthModule,
    WalletModule,
  ],
})
export class AppModule {}
