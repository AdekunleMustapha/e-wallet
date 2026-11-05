import { Inject, Injectable, Logger } from "@nestjs/common";
import { ADDRESS_REPOSITORY, AddressPaginationFilters, COUNTRY_REPOSITORY, IAddressRepository, ICountryRepository, PaginationOptions, PaginationResult } from "../../domain/repository";
import { AddressOutput, toAddressOutput, toCountryOutput } from "../dtos";
import { UseCase } from "src/shared/application/use-case";
import { Result } from "src/shared/domain/result";

export type SearchAddressCommand = {
    filters: AddressPaginationFilters,
    options: PaginationOptions
}

export type SearchAddressPaginationOutput = PaginationResult<AddressOutput>;

@Injectable()
export class SearchAddressByUseCase implements UseCase<SearchAddressCommand, SearchAddressPaginationOutput> {
    private readonly logger = new Logger(SearchAddressByUseCase.name);

    constructor(
        @Inject(ADDRESS_REPOSITORY) private readonly addressRepository: IAddressRepository,
        @Inject(COUNTRY_REPOSITORY) private readonly countryRepository: ICountryRepository
    ) {}

    public async execute(dto: SearchAddressCommand): Promise<Result<SearchAddressPaginationOutput>> {
        this.logger.log("Executing search address use case");

        const searchResult = await this.addressRepository.search(dto.filters, dto.options);
        if(searchResult.isFailure) return Result.fail(searchResult.error);
        const paginatedResult = searchResult.value;
        const addressOutputs: AddressOutput[] = [];
        for(let i=0; i < paginatedResult.data.length; i++) {
            const countryResult = await this.countryRepository.getById(paginatedResult.data[i].countryId);
            addressOutputs.push(toAddressOutput(
                paginatedResult.data[i],
                toCountryOutput(countryResult.value)
            ))
        }

        return Result.ok({
            data: addressOutputs,
            limit: paginatedResult.limit,
            page: paginatedResult.page,
            total: paginatedResult.total,
            totalPages: paginatedResult.totalPages
        });
    }
}