import { Result } from "src/shared/domain/result";
import { Person } from "../../domain/entities";
import { BVNHash, DOB, Email, Name, NINHash } from "../../domain/value-objects";
import { PersonOrmEntity } from "../../infrastructure/persistence/orm-entities";
import { UniqueId } from "src/shared/domain/unique-id";

/**
 * Since records stored in db row are already validated before recording
 * so most cases there shouldn't be an error when getting the value object
 * In cases where errors occur, an error is thrown for the class that uses it,
 * to catch 
 */
function must<T>(result: Result<T>, field: string, id: string): T {
    if(result.isFailure) {
        throw new Error(`Error found in person mapper\nField: ${field}\nId: ${id}\nTable: Persons`);
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
            dob: must(DOB.create({year, month, day}), 'dob', row.id),
            email: must(Email.create(row.email), 'email', row.id),
            firstName: must(Name.create(row.firstName), 'first_name', row.id),
            lastName: must(Name.create(row.lastName), 'last_name', row.id),
            genderId: UniqueId.createFromString(row.genderId),
            addressId: row.addressId? UniqueId.createFromString(row.addressId) : undefined,
            bvnHash: row.bvnHash? must(BVNHash.create(row.bvnHash), 'bvn_hash', row.id) : undefined,
            createdAt: row.createdAt,
            id: UniqueId.createFromString(row.id),
            ninHash: row.ninHash ? must(NINHash.create(row.ninHash), 'nin_hash', row.id) : undefined,
            updatedAt: row.updatedAt
        });
    }

    public static toOrm(person: Person): PersonOrmEntity {
        const row = new PersonOrmEntity();
        row.addressId = person.addressId?.value?? null;
        row.bvnHash = person.bvnHash?.hash?? null;
        row.createdAt = person.createdAt;
        row.updatedAt = person.updatedAt;
        row.dob = person.dob.toDateString();
        row.email = person.email.value;
        row.firstName = person.firstName.name;
        row.lastName = person.lastName.name;
        row.genderId = person.genderId.value;
        row.id = person.id.value;
        row.ninHash = person.ninHash?.hash?? null;
        return row;
    }
}