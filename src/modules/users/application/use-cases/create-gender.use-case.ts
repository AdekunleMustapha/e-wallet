import { Injectable, Inject, Logger } from "@nestjs/common";
import { UseCase } from "src/shared/application/use-case";
import { GenderOutput, toGenderOutput } from "../dtos";
import { Result } from "src/shared/domain/result";
import { Gender } from "../../domain/entities";
import { GENDER_REPOSITORY, IGenderRepository } from "../../domain/repository";

export type CreateGenderCommand = {name: string}

@Injectable()
export class CreateGenderUseCase implements UseCase<CreateGenderCommand, GenderOutput> {
    private readonly logger = new Logger(CreateGenderUseCase.name);

    constructor(
        @Inject(GENDER_REPOSITORY) private readonly genderRepository: IGenderRepository
    ){}


    public async execute(dto: CreateGenderCommand): Promise<Result<GenderOutput>> {
        this.logger.log("Executing create gender use case");

        const genderResult = Gender.create({genderName: dto.name});
        if(genderResult.isFailure) return Result.fail(genderResult.error);

        const saveResult = await this.genderRepository.save(genderResult.value);
        if(saveResult.isFailure) return Result.fail(saveResult.error);
        return Result.ok(toGenderOutput(saveResult.value));
    }
}