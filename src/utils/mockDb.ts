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
 * Isso permite que ações do recrutador (desbloquear currículo, criar vaga,
 * comprar créditos, associar candidato) sobrevivam a um refresh da página,
 * aproximando a experiência de um backend real mesmo sem ele existir ainda.
 */

const KEYS = {
  candidates: "db:candidates",
  jobs: "db:jobs",
  associations: "db:associations",
  balance: "db:credit-balance",
  transactions: "db:credit-transactions",
  payments: "db:payments",
  session: "db:session",
  notifications: "db:notifications",
  notificationPrefs: "db:notification-prefs",
  favorites: "db:favorites",
  savedFilters: "db:saved-filters",
  onboarding: "db:onboarding-dismissed",
  company: "db:company",
  seeded: "db:seeded-v1",
  seededExtras: "db:seeded-extras-v1",
} as const;

const DEFAULT_NOTIFICATION_PREFS: NotificationPreferences = {
  newMatches: true,
  lowCredits: true,
  approvedPurchases: true,
  jobUpdates: true,
  otherNotices: false,
};

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

function seedIfNeeded(): void {
  const seeded = readStorage<boolean>(KEYS.seeded, false);
  if (seeded) return;

  writeStorage(KEYS.candidates, mockCandidates);
  writeStorage(KEYS.jobs, mockJobs);
  writeStorage<CandidateJobAssociation[]>(
    KEYS.associations,
    mockCandidates
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
  );
  writeStorage(KEYS.balance, initialCreditBalance);
  writeStorage(KEYS.transactions, initialCreditHistory);
  writeStorage(KEYS.payments, initialPayments);
  writeStorage(KEYS.seeded, true);
}

/** Seed separado para os dados introduzidos na evolução do produto (fase 2),
 * para não resetar o progresso de quem já vinha usando a demonstração. */
function seedExtrasIfNeeded(): void {
  const seeded = readStorage<boolean>(KEYS.seededExtras, false);
  if (seeded) return;

  writeStorage(KEYS.notifications, initialNotifications);
  writeStorage(KEYS.notificationPrefs, DEFAULT_NOTIFICATION_PREFS);
  writeStorage<FavoriteCandidate[]>(KEYS.favorites, []);
  writeStorage<SavedFilter[]>(KEYS.savedFilters, []);
  writeStorage(KEYS.company, initialCompany);
  writeStorage(KEYS.seededExtras, true);
}

seedIfNeeded();
seedExtrasIfNeeded();

export const mockDb = {
  getCandidates(): Candidate[] {
    return readStorage<Candidate[]>(KEYS.candidates, mockCandidates);
  },
  saveCandidates(candidates: Candidate[]): void {
    writeStorage(KEYS.candidates, candidates);
  },
  getJobs(): Job[] {
    return readStorage<Job[]>(KEYS.jobs, mockJobs);
  },
  saveJobs(jobs: Job[]): void {
    writeStorage(KEYS.jobs, jobs);
  },
  getAssociations(): CandidateJobAssociation[] {
    return readStorage<CandidateJobAssociation[]>(KEYS.associations, []);
  },
  saveAssociations(associations: CandidateJobAssociation[]): void {
    writeStorage(KEYS.associations, associations);
  },
  getBalance(): CreditBalance {
    return readStorage<CreditBalance>(KEYS.balance, initialCreditBalance);
  },
  saveBalance(balance: CreditBalance): void {
    writeStorage(KEYS.balance, balance);
  },
  getTransactions(): CreditTransaction[] {
    return readStorage<CreditTransaction[]>(KEYS.transactions, initialCreditHistory);
  },
  saveTransactions(transactions: CreditTransaction[]): void {
    writeStorage(KEYS.transactions, transactions);
  },
  getPayments(): Payment[] {
    return readStorage<Payment[]>(KEYS.payments, initialPayments);
  },
  savePayments(payments: Payment[]): void {
    writeStorage(KEYS.payments, payments);
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
    return readStorage<Notification[]>(KEYS.notifications, initialNotifications);
  },
  saveNotifications(notifications: Notification[]): void {
    writeStorage(KEYS.notifications, notifications);
  },
  getNotificationPreferences(): NotificationPreferences {
    return readStorage<NotificationPreferences>(KEYS.notificationPrefs, DEFAULT_NOTIFICATION_PREFS);
  },
  saveNotificationPreferences(prefs: NotificationPreferences): void {
    writeStorage(KEYS.notificationPrefs, prefs);
  },

  getFavorites(): FavoriteCandidate[] {
    return readStorage<FavoriteCandidate[]>(KEYS.favorites, []);
  },
  saveFavorites(favorites: FavoriteCandidate[]): void {
    writeStorage(KEYS.favorites, favorites);
  },

  getSavedFilters(): SavedFilter[] {
    return readStorage<SavedFilter[]>(KEYS.savedFilters, []);
  },
  saveSavedFilters(filters: SavedFilter[]): void {
    writeStorage(KEYS.savedFilters, filters);
  },

  isOnboardingDismissed(): boolean {
    return readStorage<boolean>(KEYS.onboarding, false);
  },
  dismissOnboarding(): void {
    writeStorage(KEYS.onboarding, true);
  },

  getCompany(): Company {
    return readStorage<Company>(KEYS.company, initialCompany);
  },
  saveCompany(company: Company): void {
    writeStorage(KEYS.company, company);
  },
};
