import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateGenderAndPersons1792795235535 implements MigrationInterface {
    name = 'CreateGenderAndPersons1792795235535';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE genders (
                id CHAR(36) NOT NULL PRIMARY KEY,
                gender_name VARCHAR(50) NOT NULL UNIQUE,
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
                updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
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
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
                updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
                KEY idx_persons_email (email),
                KEY idx_persons_gender_id (gender_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci    
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP  TABLE IF EXISTS persons');
        await queryRunner.query('DROP TABLE IF EXISTS genders');
    }

}
