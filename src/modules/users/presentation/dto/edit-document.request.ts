import { IsBoolean, IsOptional, IsString, MaxLength } from "class-validator";

export class EditDocumentRequest {
    @IsOptional()
    @IsString()
    @MaxLength(255)
    documentName?: string;

    @IsOptional()
    @IsBoolean()
    verified?: boolean;
}
