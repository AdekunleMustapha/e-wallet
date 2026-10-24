import { Column, Entity, PrimaryColumn } from "typeorm";

/**
 * Database shape for document type entity
 */
@Entity({name: "document_types"})
export class DocumentTypeOrmEntity {

    @PrimaryColumn({type: "char", length: 36})
    id!: string;

    @Column({name: "document_type_name", type: "varchar", length: 255, unique: true})
    documentTypeName!: string;

    @Column({name: "created_at", type: "datetime", precision: 3})
    createdAt!: Date;

    @Column({name: "updated_at", type: "datetime", precision: 3})
    updatedAt!: Date;
}