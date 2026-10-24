import { Entity, Column, PrimaryColumn, Index } from "typeorm";

/**
 * Data base shape of Person
 */
@Entity({name: "persons"})
export class PersonOrmEntity {

    @PrimaryColumn({type: "char", length: 36})
    id!: string;

    @Column({name: "first_name", type: "varchar", length: 255})
    firstName!: string;

    @Column({name: "last_name", type: "varchar", length: 255})
    lastName!: string;

    @Column({type: "date"})
    dob!: string;

    @Index('idx_persons_email', {unique: true})
    @Column({type: "varchar", length: 255})
    email!: string;

    @Index('idx_persons_gender_id', {unique: false})
    @Column({name: "gender_id", type: "char", length: 36})
    genderId!: string;

    @Column({name: "address_id", type: "char", length: 36, nullable: true})
    addressId!: string | null;

    @Column({name: "nin_hash", type: "char", length: 64, nullable: true})
    ninHash!: string | null;

    @Column({name: "bvn_hash", type: "char", length: 64, nullable: true})
    bvnHash!: string | null;

    @Column({name: "created_at", type: "datetime", precision: 3})
    createdAt!: Date;

    @Column({name: "updated_at", type: "datetime", precision: 3})
    updatedAt!: Date;
}