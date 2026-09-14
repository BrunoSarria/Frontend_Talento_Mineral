import type { Recruiter } from "../types/api";
import type { Company, PlanSummary } from "../types/company";
import { delay } from "../utils/delay";
import { mockDb } from "../utils/mockDb";
import { currentPlan } from "../mocks/company";

/**
 * Endpoints futuros (sugestão):
 *   GET  /api/conta
 *   PUT  /api/conta
 *   PUT  /api/conta/senha
 *   GET  /api/empresa
 *   PUT  /api/empresa
 *   GET  /api/plano
 */
export const settingsService = {
  async updateAccount(data: Partial<Pick<Recruiter, "name" | "email" | "phone" | "role">>): Promise<Recruiter> {
    await delay(350);
    const session = mockDb.getSession();
    if (!session) throw { status: 401, message: "Sessão inválida." };
    const updated: Recruiter = { ...session.recruiter, ...data };
    mockDb.updateSessionRecruiter(updated);
    return updated;
  },

  async changePassword(_currentPassword: string, _newPassword: string): Promise<void> {
    await delay(400);
    // Mock: apenas simula o fluxo. Nenhuma senha é de fato validada/alterada
    // até que o backend exista.
  },

  async getCompany(): Promise<Company> {
    await delay(250);
    return mockDb.getCompany();
  },

  async updateCompany(data: Partial<Company>): Promise<Company> {
    await delay(350);
    const updated: Company = { ...mockDb.getCompany(), ...data };
    mockDb.saveCompany(updated);
    return updated;
  },

  async getPlanSummary(): Promise<PlanSummary> {
    await delay(200);
    return currentPlan;
  },
};
