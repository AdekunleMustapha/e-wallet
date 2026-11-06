import { Inject, Injectable, Logger } from "@nestjs/common";
import { UseCase } from "src/shared/application/use-case";
import { DocumentOutput, toDocumentOutput, toDocumentTypeOutput } from "../dtos";
import { DOCUMENT_REPOSITORY, DOCUMENT_TYPE_REPOSITORY, IDocumentRepository, IDocumentTypeRepository, IPersonRepository, PERSON_REPOSITORY } from "../../domain/repository";
import { Result } from "src/shared/domain/result";
import { Document } from "../../domain/entities";
import { UniqueId } from "src/shared/domain/unique-id";

export type CreateDocumentCommand = {
    personId: string;
    documentTypeId: string;
    documentName: string;
    documentLink: string;
};

@Injectable()
export class CreateDocumentUseCase implements UseCase<CreateDocumentCommand, DocumentOutput> {
    private readonly logger = new Logger(CreateDocumentUseCase.name);

    constructor(
        @Inject(DOCUMENT_REPOSITORY) private readonly documentRepository: IDocumentRepository,
        @Inject(DOCUMENT_TYPE_REPOSITORY) private readonly documentTypeRepository: IDocumentTypeRepository,
        @Inject(PERSON_REPOSITORY) private readonly personRepository: IPersonRepository
    ) {}

    public async execute(dto: CreateDocumentCommand): Promise<Result<DocumentOutput>> {
        this.logger.log("Executing create document use case");

        const personId = UniqueId.createFromString(dto.personId);
        const personResult = await this.personRepository.getById(personId);
        if(personResult.isFailure) return Result.fail(personResult.error);

        const documentTypeId = UniqueId.createFromString(dto.documentTypeId);
        const documentTypeResult = await this.documentTypeRepository.getById(documentTypeId);
        if(documentTypeResult.isFailure) return Result.fail(documentTypeResult.error);

        const documentResult = Document.create({
            personId,
            documentTypeId,
            documentName: dto.documentName,
            documentLink: dto.documentLink,
            verified: false
        });
        if(documentResult.isFailure) return Result.fail(documentResult.error);

        const saveResult = await this.documentRepository.save(documentResult.value);
        if(saveResult.isFailure) return Result.fail(saveResult.error);

        return Result.ok(toDocumentOutput(saveResult.value, toDocumentTypeOutput(documentTypeResult.value)));
    }
}
