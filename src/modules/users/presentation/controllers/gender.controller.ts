import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post } from "@nestjs/common";
import { CreateGenderUseCase, DeleteGenderUseCase, EditGenderUseCase, GetAllGenderUseCase, GetGenderByIdUseCase } from "../../application/use-cases";
import { CreateGenderRequest, EditGenderRequest } from "../dto";
import { GenderOutput } from "../../application/dtos";
import { unwrap } from "src/shared/presentation/unwrap-result";

@Controller("gender")
export class GenderController {
    constructor(
        private readonly createGenderUseCase: CreateGenderUseCase,
        private readonly editGenderUseCase: EditGenderUseCase,
        private readonly getAllGenderUseCase: GetAllGenderUseCase,
        private readonly getGenderByIdUseCase: GetGenderByIdUseCase,
        private readonly deleteGenderUseCase: DeleteGenderUseCase,
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    public async create(@Body() body: CreateGenderRequest): Promise<GenderOutput> {
        return unwrap(await this.createGenderUseCase.execute({ name: body.genderName }));
    }

    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    public async edit(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() body: EditGenderRequest
    ): Promise<GenderOutput> {
        const name = body.genderName;
        return unwrap(await this.editGenderUseCase.execute({ id, name }));
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    public async getAll(): Promise<GenderOutput[]> {
        return unwrap(await this.getAllGenderUseCase.execute());
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    public async getById(@Param('id', ParseUUIDPipe) id: string): Promise<GenderOutput> {
        return unwrap(await this.getGenderByIdUseCase.execute({ id }));
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    public async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
        return unwrap(await this.deleteGenderUseCase.execute({ id }));
    }
}
