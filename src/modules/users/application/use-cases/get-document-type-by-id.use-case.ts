import { Inject, Injectable, Logger } from "@nestjs/common";
import { UseCase } from "src/shared/application/use-case";
import { DocumentTypeOutput, toDocumentTypeOutput } from "../dtos";
import { DOCUMENT_TYPE_REPOSITORY, IDocumentTypeRepository } from "../../domain/repository";
import { Result } from "src/shared/domain/result";
import { UniqueId } from "src/shared/domain/unique-id";

export type GetDocumentTypeByIdCommand = { id: string };

@Injectable()
export class GetDocumentTypeByIdUseCase implements UseCase<GetDocumentTypeByIdCommand, DocumentTypeOutput> {
    private readonly logger = new Logger(GetDocumentTypeByIdUseCase.name);

    constructor(
        @Inject(DOCUMENT_TYPE_REPOSITORY) private readonly documentTypeRepository: IDocumentTypeRepository
    ){}

    public async execute(dto: GetDocumentTypeByIdCommand): Promise<Result<DocumentTypeOutput>> {
        this.logger.log("Executing get document type by id use case");
        const id = UniqueId.createFromString(dto.id);

        const savedResult = await this.documentTypeRepository.getById(id);
        if(savedResult.isFailure) return Result.fail(savedResult.error);
        return Result.ok(toDocumentTypeOutput(savedResult.value));
    }
}
