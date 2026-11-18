import { City } from "../../domain/entities";
import { Country, NigeriaState } from "../../domain/enums";
import { Name } from "../../domain/value-objects";
import { CityOrmEntity } from "../../infrastructure/persistence/orm-entities";
import { must } from "./person.mapper";

export class CityMapper {
    
    public static toDomain(row: CityOrmEntity): City {
        return City.reconstitute({
            city: must(Name.create(row.city), "city", row.city),
            country: row.country as Country,
            state: row.state as NigeriaState,
            createdAt: row.createdAt,
            id: row.id
        })
    }

    public static toOrm(city: City): CityOrmEntity {
        const row = new CityOrmEntity();
        row.id = city.id.value;
        row.city = city.city.name;
        row.country = city.country;
        row.state = city.state;
        row.createdAt = city.createdAt;
        return row;
    }
}