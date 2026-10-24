import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDocumentAndDocumentType1792802381972 implements MigrationInterface {
    name = "CreateDocumentAndDocumentType1792802381972";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE document_types (
                id CHAR(36) NOT NULL PRIMARY KEY,
                document_type_name VARCHAR(255) NOT NULL UNIQUE,
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
                updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        
        await queryRunner.query(`
            CREATE TABLE documents (
                id CHAR(36) NOT NULL PRIMARY KEY,
                person_id CHAR(36) NOT NULL REFERENCES persons (id),
                document_type_id CHAR(36) NOT NULL REFERENCES document_types (id),
                document_name VARCHAR(255) NOT NULL,
                document_link VARCHAR(255) NOT NULL,
                verified BOOLEAN NOT NULL DEFAULT FALSE,
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
                updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
                KEY idx_documents_person_id (person_id),
                KEY idx_documents_document_type_id (document_type_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE IF EXISTS documents");
        await queryRunner.query("DROP TABLE IF EXISTS document_types");
    }

}
