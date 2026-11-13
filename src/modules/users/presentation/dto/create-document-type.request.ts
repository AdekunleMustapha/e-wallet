import { IsOptional, IsString, MaxLength } from "class-validator";

export class CreateDocumentTypeRequest {
    @IsOptional()
    @IsString()
    @MaxLength(100)
    documentTypeName?: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    name?: string;
}
