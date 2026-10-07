import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { AppLogger } from '../../shared/logger/app-logger.service';
import { REDIS_CLIENT, RedisService } from './redis.service';

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      inject: [ConfigService, AppLogger],
      useFactory: (config: ConfigService, logger: AppLogger) => {
        const client = new Redis({
          host: config.getOrThrow<string>('redis.host'),
          port: config.getOrThrow<number>('redis.port'),
          password: config.get<string>('redis.password'),
          db: config.getOrThrow<number>('redis.db'),
          keyPrefix: config.get<string>('redis.keyPrefix'),
          tls: config.get<boolean>('redis.tls') ? {} : undefined,
          maxRetriesPerRequest: 3,
          retryStrategy: (attempt) => Math.min(attempt * 200, 3000),
        });

        client.on('connect', () => logger.log('Redis connected', 'Redis'));
        client.on('error', (err) => logger.error(`Redis error: ${err.message}`, err.stack, 'Redis'));
        client.on('reconnecting', () => logger.warn('Redis reconnecting', 'Redis'));
        return client;
      },
    },
    RedisService,
  ],
  exports: [RedisService],
})
export class RedisModule {}
