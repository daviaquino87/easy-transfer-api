import { IUser } from '@/common/interfaces/user.interface';
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateUserDTO } from '@/main/api/identification/dtos/create-user.dto';
import { validateDTO } from '@/common/utils/validate-dto';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { randomUUID } from 'crypto';
import { hash } from 'bcryptjs';

interface IExecuteInput {
  createUserDto: CreateUserDTO;
}

interface IExecuteOutput {
  user: IUser;
}

type IApplyValidationsInput = IExecuteInput;
interface IApplyValidationsOutput {
  dtoValidated: CreateUserDTO;
}

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private async ensureDocumentIsValid(document: string): Promise<void> {
    const ensureDocumentIsUnique = await this.prismaService.user.findUnique({
      where: {
        document,
      },
    });

    if (ensureDocumentIsUnique) {
      throw new ConflictException('Ops! O documento informado está em uso.');
    }
  }

  private async ensureEmailIsValid(email: string): Promise<void> {
    const ensureEmailIsUnique = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (ensureEmailIsUnique) {
      throw new ConflictException('Ops! O e-mail informado está em uso.');
    }
  }

  private async applyValidations(
    params: IApplyValidationsInput,
  ): Promise<IApplyValidationsOutput> {
    const { dtoValidated, error } = await validateDTO(
      CreateUserDTO,
      params.createUserDto,
    );

    if (error) {
      throw new BadRequestException(error);
    }

    await Promise.all([
      this.ensureDocumentIsValid(dtoValidated.document),
      this.ensureEmailIsValid(dtoValidated.email),
    ]);

    return {
      dtoValidated,
    };
  }

  async execute(params: IExecuteInput): Promise<IExecuteOutput> {
    const { dtoValidated } = await this.applyValidations(params);

    const passwordHash = await hash(dtoValidated.password, 6);

    const user = await this.prismaService.user.create({
      data: {
        id: randomUUID(),
        name: dtoValidated.name,
        email: dtoValidated.email,
        type: dtoValidated.type,
        document: dtoValidated.document,
        documentType: dtoValidated.documentType,
        passwordHash,
      },
    });

    return {
      user,
    };
  }
}
