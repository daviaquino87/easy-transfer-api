import { ISendEmailOfTransfer } from '@/common/interfaces/rabbitmq.interfaces';
import { Injectable } from '@nestjs/common';
import { MockSendNotificationGateway } from '@/main/consumers/gateway/mock-send-notification.gateway';

@Injectable()
export class SendEmailOfTransferHandle {
  constructor(
    private readonly mockSendNotificationGateway: MockSendNotificationGateway,
  ) {}

  async execute(sendEmailOfTransferEvent: ISendEmailOfTransfer) {
    await this.mockSendNotificationGateway.sendNotification(
      sendEmailOfTransferEvent,
    );
  }
}
