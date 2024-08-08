import { EnvService } from '@/infra/env/env.service';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MockSendNotificationGateway {
  private logger = new Logger(MockSendNotificationGateway.name);

  constructor(private readonly envService: EnvService) {}

  public async sendNotification(data: any): Promise<boolean> {
    const url = this.envService.get('SEND_NOTIFICATION_SERVICE_URL');

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        this.logger.error(`Request failed with status ${response.status}`);
        return false;
      }

      return true;
    } catch (error) {
      this.logger.error('Notification request failed:', error);
      return false;
    }
  }
}
