import { isCNPJ, isCPF } from 'brazilian-values';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { DocumentTypeEnum } from '@/common/enums/user.enum';

const CNPJ_MASK = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
const CPF_MASK = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;

@ValidatorConstraint({ name: 'validateDocumentByType' })
export class validateDocumentByTypeConstraint
  implements ValidatorConstraintInterface
{
  validate(value: any, args: ValidationArguments) {
    if ((args.object as any).documentType === DocumentTypeEnum.CNPJ) {
      return isCNPJ(value) && CNPJ_MASK.test(value);
    }

    return isCPF(value) && CPF_MASK.test(value);
  }

  defaultMessage(value: any): string {
    if (value.object.documentType === DocumentTypeEnum.CNPJ) {
      return 'Ops! O documento informado não é um CNPJ valido';
    }

    return 'Ops! O documento informado não é um CPF valido';
  }
}

export function validateDocumentByType(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: validateDocumentByTypeConstraint,
    });
  };
}
