import { Inject, Injectable, Logger } from "@nestjs/common";
import { UseCase } from "src/shared/application/use-case";
import { PersonOutput, toPersonOutput } from "../dtos";
import { IPersonRepository, PERSON_REPOSITORY } from "../../domain/repository";
import { Result } from "src/shared/domain/result";
import { UniqueId } from "src/shared/domain/unique-id";
import { NIN } from "../../domain/value-objects";
import { INinHasher, NIN_HASHER } from "../../domain/services";

export type LinkNinCommand = {
    id: string;
    nin: string;
};

@Injectable()
export class LinkNinUseCase implements UseCase<LinkNinCommand, PersonOutput> {
    private readonly logger = new Logger(LinkNinUseCase.name);

    constructor(
        @Inject(PERSON_REPOSITORY) private readonly personRepository: IPersonRepository,
        @Inject(NIN_HASHER) private readonly ninHasher: INinHasher,
    ) {}

    public async execute(dto: LinkNinCommand): Promise<Result<PersonOutput>> {
        this.logger.log(`Executing link NIN use case for person: ${dto.id}`);

        const ninResult = NIN.create(dto.nin);
        if (ninResult.isFailure) return Result.fail(ninResult.error);

        const id = UniqueId.createFromString(dto.id);
        const personResult = await this.personRepository.getById(id);
        if (personResult.isFailure) return Result.fail(personResult.error);
        const person = personResult.value;

        const hashResult = this.ninHasher.hash(ninResult.value);
        if (hashResult.isFailure) return Result.fail(hashResult.error);

        const linkResult = person.linkNin(hashResult.value);
        if (linkResult.isFailure) return Result.fail(linkResult.error);

        const updateResult = await this.personRepository.update(person);
        if (updateResult.isFailure) return Result.fail(updateResult.error);

        return Result.ok(toPersonOutput(person));
    }
}
