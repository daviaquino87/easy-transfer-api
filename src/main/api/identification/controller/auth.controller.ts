import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CreateSessionUseCase } from '@/main/api/identification/use-cases';
import { CreateSessionDTO } from '@/main/api/identification/dtos/create-session.dto';
import { authConfig } from '@/main/api/identification/constants';
import { Auth, AuthUser } from '@/common/decorators/auth.decorator';
import { UserOutputDTO } from '@/common/dtos/user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly createSessionUseCase: CreateSessionUseCase) {}

  @Post('session')
  async authenticate(
    @Res() response: Response,
    @Body() createSessionDto: CreateSessionDTO,
  ) {
    const { accessToken } = await this.createSessionUseCase.execute({
      createSessionDto,
    });

    response
      .cookie('accessToken', accessToken, {
        maxAge: Number(authConfig.JWT_AUTH_EXPIRE_IN),
        httpOnly: true,
      })
      .send();
  }

  @Auth()
  @Get('me')
  async getAuthenticatedUser(
    @AuthUser() user: UserOutputDTO,
  ): Promise<UserOutputDTO> {
    return user;
  }
}
