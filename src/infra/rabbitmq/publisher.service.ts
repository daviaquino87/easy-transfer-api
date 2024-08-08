import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';

import { ExchangesEnum, QueuesEnum } from '@/infra/rabbitmq/enums';
import { INotifyUser } from '@/common/interfaces/rabbitmq.interfaces';

@Injectable()
export class PublisherService {
  private readonly logger = new Logger(PublisherService.name);
  constructor(private readonly amqpConnection: AmqpConnection) {}

  async notifyUser(message: INotifyUser) {
    try {
      await this.amqpConnection.publish(
        ExchangesEnum.DEFAULT,
        QueuesEnum.NOTIFY_USER,
        message,
      );
    } catch (error) {
      this.logger.error(error);
    }
  }
}
