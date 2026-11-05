import { Inject, Injectable, Logger } from "@nestjs/common";
import { UseCase } from "src/shared/application/use-case";
import { DOCUMENT_REPOSITORY, IDocumentRepository } from "../../domain/repository";
import { Result } from "src/shared/domain/result";
import { UniqueId } from "src/shared/domain/unique-id";

export type DeleteDocumentCommand = { id: string };

@Injectable()
export class DeleteDocumentUseCase implements UseCase<DeleteDocumentCommand, void> {
    private readonly logger = new Logger(DeleteDocumentUseCase.name);

    constructor(
        @Inject(DOCUMENT_REPOSITORY) private readonly documentRepository: IDocumentRepository
    ){}

    public async execute(dto: DeleteDocumentCommand): Promise<Result<void>> {
        this.logger.log("Executing delete document use case");

        const id = UniqueId.createFromString(dto.id);
        const result = await this.documentRepository.delete(id);
        if(result.isFailure) return Result.fail(result.error);
        return Result.ok();
    }
}
