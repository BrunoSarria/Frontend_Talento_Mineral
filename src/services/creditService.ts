import type { CreditBalance, CreditPlan, CreditTransaction } from "../types/credit";
import type { Candidate } from "../types/candidate";
import { delay } from "../utils/delay";
import { mockDb } from "../utils/mockDb";
import { mockCreditPlans } from "../mocks/credits";
import { MOCK_LATENCY } from "./config";
import { notificationService } from "./notificationService";

/** Abaixo deste saldo, disparamos um alerta de créditos baixos (uma vez, na transição). */
export const LOW_CREDIT_THRESHOLD = 9;
export const CRITICAL_CREDIT_THRESHOLD = 3;

/**
 * Endpoints futuros:
 *   GET /api/planos
 *   GET /api/creditos
 *   GET /api/creditos/historico
 */
export const creditService = {
  async getBalance(): Promise<CreditBalance> {
    await delay(300);
    return mockDb.getBalance();
  },

  async getPlans(): Promise<CreditPlan[]> {
    await delay(300);
    return mockCreditPlans;
  },

  async getHistory(): Promise<CreditTransaction[]> {
    await delay(MOCK_LATENCY);
    return mockDb.getTransactions().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  },

  /** Uso interno pelo candidateService ao desbloquear um currículo. */
  debitForUnlock(candidate: Candidate): void {
    const balance = mockDb.getBalance();
    const next: CreditBalance = {
      ...balance,
      available: balance.available - 1,
      used: balance.used + 1,
    };
    mockDb.saveBalance(next);

    const label = candidate.name ?? `currículo ${candidate.id}`;
    const tx: CreditTransaction = {
      id: `tx-${Date.now()}`,
      type: "UNLOCK",
      description: `Desbloqueio de currículo — ${label}`,
      amount: -1,
      createdAt: new Date().toISOString(),
    };
    mockDb.saveTransactions([tx, ...mockDb.getTransactions()]);

    if (balance.available > LOW_CREDIT_THRESHOLD && next.available <= LOW_CREDIT_THRESHOLD) {
      notificationService.push({
        title: "Seus créditos estão acabando",
        description: `Você possui apenas ${next.available} créditos disponíveis.`,
        type: "CREDIT",
        link: "/creditos",
      });
    }
  },

  /** Uso interno pelo paymentService após aprovação de uma compra. */
  creditForPurchase(plan: CreditPlan): void {
    const balance = mockDb.getBalance();
    const next: CreditBalance = {
      ...balance,
      available: balance.available + plan.credits,
      acquired: balance.acquired + plan.credits,
    };
    mockDb.saveBalance(next);

    const tx: CreditTransaction = {
      id: `tx-${Date.now()}`,
      type: "PURCHASE",
      description: `Compra de plano ${plan.name}`,
      amount: plan.credits,
      createdAt: new Date().toISOString(),
    };
    mockDb.saveTransactions([tx, ...mockDb.getTransactions()]);

    notificationService.push({
      title: "Compra aprovada",
      description: `Sua compra de ${plan.credits} créditos foi aprovada com sucesso.`,
      type: "PAYMENT",
      link: "/creditos",
    });
  },
};
