import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';

import { ExchangesEnum, QueuesEnum } from '@/infra/rabbitmq/enums';
import { INotifyUser } from '@/common/interfaces/rabbitmq.interfaces';

@Injectable()
export class PublisherService {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  async notifyUser(message: INotifyUser) {
    await this.amqpConnection.publish(
      ExchangesEnum.DEFAULT,
      QueuesEnum.NOTIFY_USER,
      message,
    );
  }
}
