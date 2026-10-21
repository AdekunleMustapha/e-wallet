import { UniqueId } from "src/shared/domain/unique-id";
import { Country } from "../../domain/entities";
import { CountryOrmEntity } from "../../infrastructure/persistence/orm-entities";

/**
 * Country Mapper
 */
export class CountryMapper {

    public static toDomain(row: CountryOrmEntity): Country {
        return Country.reconstitute({
            countryCode: row.countryCode,
            countryName: row.countryName,
            createdAt: row.createdAt,
            id: UniqueId.createFromString(row.id),
            updatedAt: row.updatedAt
        });
    }

    public static toOrm(country: Country): CountryOrmEntity {
        const row = new CountryOrmEntity();
        row.id = country.id.value;
        row.countryCode = country.countryCode;
        row.countryName = country.countryName;
        row.createdAt = country.createdAt;
        row.updatedAt = country.updatedAt;
        return row;
    }
}