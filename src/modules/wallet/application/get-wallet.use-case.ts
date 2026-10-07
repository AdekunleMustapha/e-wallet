import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { RedisService } from '../../../infrastructure/cache/redis.service';
import { Wallet } from '../domain/wallet.entity';
import { WALLET_REPOSITORY, WalletRepository } from '../domain/wallet.repository';

@Injectable()
export class GetWalletUseCase {
  constructor(
    @Inject(WALLET_REPOSITORY) private readonly wallets: WalletRepository,
    private readonly redis: RedisService,
  ) {}

  async execute(id: string): Promise<Wallet> {
    const wallet = await this.redis.remember(`wallet:${id}`, 30, async () =>
      this.wallets.findById(id),
    );
    if (!wallet) throw new NotFoundException(`Wallet ${id} not found`);
    return wallet;
  }
}
