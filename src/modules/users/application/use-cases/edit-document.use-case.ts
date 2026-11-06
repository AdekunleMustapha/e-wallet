import { Inject, Injectable, Logger } from "@nestjs/common";
import { UseCase } from "src/shared/application/use-case";
import { DocumentOutput, toDocumentOutput, toDocumentTypeOutput } from "../dtos";
import { DOCUMENT_REPOSITORY, DOCUMENT_TYPE_REPOSITORY, IDocumentRepository, IDocumentTypeRepository } from "../../domain/repository";
import { Result } from "src/shared/domain/result";
import { UniqueId } from "src/shared/domain/unique-id";

export type EditDocumentCommand = {
    id: string;
    documentName?: string;
    verified?: boolean;
};

@Injectable()
export class EditDocumentUseCase implements UseCase<EditDocumentCommand, DocumentOutput> {
    private readonly logger = new Logger(EditDocumentUseCase.name);

    constructor(
        @Inject(DOCUMENT_REPOSITORY) private readonly documentRepository: IDocumentRepository,
        @Inject(DOCUMENT_TYPE_REPOSITORY) private readonly documentTypeRepository: IDocumentTypeRepository
    ) {}

    public async execute(dto: EditDocumentCommand): Promise<Result<DocumentOutput>> {
        this.logger.log("Executing edit document use case");

        const id = UniqueId.createFromString(dto.id);
        const documentResult = await this.documentRepository.getById(id);
        if(documentResult.isFailure) return Result.fail(documentResult.error);

        const document = documentResult.value;

        if(dto.documentName) {
            const nameResult = document.changeDocumentName(dto.documentName);
            if(nameResult.isFailure) return Result.fail(nameResult.error);
        }

        if(dto.verified) {
            document.markAsVerified();
        }

        const updateResult = await this.documentRepository.update(document);
        if(updateResult.isFailure) return Result.fail(updateResult.error);

        const documentTypeResult = await this.documentTypeRepository.getById(document.documentTypeId);
        if(documentTypeResult.isFailure) return Result.fail(documentTypeResult.error);

        return Result.ok(toDocumentOutput(updateResult.value, toDocumentTypeOutput(documentTypeResult.value)));
    }
}
