import { Inject, Injectable, Logger } from "@nestjs/common";
import { UseCase } from "src/shared/application/use-case";
import { CountryOutput, toCountryOutput } from "../dtos";
import { COUNTRY_REPOSITORY, ICountryRepository } from "../../domain/repository";
import { Result } from "src/shared/domain/result";
import { Country } from "../../domain/entities";

export type CreateCountryCommand = { name: string; code: string };

@Injectable()
export class CreateCountryUseCase implements UseCase<CreateCountryCommand, CountryOutput> {
    private readonly logger = new Logger(CreateCountryUseCase.name);

    constructor(
        @Inject(COUNTRY_REPOSITORY) private readonly countryRepository: ICountryRepository
    ){}

    public async execute(dto: CreateCountryCommand): Promise<Result<CountryOutput>> {
        this.logger.log("Executing create country use case");

        const countryResult = Country.create({ countryName: dto.name, countryCode: dto.code });
        if(countryResult.isFailure) return Result.fail(countryResult.error);

        const saveResult = await this.countryRepository.save(countryResult.value);
        if(saveResult.isFailure) return Result.fail(saveResult.error);
        return Result.ok(toCountryOutput(saveResult.value));
    }
}
