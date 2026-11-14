import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query } from "@nestjs/common";
import { CreateDocumentUseCase, DeleteDocumentUseCase, EditDocumentUseCase, GetDocumentByIdUseCase, SearchDocumentUseCase } from "../../application/use-cases";
import { CreateDocumentRequest, EditDocumentRequest, SearchDocumentRequest } from "../dto";
import { DocumentOutput } from "../../application/dtos";
import { unwrap } from "src/shared/presentation/unwrap-result";
import { DocumentPaginationFilters, PaginationResult } from "../../domain/repository";

@Controller("document")
export class DocumentController {
    constructor(
        private readonly createDocumentUseCase: CreateDocumentUseCase,
        private readonly editDocumentUseCase: EditDocumentUseCase,
        private readonly getDocumentByIdUseCase: GetDocumentByIdUseCase,
        private readonly deleteDocumentUseCase: DeleteDocumentUseCase,
        private readonly searchDocumentUseCase: SearchDocumentUseCase,
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    public async create(@Body() body: CreateDocumentRequest): Promise<DocumentOutput> {
        return unwrap(await this.createDocumentUseCase.execute(body));
    }

    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    public async edit(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() body: EditDocumentRequest
    ): Promise<DocumentOutput> {
        return unwrap(await this.editDocumentUseCase.execute({ id, ...body }));
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    public async getById(@Param('id', ParseUUIDPipe) id: string): Promise<DocumentOutput> {
        return unwrap(await this.getDocumentByIdUseCase.execute({ id }));
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    public async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
        return unwrap(await this.deleteDocumentUseCase.execute({ id }));
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    public async search(@Query() query: SearchDocumentRequest): Promise<PaginationResult<DocumentOutput>> {
        const options = {
            limit: query.limit || 100,
            page: query.page || 1,
            sortBy: query.sortBy,
            sortOrder: query.sortOrder,
        };
        const filters: DocumentPaginationFilters = {
            personId: query.personId!,
            documentType: query.documentTypeId || query.documentType,
            documentName: query.documentName,
            verified: query.verified,
        };
        return unwrap(await this.searchDocumentUseCase.execute({ filters, options }));
    }
}
