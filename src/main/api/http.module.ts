import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/infra/database/database.module';
import { EnvModule } from '@/infra/env/env.module';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from '@/infra/env/env-schema';
import { IdentificationModule } from '@/main/api/identification/identification.module';
import { FinancialModule } from '@/main/api/financial/financial.module';
import { RabbitMqModule } from '@/infra/rabbitmq/rabbitmq.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    EnvModule,
    DatabaseModule,
    RabbitMqModule,
    IdentificationModule,
    FinancialModule,
  ],
})
export class HttpModule {}
