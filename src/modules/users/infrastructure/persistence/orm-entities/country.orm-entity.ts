import { Column, Entity, PrimaryColumn } from "typeorm";

/**
 * Database shape for country entity
 */
@Entity({name: "countries"})
export class CountryOrmEntity {

    @PrimaryColumn({type: "char", length: 36})
    id!: string;

    @Column({name: "country_name", type: "varchar", length: 255})
    countryName!: string;

    @Column({name: "country_code", type: "char",  length: 3})
    countryCode!: number;

    @Column({name: "created_at", type: "datetime", precision: 3})
    createdAt!: Date;

    @Column({name: "updated_at", type: "datetime", precision: 3})
    updatedAt!: Date;
}