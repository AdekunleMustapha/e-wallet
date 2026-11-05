import { Inject, Injectable, Logger } from "@nestjs/common";
import { UseCase } from "src/shared/application/use-case";
import { GENDER_REPOSITORY, IGenderRepository } from "../../domain/repository";
import { Result } from "src/shared/domain/result";
import { UniqueId } from "src/shared/domain/unique-id";

export type DeleteGenderCommand = { id: string };

@Injectable()
export class DeleteGenderUseCase implements UseCase<DeleteGenderCommand, void> {
    private readonly logger = new Logger(DeleteGenderUseCase.name);

    constructor(
        @Inject(GENDER_REPOSITORY) private readonly genderRepository: IGenderRepository
    ){}

    public async execute(dto: DeleteGenderCommand): Promise<Result<void>> {
        this.logger.log("Executing delete gender use case");

        const id = UniqueId.createFromString(dto.id);
        const result = await this.genderRepository.delete(id);
        if(result.isFailure) return Result.fail(result.error);
        return Result.ok();
    }
}
