import { Module } from '@nestjs/common';
import { ControllersController } from './presentation/controllers/controllers.controller.js';

@Module({
  controllers: [ControllersController]
})
export class UsersModule {}
