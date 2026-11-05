import { Inject, Injectable, Logger } from "@nestjs/common";
import { UseCase } from "src/shared/application/use-case";
import { PersonOutput, toPersonOutput, toAddressOutput, toCountryOutput, toGenderOutput } from "../dtos";
import { PERSON_REPOSITORY, PersonPaginationFilters, IPersonRepository, PaginationOptions, PaginationResult } from "../../domain/repository";
import { GENDER_REPOSITORY, IGenderRepository } from "../../domain/repository";
import { ADDRESS_REPOSITORY, IAddressRepository } from "../../domain/repository";
import { COUNTRY_REPOSITORY, ICountryRepository } from "../../domain/repository";
import { Result } from "src/shared/domain/result";
import { NotFoundError } from "src/shared/domain/errors";

export type SearchPersonCommand = {
    filters: PersonPaginationFilters;
    options: PaginationOptions;
};

export type SearchPersonResult = PaginationResult<PersonOutput>;

@Injectable()
export class SearchPersonUseCase implements UseCase<SearchPersonCommand, SearchPersonResult> {
    private readonly logger = new Logger(SearchPersonUseCase.name);

    constructor(
        @Inject(PERSON_REPOSITORY) private readonly personRepository: IPersonRepository,
        @Inject(GENDER_REPOSITORY) private readonly genderRepository: IGenderRepository,
        @Inject(ADDRESS_REPOSITORY) private readonly addressRepository: IAddressRepository,
        @Inject(COUNTRY_REPOSITORY) private readonly countryRepository: ICountryRepository
    ){}

    public async execute(dto: SearchPersonCommand): Promise<Result<SearchPersonResult>> {
        this.logger.log("Executing search person use case");

        const searchResult = await this.personRepository.search(dto.filters, dto.options);
        if(searchResult.isFailure) return Result.fail(searchResult.error);

        const paginatedResult = searchResult.value;

        const personOutputs: PersonOutput[] = [];
        for(const person of paginatedResult.data) {
            const genderResult = await this.genderRepository.getById(person.genderId);
            if(genderResult.isFailure) return Result.fail(genderResult.error);

            if(!person.addressId) {
                return Result.fail(new NotFoundError("Person has no linked address"));
            }

            const addressResult = await this.addressRepository.getById(person.addressId);
            if(addressResult.isFailure) return Result.fail(addressResult.error);

            const countryResult = await this.countryRepository.getById(addressResult.value.countryId);
            if(countryResult.isFailure) return Result.fail(countryResult.error);

            const addressOutput = toAddressOutput(addressResult.value, toCountryOutput(countryResult.value));
            const genderOutput = toGenderOutput(genderResult.value);

            personOutputs.push(toPersonOutput(person, addressOutput, genderOutput));
        }

        return Result.ok({
            data: personOutputs,
            total: paginatedResult.total,
            page: paginatedResult.page,
            limit: paginatedResult.limit,
            totalPages: paginatedResult.totalPages,
        });
    }
}
