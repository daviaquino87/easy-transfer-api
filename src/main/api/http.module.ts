import { Module } from '@nestjs/common';
import { UsersController } from '@/main/api/users/controller/users.controller';
import { CreateUserUseCase } from '@/main/api/users/use-cases';
import { DatabaseModule } from '@/infra/database/database.module';
import { EnvModule } from '@/infra/env/env.module';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from '@/infra/env/env-schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    EnvModule,
    DatabaseModule,
  ],
  providers: [CreateUserUseCase],
  controllers: [UsersController],
})
export class HttpModule {}
