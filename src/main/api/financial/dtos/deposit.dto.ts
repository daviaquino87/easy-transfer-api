import { UUID_VERSION } from '@/common/constants';
import { IsNumber, IsPositive, IsUUID } from 'class-validator';

export class DepositDTO {
  @IsPositive({
    message: 'Ops! O campo valor em centavos deve ser um numero positivo',
  })
  @IsNumber(
    {},
    {
      message: 'Ops! O campo valor em centavos deve ser um número',
    },
  )
  valueInCents: number;

  @IsUUID(UUID_VERSION, {
    message: 'Ops! O campo conta bancária deve ser um UUID valido',
  })
  bankAccountId: string;
}
