export interface ISendEmailOfTransfer {
  email: string;
  value: number;
  payer: {
    name: string;
    document: string;
  };
  payee: {
    name: string;
    document: string;
  };
}

type INotifyUserEventType = 'SendEmailOfTransfer' | 'Others';

interface INotifyUserEventData {
  SendEmailOfTransfer: ISendEmailOfTransfer;
  Others: unknown;
}

export type INotifyUser = {
  eventType: INotifyUserEventType;
  data: INotifyUserEventData[INotifyUserEventType];
};
