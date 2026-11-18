import { UniqueId } from "src/shared/domain/unique-id"
import { Country, NigeriaState } from "../enums"
import { BaseEntity } from "src/shared/domain/base-entity"
import { Result } from "src/shared/domain/result"
import { Name } from "../value-objects"

type CityProps = {
    id?: string,
    city: Name,
    state: NigeriaState,
    country: Country,
    createdAt?: Date
}

export class City extends BaseEntity {
    private readonly _city: Name;
    private readonly _state: NigeriaState;
    private readonly _country: Country;

    constructor(props: CityProps){
        super({
            id: props.id? UniqueId.createFromString(props.id) : undefined,
            createdAt: props.createdAt
        });
        this._city = props.city;
        this._country = props.country;
        this._state = props.state;
    }

    public static create(props: CityProps): Result<City> {
        return Result.ok(new City(props));
    }

    public static reconstitute(props: CityProps): City {
        return new City(props);
    }

    get city(): Name {return this._city;}
    get state(): NigeriaState {return this._state;}
    get country(): Country {return this._country;}
}