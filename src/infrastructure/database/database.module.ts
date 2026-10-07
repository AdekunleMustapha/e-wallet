import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RawQueryService } from './raw-query.service';
import { buildTypeOrmOptions } from './typeorm.options';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        buildTypeOrmOptions({
          host: config.getOrThrow<string>('database.host'),
          port: config.getOrThrow<number>('database.port'),
          username: config.getOrThrow<string>('database.username'),
          password: config.get<string>('database.password') ?? '',
          database: config.getOrThrow<string>('database.database'),
          poolSize: config.getOrThrow<number>('database.poolSize'),
          logging: config.getOrThrow<boolean>('database.logging'),
        }),
    }),
  ],
  providers: [RawQueryService],
  exports: [RawQueryService],
})
export class DatabaseModule {}
