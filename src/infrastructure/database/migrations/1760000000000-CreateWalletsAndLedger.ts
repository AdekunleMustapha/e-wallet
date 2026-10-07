import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Example migration written in plain SQL, which is the freedom you asked for:
 * migrations are just `queryRunner.query(...)`, so use any MySQL feature you like.
 *
 * Create new ones with:
 *   npm run migration:create src/infrastructure/database/migrations/AddSomething
 * Or let TypeORM diff your ORM entities:
 *   npm run migration:generate src/infrastructure/database/migrations/AddSomething
 */
export class CreateWalletsAndLedger1760000000000 implements MigrationInterface {
  name = 'CreateWalletsAndLedger1760000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE wallets (
        id           CHAR(36)      NOT NULL,
        owner_id     CHAR(36)      NOT NULL,
        currency     CHAR(3)       NOT NULL,
        balance      DECIMAL(20,4) NOT NULL DEFAULT 0,
        status       ENUM('ACTIVE','FROZEN','CLOSED') NOT NULL DEFAULT 'ACTIVE',
        version      INT UNSIGNED  NOT NULL DEFAULT 0,
        created_at   DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        updated_at   DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
        PRIMARY KEY (id),
        UNIQUE KEY uq_wallets_owner_currency (owner_id, currency),
        CONSTRAINT chk_wallets_balance_non_negative CHECK (balance >= 0)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await queryRunner.query(`
      CREATE TABLE ledger_entries (
        id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        wallet_id      CHAR(36)        NOT NULL,
        reference      VARCHAR(64)     NOT NULL,
        direction      ENUM('DEBIT','CREDIT') NOT NULL,
        amount         DECIMAL(20,4)   NOT NULL,
        balance_after  DECIMAL(20,4)   NOT NULL,
        created_at     DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        PRIMARY KEY (id),
        UNIQUE KEY uq_ledger_reference_wallet (reference, wallet_id),
        KEY idx_ledger_wallet_created (wallet_id, created_at),
        CONSTRAINT fk_ledger_wallet FOREIGN KEY (wallet_id) REFERENCES wallets (id),
        CONSTRAINT chk_ledger_amount_positive CHECK (amount > 0)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS ledger_entries');
    await queryRunner.query('DROP TABLE IF EXISTS wallets');
  }
}
