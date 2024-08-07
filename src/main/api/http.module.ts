import { Module } from '@nestjs/common';
import { UsersController } from '@/main/api/identification/controller/users.controller';
import { CreateUserUseCase } from '@/main/api/identification/use-cases';
import { DatabaseModule } from '@/infra/database/database.module';
import { EnvModule } from '@/infra/env/env.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { envSchema } from '@/infra/env/env-schema';
import { authConfig } from '@/main/api/identification/constants';
import { EnvService } from '@/infra/env/env.service';
import { JwtModule } from '@nestjs/jwt';
import { JWTAuthStrategy } from '@/main/api/identification/strategies/jwt-auth.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    EnvModule,
    DatabaseModule,
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
  providers: [JWTAuthStrategy, CreateUserUseCase],
  controllers: [UsersController],
})
export class HttpModule {}
