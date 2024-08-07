import { plainToInstance } from 'class-transformer';
import { ValidationError, validate } from 'class-validator';

type DTOType<T> = { new (): T };

interface IValidateDtoOutput<T> {
  error?: string;
  dtoValidated?: T;
}

const getMessageError = (errors: ValidationError[]): string => {
  try {
    const [firstError] = errors;
    const hasNestedErrors = firstError?.children?.length > 0;

    if (hasNestedErrors) {
      const [nestedError] = firstError.children;
      const hasNestedNestedErrors = nestedError?.children?.length > 0;

      if (hasNestedNestedErrors) {
        const [nestedNestedError] = nestedError.children;

        return getMessageError([nestedNestedError]);
      }

      const [nestedMessageError] = Object.values(nestedError.constraints);

      return nestedMessageError;
    }

    const [messageError] = Object.values(firstError.constraints);

    return messageError;
  } catch (error) {
    return 'Ops! Ocorreu um erro inesperado.';
  }
};

/**
 * @description Validates a DTO object to ensure data integrity, simplifying the validation of objects coming from HTTP requests or other sources.
 * @param DTOClass The class of the DTO used to validate the object.
 * @param dtoObject The object to be validated.
 * @returns A BadRequest exception if validation fails, or void if validation is successful.
 */
export const validateDTO = async <T>(
  DTOClass: DTOType<T>,
  dtoObject: T,
): Promise<IValidateDtoOutput<T>> => {
  dtoObject = plainToInstance(DTOClass, dtoObject);

  if (!(dtoObject instanceof DTOClass)) {
    return {
      error: 'Ops! O objeto não é uma instância do DTO.',
    };
  }

  const errors = await validate(dtoObject as object, {
    stopAtFirstError: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  });

  const hasErrors = errors.length > 0;

  if (hasErrors) {
    const messageError = getMessageError(errors);

    return {
      error: messageError,
    };
  }

  return {
    dtoValidated: dtoObject,
  };
};
