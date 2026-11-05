import { Inject, Injectable, Logger } from "@nestjs/common";
import { UseCase } from "src/shared/application/use-case";
import { DOCUMENT_TYPE_REPOSITORY, IDocumentTypeRepository } from "../../domain/repository";
import { Result } from "src/shared/domain/result";
import { UniqueId } from "src/shared/domain/unique-id";

export type DeleteDocumentTypeCommand = { id: string };

@Injectable()
export class DeleteDocumentTypeUseCase implements UseCase<DeleteDocumentTypeCommand, void> {
    private readonly logger = new Logger(DeleteDocumentTypeUseCase.name);

    constructor(
        @Inject(DOCUMENT_TYPE_REPOSITORY) private readonly documentTypeRepository: IDocumentTypeRepository
    ){}

    public async execute(dto: DeleteDocumentTypeCommand): Promise<Result<void>> {
        this.logger.log("Executing delete document type use case");

        const id = UniqueId.createFromString(dto.id);
        const result = await this.documentTypeRepository.delete(id);
        if(result.isFailure) return Result.fail(result.error);
        return Result.ok();
    }
}
