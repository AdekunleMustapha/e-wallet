import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query } from "@nestjs/common";
import { CreateCountryUseCase, DeleteCountryUseCase, EditCountryUseCase, GetCountryByIdUseCase, SearchCountryUseCase } from "../../application/use-cases";
import { CreateCountryRequest, EditCountryRequest, SearchCountryRequest } from "../dto";
import { CountryOutput } from "../../application/dtos";
import { unwrap } from "src/shared/presentation/unwrap-result";
import { CountryPaginationFilters, PaginationResult } from "../../domain/repository";

@Controller("country")
export class CountryController {
    constructor(
        private readonly createCountryUseCase: CreateCountryUseCase,
        private readonly editCountryUseCase: EditCountryUseCase,
        private readonly getCountryByIdUseCase: GetCountryByIdUseCase,
        private readonly deleteCountryUseCase: DeleteCountryUseCase,
        private readonly searchCountryUseCase: SearchCountryUseCase,
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    public async create(@Body() body: CreateCountryRequest): Promise<CountryOutput> {
        const name = body.countryName;
        const code = body.countryCode;
        return unwrap(await this.createCountryUseCase.execute({ name, code }));
    }

    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    public async edit(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() body: EditCountryRequest
    ): Promise<CountryOutput> {
        const name = body.countryName;
        const code = body.countryCode;
        return unwrap(await this.editCountryUseCase.execute({ id, name, code }));
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    public async getById(@Param('id', ParseUUIDPipe) id: string): Promise<CountryOutput> {
        return unwrap(await this.getCountryByIdUseCase.execute({ id }));
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    public async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
        return unwrap(await this.deleteCountryUseCase.execute({ id }));
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    public async search(@Query() query: SearchCountryRequest): Promise<PaginationResult<CountryOutput>> {
        const options = {
            limit: query.limit || 100,
            page: query.page || 1,
            sortBy: query.sortBy,
            sortOrder: query.sortOrder,
        };
        const filters: CountryPaginationFilters = {
            countryName: query.countryName,
            countryCode: query.countryCode,
        };
        return unwrap(await this.searchCountryUseCase.execute({ filters, options }));
    }
}
