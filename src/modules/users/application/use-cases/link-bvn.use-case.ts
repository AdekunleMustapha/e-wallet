import { Inject, Injectable, Logger } from "@nestjs/common";
import { UseCase } from "src/shared/application/use-case";
import { PersonOutput, toPersonOutput } from "../dtos";
import { IPersonRepository, PERSON_REPOSITORY } from "../../domain/repository";
import { Result } from "src/shared/domain/result";
import { UniqueId } from "src/shared/domain/unique-id";
import { BVN } from "../../domain/value-objects";
import { BVN_HASHER, IBvnHasher } from "../../domain/services";

export type LinkBvnCommand = {
    id: string;
    bvn: string;
};

@Injectable()
export class LinkBvnUseCase implements UseCase<LinkBvnCommand, PersonOutput> {
    private readonly logger = new Logger(LinkBvnUseCase.name);

    constructor(
        @Inject(PERSON_REPOSITORY) private readonly personRepository: IPersonRepository,
        @Inject(BVN_HASHER) private readonly bvnHasher: IBvnHasher,
    ) {}

    public async execute(dto: LinkBvnCommand): Promise<Result<PersonOutput>> {
        this.logger.log(`Executing link BVN use case for person: ${dto.id}`);

        const bvnResult = BVN.create(dto.bvn);
        if (bvnResult.isFailure) return Result.fail(bvnResult.error);

        const id = UniqueId.createFromString(dto.id);
        const personResult = await this.personRepository.getById(id);
        if (personResult.isFailure) return Result.fail(personResult.error);
        const person = personResult.value;

        const hashResult = this.bvnHasher.hash(bvnResult.value);
        if (hashResult.isFailure) return Result.fail(hashResult.error);

        const linkResult = person.linkBvn(hashResult.value);
        if (linkResult.isFailure) return Result.fail(linkResult.error);

        const updateResult = await this.personRepository.update(person);
        if (updateResult.isFailure) return Result.fail(updateResult.error);

        return Result.ok(toPersonOutput(person));
    }
}
