import { Module } from '@nestjs/common';
import { GetWalletUseCase } from './application/get-wallet.use-case';
import { WALLET_REPOSITORY } from './domain/wallet.repository';
import { WalletSqlRepository } from './infrastructure/wallet.sql.repository';
import { WalletController } from './presentation/wallet.controller';

@Module({
  controllers: [WalletController],
  providers: [
    GetWalletUseCase,
    { provide: WALLET_REPOSITORY, useClass: WalletSqlRepository },
  ],
})
export class WalletModule {}
