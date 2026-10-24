import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCountryAndAddresses1792795287459 implements MigrationInterface {
    name = "CreateCountryAndAddresses1792795287459";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE countries (
                id CHAR(36) NOT NULL PRIMARY KEY,
                country_name VARCHAR(255) NOT NULL UNIQUE,
                country_code CHAR(3) NOT NULL UNIQUE,
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
                updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        
        await queryRunner.query(`
            CREATE TABLE addresses (
                id CHAR(36) NOT NULL PRIMARY KEY,
                country_id CHAR(36) NOT NULL REFERENCE country(id),
                state VARCHAR(100) NOT NULL,
                city VARCHAR(100) NOT NULL,
                street_name VARCHAR(100) NOT NULL,
                postal_code VARCHAR(9),
                building_code VARCHAR(10),
                flat_code VARCHAR(10),
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
                updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
                KEY idex_addresses_country_id (country_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `)

        await queryRunner.query(`
            ALTER TABLE persons 
            ADD CONSTRAINT fk_persons_address_id FOREIGN KEY (address_id) REFERENCES addresses (id);   
        `) 
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE persons DROP FOREIGN KEY fk_persons_address_id');
        await queryRunner.query('DROP TABLE IF EXISTS addresses');
        await queryRunner.query('DROP TABLE IF EXISTS countries');
    }

}
