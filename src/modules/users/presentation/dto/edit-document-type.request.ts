import { IsOptional, IsString, MaxLength } from "class-validator";

export class EditDocumentTypeRequest {
    @IsOptional()
    @IsString()
    @MaxLength(100)
    documentTypeName?: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    name?: string;
}
