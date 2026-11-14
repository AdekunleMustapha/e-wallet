import { Inject, Injectable, Logger } from "@nestjs/common";
import { UseCase } from "src/shared/application/use-case";
import { DocumentTypeOutput, toDocumentTypeOutput } from "../dtos";
import { DOCUMENT_TYPE_REPOSITORY, IDocumentTypeRepository } from "../../domain/repository";
import { Result } from "src/shared/domain/result";
import { UniqueId } from "src/shared/domain/unique-id";

export type EditDocumentTypeCommand = { id: string; name: string };

@Injectable()
export class EditDocumentTypeUseCase implements UseCase<EditDocumentTypeCommand, DocumentTypeOutput> {
    private readonly logger = new Logger(EditDocumentTypeUseCase.name);

    constructor(
        @Inject(DOCUMENT_TYPE_REPOSITORY) private readonly documentTypeRepository: IDocumentTypeRepository
    ){}

    public async execute(dto: EditDocumentTypeCommand): Promise<Result<DocumentTypeOutput>> {
        this.logger.log("Executing edit document type use case");

        const id = UniqueId.createFromString(dto.id);
        const documentTypeResult = await this.documentTypeRepository.getById(id);
        if(documentTypeResult.isFailure) return Result.fail(documentTypeResult.error);

        const documentType = documentTypeResult.value;
        const changeResult = documentType.update({ documentTypeName: dto.name });
        if(changeResult.isFailure) return Result.fail(changeResult.error);

        const result = await this.documentTypeRepository.update(documentType);
        if(result.isFailure) return Result.fail(result.error);

        return Result.ok(toDocumentTypeOutput(result.value));
    }
}
