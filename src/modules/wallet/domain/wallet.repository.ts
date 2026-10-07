import { Wallet } from './wallet.entity';

/** Port: the domain/application layers depend on this, never on MySQL. */
export interface WalletRepository {
  findById(id: string): Promise<Wallet | null>;
}

export const WALLET_REPOSITORY = Symbol('WALLET_REPOSITORY');
