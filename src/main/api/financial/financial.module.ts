import { Module } from '@nestjs/common';
import { FinancialController } from '@/main/api/financial/controllers/financial.controller';
import {
  DepositUseCase,
  ElectronicFoundsTransferUseCase,
} from '@/main/api/financial/use-cases';
import { BankAuthorizationGateway } from '@/main/api/financial/gateway/bank-authorization.gateway';

@Module({
  imports: [],
  providers: [
    DepositUseCase,
    ElectronicFoundsTransferUseCase,
    BankAuthorizationGateway,
  ],
  controllers: [FinancialController],
  exports: [],
})
export class FinancialModule {}
