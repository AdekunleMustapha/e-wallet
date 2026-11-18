import { Column, Entity, Index, PrimaryColumn } from "typeorm";

@Entity({name: 'cities'})
@Index('idx_cities_state_city', ['state', 'city'], {unique: true})
export class CityOrmEntity {
    @PrimaryColumn({type: "char", length: 36})
    id!: string;

    @Index('idx_cities_city', {unique: false})
    @Column({type: "varchar", length: 255})
    city!: string;

    @Column({type: "varchar", length: 255})
    state!: string;

    @Column({type: "varchar", length: 255})
    country!: string;

    @Column({name: "created_at", type: "timestamp", precision: 3})
    createdAt!: Date;
}
