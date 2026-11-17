import { Inject, Injectable, Logger } from "@nestjs/common";
import { UseCase } from "src/shared/application/use-case";
import { PersonOutput, toPersonOutput } from "../dtos";
import { PERSON_REPOSITORY, PersonPaginationFilters, IPersonRepository, PaginationOptions, PaginationResult } from "../../domain/repository";
import { Result } from "src/shared/domain/result";

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
    ) {}

    public async execute(dto: SearchPersonCommand): Promise<Result<SearchPersonResult>> {
        this.logger.log("Executing search person use case");

        const searchResult = await this.personRepository.search(dto.filters, dto.options);
        if (searchResult.isFailure) return Result.fail(searchResult.error);

        const paginatedResult = searchResult.value;

        return Result.ok({
            data: paginatedResult.data.map(toPersonOutput),
            total: paginatedResult.total,
            page: paginatedResult.page,
            limit: paginatedResult.limit,
            totalPages: paginatedResult.totalPages,
        });
    }
}
