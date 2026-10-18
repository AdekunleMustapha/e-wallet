import { BaseEntity } from "src/shared/domain/base-entity";
import { ValidationError } from "src/shared/domain/errors";
import { Result } from "src/shared/domain/result";
import { UniqueId } from "src/shared/domain/unique-id";

type CountryProps = {
    id?: UniqueId;
    countryName: string;
    countryCode: number;
    createdAt?: Date;
    updatedAt?: Date;
}

/**
 * Country Entity, decides the supported countries the app allows
 */
export class Country extends BaseEntity {
    private _countryName: string;
    private _countryCode: number;

    private constructor(props: CountryProps) {
        super({
            id: props.id,
            createdAt: props.createdAt,
            updatedAt: props.updatedAt
        });
        this._countryCode = props.countryCode;
        this._countryName = props.countryName;
    }

    public static create(props: Omit<CountryProps, 'id' | 'createdAt'| 'updatedAt'>): Result<Country> {
        const countryName = props.countryName.trim();
        const countryCode = props.countryCode;

        if(countryName.length === 0 || countryName.length > 255) {
            return Result.fail(new ValidationError("Country name must not be 0 or greater than 255 characters"));
        }

        if(!/^\d{3}$/.test(countryCode.toString())) {
            return Result.fail(new ValidationError("Country code must equal 3 digits"));
        }

        return Result.ok(new Country({countryCode, countryName}));
    }

    public static reconstitute(props: CountryProps): Country {
        return new Country(props);
    }

    get countryName(): string {
        return this._countryName;
    }

    get countryCode(): number {
        return this._countryCode;
    }
}