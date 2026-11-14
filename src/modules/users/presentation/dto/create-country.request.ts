import { IsOptional, IsString, Matches, MaxLength } from "class-validator";

export class CreateCountryRequest {
    @IsString()
    @MaxLength(255)
    countryName!: string;

    @IsString()
    @Matches(/^\d{3}$/, { message: 'countryCode must be exactly 3 digits' })
    countryCode!: string;
}
