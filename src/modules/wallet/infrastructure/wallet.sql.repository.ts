import { Injectable } from '@nestjs/common';
import { RawQueryService } from '../../../infrastructure/database/raw-query.service';
import { Wallet, WalletStatus } from '../domain/wallet.entity';
import { WalletRepository } from '../domain/wallet.repository';

interface WalletRow {
  id: string;
  owner_id: string;
  currency: string;
  balance: string;
  status: WalletStatus;
  created_at: Date;
}

/**
 * Adapter implementing the domain port with raw SQL.
 * Swap or add a TypeORM-entity-based repository later without touching the domain.
 */
@Injectable()
export class WalletSqlRepository implements WalletRepository {
  constructor(private readonly db: RawQueryService) {}

  async findById(id: string): Promise<Wallet | null> {
    const row = await this.db.queryOne<WalletRow>(
      'SELECT id, owner_id, currency, balance, status, created_at FROM wallets WHERE id = ?',
      [id],
    );
    return row
      ? new Wallet(row.id, row.owner_id, row.currency, row.balance, row.status, row.created_at)
      : null;
  }
}
