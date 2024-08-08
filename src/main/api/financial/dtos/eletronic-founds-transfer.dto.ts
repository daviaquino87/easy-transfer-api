import { UUID_VERSION } from '@/common/constants';
import { IsNotBlank } from '@/common/decorators/is-not-blank.decorator';
import { IsNumber, IsPositive, IsUUID } from 'class-validator';

export class ElectronicFoundsTransferDTO {
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
    message: 'Ops! O campo id do pagador deve ser um UUID valido',
  })
  @IsNotBlank({ message: 'Ops! O campo id do pagador é obrigatório. ' })
  payerId: string;

  @IsUUID(UUID_VERSION, {
    message: 'Ops! O campo id do beneficiário deve ser um UUID valido',
  })
  @IsNotBlank({ message: 'Ops! O campo id do beneficiário é obrigatório. ' })
  payeeId: string;
}
