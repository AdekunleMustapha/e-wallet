import { Inject, Injectable } from "@nestjs/common";
import { UseCase } from "src/shared/application/use-case";
import { DocumentTypeOutput, toDocumentTypeOutput } from "../dtos";
import { DOCUMENT_TYPE_REPOSITORY, IDocumentTypeRepository } from "../../domain/repository";
import { Result } from "src/shared/domain/result";
import { DocumentType } from "../../domain/entities";

export type CreateDocumentTypeCommand = {name: string}

@Injectable()
export class CreateDocumentTypeUseCase implements UseCase<CreateDocumentTypeCommand, DocumentTypeOutput> {

    constructor(
        @Inject(DOCUMENT_TYPE_REPOSITORY) private readonly documentTypeRepository: IDocumentTypeRepository
    ){}

    public async execute(dto: CreateDocumentTypeCommand): Promise<Result<DocumentTypeOutput>> {
       const documentTypeResult = DocumentType.create({documentTypeName: dto.name});
       if(documentTypeResult.isFailure) return Result.fail(documentTypeResult.error);
       const documentType = documentTypeResult.value;
       
       const result = await this.documentTypeRepository.save(documentType);
       if(result.isFailure) return Result.fail(result.error);
       return Result.ok(toDocumentTypeOutput(result.value));
    }

}