import { RabbitMQModule as BaseRabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';

import { EnvModule } from '@/infra/env/env.module';
import { EnvService } from '@/infra/env/env.service';
import { ExchangesEnum, ExchangesTypesEnum } from '@/infra/rabbitmq/enums';
import { PublisherService } from '@/infra/rabbitmq/publisher.service';

@Module({
  imports: [
    EnvModule,
    BaseRabbitMQModule.forRootAsync(BaseRabbitMQModule, {
      useFactory: (envService: EnvService) => ({
        uri: envService.get('RABBITMQ_URL'),
        registerHandlers: process.argv.includes('--registerHandlers'),
        exchanges: [
          {
            name: ExchangesEnum.DEFAULT,
            type: ExchangesTypesEnum.TOPIC,
          },
        ],
      }),
      inject: [EnvService],
      exports: [BaseRabbitMQModule],
    }),
  ],
  providers: [PublisherService],
  exports: [BaseRabbitMQModule, PublisherService],
})
export class RabbitMqModule {}
