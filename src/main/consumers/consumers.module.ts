import { DatabaseModule } from '@/infra/database/database.module';
import { envSchema } from '@/infra/env/env-schema';
import { RabbitMqModule } from '@/infra/rabbitmq/rabbitmq.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotifyUserQueue } from '@/main/consumers/queues/notify-user.queue';
import { SendEmailOfTransferHandle } from '@/main/consumers/handlers/send-email-of-transfer.handle';
import { MockSendNotificationGateway } from '@/main/consumers/gateway/mock-send-notification.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    RabbitMqModule,
    DatabaseModule,
  ],
  providers: [
    NotifyUserQueue,
    SendEmailOfTransferHandle,
    MockSendNotificationGateway,
  ],
})
export class ConsumersModule {}
