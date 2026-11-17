import { IsEnum, IsOptional, IsString, Matches } from "class-validator";
import { PaginationRequest } from "./pagination.request";
import { DOB_PATTERN } from "./dob";
import { Country, Gender, Tier } from "../../domain/enums";

export class SearchPersonRequest extends PaginationRequest {
    @IsOptional()
    @IsEnum(Gender)
    gender?: Gender;

    @IsOptional()
    @IsString()
    phoneNumber?: string;

    @IsOptional()
    @IsEnum(Country)
    country?: Country;

    @IsOptional()
    @IsString()
    state?: string;

    @IsOptional()
    @IsString()
    city?: string;

    @IsOptional()
    @IsEnum(Tier)
    tier?: Tier;

    @IsOptional()
    @Matches(DOB_PATTERN, { message: 'dob must be in the format "YYYY-MM-DD"' })
    dob?: string;

    @IsOptional()
    @IsString()
    searchQuery?: string;
}
