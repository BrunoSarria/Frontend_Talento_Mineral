import type { CreditBalance, CreditPlan, CreditTransaction } from "../types/credit";

export const initialCreditBalance: CreditBalance = {
  available: 42,
  acquired: 90,
  used: 48,
};

export const mockCreditPlans: CreditPlan[] = [
  { id: "plan-010", name: "Inicial", credits: 10, price: 99 },
  { id: "plan-050", name: "Crescimento", credits: 50, price: 399, highlight: "Mais escolhido" },
  { id: "plan-100", name: "Operação Plena", credits: 100, price: 699 },
];

export const initialCreditHistory: CreditTransaction[] = [
  {
    id: "tx-001",
    type: "UNLOCK",
    description: "Desbloqueio de currículo — Roberto Almeida Souza",
    amount: -1,
    createdAt: "2026-09-10T10:12:00.000Z",
  },
  {
    id: "tx-002",
    type: "PURCHASE",
    description: "Compra de plano Crescimento",
    amount: 50,
    createdAt: "2026-09-09T08:00:00.000Z",
  },
  {
    id: "tx-003",
    type: "UNLOCK",
    description: "Desbloqueio de currículo — Fernanda Costa Lima",
    amount: -1,
    createdAt: "2026-09-05T15:40:00.000Z",
  },
  {
    id: "tx-004",
    type: "UNLOCK",
    description: "Desbloqueio de currículo — Diego Ferreira Martins",
    amount: -1,
    createdAt: "2026-08-28T09:22:00.000Z",
  },
  {
    id: "tx-005",
    type: "PURCHASE",
    description: "Compra de plano Inicial",
    amount: 10,
    createdAt: "2026-08-15T11:05:00.000Z",
  },
];
