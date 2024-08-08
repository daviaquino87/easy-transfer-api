import { EnvService } from '@/infra/env/env.service';
import { Injectable, Logger } from '@nestjs/common';

interface IResponse {
  status: string;
  data: {
    authorization: boolean;
  };
}

@Injectable()
export class MockBankAuthorizationGateway {
  private logger = new Logger(MockBankAuthorizationGateway.name);

  constructor(private readonly envService: EnvService) {}

  public async authorizeEtfService(): Promise<boolean> {
    const url = this.envService.get('BANK_AUTHORIZATION_URL');

    try {
      const response = await fetch(url, {
        method: 'GET',
      });

      if (!response.ok) {
        this.logger.error(`Request failed with status ${response.status}`);
        return false;
      }

      const data: IResponse = await response.json();

      return data.status === 'success' && data.data.authorization;
    } catch (error) {
      this.logger.error('Authorization request failed:', error);
      return false;
    }
  }
}
