import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';

import { ExchangesEnum, QueuesEnum } from '@/infra/rabbitmq/enums';

@Injectable()
export class PublisherService {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  async notifyUser(message: any) {
    await this.amqpConnection.publish(
      ExchangesEnum.DEFAULT,
      QueuesEnum.NOTIFY_USER,
      message,
    );
  }
}
