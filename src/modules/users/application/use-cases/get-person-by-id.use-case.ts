import { Inject, Injectable, Logger } from "@nestjs/common";
import { UseCase } from "src/shared/application/use-case";
import { PersonOutput, toPersonOutput } from "../dtos";
import { PERSON_REPOSITORY, IPersonRepository } from "../../domain/repository";
import { Result } from "src/shared/domain/result";
import { UniqueId } from "src/shared/domain/unique-id";

export type GetPersonByIdCommand = { id: string };

@Injectable()
export class GetPersonByIdUseCase implements UseCase<GetPersonByIdCommand, PersonOutput> {
    private readonly logger = new Logger(GetPersonByIdUseCase.name);

    constructor(
        @Inject(PERSON_REPOSITORY) private readonly personRepository: IPersonRepository,
    ) {}

    public async execute(dto: GetPersonByIdCommand): Promise<Result<PersonOutput>> {
        this.logger.log("Executing get person by id use case");

        const id = UniqueId.createFromString(dto.id);
        const personResult = await this.personRepository.getById(id);
        if (personResult.isFailure) return Result.fail(personResult.error);

        return Result.ok(toPersonOutput(personResult.value));
    }
}
