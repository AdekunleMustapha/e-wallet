import { Inject, Injectable, Logger } from "@nestjs/common";
import { UseCase } from "src/shared/application/use-case";
import { CountryOutput, toCountryOutput } from "../dtos";
import { COUNTRY_REPOSITORY, ICountryRepository } from "../../domain/repository";
import { Result } from "src/shared/domain/result";
import { UniqueId } from "src/shared/domain/unique-id";

export type EditCountryCommand = { id: string; name?: string; code?: string };

@Injectable()
export class EditCountryUseCase implements UseCase<EditCountryCommand, CountryOutput> {
    private readonly logger = new Logger(EditCountryUseCase.name);

    constructor(
        @Inject(COUNTRY_REPOSITORY) private readonly countryRepository: ICountryRepository
    ){}

    public async execute(dto: EditCountryCommand): Promise<Result<CountryOutput>> {
        this.logger.log("Executing edit country use case");

        const id = UniqueId.createFromString(dto.id);
        const countryResult = await this.countryRepository.getById(id);
        if(countryResult.isFailure) return Result.fail(countryResult.error);

        const country = countryResult.value;
        const changeResult = country.changeCountryDetails({ countryName: dto.name, countryCode: dto.code });
        if(changeResult.isFailure) return Result.fail(changeResult.error);

        const result = await this.countryRepository.update(country);
        if(result.isFailure) return Result.fail(result.error);

        return Result.ok(toCountryOutput(result.value));
    }
}
