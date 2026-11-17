import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query } from "@nestjs/common";
import { 
    CreatePersonUseCase, 
    GetPersonByIdUseCase, 
    SearchPersonUseCase,
    LinkNinUseCase,
    LinkBvnUseCase,
    UpgradeTierUseCase
} from "../../application/use-cases";
import { 
    CreatePersonRequest, 
    LinkBvnRequest, 
    LinkNinRequest, 
    SearchPersonRequest, 
    UpgradeTierRequest,
    splitDob 
} from "../dto";
import { PersonOutput } from "../../application/dtos";
import { unwrap } from "src/shared/presentation/unwrap-result";
import { PaginationResult, PersonPaginationFilters } from "../../domain/repository";

@Controller("person")
export class PersonController {
    constructor(
        private readonly createPersonUseCase: CreatePersonUseCase,
        private readonly getPersonByIdUseCase: GetPersonByIdUseCase,
        private readonly searchPersonUseCase: SearchPersonUseCase,
        private readonly linkNinUseCase: LinkNinUseCase,
        private readonly linkBvnUseCase: LinkBvnUseCase,
        private readonly upgradeTierUseCase: UpgradeTierUseCase
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    public async create(@Body() body: CreatePersonRequest): Promise<PersonOutput> {
        const dob = splitDob(body.dob);
        return unwrap(await this.createPersonUseCase.execute({
            firstName: body.firstName,
            lastName: body.lastName,
            middleName: body.middleName,
            dob,
            email: body.email,
            phoneNumber: body.phoneNumber,
            gender: body.gender,
            country: body.country,
            state: body.state,
            city: body.city,
            addressLine1: body.addressLine1,
            postalCode: body.postalCode,
            password: body.password,
        }));
    }

    @Patch(':id/link-nin')
    @HttpCode(HttpStatus.OK)
    public async linkNin(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() body: LinkNinRequest
    ): Promise<PersonOutput> {
        return unwrap(await this.linkNinUseCase.execute({ id, nin: body.nin }));
    }

    @Patch(':id/link-bvn')
    @HttpCode(HttpStatus.OK)
    public async linkBvn(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() body: LinkBvnRequest
    ): Promise<PersonOutput> {
        return unwrap(await this.linkBvnUseCase.execute({ id, bvn: body.bvn }));
    }

    @Patch(':id/upgrade-tier')
    @HttpCode(HttpStatus.OK)
    public async upgradeTier(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() body: UpgradeTierRequest
    ): Promise<PersonOutput> {
        return unwrap(await this.upgradeTierUseCase.execute({ id, tier: body.tier }));
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
            gender: query.gender,
            phoneNumber: query.phoneNumber,
            country: query.country,
            state: query.state,
            city: query.city,
            tier: query.tier,
            dob: query.dob ? splitDob(query.dob) : undefined,
            searchQuery: query.searchQuery,
        };
        return unwrap(await this.searchPersonUseCase.execute({ filters, options }));
    }
}
