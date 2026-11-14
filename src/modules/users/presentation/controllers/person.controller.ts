import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query } from "@nestjs/common";
import { CreatePersonUseCase, EditPersonUseCase, GetPersonByIdUseCase, SearchPersonUseCase } from "../../application/use-cases";
import { CreatePersonRequest, EditPersonRequest, LinkBvnRequest, LinkNinRequest, SearchPersonRequest, splitDob } from "../dto";
import { PersonOutput } from "../../application/dtos";
import { unwrap } from "src/shared/presentation/unwrap-result";
import { PaginationResult, PersonPaginationFilters } from "../../domain/repository";

@Controller("person")
export class PersonController {
    constructor(
        private readonly createPersonUseCase: CreatePersonUseCase,
        private readonly editPersonUseCase: EditPersonUseCase,
        private readonly getPersonByIdUseCase: GetPersonByIdUseCase,
        private readonly searchPersonUseCase: SearchPersonUseCase,
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    public async create(@Body() body: CreatePersonRequest): Promise<PersonOutput> {
        const dob = splitDob(body.dob);
        return unwrap(await this.createPersonUseCase.execute({
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            genderId: body.genderId,
            addressId: body.addressId,
            dob,
        }));
    }

    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    public async edit(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() body: EditPersonRequest
    ): Promise<PersonOutput> {
        return unwrap(await this.editPersonUseCase.execute({ id, ...body }));
    }

    @Patch(':id/link-nin')
    @HttpCode(HttpStatus.OK)
    public async linkNin(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() body: LinkNinRequest
    ): Promise<PersonOutput> {
        return unwrap(await this.editPersonUseCase.execute({ id, nin: body.nin }));
    }

    @Patch(':id/link-bvn')
    @HttpCode(HttpStatus.OK)
    public async linkBvn(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() body: LinkBvnRequest
    ): Promise<PersonOutput> {
        return unwrap(await this.editPersonUseCase.execute({ id, bvn: body.bvn }));
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    public async getById(@Param('id', ParseUUIDPipe) id: string): Promise<PersonOutput> {
        return unwrap(await this.getPersonByIdUseCase.execute({ id }));
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    public async search(@Query() query: SearchPersonRequest): Promise<PaginationResult<PersonOutput>> {
        const options = {
            limit: query.limit || 100,
            page: query.page || 1,
            sortBy: query.sortBy,
            sortOrder: query.sortOrder,
        };
        const filters: PersonPaginationFilters = {
            genderId: query.genderId,
            addressId: query.addressId,
            dob: query.dob ? splitDob(query.dob) : undefined,
            searchQuery: query.searchQuery,
        };
        return unwrap(await this.searchPersonUseCase.execute({ filters, options }));
    }
}
