import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { IUser } from '@/common/interfaces/user.interface';
import { compareSync } from 'bcryptjs';
import { CreateSessionDTO } from '@/main/api/identification/dtos/create-session.dto';
import { validateDTO } from '@/common/utils/validate-dto';
import { JwtService } from '@nestjs/jwt';

interface IExecuteInput {
  createSessionDto: CreateSessionDTO;
}

interface IExecuteOutput {
  accessToken: string;
}

type IApplyValidationsInput = IExecuteInput;

interface IApplyValidationsOutput {
  user: IUser;
}

@Injectable()
export class CreateSessionUseCase {
  constructor(
    private readonly prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  private async ensureUserIsValid(email: string): Promise<IUser> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new BadRequestException('Ops! Email e/ou senha inválidos');
    }

    return user;
  }

  private ensurePasswordMachs(user: IUser, password: string): void {
    const passwordMatch = compareSync(password, user.passwordHash);

    if (!passwordMatch) {
      throw new BadRequestException('Ops! Email e/ou senha inválidos');
    }
  }

  private async applyValidations(
    params: IApplyValidationsInput,
  ): Promise<IApplyValidationsOutput> {
    const { createSessionDto } = params;

    const { dtoValidated, error } = await validateDTO(
      CreateSessionDTO,
      createSessionDto,
    );

    if (error) {
      throw new BadRequestException(error);
    }

    const user = await this.ensureUserIsValid(dtoValidated.email);
    this.ensurePasswordMachs(user, dtoValidated.password);

    return {
      user,
    };
  }

  async execute(params: IExecuteInput): Promise<IExecuteOutput> {
    const { user } = await this.applyValidations(params);

    const payload: Record<string, unknown> = {
      sub: user.id,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
    };
  }
}
