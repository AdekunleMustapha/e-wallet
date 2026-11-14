import { Inject, Injectable, Logger } from "@nestjs/common";
import { UseCase } from "src/shared/application/use-case";
import { GenderOutput, toGenderOutput } from "../dtos";
import { GENDER_REPOSITORY, IGenderRepository } from "../../domain/repository";
import { Result } from "src/shared/domain/result";
import { UniqueId } from "src/shared/domain/unique-id";

export type EditGenderCommand = {id: string, name: string};

@Injectable()
export class EditGenderUseCase implements UseCase<EditGenderCommand, GenderOutput> {
    private readonly logger = new Logger(EditGenderUseCase.name);

    constructor(
        @Inject(GENDER_REPOSITORY) private readonly genderRepository: IGenderRepository
    ){}

    public async execute(dto: EditGenderCommand): Promise<Result<GenderOutput>> {
        this.logger.log("Executing edit gender use case");
        
        const id = UniqueId.createFromString(dto.id);
        const genderResult = await this.genderRepository.getById(id);
        if(genderResult.isFailure) return Result.fail(genderResult.error);

        const gender = genderResult.value;
        const updateResult = gender.update({ genderName: dto.name });
        if(updateResult.isFailure) return Result.fail(updateResult.error);

        const result = await this.genderRepository.update(gender);
        if(result.isFailure) return Result.fail(result.error);

        return Result.ok(toGenderOutput(result.value));
    }
}