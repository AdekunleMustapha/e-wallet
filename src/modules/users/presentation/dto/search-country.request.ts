import { IsOptional, IsString } from "class-validator";
import { PaginationRequest } from "./pagination.request";

export class SearchCountryRequest extends PaginationRequest {
    @IsOptional()
    @IsString()
    countryName?: string;

    @IsOptional()
    @IsString()
    countryCode?: string;
}
