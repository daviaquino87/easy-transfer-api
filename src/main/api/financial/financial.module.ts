import { Module } from '@nestjs/common';
import { FinancialController } from '@/main/api/financial/controllers/financial.controller';
import { DepositUseCase } from '@/main/api/financial/use-cases';

@Module({
  imports: [],
  providers: [DepositUseCase],
  controllers: [FinancialController],
  exports: [],
})
export class FinancialModule {}
