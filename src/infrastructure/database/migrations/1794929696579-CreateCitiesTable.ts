import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCitiesTable1794929696579 implements MigrationInterface {
    name = "CreateCitiesTable1794929696579";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS cities (
                id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
                city VARCHAR(255) NOT NULL,
                state VARCHAR(255) NOT NULL,
                country VARCHAR(255) NOT NULL DEFAULT 'Nigeria',
                created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
            );

            CREATE UNIQUE INDEX IF NOT EXISTS idx_cities_state_city ON cities(state, city);
            CREATE INDEX IF NOT EXISTS idx_cities_city ON cities(city);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS cities`);
    }

}
