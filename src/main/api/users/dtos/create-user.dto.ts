import { IsNotBlank } from '@/common/decorators/is-not-blank.decorator';
import { validateDocumentByType } from '@/common/decorators/validate-document-by-type.decorator';
import { UserTypeEnum, DocumentTypeEnum } from '@/common/enums/user.enum';
import { IsEmail, IsEnum, MinLength } from 'class-validator';

export class CreateUserDTO {
  @MinLength(10, {
    message: 'Ops! O campo nome deve ter pelo menos 10 caracteres.',
  })
  @IsNotBlank({
    message: 'Ops! O campo nome é obrigatório.',
  })
  name: string;

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

  @IsEnum(UserTypeEnum, {
    message: 'Ops! O tipo de usuário informado é inválido.',
  })
  @IsNotBlank({
    message: 'Ops! O campo tipo de usuário é obrigatório.',
  })
  type: UserTypeEnum;

  @IsEnum(DocumentTypeEnum, {
    message: 'Ops! O tipo de documento informado é inválido.',
  })
  @IsNotBlank({
    message: 'Ops! O campo tipo de documento é obrigatório.',
  })
  documentType: DocumentTypeEnum;

  @validateDocumentByType()
  @IsNotBlank({
    message: 'Ops! O campo documento é obrigatório.',
  })
  document: string;
}
