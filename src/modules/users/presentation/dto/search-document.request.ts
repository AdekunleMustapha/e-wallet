import { Type } from "class-transformer";
import { IsBoolean, IsOptional, IsString, IsUUID } from "class-validator";
import { PaginationRequest } from "./pagination.request";

export class SearchDocumentRequest extends PaginationRequest {
    @IsOptional()
    @IsUUID()
    personId?: string;

    @IsOptional()
    @IsUUID()
    documentTypeId?: string;

    @IsOptional()
    @IsUUID()
    documentType?: string;

    @IsOptional()
    @IsString()
    documentName?: string;

    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    verified?: boolean;
}
