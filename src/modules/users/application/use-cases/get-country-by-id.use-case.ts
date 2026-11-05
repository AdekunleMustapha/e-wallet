import { Inject, Injectable, Logger } from "@nestjs/common";
import { UseCase } from "src/shared/application/use-case";
import { CountryOutput, toCountryOutput } from "../dtos";
import { COUNTRY_REPOSITORY, ICountryRepository } from "../../domain/repository";
import { Result } from "src/shared/domain/result";
import { UniqueId } from "src/shared/domain/unique-id";

export type GetCountryByIdCommand = { id: string };

@Injectable()
export class GetCountryByIdUseCase implements UseCase<GetCountryByIdCommand, CountryOutput> {
    private readonly logger = new Logger(GetCountryByIdUseCase.name);

    constructor(
        @Inject(COUNTRY_REPOSITORY) private readonly countryRepository: ICountryRepository
    ){}

    public async execute(dto: GetCountryByIdCommand): Promise<Result<CountryOutput>> {
        this.logger.log("Executing get country by id use case");
        const id = UniqueId.createFromString(dto.id);

        const savedResult = await this.countryRepository.getById(id);
        if(savedResult.isFailure) return Result.fail(savedResult.error);
        return Result.ok(toCountryOutput(savedResult.value));
    }
}
