import { IsOptional, IsString, IsUUID, Matches } from "class-validator";
import { PaginationRequest } from "./pagination.request";
import { DOB_PATTERN } from "./dob";

export class SearchPersonRequest extends PaginationRequest {
    @IsOptional()
    @IsUUID()
    genderId?: string;

    @IsOptional()
    @IsUUID()
    addressId?: string;

    @IsOptional()
    @Matches(DOB_PATTERN, { message: 'dob must be in the format "YYYY-MM-DD"' })
    dob?: string;

    @IsOptional()
    @IsString()
    searchQuery?: string;
}
