import type { Payment } from "../types/payment";
import type { CreditPlan } from "../types/credit";
import { delay } from "../utils/delay";
import { mockDb } from "../utils/mockDb";
import { MOCK_LATENCY } from "./config";
import { creditService } from "./creditService";

/**
 * Endpoint futuro:
 *   POST /api/pagamentos
 *
 * A integração real de pagamento (ex.: Mercado Pago) ainda será definida.
 * Este service apenas simula o ciclo PENDING → APPROVED de forma síncrona.
 */
export const paymentService = {
  async createPayment(plan: CreditPlan): Promise<Payment> {
    await delay(MOCK_LATENCY);

    const payment: Payment = {
      id: `pay-${Date.now()}`,
      planId: plan.id,
      planName: plan.name,
      amount: plan.price,
      status: "APPROVED",
      createdAt: new Date().toISOString(),
    };

    mockDb.savePayments([payment, ...mockDb.getPayments()]);
    creditService.creditForPurchase(plan);

    return payment;
  },

  async getHistory(): Promise<Payment[]> {
    await delay(MOCK_LATENCY);
    return mockDb.getPayments().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  },
};
