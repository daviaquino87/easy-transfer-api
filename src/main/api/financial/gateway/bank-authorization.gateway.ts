interface IResponse {
  status: string;
  data: {
    authorization: boolean;
  };
}

export class BankAuthorizationGateway {
  private static readonly url = 'https://util.devi.tools/api/v2/authorize';

  public static async authorizeEtfService(): Promise<boolean> {
    try {
      const response = await fetch(BankAuthorizationGateway.url, {
        method: 'GET',
      });

      const data: IResponse = await response.json();

      return data.status === 'success' && data.data.authorization;
    } catch (error) {
      console.error('Authorization request failed:', error);
      return false;
    }
  }
}
