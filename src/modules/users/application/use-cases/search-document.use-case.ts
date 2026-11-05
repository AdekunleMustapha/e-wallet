import { Inject, Injectable, Logger } from "@nestjs/common";
import { UseCase } from "src/shared/application/use-case";
import { DocumentOutput, toDocumentOutput, toDocumentTypeOutput } from "../dtos";
import { DOCUMENT_REPOSITORY, DocumentPaginationFilters, IDocumentRepository, PaginationOptions, PaginationResult } from "../../domain/repository";
import { DOCUMENT_TYPE_REPOSITORY, IDocumentTypeRepository } from "../../domain/repository";
import { Result } from "src/shared/domain/result";

export type SearchDocumentCommand = {
    filters: DocumentPaginationFilters;
    options: PaginationOptions;
};

export type SearchDocumentResult = PaginationResult<DocumentOutput>;

@Injectable()
export class SearchDocumentUseCase implements UseCase<SearchDocumentCommand, SearchDocumentResult> {
    private readonly logger = new Logger(SearchDocumentUseCase.name);

    constructor(
        @Inject(DOCUMENT_REPOSITORY) private readonly documentRepository: IDocumentRepository,
        @Inject(DOCUMENT_TYPE_REPOSITORY) private readonly documentTypeRepository: IDocumentTypeRepository
    ){}

    public async execute(dto: SearchDocumentCommand): Promise<Result<SearchDocumentResult>> {
        this.logger.log("Executing search document use case");

        const searchResult = await this.documentRepository.search(dto.filters, dto.options);
        if(searchResult.isFailure) return Result.fail(searchResult.error);

        const paginatedResult = searchResult.value;

        const documentOutputs: DocumentOutput[] = [];
        for(const document of paginatedResult.data) {
            const documentTypeResult = await this.documentTypeRepository.getById(document.documentTypeId);
            if(documentTypeResult.isFailure) return Result.fail(documentTypeResult.error);
            documentOutputs.push(toDocumentOutput(document, toDocumentTypeOutput(documentTypeResult.value)));
        }

        return Result.ok({
            data: documentOutputs,
            total: paginatedResult.total,
            page: paginatedResult.page,
            limit: paginatedResult.limit,
            totalPages: paginatedResult.totalPages,
        });
    }
}
