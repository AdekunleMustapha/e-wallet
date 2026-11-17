import { MigrationInterface, QueryRunner } from "typeorm";

export class DropCountryAddressAndGenderTableAlterPersonsTable1794856959164 implements MigrationInterface {
    name = "DropCountryAddressAndGenderTableAlterPersonsTable1794856959164";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE persons
                DROP COLUMN gender_id,
                DROP COLUMN address_id,
                ADD COLUMN middle_name VARCHAR(255),
                ADD COLUMN gender VARCHAR(10) NOT NULL,
                ADD COLUMN country VARCHAR(100) NOT NULL,
                ADD COLUMN state VARCHAR(100) NOT NULL,
                ADD COLUMN city VARCHAR(100) NOT NULL,
                ADD COLUMN address_line_1 VARCHAR (255) NOT NULL,
                ADD COLUMN postal_code VARCHAR(10),
                ADD COLUMN tier SMALLINT NOT NULL DEFAULT 1 CONSTRAINT chk_people_tier CHECK (tier BETWEEN 1 AND 3),
                ADD COLUMN password_hash CHAR(64) NOT NULL,
                ADD COLUMN phone_number VARCHAR(15) NOT NULL;

            ALTER TABLE persons RENAME TO people;

            CREATE UNIQUE INDEX idx_people_phone_number ON people(phone_number);
        `);

        await queryRunner.query(`
            DROP TABLE IF EXISTS addresses;
            DROP TABLE IF EXISTS countries;
            DROP TABLE IF EXISTS genders;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE countries (
                id CHAR(36) NOT NULL PRIMARY KEY,
                country_name VARCHAR(255) NOT NULL UNIQUE,
                country_code CHAR(3) NOT NULL UNIQUE,
                created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
                updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
            );

            CREATE INDEX idx_countries_country_code ON countries(country_code);
        `);

        await queryRunner.query(`
            CREATE TABLE addresses (
                id CHAR(36) NOT NULL PRIMARY KEY,
                country_id CHAR(36) NOT NULL REFERENCES countries(id),
                state VARCHAR(100) NOT NULL,
                city VARCHAR(100) NOT NULL,
                street_name VARCHAR(100) NOT NULL,
                postal_code VARCHAR(9),
                building_code VARCHAR(10),
                flat_code VARCHAR(10),
                created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
                updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
            );

            CREATE INDEX idx_addresses_country_id ON addresses(country_id);
        `);

        await queryRunner.query(`
            CREATE TABLE genders (
                id CHAR(36) NOT NULL PRIMARY KEY,
                gender_name VARCHAR(50) NOT NULL UNIQUE,
                created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
                updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
            );
        `);

        await queryRunner.query(`
            ALTER TABLE people
                ADD COLUMN gender_id CHAR(36) NOT NULL REFERENCES genders(id),
                ADD COLUMN address_id CHAR(36),
                DROP COLUMN middle_name,
                DROP COLUMN gender,
                DROP COLUMN country,
                DROP COLUMN state,
                DROP COLUMN city,
                DROP COLUMN address_line_1,
                DROP COLUMN postal_code,
                DROP COLUMN tier,
                DROP COLUMN password_hash,
                DROP COLUMN phone_number;

            ALTER TABLE people RENAME TO persons;
        `);
    }

}
