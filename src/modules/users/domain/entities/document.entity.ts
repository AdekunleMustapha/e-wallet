import { ValidationError } from "src/shared/domain/errors";
import { BaseEntity } from "src/shared/domain/base-entity";
import { Result } from "src/shared/domain/result";
import { UniqueId } from "src/shared/domain/unique-id";

type DocumentProps = {
    id?: UniqueId;
    personId: UniqueId;
    documentType: UniqueId;
    documentName: string;
    documentLink: string;
    verified: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

/**
 * Document Entity, keeps track of user submitted docs
 * By their types, their links and if they are verified
 */
export class Document extends BaseEntity {
    private _personId: UniqueId;
    private _documentType: UniqueId;
    private _documentName: string;
    private _documentLink: string;
    private _verified: boolean;

    private constructor(props: DocumentProps) {
        super({
            id: props.id,
            createdAt: props.createdAt,
            updatedAt: props.updatedAt
        });
        this._personId = props.personId;
        this._documentType = props.documentType;
        this._documentName = props.documentName;
        this._documentLink = props.documentLink;
        this._verified = props.verified;
    }

    public static create (props: DocumentProps): Result<Document> {
        const documentName = props.documentName.trim();
        if(documentName.length === 0 || documentName.length > 255) {
            return Result.fail(new ValidationError("Document name should be between 1 to 255 characters"));
        }

        return Result.ok(new Document({
            documentLink: props.documentLink.trim(),
            documentName: documentName,
            documentType: props.documentType,
            personId: props.personId,
            verified: false // documents are not verified by default
        }));
    }

    public static reconstitute(props: DocumentProps): Document {
        return new Document(props);
    }

    public markAsVerified(): void {
        this._verified = true;
    }

    get documentLink(): string {
        return this._documentLink;
    }

    get documentName(): string {
        return this._documentName;
    }

    get documentType(): UniqueId {
        return this._documentType;
    }

    get personId(): UniqueId {
        return this._personId;
    }

    get verified(): boolean {
        return this._verified;
    }
}