import { BaseEntity } from "src/shared/domain/base-entity";
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
}