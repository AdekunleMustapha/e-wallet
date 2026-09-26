import { Body, Controller, Post } from '@nestjs/common';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case.js';
import type { RegisterUserDto } from '../../application/dtos/register-user.dto.js';

@Controller('users')
export class UsersController {

    constructor(
        private readonly registerUserUseCase: RegisterUserUseCase
    ){}

    @Post()
    public async register(@Body() dto: RegisterUserDto) {
        return this.registerUserUseCase.execute(dto);
    }
}
