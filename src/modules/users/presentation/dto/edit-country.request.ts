import { IsOptional, IsString, Matches, MaxLength } from "class-validator";

export class EditCountryRequest {
    @IsOptional()
    @IsString()
    @MaxLength(255)
    countryName?: string;

    @IsOptional()
    @IsString()
    @Matches(/^\d{3}$/, { message: 'countryCode must be exactly 3 digits' })
    countryCode?: string;
}
