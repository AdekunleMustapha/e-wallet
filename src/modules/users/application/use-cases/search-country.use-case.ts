import { Inject, Injectable, Logger } from "@nestjs/common";
import { UseCase } from "src/shared/application/use-case";
import { CountryOutput, toCountryOutput } from "../dtos";
import { COUNTRY_REPOSITORY, CountryPaginationFilters, ICountryRepository, PaginationOptions, PaginationResult } from "../../domain/repository";
import { Result } from "src/shared/domain/result";

export type SearchCountryCommand = {
    filters: CountryPaginationFilters;
    options: PaginationOptions;
};

export type SearchCountryResult = PaginationResult<CountryOutput>;

@Injectable()
export class SearchCountryUseCase implements UseCase<SearchCountryCommand, SearchCountryResult> {
    private readonly logger = new Logger(SearchCountryUseCase.name);

    constructor(
        @Inject(COUNTRY_REPOSITORY) private readonly countryRepository: ICountryRepository
    ){}

    public async execute(dto: SearchCountryCommand): Promise<Result<SearchCountryResult>> {
        this.logger.log("Executing search country use case");

        const searchResult = await this.countryRepository.search(dto.filters, dto.options);
        if(searchResult.isFailure) return Result.fail(searchResult.error);

        const paginatedResult = searchResult.value;
        return Result.ok({
            data: paginatedResult.data.map(toCountryOutput),
            total: paginatedResult.total,
            page: paginatedResult.page,
            limit: paginatedResult.limit,
            totalPages: paginatedResult.totalPages,
        });
    }
}
