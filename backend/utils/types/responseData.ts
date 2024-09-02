export interface ResponseData {
    data: {
      payee: string;
      share_amount: number;
      name: string;
      initiator: string;
      email: string;
      initiator_id: string;
    };
    to: string;
    disposition: string;
  }