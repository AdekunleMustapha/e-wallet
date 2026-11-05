import { Inject, Injectable, Logger } from "@nestjs/common";
import { UseCase } from "src/shared/application/use-case";
import { COUNTRY_REPOSITORY, ICountryRepository } from "../../domain/repository";
import { Result } from "src/shared/domain/result";
import { UniqueId } from "src/shared/domain/unique-id";

export type DeleteCountryCommand = { id: string };

@Injectable()
export class DeleteCountryUseCase implements UseCase<DeleteCountryCommand, void> {
    private readonly logger = new Logger(DeleteCountryUseCase.name);

    constructor(
        @Inject(COUNTRY_REPOSITORY) private readonly countryRepository: ICountryRepository
    ){}

    public async execute(dto: DeleteCountryCommand): Promise<Result<void>> {
        this.logger.log("Executing delete country use case");

        const id = UniqueId.createFromString(dto.id);
        const result = await this.countryRepository.delete(id);
        if(result.isFailure) return Result.fail(result.error);
        return Result.ok();
    }
}
