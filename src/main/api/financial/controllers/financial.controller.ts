import { Auth, AuthUser } from '@/common/decorators/auth.decorator';
import { UserOutputDTO } from '@/common/dtos/user.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DepositDTO } from '@/main/api/financial/dtos/deposit.dto';
import {
  DepositUseCase,
  ElectronicFoundsTransferUseCase,
} from '@/main/api/financial/use-cases';
import { ElectronicFoundsTransferDTO } from '@/main/api/financial/dtos/eletronic-founds-transfer.dto';

@Auth()
@ApiTags('Financial')
@Controller('financial/bank-account')
export class FinancialController {
  constructor(
    private readonly depositUseCase: DepositUseCase,
    private readonly electronicFoundsTransferUseCase: ElectronicFoundsTransferUseCase,
  ) {}

  @ApiOperation({
    summary: 'Apenas para deposito na conta do proprio usuário autenticado ℹ️',
  })
  @Post('/deposit')
  async deposit(
    @AuthUser() user: UserOutputDTO,
    @Body() depositDto: DepositDTO,
  ): Promise<void> {
    await this.depositUseCase.execute({
      depositDto,
      sessionUserId: user.id,
    });
  }

  @ApiOperation({
    summary: 'Transferência eletronica ℹ️',
  })
  @Post('/eft')
  async electronicFundTransfer(
    @AuthUser() user: UserOutputDTO,
    @Body() electronicFoundsTransferDto: ElectronicFoundsTransferDTO,
  ): Promise<void> {
    await this.electronicFoundsTransferUseCase.execute({
      electronicFoundsTransferDto,
      sessionUserId: user.id,
    });
  }
}
