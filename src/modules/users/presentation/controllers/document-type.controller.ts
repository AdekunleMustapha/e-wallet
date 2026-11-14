import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post } from "@nestjs/common";
import { CreateDocumentTypeUseCase, DeleteDocumentTypeUseCase, EditDocumentTypeUseCase, GetAllDocumentTypeUseCase, GetDocumentTypeByIdUseCase } from "../../application/use-cases";
import { CreateDocumentTypeRequest, EditDocumentTypeRequest } from "../dto";
import { DocumentTypeOutput } from "../../application/dtos";
import { unwrap } from "src/shared/presentation/unwrap-result";

@Controller("document-type")
export class DocumentTypeController {
    constructor(
        private readonly createDocumentTypeUseCase: CreateDocumentTypeUseCase,
        private readonly editDocumentTypeUseCase: EditDocumentTypeUseCase,
        private readonly getAllDocumentTypeUseCase: GetAllDocumentTypeUseCase,
        private readonly getDocumentTypeByIdUseCase: GetDocumentTypeByIdUseCase,
        private readonly deleteDocumentTypeUseCase: DeleteDocumentTypeUseCase,
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    public async create(@Body() body: CreateDocumentTypeRequest): Promise<DocumentTypeOutput> {
        const name = body.documentTypeName;
        return unwrap(await this.createDocumentTypeUseCase.execute({ name }));
    }

    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    public async edit(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() body: EditDocumentTypeRequest
    ): Promise<DocumentTypeOutput> {
        const name = body.documentTypeName;
        return unwrap(await this.editDocumentTypeUseCase.execute({ id, name }));
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    public async getAll(): Promise<DocumentTypeOutput[]> {
        return unwrap(await this.getAllDocumentTypeUseCase.execute());
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    public async getById(@Param('id', ParseUUIDPipe) id: string): Promise<DocumentTypeOutput> {
        return unwrap(await this.getDocumentTypeByIdUseCase.execute({ id }));
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    public async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
        return unwrap(await this.deleteDocumentTypeUseCase.execute({ id }));
    }
}
