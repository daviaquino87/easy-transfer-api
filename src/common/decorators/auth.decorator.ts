import { applyDecorators, UseGuards } from '@nestjs/common';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { ApiCookieAuth } from '@nestjs/swagger';

import { UserOutputDTO } from '@/common/dtos/user.dto';
import { JwtAuthGuard } from '@/main/api/identification/guards/jwt-auth.guard';

export function Auth() {
  return applyDecorators(ApiCookieAuth(), UseGuards(JwtAuthGuard));
}

export const AuthUser = createParamDecorator(
  (_: never, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.user as UserOutputDTO;
  },
);
