import { IsOptional, IsString, Matches, MaxLength } from "class-validator";

export class CreateCountryRequest {
    @IsOptional()
    @IsString()
    @MaxLength(255)
    countryName?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    name?: string;

    @IsOptional()
    @IsString()
    @Matches(/^\d{3}$/, { message: 'countryCode must be exactly 3 digits' })
    countryCode?: string;

    @IsOptional()
    @IsString()
    @Matches(/^\d{3}$/, { message: 'code must be exactly 3 digits' })
    code?: string;
}
