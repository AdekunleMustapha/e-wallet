import { Module } from '@nestjs/common';
import { UsersController } from './presentation/controllers/users.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserORMEntity } from './infrastructure/persistence/entities/user.orm-entity.js';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserORMEntity
    ])
  ],

  controllers: [UsersController],

  providers: [
    RegisterUserUseCase
  ]
})
export class UsersModule {}
