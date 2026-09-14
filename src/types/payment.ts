export type PaymentStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Payment {
  id: string;
  planId: string;
  planName: string;
  amount: number;
  status: PaymentStatus;
  createdAt: string;
}
