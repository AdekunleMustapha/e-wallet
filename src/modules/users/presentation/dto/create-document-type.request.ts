import { IsOptional, IsString, MaxLength } from "class-validator";

export class CreateDocumentTypeRequest {
    @IsString()
    @MaxLength(100)
    documentTypeName!: string;
}
