import { Column, Entity, Index, PrimaryColumn } from "typeorm";

/**
 * Database shape for document entity
 */
@Entity({name: "documents"})
export class DocumentOrmEntity {

    @PrimaryColumn({type:"char", length: 36})
    id!: string;

    @Index('idx_documents_person_id', {unique: false})
    @Column({name: "person_id", type: "char", length: 36})
    personId!: string;

    @Index("idx_documents_document_type_id", {unique: false})
    @Column({name: "document_type_id", type: "char", length: 36})
    documentTypeId!: string;

    @Column({name: "document_name", type: "varchar", length: 255})
    documentName!: string;

    @Column({name: "document_link", type: "varchar", length: 255})
    documentLink!: string;

    @Column({type: "boolean", default: false})
    verified!: boolean;

    @Column({name: "created_at", type: "datetime", precision: 3})
    createdAt!: Date;

    @Column({name: "updated_at", type: "datetime", precision: 3})
    updatedAt!: Date;
}