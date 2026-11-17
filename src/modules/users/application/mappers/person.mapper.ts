import { Result } from "src/shared/domain/result";
import { Person } from "../../domain/entities";
import { BVNHash, DOB, Email, Name, NINHash, PasswordHash, PhoneNumber } from "../../domain/value-objects";
import { PersonOrmEntity } from "../../infrastructure/persistence/orm-entities";
import { UniqueId } from "src/shared/domain/unique-id";
import { Country, Gender, Tier } from "../../domain/enums";

/**
 * Since records stored in db row are already validated before recording,
 * in most cases there shouldn't be an error when getting the value object.
 * In cases where errors occur, an error is thrown for the class that uses it to catch.
 */
function must<T>(result: Result<T>, field: string, id: string): T {
    if (result.isFailure) {
        throw new Error(`Error found in person mapper\nField: ${field}\nId: ${id}\nTable: people`);
    }
    return result.value;
}

/**
 * Person mapper
 */
export class PersonMapper {
    
    public static toDomain(row: PersonOrmEntity): Person {
        const [year, month, day] = row.dob.split('-');

        return Person.reconstitute({
            id: UniqueId.createFromString(row.id),
            firstName: must(Name.create(row.firstName), 'first_name', row.id),
            lastName: must(Name.create(row.lastName), 'last_name', row.id),
            middleName: row.middleName ? must(Name.create(row.middleName), 'middle_name', row.id) : undefined,
            dob: must(DOB.create({ year, month, day }), 'dob', row.id),
            email: must(Email.create(row.email), 'email', row.id),
            phoneNumber: must(PhoneNumber.create(row.phoneNumber), 'phone_number', row.id),
            gender: row.gender as Gender,
            country: row.country as Country,
            state: row.state,
            city: row.city,
            addressLine1: row.addressLine1,
            postalCode: row.postalCode ?? undefined,
            tier: row.tier as Tier,
            passwordHash: must(PasswordHash.create(row.passwordHash), 'password_hash', row.id),
            bvnHash: row.bvnHash ? must(BVNHash.create(row.bvnHash), 'bvn_hash', row.id) : undefined,
            ninHash: row.ninHash ? must(NINHash.create(row.ninHash), 'nin_hash', row.id) : undefined,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
        });
    }

    public static toOrm(person: Person): PersonOrmEntity {
        const row = new PersonOrmEntity();
        row.id = person.id.value;
        row.firstName = person.firstName.name;
        row.lastName = person.lastName.name;
        row.middleName = person.middleName?.name;
        row.dob = person.dob.toDateString();
        row.email = person.email.value;
        row.phoneNumber = person.phoneNumber.value;
        row.gender = person.gender;
        row.country = person.country;
        row.state = person.state;
        row.city = person.city;
        row.addressLine1 = person.addressLine1;
        row.postalCode = person.postalCode;
        row.tier = person.tier;
        row.passwordHash = person.passwordHash.hash;
        row.ninHash = person.ninHash?.hash ?? null;
        row.bvnHash = person.bvnHash?.hash ?? null;
        row.createdAt = person.createdAt;
        row.updatedAt = person.updatedAt;
        return row;
    }
}
