import { BaseEntity } from "src/shared/domain/base-entity";
import { ValidationError } from "src/shared/domain/errors";
import { Result } from "src/shared/domain/result";
import { UniqueId } from "src/shared/domain/unique-id";

type DocumentTypeProps = {
    id?: UniqueId;
    documentTypeName: string;
    createdAt?: Date;
    updatedAt?: Date;
}

/**
 * Document Type Entity, determines the document types the app allows
 */
export class DocumentType extends BaseEntity {
    private _documentTypeName: string;

    private constructor(props: DocumentTypeProps) {
        super({
            id: props.id,
            createdAt: props.createdAt,
            updatedAt: props.updatedAt
        });
        this._documentTypeName = props.documentTypeName;
    }

    public static create(props: Omit<DocumentTypeProps, 'id' | 'createdAt' | 'updatedAt'>): Result<DocumentType> {
        const documentTypeName = props.documentTypeName.trim();

        if(documentTypeName.length === 0 || documentTypeName.length > 100) {
            return Result.fail(new ValidationError("Document type name can't be greater than 100 characters or 0 characters"));
        }

        return Result.ok(new DocumentType(props));
    }

    public static reconstitute(props: DocumentTypeProps): DocumentType {
        return new DocumentType(props);
    }

    get documentTypeName(): string {
        return this._documentTypeName;
    }
}