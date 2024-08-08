import { Module } from '@nestjs/common';
import { JWTAuthStrategy } from '@/main/api/identification/strategies/jwt-auth.strategy';
import {
  CreateSessionUseCase,
  CreateUserUseCase,
} from '@/main/api/identification/use-cases';
import { AuthController } from '@/main/api/identification/controller/auth.controller';
import { UsersController } from '@/main/api/identification/controller/users.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { authConfig } from '@/main/api/identification/constants';
import { EnvService } from '@/infra/env/env.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      global: true,
      useFactory(env: EnvService) {
        const JWT_AUTH_SECRET = env.get('JWT_AUTH_SECRET');

        return {
          secret: JWT_AUTH_SECRET,
          signOptions: {
            expiresIn: authConfig.JWT_AUTH_EXPIRE_IN,
          },
        };
      },
    }),
  ],
  providers: [JWTAuthStrategy, CreateUserUseCase, CreateSessionUseCase],
  controllers: [AuthController, UsersController],
  exports: [],
})
export class IdentificationModule {}
