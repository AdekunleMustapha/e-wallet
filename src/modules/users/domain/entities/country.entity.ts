import { BaseEntity } from "src/shared/domain/base-entity";
import { ValidationError } from "src/shared/domain/errors";
import { Result } from "src/shared/domain/result";
import { UniqueId } from "src/shared/domain/unique-id";

type CountryProps = {
    id?: UniqueId;
    countryName: string;
    countryCode: string;
    createdAt?: Date;
    updatedAt?: Date;
}

/**
 * Country Entity, decides the supported countries the app allows
 */
export class Country extends BaseEntity {
    private _countryName: string;
    private _countryCode: string;

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

        if(!/^\d{3}$/.test(countryCode)) {
            return Result.fail(new ValidationError("Country code must equal 3 digits"));
        }

        return Result.ok(new Country({countryCode, countryName}));
    }

    public static reconstitute(props: CountryProps): Country {
        return new Country(props);
    }

    public update(props: {
        countryCode?: string;
        countryName?: string;
    }): Result<void> {
        if(props.countryName) {
            const countryName = props.countryName.trim();
            if(countryName.length === 0 || countryName.length > 255) {
                return Result.fail(new ValidationError("Name must be between 1 to 255 characters"));
            }
            this._countryName = countryName;
        }
        
        if(props.countryCode) {
            const countryCode = props.countryCode.trim();
            if(!/^\d{3}$/.test(countryCode)) {
                return Result.fail(new ValidationError("Country code must equal 3 digits"));
            }
            this._countryCode = countryCode;
        }
        this.updateTimestamp();
        return Result.ok();
    }

    get countryName(): string {return this._countryName;}

    get countryCode(): string {return this._countryCode;}
}