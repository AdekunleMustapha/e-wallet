import { Column, Entity, PrimaryColumn } from "typeorm";

/**
 * Data base shape of gender. No rules here
 */
@Entity({name: "genders"})
export class GenderOrmEntity {

    @PrimaryColumn({ type: "char", length: 36})
    id!: string;

    @Column({ name: "gender_name", type: "varchar", length: 50})
    genderName!: string;

    @Column({ name: "created_at", type: "timestamp", precision: 3})
    createdAt!: Date;

    @Column({name: "updated_at", type: "timestamp", precision: 3})
    updatedAt!: Date;
}