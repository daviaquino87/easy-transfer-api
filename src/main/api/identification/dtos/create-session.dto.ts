import { IsNotBlank } from '@/common/decorators/is-not-blank.decorator';
import { IsEmail, MinLength } from 'class-validator';

export class CreateSessionDTO {
  @IsEmail(
    {},
    {
      message: 'Ops! O campo email está inválido.',
    },
  )
  @IsNotBlank({
    message: 'Ops! O campo email é obrigatório.',
  })
  email: string;

  @MinLength(8, {
    message: 'Ops! O campo senha deve ter pelo menos 8 caracteres.',
  })
  @IsNotBlank({
    message: 'Ops! O campo senha é obrigatório.',
  })
  password: string;
}
