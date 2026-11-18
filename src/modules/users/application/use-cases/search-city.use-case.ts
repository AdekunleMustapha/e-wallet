import { UseCase } from "src/shared/application/use-case";
import { CITY_REPOSITORY, CityPaginationFilters, ICityRepository, PaginationOptions, PaginationResult } from "../../domain/repository";
import { CityOutput, toCityOutput } from "../dtos";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { Result } from "src/shared/domain/result";

export type SearchCityCommand = {
    filters: CityPaginationFilters;
    options: PaginationOptions;
};

export type SearchCityResult = PaginationResult<CityOutput>

@Injectable()
export class SearchCityUseCase implements UseCase<SearchCityCommand, SearchCityResult> {
    private readonly logger = new Logger(SearchCityUseCase.name);

    constructor(
        @Inject(CITY_REPOSITORY) private readonly cityRepository: ICityRepository
    ) {}

    public async execute(dto: SearchCityCommand): Promise<Result<SearchCityResult>> {
        this.logger.log("Executing search city use case");

        const result = await this.cityRepository.search(dto.filters, dto.options);
        if(result.isFailure) return Result.fail(result.error);
        const {limit, page, total, totalPages } = result.value;

        const data: CityOutput[] = [];
        for(let value of result.value.data) {
            data.push(toCityOutput(value));
        }

        return Result.ok({data, limit, page, total, totalPages});
    }
}