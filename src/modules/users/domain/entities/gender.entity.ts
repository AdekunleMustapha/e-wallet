import { ValidationError } from "src/shared/domain/errors";
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

    public static create(props: Omit<GenderProps, 'id' | 'createdAt' | 'updatedAt'>): Result<Gender> {
        const genderName = props.genderName.trim();

        if(genderName.length === 0 || genderName.length > 50) {
            return Result.fail(new ValidationError("Gender must be between 1 to 50 characters"));
        }

        return Result.ok(new Gender({genderName}));
    }

    public static reconstitute(props: GenderProps): Gender {
        return new Gender(props);
    }

    get genderName(): string {
        return this._genderName;
    }
}