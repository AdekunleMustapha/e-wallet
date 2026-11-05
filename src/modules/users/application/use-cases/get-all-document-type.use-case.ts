import { Inject, Injectable, Logger } from "@nestjs/common";
import { UseCase } from "src/shared/application/use-case";
import { DocumentTypeOutput, toDocumentTypeOutput } from "../dtos";
import { DOCUMENT_TYPE_REPOSITORY, IDocumentTypeRepository } from "../../domain/repository";
import { Result } from "src/shared/domain/result";

@Injectable()
export class GetAllDocumentTypeUseCase implements UseCase<void, DocumentTypeOutput[]> {
    private readonly logger = new Logger(GetAllDocumentTypeUseCase.name);

    constructor(
        @Inject(DOCUMENT_TYPE_REPOSITORY) private readonly documentTypeRepository: IDocumentTypeRepository
    ){}

    public async execute(dto: void): Promise<Result<DocumentTypeOutput[]>> {
        this.logger.log("Executing get all document type use case");
        const savedResults = await this.documentTypeRepository.getAll();
        if(savedResults.isFailure) return Result.fail(savedResults.error);
        return Result.ok(savedResults.value.map(toDocumentTypeOutput));
    }
}
