import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy, ExtractJwt } from 'passport-jwt';

import { EnvService } from '@/infra/env/env.service';
import { authConfig } from '@/main/api/identification/constants';
import { UserOutputDTO } from '@/common/dtos/user.dto';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { DocumentTypeEnum, UserTypeEnum } from '@/common/enums/user.enum';

export interface IPayloadAccessToken {
  sub: string;
}

@Injectable()
export class JWTAuthStrategy extends PassportStrategy(
  Strategy,
  authConfig.STRATEGY_NAME,
) {
  constructor(
    private readonly prismaService: PrismaService,
    envService: EnvService,
  ) {
    const JWT_AUTH_SECRET = envService.get('JWT_AUTH_SECRET');

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request?.cookies?.accessToken,
      ]),
      secretOrKey: JWT_AUTH_SECRET,
    });
  }

  async validate({ sub }: IPayloadAccessToken): Promise<UserOutputDTO> {
    const userAuth = await this.prismaService.user.findUnique({
      where: {
        id: sub,
      },
    });

    if (!userAuth) {
      throw new UnauthorizedException('Ops! Usuário não autorizado');
    }

    return {
      id: userAuth.id,
      name: userAuth.name,
      email: userAuth.email,
      type: userAuth.type as UserTypeEnum,
      documentType: userAuth.documentType as DocumentTypeEnum,
      document: userAuth.document,
      createdAt: userAuth.createdAt,
      updatedAt: userAuth.updatedAt,
    };
  }
}
