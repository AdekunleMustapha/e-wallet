import { UniqueId } from "src/shared/domain/unique-id";
import { Address } from "../../domain/entities";
import { AddressOrmEntity } from "../../infrastructure/persistence/orm-entities";

/**
 * Address mapper
 */
export class AddressMapper {

    public static toDomain(row: AddressOrmEntity): Address {
        return Address.reconstitute({
            city: row.city,
            countryId: UniqueId.createFromString(row.countryId),
            state: row.state,
            streetName: row.streetName,
            buildingCode: row.buildingCode?? undefined,
            createdAt: row.createdAt,
            flatCode: row.flatCode?? undefined,
            id: UniqueId.createFromString(row.id),
            postalCode: row.postalCode?? undefined,
            updatedAt: row.updatedAt
        });
    }

    public static toOrm(address: Address): AddressOrmEntity {
        const row = new AddressOrmEntity();
        row.buildingCode = address.buildingCode?? null;
        row.city = address.city;
        row.countryId = address.countryId.value;
        row.createdAt = address.createdAt;
        row.flatCode = address.flatCode?? null;
        row.id = address.id.value;
        row.postalCode = address.postalCode?? null;
        row.state = address.state;
        row.streetName = address.streetName;
        row.updatedAt = address.updatedAt;
        return row;
    }
}