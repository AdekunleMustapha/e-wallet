import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateGenderAndPersons1792795235535 implements MigrationInterface {
    name = 'CreateGenderAndPersons';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE genders (
                id CHAR(36) NOT NULL PRIMARY KEY,
                gender_name VARCHAR(50) NOT NULL UNIQUE,
                created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
                updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
            );
        `);

        await queryRunner.query(`
            CREATE TABLE persons (
                id CHAR(36) NOT NULL PRIMARY KEY,
                first_name VARCHAR(255) NOT NULL,
                last_name VARCHAR(255) NOT NULL,
                dob DATE NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                gender_id CHAR(36) NOT NULL REFERENCES genders(id),
                address_id CHAR(36),
                nin_hash CHAR(64) UNIQUE,
                bvn_hash CHAR(64) UNIQUE,
                created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
                updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
            );

            CREATE INDEX idx_persons_email ON persons(email);
            CREATE INDEX idx_persons_gender_id ON persons(gender_id);
            CREATE INDEX idx_persons_address_id ON persons(address_id);
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE IF EXISTS persons');
        await queryRunner.query('DROP TABLE IF EXISTS genders');
    }

}
