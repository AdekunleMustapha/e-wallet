import { BaseEntity } from "src/shared/domain/base-entity";
import { Result } from "src/shared/domain/result";
import { UniqueId } from "src/shared/domain/unique-id";

type GenderProps = {
    id?: UniqueId;
    genderName: string;
    createdAt?: Date;
    updatedAt?: Date;
}

/**
 * Gender Entity
 */
export class Gender extends BaseEntity {
    private _genderName: string;

    private constructor(props: GenderProps) {
        super({
            id: props.id,
            createdAt: props.createdAt,
            updatedAt: props.updatedAt
        });
        this._genderName = props.genderName;
    }
}