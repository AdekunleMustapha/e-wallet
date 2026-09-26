import { RegisterUserDto } from "../dtos/register-user.dto.js";


export class RegisterUserUseCase {
 
    
    public async execute(dto: RegisterUserDto): Promise<void> {
        console.log("Testing... executing register user use case");
    }
}