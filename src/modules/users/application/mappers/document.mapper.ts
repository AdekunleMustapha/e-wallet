import { DocumentOrmEntity } from "../../infrastructure/persistence/orm-entities";
import { Document } from "../../domain/entities";
import { UniqueId } from "src/shared/domain/unique-id";

/**
 * Document mapper 
 */
export class DocumentMapper {

    public static toDomain(row: DocumentOrmEntity): Document {
        return Document.reconstitute({
            documentLink: row.documentLink,
            documentName: row.documentName,
            documentType: UniqueId.createFromString(row.documentType),
            personId: UniqueId.createFromString(row.personId),
            verified: row.verified,
            createdAt: row.createdAt,
            id: UniqueId.createFromString(row.id),
            updatedAt: row.updatedAt
        });
    }

    public static toOrm(document: Document): DocumentOrmEntity {
        const row = new DocumentOrmEntity();
        row.createdAt = document.createdAt;
        row.documentLink = document.documentLink;
        row.documentName = document.documentName;
        row.documentType = document.documentType.value;
        row.id = document.id.value;
        row.personId = document.personId.value;
        row.updatedAt = document.updatedAt;
        row.verified = document.verified;
        return row;
    }
}