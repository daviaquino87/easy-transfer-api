import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ElectronicFoundsTransferDTO } from '@/main/api/financial/dtos/eletronic-founds-transfer.dto';
import { validateDTO } from '@/common/utils/validate-dto';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { randomUUID } from 'crypto';
import { IBankAccount } from '@/common/interfaces/bank-account.interface';
import { BankAuthorizationGateway } from '@/main/api/financial/gateway/bank-authorization.gateway';

interface IExecuteInput {
  electronicFoundsTransferDto: ElectronicFoundsTransferDTO;
  sessionUserId: string;
}

type IApplyValidationsInput = IExecuteInput;

interface IApplyValidationsOutput {
  payerBankAccount: IBankAccount;
  payeeBankAccount: IBankAccount;
  dtoValidated: ElectronicFoundsTransferDTO;
}

@Injectable()
export class ElectronicFoundsTransferUseCase {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly bankAuthorizationGateway: BankAuthorizationGateway,
  ) {}

  async ensurePayerBankAccountIsValid(
    payerId: string,
    userId: string,
  ): Promise<IBankAccount> {
    const payer = await this.prismaService.user.findUnique({
      where: {
        id: payerId,
      },
      include: {
        bankAccount: true,
      },
    });

    if (!payer) {
      throw new NotFoundException('Ops! A pagador informado  não existe');
    }

    if (payer.type == 'SHOPKEEPER') {
      throw new BadRequestException(
        'Ops! Usuarios do tipo lojista não podem transferir fundos',
      );
    }

    if (payer.bankAccount.userId !== userId) {
      throw new BadRequestException(
        'Ops! A conta informada para o pagador não pertence ao usuário autenticado',
      );
    }

    return payer.bankAccount;
  }

  async ensurePayeeBankAccountIsValid(payeeId: string): Promise<IBankAccount> {
    const payee = await this.prismaService.user.findUnique({
      where: {
        id: payeeId,
      },
      include: {
        bankAccount: true,
      },
    });

    if (!payee) {
      throw new NotFoundException('Ops! A beneficiário informado não existe');
    }

    return payee.bankAccount;
  }

  private async applyValidations(
    params: IApplyValidationsInput,
  ): Promise<IApplyValidationsOutput> {
    const { electronicFoundsTransferDto, sessionUserId } = params;

    const { dtoValidated, error } = await validateDTO(
      ElectronicFoundsTransferDTO,
      electronicFoundsTransferDto,
    );

    if (error) {
      throw new BadRequestException(error);
    }

    if (dtoValidated.payeeId === dtoValidated.payerId) {
      throw new BadRequestException(
        'Ops! O pagador e o recebedor devem ser diferentes',
      );
    }

    const payerBankAccount = await this.ensurePayerBankAccountIsValid(
      dtoValidated.payerId,
      sessionUserId,
    );

    const payeeBankAccount = await this.ensurePayeeBankAccountIsValid(
      dtoValidated.payeeId,
    );

    return {
      payerBankAccount,
      payeeBankAccount,
      dtoValidated,
    };
  }

  async execute(params: IExecuteInput): Promise<void> {
    const { dtoValidated, payeeBankAccount, payerBankAccount } =
      await this.applyValidations(params);

    await this.prismaService.$transaction(async (tx) => {
      const operationId = randomUUID();

      const result =
        await tx.$queryRaw`SELECT balance_in_cents FROM bank_accounts WHERE id = ${payerBankAccount.id} FOR UPDATE`;

      const { balance_in_cents: balanceInCents } = result[0];

      if (balanceInCents < dtoValidated.valueInCents) {
        throw new BadRequestException('Ops! Saldo insuficiente');
      }

      await tx.bankAccount.update({
        where: {
          id: payerBankAccount.id,
        },
        data: {
          balanceInCents: {
            decrement: dtoValidated.valueInCents,
          },
          transactions: {
            create: {
              id: randomUUID(),
              operationId,
              type: 'DEBIT',
              amountInCents: dtoValidated.valueInCents,
            },
          },
        },
      });

      await tx.bankAccount.update({
        where: {
          id: payeeBankAccount.id,
        },
        data: {
          balanceInCents: {
            increment: dtoValidated.valueInCents,
          },
          transactions: {
            create: {
              id: randomUUID(),
              operationId,
              type: 'CREDIT',
              amountInCents: dtoValidated.valueInCents,
            },
          },
        },
      });

      const operationAuthorized =
        await this.bankAuthorizationGateway.authorizeEtfService();

      if (!operationAuthorized) {
        throw new BadRequestException('Ops! Operação não autorizada');
      }
    });
  }
}
