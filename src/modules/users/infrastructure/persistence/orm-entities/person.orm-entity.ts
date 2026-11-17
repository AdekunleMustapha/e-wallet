import { Entity, Column, PrimaryColumn, Index } from "typeorm";

/**
 * Data base shape of Person
 */
@Entity({name: "people"})
export class PersonOrmEntity {

    @PrimaryColumn({type: "char", length: 36})
    id!: string;

    @Column({name: "first_name", type: "varchar", length: 255})
    firstName!: string;

    @Column({name: "last_name", type: "varchar", length: 255})
    lastName!: string;

    @Column({name: "middle_name", type: "varchar", length: 255, nullable: true})
    middleName?: string;

    @Column({type: "date"})
    dob!: string;

    @Index('idx_persons_email', {unique: true})
    @Column({type: "varchar", length: 255})
    email!: string;

    @Index('idx_people_phone_number',{unique: true})
    @Column({name: "phone_number", type: "varchar", length: 15})
    phoneNumber!: string;

    @Column({type: "varchar", length: 10})
    gender!: string;

    @Column({type: "varchar", length: 100})
    country!: string;

    @Column({type: "varchar", length: 100})
    state!: string;

    @Column({type: "varchar", length: 100})
    city!: string;

    @Column({name: "address_line_1", type: "varchar", length: 255})
    addressLine1!: string;

    @Column({name: "postal_code", type: "varchar", length: 10, nullable: true})
    postalCode?: string;

    @Column({type: "smallint", default: 1})
    tier!: number;

    @Column({name: "password_hash", type: "char", length: 64})
    passwordHash!: string;

    @Column({name: "nin_hash", type: "char", length: 64, nullable: true})
    ninHash!: string | null;

    @Column({name: "bvn_hash", type: "char", length: 64, nullable: true})
    bvnHash!: string | null;

    @Column({name: "created_at", type: "timestamp", precision: 3})
    createdAt!: Date;

    @Column({name: "updated_at", type: "timestamp", precision: 3})
    updatedAt!: Date;
}