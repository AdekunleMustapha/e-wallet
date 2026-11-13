import { IsOptional, IsString, MaxLength } from "class-validator";

export class EditGenderRequest {
    @IsOptional()
    @IsString()
    @MaxLength(50)
    genderName?: string;

    @IsOptional()
    @IsString()
    @MaxLength(50)
    name?: string;
}
