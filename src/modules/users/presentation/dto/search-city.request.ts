import { IsEnum, IsOptional, IsString } from "class-validator";
import { PaginationRequest } from "./pagination.request";
import { Country, NigeriaState } from "../../domain/enums";
import { TitleCase } from "src/shared/presentation/transform";

export class SearchCityRequest extends PaginationRequest {
    @IsOptional()
    @IsString()
    @TitleCase()
    city?: string;

    @IsOptional()
    @TitleCase()
    @IsEnum(NigeriaState)
    state?: NigeriaState;

    @IsOptional()
    @TitleCase()
    @IsEnum(Country)
    country?: Country;
}
