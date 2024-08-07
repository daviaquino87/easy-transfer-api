import { DocumentTypeEnum, UserTypeEnum } from '@/common/enums/user.enum';
import { IUser } from '@/common/interfaces/user.interface';

export class UserOutputDTO {
  id: string;
  name: string;
  email: string;
  type: UserTypeEnum;
  documentType: DocumentTypeEnum;
  document: string;
  createdAt: Date;
  updatedAt: Date;

  static toHttp(user: IUser): UserOutputDTO {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      type: user.type as UserTypeEnum,
      documentType: user.documentType as DocumentTypeEnum,
      document: user.document,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
