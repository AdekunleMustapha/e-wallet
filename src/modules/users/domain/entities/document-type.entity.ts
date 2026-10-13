import { BaseEntity } from "src/shared/domain/base-entity";
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
}