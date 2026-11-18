import { Controller, Get, HttpCode, HttpStatus, Query } from "@nestjs/common";
import { GetStateUseCase, SearchCityUseCase } from "../../application/use-cases";
import { SearchCityRequest } from "../dto";
import { CityOutput } from "../../application/dtos";
import { unwrap } from "src/shared/presentation/unwrap-result";
import { PaginationResult } from "../../domain/repository";

@Controller("city")
export class CityController {
    constructor(
        private readonly getStateUseCase: GetStateUseCase,
        private readonly searchCityUseCase: SearchCityUseCase,
    ) {}

    @Get("states")
    @HttpCode(HttpStatus.OK)
    public async getStates(): Promise<{ states: string[] }> {
        return unwrap(await this.getStateUseCase.execute());
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    public async search(@Query() query: SearchCityRequest): Promise<PaginationResult<CityOutput>> {
        const options = {
            limit: query.limit || 20,
            page: query.page || 1,
            sortBy: query.sortBy,
            sortOrder: query.sortOrder,
        };
        const filters = {
            city: query.city,
            state: query.state,
            country: query.country,
        };
        return unwrap(await this.searchCityUseCase.execute({ filters, options }));
    }
}
