import type { Payment } from "../types/payment";

export const initialPayments: Payment[] = [
  {
    id: "pay-001",
    planId: "plan-050",
    planName: "Crescimento",
    amount: 399,
    status: "APPROVED",
    createdAt: "2026-09-09T08:00:00.000Z",
  },
  {
    id: "pay-002",
    planId: "plan-010",
    planName: "Inicial",
    amount: 99,
    status: "APPROVED",
    createdAt: "2026-08-15T11:05:00.000Z",
  },
  {
    id: "pay-003",
    planId: "plan-100",
    planName: "Operação Plena",
    amount: 699,
    status: "REJECTED",
    createdAt: "2026-07-02T14:20:00.000Z",
  },
];
