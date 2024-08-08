import { Module } from '@nestjs/common';
import { FinancialController } from '@/main/api/financial/controllers/financial.controller';
import {
  DepositUseCase,
  ElectronicFoundsTransferUseCase,
} from '@/main/api/financial/use-cases';
import { MockBankAuthorizationGateway } from '@/main/api/financial/gateway/mock-bank-authorization.gateway';
import { RabbitMqModule } from '@/infra/rabbitmq/rabbitmq.module';

@Module({
  imports: [RabbitMqModule],
  providers: [
    DepositUseCase,
    ElectronicFoundsTransferUseCase,
    MockBankAuthorizationGateway,
  ],
  controllers: [FinancialController],
  exports: [],
})
export class FinancialModule {}
