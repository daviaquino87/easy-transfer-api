import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';

import { ExchangesEnum, QueuesEnum } from '@/infra/rabbitmq/enums';
import {
  INotifyUser,
  ISendEmailOfTransfer,
} from '@/common/interfaces/rabbitmq.interfaces';
import { SendEmailOfTransferHandle } from '@/main/consumers/handlers/send-email-of-transfer.handle';

@Injectable()
export class NotifyUserQueue {
  constructor(
    private readonly sendEmailOfTransferHandle: SendEmailOfTransferHandle,
  ) {}

  @RabbitSubscribe({
    exchange: ExchangesEnum.DEFAULT,
    queue: QueuesEnum.NOTIFY_USER,
    routingKey: QueuesEnum.NOTIFY_USER,
  })
  public async execute(message: INotifyUser) {
    try {
      switch (message.eventType) {
        case 'SendEmailOfTransfer':
          await this.sendEmailOfTransferHandle.execute(
            message.data as ISendEmailOfTransfer,
          );
          break;
        default:
          Logger.warn(
            `Event type not found: ${message.eventType}`,
            NotifyUserQueue.name,
          );
          break;
      }
    } catch (error) {
      Logger.error(error, NotifyUserQueue.name);
    }
  }
}
