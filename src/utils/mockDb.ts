import type { Candidate } from "../types/candidate";
import type { Job, CandidateJobAssociation } from "../types/job";
import type { CreditBalance, CreditTransaction } from "../types/credit";
import type { Payment } from "../types/payment";
import type { AuthSession, Recruiter } from "../types/api";
import type { Notification, NotificationPreferences } from "../types/notification";
import type { FavoriteCandidate } from "../types/favorite";
import type { SavedFilter } from "../types/savedFilter";
import type { Company } from "../types/company";
import { mockCandidates } from "../mocks/candidates";
import { mockJobs, CURRENT_COMPANY_ID } from "../mocks/jobs";
import { initialCreditBalance, initialCreditHistory } from "../mocks/credits";
import { initialPayments } from "../mocks/payments";
import { initialNotifications } from "../mocks/notifications";
import { initialCompany } from "../mocks/company";
import { readStorage, writeStorage } from "./storage";

/**
 * Camada única de "banco de dados" simulado, persistida em localStorage.
 *
 * IMPORTANTE — multi-tenant: o pool de currículos (candidatos) é
 * GLOBAL/compartilhado, como aconteceria de verdade em um marketplace de
 * recrutamento (todas as empresas pesquisam a mesma base vinda do
 * WhatsApp). Já vagas, créditos, pagamentos, associações, favoritos,
 * filtros salvos, notificações e dados da empresa são isolados POR
 * EMPRESA (chave = companyId da sessão atual), para que criar uma nova
 * conta comece "do zero" em vez de herdar os dados da conta de demonstração.
 *
 * O desbloqueio de um currículo também é por empresa: o registro de QUAL
 * currículo cada empresa já desbloqueou fica em `db:unlocked:<companyId>`.
 * Os dados revelados (nome/contato) do currículo em si são gerados uma
 * única vez e reaproveitados por qualquer empresa que desbloquear aquele
 * mesmo currículo depois — assim como aconteceria com uma pessoa real.
 */

const KEYS = {
  candidates: "db:candidates",
  session: "db:session",
  jobs: "db:jobs",
  associations: "db:associations",
  balance: "db:credit-balance",
  transactions: "db:credit-transactions",
  payments: "db:payments",
  notifications: "db:notifications",
  notificationPrefs: "db:notification-prefs",
  favorites: "db:favorites",
  savedFilters: "db:saved-filters",
  onboarding: "db:onboarding-dismissed",
  company: "db:company",
  unlocked: "db:unlocked",
} as const;

const DEFAULT_NOTIFICATION_PREFS: NotificationPreferences = {
  newMatches: true,
  lowCredits: true,
  approvedPurchases: true,
  jobUpdates: true,
  otherNotices: false,
};

/** Créditos iniciais para uma empresa recém-cadastrada (fora da demo). */
const STARTER_BALANCE: CreditBalance = { available: 10, acquired: 10, used: 0 };

export const DEMO_RECRUITER: Recruiter = {
  id: "rec-001",
  name: "Ana Beatriz Correia",
  email: "demo@talentomineral.com",
  phone: "(28) 99900-1234",
  companyId: CURRENT_COMPANY_ID,
  companyName: "Rochas Cachoeiro Exportação Ltda.",
};

export const DEMO_CREDENTIALS = {
  email: "demo@talentomineral.com",
  password: "123456",
};

/** IDs pré-revelados na conta de demonstração (nome/contato já preenchidos no mock). */
const DEMO_UNLOCKED_IDS = mockCandidates.filter((c) => c.isUnlocked).map((c) => c.id);

function currentCompanyId(): string {
  const session = readStorage<AuthSession | null>(KEYS.session, null);
  return session?.recruiter.companyId ?? CURRENT_COMPANY_ID;
}

function isDemoCompany(companyId: string): boolean {
  return companyId === CURRENT_COMPANY_ID;
}

function scoped(base: string, companyId = currentCompanyId()): string {
  return `${base}:${companyId}`;
}

export const mockDb = {
  // ---- Pool de currículos: GLOBAL, compartilhado entre todas as empresas ----
  getCandidates(): Candidate[] {
    return readStorage<Candidate[]>(KEYS.candidates, mockCandidates);
  },
  saveCandidates(candidates: Candidate[]): void {
    writeStorage(KEYS.candidates, candidates);
  },

  /** IDs de currículos que a empresa atual já desbloqueou. */
  getUnlockedIds(): string[] {
    const companyId = currentCompanyId();
    const fallback = isDemoCompany(companyId) ? DEMO_UNLOCKED_IDS : [];
    return readStorage<string[]>(scoped(KEYS.unlocked, companyId), fallback);
  },
  /** Garante que o currículo tenha nome/contato gerados (uma única vez, reaproveitado por todas as empresas) e marca como desbloqueado para a empresa atual. */
  unlockForCurrentCompany(candidateId: string): Candidate {
    const candidates = mockDb.getCandidates();
    const candidate = candidates.find((c) => c.id === candidateId);
    if (!candidate) throw { status: 404, message: "Currículo não encontrado." };

    let revealed = candidate;
    if (!candidate.name || !candidate.contact) {
      revealed = {
        ...candidate,
        name: candidate.name ?? `Currículo ${candidate.id.replace("cand-", "#")}`,
        contact: candidate.contact ?? {
          phone: "(28) 99900-" + candidate.id.slice(-4),
          email: `contato.${candidate.id}@exemplo.com`,
        },
      };
      mockDb.saveCandidates(candidates.map((c) => (c.id === candidateId ? revealed : c)));
    }

    const companyId = currentCompanyId();
    const unlockedIds = mockDb.getUnlockedIds();
    if (!unlockedIds.includes(candidateId)) {
      writeStorage(scoped(KEYS.unlocked, companyId), [...unlockedIds, candidateId]);
    }

    return revealed;
  },

  // ---- Dados isolados por empresa ----
  getJobs(): Job[] {
    const companyId = currentCompanyId();
    const fallback = isDemoCompany(companyId) ? mockJobs : [];
    return readStorage<Job[]>(scoped(KEYS.jobs, companyId), fallback);
  },
  saveJobs(jobs: Job[]): void {
    writeStorage(scoped(KEYS.jobs), jobs);
  },

  getAssociations(): CandidateJobAssociation[] {
    const companyId = currentCompanyId();
    const fallback = isDemoCompany(companyId)
      ? mockCandidates
          .filter((c) => c.jobIds.length > 0)
          .flatMap((c) =>
            c.jobIds.map((jobId, idx) => ({
              id: `assoc-${c.id}-${idx}`,
              candidateId: c.id,
              jobId,
              status: "ASSOCIATED" as const,
              createdAt: c.createdAt,
            }))
          )
      : [];
    return readStorage<CandidateJobAssociation[]>(scoped(KEYS.associations, companyId), fallback);
  },
  saveAssociations(associations: CandidateJobAssociation[]): void {
    writeStorage(scoped(KEYS.associations), associations);
  },

  getBalance(): CreditBalance {
    const companyId = currentCompanyId();
    const fallback = isDemoCompany(companyId) ? initialCreditBalance : STARTER_BALANCE;
    return readStorage<CreditBalance>(scoped(KEYS.balance, companyId), fallback);
  },
  saveBalance(balance: CreditBalance): void {
    writeStorage(scoped(KEYS.balance), balance);
  },

  getTransactions(): CreditTransaction[] {
    const companyId = currentCompanyId();
    const fallback = isDemoCompany(companyId) ? initialCreditHistory : [];
    return readStorage<CreditTransaction[]>(scoped(KEYS.transactions, companyId), fallback);
  },
  saveTransactions(transactions: CreditTransaction[]): void {
    writeStorage(scoped(KEYS.transactions), transactions);
  },

  getPayments(): Payment[] {
    const companyId = currentCompanyId();
    const fallback = isDemoCompany(companyId) ? initialPayments : [];
    return readStorage<Payment[]>(scoped(KEYS.payments, companyId), fallback);
  },
  savePayments(payments: Payment[]): void {
    writeStorage(scoped(KEYS.payments), payments);
  },

  getSession(): AuthSession | null {
    return readStorage<AuthSession | null>(KEYS.session, null);
  },
  saveSession(session: AuthSession | null): void {
    writeStorage(KEYS.session, session);
    if (session) {
      window.localStorage.setItem("talento-mineral:session-token", session.token);
    } else {
      window.localStorage.removeItem("talento-mineral:session-token");
    }
  },
  updateSessionRecruiter(recruiter: Recruiter): void {
    const session = mockDb.getSession();
    if (!session) return;
    mockDb.saveSession({ ...session, recruiter });
  },

  getNotifications(): Notification[] {
    const companyId = currentCompanyId();
    const fallback = isDemoCompany(companyId)
      ? initialNotifications
      : [
          {
            id: "notif-welcome",
            title: "Bem-vindo ao Talento Mineral",
            description: "Sua conta foi criada com sucesso. Explore os currículos disponíveis.",
            type: "SYSTEM" as const,
            read: false,
            createdAt: new Date().toISOString(),
          },
        ];
    return readStorage<Notification[]>(scoped(KEYS.notifications, companyId), fallback);
  },
  saveNotifications(notifications: Notification[]): void {
    writeStorage(scoped(KEYS.notifications), notifications);
  },
  getNotificationPreferences(): NotificationPreferences {
    return readStorage<NotificationPreferences>(scoped(KEYS.notificationPrefs), DEFAULT_NOTIFICATION_PREFS);
  },
  saveNotificationPreferences(prefs: NotificationPreferences): void {
    writeStorage(scoped(KEYS.notificationPrefs), prefs);
  },

  getFavorites(): FavoriteCandidate[] {
    return readStorage<FavoriteCandidate[]>(scoped(KEYS.favorites), []);
  },
  saveFavorites(favorites: FavoriteCandidate[]): void {
    writeStorage(scoped(KEYS.favorites), favorites);
  },

  getSavedFilters(): SavedFilter[] {
    return readStorage<SavedFilter[]>(scoped(KEYS.savedFilters), []);
  },
  saveSavedFilters(filters: SavedFilter[]): void {
    writeStorage(scoped(KEYS.savedFilters), filters);
  },

  isOnboardingDismissed(): boolean {
    return readStorage<boolean>(scoped(KEYS.onboarding), false);
  },
  dismissOnboarding(): void {
    writeStorage(scoped(KEYS.onboarding), true);
  },

  getCompany(): Company {
    const companyId = currentCompanyId();
    const session = mockDb.getSession();
    const fallback: Company = isDemoCompany(companyId)
      ? initialCompany
      : { id: companyId, name: session?.recruiter.companyName ?? "Minha empresa", city: "" };
    return readStorage<Company>(scoped(KEYS.company, companyId), fallback);
  },
  saveCompany(company: Company): void {
    writeStorage(scoped(KEYS.company, company.id), company);
  },
};
