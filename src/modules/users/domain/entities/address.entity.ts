import { Result } from "src/shared/domain/result";
import { UniqueId } from "src/shared/domain/unique-id";
import { BaseEntity } from "src/shared/domain/base-entity";

type AddressProps = {
    id?: UniqueId;
    country: UniqueId;
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
    private _country: UniqueId;
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
        this._country = props.country;
        this._state = props.state;
        this._city = props.city;
        this._streetName = props.streetName;
        this._postalCode = props.postalCode;
        this._buildingCode = props.buildingCode;
        this._flatCode = props.flatCode;
    }
}