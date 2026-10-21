import { UniqueId } from "src/shared/domain/unique-id";
import { Gender } from "../../domain/entities";
import { GenderOrmEntity } from "../../infrastructure/persistence/orm-entities";

/**
 * Gender mapper
 */
export class GenderMapper {

    public static toDomain(row: GenderOrmEntity): Gender {
        return Gender.reconstitute({
            genderName: row.genderName,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
            id: UniqueId.createFromString(row.id)
        });
    }

    public static toOrm(gender: Gender): GenderOrmEntity {
        const row = new GenderOrmEntity();
        row.createdAt = gender.createdAt;
        row.genderName = gender.genderName;
        row.id = gender.id.value;
        row.updatedAt = gender.updatedAt;
        return row;
    }
}