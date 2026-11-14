import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query } from "@nestjs/common";
import { CreateAddressUseCase, EditAddressUseCase, FindAddressByIdUseCase, SearchAddressUseCase } from "../../application/use-cases";
import { CreateAddressRequest, EditAddressRequest, SearchAddressRequest } from "../dto";
import { AddressOutput } from "../../application/dtos";
import { unwrap } from "src/shared/presentation/unwrap-result";
import { PaginationResult } from "../../domain/repository";

@Controller("address")
export class AddressController {

    constructor(
        private readonly createAddressUseCase: CreateAddressUseCase,
        private readonly editAddressUseCase: EditAddressUseCase,
        private readonly findAddressByIdUseCase: FindAddressByIdUseCase,
        private readonly searchAddressUseCase: SearchAddressUseCase    
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    public async create(@Body() body: CreateAddressRequest): Promise<AddressOutput> {
        return unwrap(await this.createAddressUseCase.execute(body));
    }

    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    public async edit(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() body: EditAddressRequest
    ): Promise<AddressOutput> {
        return unwrap(await this.editAddressUseCase.execute({id, ...body}));
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    public async getById(@Param('id', ParseUUIDPipe) id: string): Promise<AddressOutput> {
        return unwrap(await this.findAddressByIdUseCase.execute({ id }));
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    public async search(@Query() query: SearchAddressRequest): Promise<PaginationResult<AddressOutput>> {
        const options = {
            limit: query.limit || 100,
            page: query.page || 1,
            sortBy: query.sortBy,
            sortOrder: query.sortOrder
        };
        const filters: Omit<SearchAddressRequest , 'limit' | 'page' | 'sortBy' | 'sortOrder'> = query;
        return unwrap(await this.searchAddressUseCase.execute({filters, options}));
    }
}
