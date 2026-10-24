import { Result } from "src/shared/domain/result";
import { UniqueId } from "src/shared/domain/unique-id";
import { BaseEntity } from "src/shared/domain/base-entity";
import { ValidationError } from "src/shared/domain/errors";

type AddressProps = {
    id?: UniqueId;
    countryId: UniqueId;
    state: string;
    city: string;
    streetName: string;
    postalCode?: string;
    buildingCode?: string;
    flatCode?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

/**
 * Address Entity that stores the different address types of persons
 * Can be re-used if the address matches another users address
 */
export class Address extends BaseEntity {
    private _countryId: UniqueId;
    private _state: string;
    private _city: string;
    private _streetName: string;
    private _postalCode: string | undefined;
    private _buildingCode: string | undefined;
    private _flatCode: string | undefined;

    private constructor(props: AddressProps){
        super({
            id: props.id,
            createdAt: props.createdAt,
            updatedAt: props.updatedAt
        });
        this._countryId = props.countryId;
        this._state = props.state;
        this._city = props.city;
        this._streetName = props.streetName;
        this._postalCode = props.postalCode;
        this._buildingCode = props.buildingCode;
        this._flatCode = props.flatCode;
    }


    public static create(props: AddressProps): Result<Address> {
        const city = props.city.trim();
        if(city.length === 0 || city.length > 100) {
            return Result.fail(new ValidationError("City must be between 1 to 100 characters"));
        }

        const state = props.state.trim();
        if(state.length === 0 || state.length > 100) {
            return Result.fail(new ValidationError("State must be between 1 to 100 characters"));
        }

        const streetName = props.streetName.trim();
        if(streetName.length === 0 || streetName.length > 100) {
            return Result.fail(new ValidationError("Street name must be between 1 to 100 characters"));
        }

        if(props.postalCode) {
            if(!/^\d{5,9}$/.test(props.postalCode)) {
                return Result.fail(new ValidationError("Postal code must be between 5 to 9 digits"));
            }
        }

        if(props.flatCode?.trim()) {
            if(!/^[A-Za-z0-9-]{1,10}$/.test(props.flatCode.trim())) {
                return Result.fail(new ValidationError("Invalid flat code"));
            }
        }

        if(props.buildingCode?.trim()) {
            if(!/^[A-Za-z0-9-]{1,10}$/.test(props.buildingCode.trim())) {
                return Result.fail(new ValidationError("Invalid flat code"));
            }
        }

        return Result.ok(new Address({
            city,
            countryId: props.countryId,
            state,
            streetName,
            buildingCode: props.buildingCode?.trim(),
            flatCode: props.flatCode?.trim(),
            postalCode: props.postalCode?.trim()
        }));
    }

    public static reconstitute(props: AddressProps): Address {
        return new Address(props);
    }

    get city(): string {
        return this._city;
    }

    get countryId(): UniqueId {
        return this._countryId;
    }

    get state(): string {
        return this._state;
    }

    get streetName(): string {
        return this._streetName;
    }

    get buildingCode(): string | undefined {
        return this._buildingCode;
    }

    get flatCode(): string | undefined {
        return this._flatCode;
    }

    get postalCode(): string | undefined {
        return this._postalCode;
    }
}