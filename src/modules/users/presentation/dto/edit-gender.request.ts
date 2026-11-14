import { IsOptional, IsString, MaxLength } from "class-validator";

export class EditGenderRequest {
    @IsString()
    @MaxLength(50)
    genderName!: string;
}
