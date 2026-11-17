import { Inject, Injectable, Logger } from "@nestjs/common";
import { UseCase } from "src/shared/application/use-case";
import { PersonOutput, toPersonOutput } from "../dtos";
import { IPersonRepository, PERSON_REPOSITORY } from "../../domain/repository";
import { Result } from "src/shared/domain/result";
import { UniqueId } from "src/shared/domain/unique-id";
import { Tier } from "../../domain/enums";
import { ValidationError } from "src/shared/domain/errors";

export type UpgradeTierCommand = {
    id: string;
    tier: Tier;
};

@Injectable()
export class UpgradeTierUseCase implements UseCase<UpgradeTierCommand, PersonOutput> {
    private readonly logger = new Logger(UpgradeTierUseCase.name);

    constructor(
        @Inject(PERSON_REPOSITORY) private readonly personRepository: IPersonRepository,
    ) {}

    public async execute(dto: UpgradeTierCommand): Promise<Result<PersonOutput>> {
        this.logger.log(`Executing upgrade tier use case for person: ${dto.id} to tier: ${dto.tier}`);

        if (!Object.values(Tier).includes(dto.tier)) {
            return Result.fail(new ValidationError("Invalid tier"));
        }

        const id = UniqueId.createFromString(dto.id);
        const personResult = await this.personRepository.getById(id);
        if (personResult.isFailure) return Result.fail(personResult.error);
        const person = personResult.value;

        const upgradeResult = person.upgradeTier(dto.tier);
        if (upgradeResult.isFailure) return Result.fail(upgradeResult.error);

        const updateResult = await this.personRepository.update(person);
        if (updateResult.isFailure) return Result.fail(updateResult.error);

        return Result.ok(toPersonOutput(person));
    }
}
