import { IsEmail, IsOptional, IsString, IsUUID, Matches, MaxLength } from "class-validator";

export class EditPersonRequest {
    @IsOptional()
    @IsEmail()
    @MaxLength(255)
    email?: string;

    @IsOptional()
    @IsUUID()
    addressId?: string;

    @IsOptional()
    @IsString()
    @Matches(/^\d{11}$/, { message: 'nin must be 11 digits' })
    nin?: string;

    @IsOptional()
    @IsString()
    @Matches(/^\d{11}$/, { message: 'bvn must be 11 digits' })
    bvn?: string;
}
