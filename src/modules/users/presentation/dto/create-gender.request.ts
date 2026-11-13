import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateGenderRequest {
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    genderName!: string
}