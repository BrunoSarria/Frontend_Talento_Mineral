import type { AuthSession, Recruiter } from "../types/api";
import { delay } from "../utils/delay";
import { DEMO_CREDENTIALS, DEMO_RECRUITER, mockDb } from "../utils/mockDb";
import { MOCK_LATENCY } from "./config";

export interface RegisterPayload {
  recruiterName: string;
  recruiterEmail: string;
  recruiterPhone: string;
  companyName: string;
  companyDocument?: string;
  companyCity: string;
  password: string;
}

/**
 * Endpoints futuros:
 *   POST /api/register
 *   POST /api/login
 *   POST /api/logout
 */
export const authService = {
  async login(email: string, password: string): Promise<AuthSession> {
    await delay(MOCK_LATENCY);

    if (email.trim().toLowerCase() !== DEMO_CREDENTIALS.email) {
      throw { status: 401, message: "E-mail ou senha inválidos." };
    }
    if (password !== DEMO_CREDENTIALS.password) {
      throw { status: 401, message: "E-mail ou senha inválidos." };
    }

    const session: AuthSession = {
      token: `mock-token-${Date.now()}`,
      recruiter: DEMO_RECRUITER,
    };
    mockDb.saveSession(session);
    return session;
  },

  async register(payload: RegisterPayload): Promise<AuthSession> {
    await delay(MOCK_LATENCY);

    if (payload.recruiterEmail.trim().toLowerCase() === DEMO_CREDENTIALS.email) {
      throw {
        status: 409,
        message: "Já existe uma conta com este e-mail.",
        fieldErrors: { recruiterEmail: "E-mail já cadastrado." },
      };
    }

    const recruiter: Recruiter = {
      id: `rec-${Date.now()}`,
      name: payload.recruiterName,
      email: payload.recruiterEmail,
      phone: payload.recruiterPhone,
      companyId: `company-${Date.now()}`,
      companyName: payload.companyName,
    };
    const session: AuthSession = { token: `mock-token-${Date.now()}`, recruiter };
    mockDb.saveSession(session);
    return session;
  },

  async logout(): Promise<void> {
    await delay(200);
    mockDb.saveSession(null);
  },

  getSession(): AuthSession | null {
    return mockDb.getSession();
  },
};
