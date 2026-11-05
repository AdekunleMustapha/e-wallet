import { Inject, Injectable, Logger } from "@nestjs/common";
import { UseCase } from "src/shared/application/use-case";
import { DocumentOutput, toDocumentOutput, toDocumentTypeOutput } from "../dtos";
import { DOCUMENT_REPOSITORY, IDocumentRepository } from "../../domain/repository";
import { DOCUMENT_TYPE_REPOSITORY, IDocumentTypeRepository } from "../../domain/repository";
import { Result } from "src/shared/domain/result";
import { UniqueId } from "src/shared/domain/unique-id";

export type GetDocumentByIdCommand = { id: string };

@Injectable()
export class GetDocumentByIdUseCase implements UseCase<GetDocumentByIdCommand, DocumentOutput> {
    private readonly logger = new Logger(GetDocumentByIdUseCase.name);

    constructor(
        @Inject(DOCUMENT_REPOSITORY) private readonly documentRepository: IDocumentRepository,
        @Inject(DOCUMENT_TYPE_REPOSITORY) private readonly documentTypeRepository: IDocumentTypeRepository
    ){}

    public async execute(dto: GetDocumentByIdCommand): Promise<Result<DocumentOutput>> {
        this.logger.log("Executing get document by id use case");

        const id = UniqueId.createFromString(dto.id);
        const documentResult = await this.documentRepository.getById(id);
        if(documentResult.isFailure) return Result.fail(documentResult.error);

        const document = documentResult.value;
        const documentTypeResult = await this.documentTypeRepository.getById(document.documentTypeId);
        if(documentTypeResult.isFailure) return Result.fail(documentTypeResult.error);

        return Result.ok(toDocumentOutput(document, toDocumentTypeOutput(documentTypeResult.value)));
    }
}
