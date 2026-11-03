import { UseCase } from "src/shared/application/use-case";
import { GenderOutput, toGenderOutput } from "../dtos";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { GENDER_REPOSITORY, IGenderRepository } from "../../domain/repository";
import { Result } from "src/shared/domain/result";

@Injectable()
export class GetAllGenderUseCase implements UseCase<void, GenderOutput[]> {
    private readonly logger = new Logger(GetAllGenderUseCase.name);

    constructor(
        @Inject(GENDER_REPOSITORY) private readonly genderRepository: IGenderRepository
    ){}

    public async execute(dto: void): Promise<Result<GenderOutput[]>> {
        this.logger.log("Executing get all gender use case");
        const savedResults = await this.genderRepository.getAll();
        if(savedResults.isFailure) return Result.fail(savedResults.error);
        return Result.ok(savedResults.value.map(toGenderOutput));
    }
}