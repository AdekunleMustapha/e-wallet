import { IsOptional, IsString, IsUUID } from "class-validator";
import { PaginationRequest } from "./pagination.request";

export class SearchAddressRequest extends PaginationRequest {
    @IsOptional()
    @IsUUID()
    countryId?: string;

    @IsOptional()
    @IsString()
    state?: string;

    @IsOptional()
    @IsString()
    city?: string;

    @IsOptional()
    @IsString()
    streetName?: string;

    @IsOptional()
    @IsString()
    postalCode?: string;

    @IsOptional()
    @IsString()
    buildingCode?: string;

    @IsOptional()
    @IsString()
    flatCode?: string;
}
