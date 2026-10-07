import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppLogger } from './shared/logger/app-logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(AppLogger));
  app.enableShutdownHooks();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const port = app.get(ConfigService).getOrThrow<number>('app.port');
  await app.listen(port);
  app.get(AppLogger).log(`Listening on port ${port}`, 'Bootstrap');
}

void bootstrap();
