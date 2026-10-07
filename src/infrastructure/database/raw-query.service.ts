import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';

/**
 * Raw SQL escape hatch. Use it whenever the ORM gets in the way: reporting
 * queries, ledger aggregates, `SELECT ... FOR UPDATE`, bulk upserts, etc.
 *
 * ALWAYS pass values through `params` (`?` placeholders). Never interpolate
 * user input into the SQL string.
 *
 *   const rows = await raw.query<{ balance: string }>(
 *     'SELECT balance FROM wallets WHERE id = ?', [walletId]);
 *
 * Need several statements to succeed or fail together?
 *
 *   await raw.transaction(async (tx) => {
 *     await tx.query('UPDATE wallets SET balance = balance - ? WHERE id = ?', [amt, from]);
 *     await tx.query('UPDATE wallets SET balance = balance + ? WHERE id = ?', [amt, to]);
 *   });
 */
@Injectable()
export class RawQueryService {
  constructor(private readonly dataSource: DataSource) {}

  /** Run a SELECT (or any statement that returns rows). */
  async query<T = Record<string, unknown>>(sql: string, params: unknown[] = []): Promise<T[]> {
    return this.dataSource.query(sql, params);
  }

  /** First row or null. */
  async queryOne<T = Record<string, unknown>>(
    sql: string,
    params: unknown[] = [],
  ): Promise<T | null> {
    const rows = await this.query<T>(sql, params);
    return rows[0] ?? null;
  }

  /** INSERT / UPDATE / DELETE: returns affected rows and insert id. */
  async execute(
    sql: string,
    params: unknown[] = [],
  ): Promise<{ affectedRows: number; insertId: number }> {
    const result = await this.dataSource.query(sql, params);
    return { affectedRows: result.affectedRows ?? 0, insertId: result.insertId ?? 0 };
  }

  /**
   * Run `work` inside a single database transaction. The callback receives a
   * transaction-scoped client; anything thrown rolls the whole thing back.
   */
  async transaction<T>(
    work: (tx: TransactionClient) => Promise<T>,
    isolation: 'READ COMMITTED' | 'REPEATABLE READ' | 'SERIALIZABLE' = 'REPEATABLE READ',
  ): Promise<T> {
    return this.dataSource.transaction(isolation, async (manager) => work(new TransactionClient(manager)));
  }
}

/** Thin wrapper so callers get the same raw API inside a transaction. */
export class TransactionClient {
  constructor(public readonly manager: EntityManager) {}

  query<T = Record<string, unknown>>(sql: string, params: unknown[] = []): Promise<T[]> {
    return this.manager.query(sql, params);
  }

  async queryOne<T = Record<string, unknown>>(
    sql: string,
    params: unknown[] = [],
  ): Promise<T | null> {
    const rows = await this.query<T>(sql, params);
    return rows[0] ?? null;
  }

  async execute(
    sql: string,
    params: unknown[] = [],
  ): Promise<{ affectedRows: number; insertId: number }> {
    const result = await this.manager.query(sql, params);
    return { affectedRows: result.affectedRows ?? 0, insertId: result.insertId ?? 0 };
  }
}
