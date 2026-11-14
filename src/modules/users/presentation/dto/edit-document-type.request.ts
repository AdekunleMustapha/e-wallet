import { IsOptional, IsString, MaxLength } from "class-validator";

export class EditDocumentTypeRequest {
    @IsString()
    @MaxLength(100)
    documentTypeName!: string;
}
