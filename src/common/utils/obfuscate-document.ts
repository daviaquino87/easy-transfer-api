import { DocumentTypeEnum } from '@/common/enums/user.enum';

export function obfuscateDocument(
  document: string,
  documentType: DocumentTypeEnum,
): string {
  if (!document) {
    throw new Error('Document must be provided');
  }

  switch (documentType) {
    case DocumentTypeEnum.CPF:
      return document.replace(/(\d{3})\.\d{3}\.\d{3}-\d{2}/, '$1.***.***-**');

    case DocumentTypeEnum.CNPJ:
      return document.replace(
        /(\d{2})\.\d{3}\.\d{3}\/\d{4}-\d{2}/,
        '$1.***.***/****-**',
      );

    default:
      throw new Error(`Unsupported document type: ${documentType}`);
  }
}
