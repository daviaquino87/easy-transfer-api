import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DepositDTO } from '@/main/api/financial/dtos/deposit.dto';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { validateDTO } from '@/common/utils/validate-dto';
import { IBankAccount } from '@/common/interfaces/bank-account.interface';
import { randomUUID } from 'crypto';

interface IExecuteInput {
  depositDto: DepositDTO;
  sessionUserId: string;
}

type IApplyValidationsInput = IExecuteInput;

@Injectable()
export class DepositUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private async ensureBankAccountIsValid(
    bankAccountId: string,
  ): Promise<IBankAccount> {
    const bankAccount = await this.prismaService.bankAccount.findUnique({
      where: {
        id: bankAccountId,
      },
    });

    if (!bankAccount) {
      throw new NotFoundException('Conta bancária inválida');
    }

    return bankAccount;
  }

  private async applyValidations(
    params: IApplyValidationsInput,
  ): Promise<void> {
    const { depositDto, sessionUserId } = params;

    const { dtoValidated, error } = await validateDTO(DepositDTO, depositDto);

    if (error) {
      throw new BadRequestException(error);
    }

    const bankAccount = await this.ensureBankAccountIsValid(
      dtoValidated.bankAccountId,
    );

    if (bankAccount.userId !== sessionUserId) {
      throw new BadRequestException(
        'Ops! O usuário só pode realizar depositos para sua propía conta',
      );
    }
  }

  async execute(params: IExecuteInput): Promise<void> {
    await this.applyValidations(params);

    await this.prismaService.bankAccount.update({
      where: {
        id: params.depositDto.bankAccountId,
      },
      data: {
        balanceInCents: {
          increment: params.depositDto.valueInCents,
        },
        transactions: {
          create: {
            id: randomUUID(),
            operationId: randomUUID(),
            type: 'CREDIT',
            amountInCents: params.depositDto.valueInCents,
          },
        },
      },
    });
  }
}
