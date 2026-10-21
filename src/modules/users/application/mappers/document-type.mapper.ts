import { UniqueId } from "src/shared/domain/unique-id";
import { DocumentType } from "../../domain/entities";
import { DocumentTypeOrmEntity } from "../../infrastructure/persistence/orm-entities";

/**
 * Document Type mapper
 */
export class DocumentTypeMapper {

    public static toDomain(row: DocumentTypeOrmEntity): DocumentType {
        return DocumentType.reconstitute({
            documentTypeName: row.documentTypeName,
            createdAt: row.createdAt,
            id: UniqueId.createFromString(row.id),
            updatedAt: row.updatedAt
        });
    }

    public static toOrm(documentType: DocumentType): DocumentTypeOrmEntity {
        const row = new DocumentTypeOrmEntity();
        row.createdAt = documentType.createdAt;
        row.documentTypeName = documentType.documentTypeName;
        row.id = documentType.id.value;
        row.updatedAt = documentType.updatedAt;
        return row;
    }
}