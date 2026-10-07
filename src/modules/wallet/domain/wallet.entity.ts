export type WalletStatus = 'ACTIVE' | 'FROZEN' | 'CLOSED';

/**
 * Pure domain entity: no Nest, no TypeORM, no framework imports.
 * Money is held as a decimal string to avoid floating-point errors.
 */
export class Wallet {
  constructor(
    public readonly id: string,
    public readonly ownerId: string,
    public readonly currency: string,
    public readonly balance: string,
    public readonly status: WalletStatus,
    public readonly createdAt: Date,
  ) {}

  isActive(): boolean {
    return this.status === 'ACTIVE';
  }
}
