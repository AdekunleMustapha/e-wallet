import { UseCase } from "src/shared/application/use-case";
import { GenderOutput, toGenderOutput } from "../dtos";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { GENDER_REPOSITORY, IGenderRepository } from "../../domain/repository";
import { Result } from "src/shared/domain/result";
import { UniqueId } from "src/shared/domain/unique-id";

export type GetGenderByIdCommand = {id: string};

@Injectable()
export class GetGenderByIdUseCase implements UseCase<GetGenderByIdCommand, GenderOutput> {
    private readonly logger = new Logger(GetGenderByIdUseCase.name);

    constructor(
        @Inject(GENDER_REPOSITORY) private readonly genderRepository: IGenderRepository
    ){}

    public async execute(dto: GetGenderByIdCommand): Promise<Result<GenderOutput>> {
        this.logger.log("Executing get gender by id use case");
        const id = UniqueId.createFromString(dto.id);

        const savedResult = await this.genderRepository.getById(id);
        if(savedResult.isFailure) return Result.fail(savedResult.error);
        return Result.ok(toGenderOutput(savedResult.value));
    }
}