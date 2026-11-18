import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterPeopleTableAddCityAndStateConstraint1794967449450 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE people
                ADD CONSTRAINT fk_people_state_city
                FOREIGN KEY (state, city) REFERENCES cities (state, city)
                ON UPDATE CASCADE
                ON DELETE RESTRICT
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE people DROP CONSTRAINT IF EXISTS fk_people_state_city`);
    }

}
