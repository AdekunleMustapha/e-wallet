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
}