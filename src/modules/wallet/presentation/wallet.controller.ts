import { Controller, Get, Param } from '@nestjs/common';
import { GetWalletUseCase } from '../application/get-wallet.use-case';

@Controller('wallets')
export class WalletController {
  constructor(private readonly getWallet: GetWalletUseCase) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const w = await this.getWallet.execute(id);
    return {
      id: w.id,
      ownerId: w.ownerId,
      currency: w.currency,
      balance: w.balance,
      status: w.status,
      createdAt: w.createdAt,
    };
  }
}
