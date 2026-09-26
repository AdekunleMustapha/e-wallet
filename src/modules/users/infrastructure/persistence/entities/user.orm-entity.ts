import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity('users')
export class UserORMEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    first_name: string

    @Column()
    last_name: string

    @Column()
    email: string

    @Column()
    pin: string

    @Column()
    nin_hash: string

    @Column()
    bvn: string
}