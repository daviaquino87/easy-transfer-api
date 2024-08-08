import { Auth, AuthUser } from '@/common/decorators/auth.decorator';
import { UserOutputDTO } from '@/common/dtos/user.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DepositDTO } from '@/main/api/financial/dtos/deposit.dto';
import { DepositUseCase } from '@/main/api/financial/use-cases';

@Auth()
@ApiTags('Financial')
@Controller('financial')
export class FinancialController {
  constructor(private readonly depositUseCase: DepositUseCase) {}

  @Post('bank-account/deposit')
  async deposit(
    @AuthUser() user: UserOutputDTO,
    @Body() depositDto: DepositDTO,
  ) {
    await this.depositUseCase.execute({
      depositDto,
      sessionUserId: user.id,
    });
  }
}
