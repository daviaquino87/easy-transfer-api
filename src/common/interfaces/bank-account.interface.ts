import { BankAccount, Prisma } from '@prisma/client';

export type IBankAccount = BankAccount;
export type IBankAccountWithUser = Prisma.BankAccountGetPayload<{
  include: {
    user: true;
  };
}>;
