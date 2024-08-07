import { UserTypeEnum, DocumentTypeEnum } from '@/common/enums/user.enum';

export class CreateUserDTO {
  name: string;
  email: string;
  password: string;
  type: UserTypeEnum;
  documentType: DocumentTypeEnum;
  document: string;
}
