export interface Payment extends Document {
  name: string;
  amount: string;
  initiatorId: string;
  date: Date;
  completed?: boolean;
  completedOn?: Date;
  splitters: [
    {
      id: string;
      name: string;
      email: string;
      is_initiator?: boolean;
      share_amount: string;
      payment_status: number;
      date_paid?: Date;
    }
  ];
}
