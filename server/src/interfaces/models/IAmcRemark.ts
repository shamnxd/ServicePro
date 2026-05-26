export interface IAmcRemark {
  id?: string;
  user: string;
  date: Date;
  text: string;
}

export interface IAmcPayment {
  date: Date;
  amount: number;
  type: "Advance" | "Payment";
  note?: string;
  recordedBy?: string;
}
