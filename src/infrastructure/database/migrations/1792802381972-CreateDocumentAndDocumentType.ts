import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDocumentAndDocumentType1792802381972 implements MigrationInterface {
    name = "CreateDocumentAndDocumentType";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE document_types (
                id CHAR(36) NOT NULL PRIMARY KEY,
                document_type_name VARCHAR(255) NOT NULL UNIQUE,
                created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
                updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
            );
        `);
        
        await queryRunner.query(`
            CREATE TABLE documents (
                id CHAR(36) NOT NULL PRIMARY KEY,
                person_id CHAR(36) NOT NULL REFERENCES persons (id),
                document_type_id CHAR(36) NOT NULL REFERENCES document_types (id),
                document_name VARCHAR(255) NOT NULL,
                document_link VARCHAR(255) NOT NULL,
                verified BOOLEAN NOT NULL DEFAULT FALSE,
                created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
                updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
            );

            CREATE INDEX idx_documents_person_id ON documents(person_id);
            CREATE INDEX idx_documents_document_type_id ON documents(document_type_id);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE IF EXISTS documents");
        await queryRunner.query("DROP TABLE IF EXISTS document_types");
    }

}
