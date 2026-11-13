import { IsNotEmpty, IsString, IsUUID, MaxLength } from "class-validator";

export class CreateDocumentRequest {
    @IsUUID()
    @IsNotEmpty()
    personId!: string;

    @IsUUID()
    @IsNotEmpty()
    documentTypeId!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    documentName!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    documentLink!: string;
}
