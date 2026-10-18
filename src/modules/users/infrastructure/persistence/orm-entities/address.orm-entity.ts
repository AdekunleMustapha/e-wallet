import { Entity, Column, PrimaryColumn, Index } from "typeorm";

/**
 * Database shape for address entity
 */
@Entity({name: "addresses"})
export class AddressOrmEntity {

    @PrimaryColumn({type: "char", length: 36})
    id!: string;

    @Index('idx_addresses_country', {unique: false})
    @Column({type: "char", length: 36})
    country!: string;

    @Column({type: "varchar", length: 100})
    state!: string;

    @Column({type: "varchar", length: 100})
    city!: string;

    @Column({type: "varchar", length: 100})
    streetName!: string;

    @Column({name: "postal_code", type: "varchar", length: 9, nullable: true})
    postalCode!: string | null;

    @Column({name: "building_code", type: "varchar", length: 10, nullable: true})
    buildingCode!: string | null;

    @Column({name: "flat_code", type: "varchar", length: 10, nullable: true})
    flatCode!: string | null;

    @Column({name: "created_at", type: "datetime", precision: 3})
    createdAt!: Date;
    
    @Column({name: "updated_at", type: "datetime", precision: 3})
    updatedAt!: Date;
}