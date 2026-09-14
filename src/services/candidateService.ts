import type { Candidate, CandidateFilters } from "../types/candidate";
import type { Paginated } from "../types/api";
import { delay } from "../utils/delay";
import { mockDb } from "../utils/mockDb";
import { mockDb as db } from "../utils/mockDb";
import { MOCK_LATENCY } from "./config";
import { creditService } from "./creditService";
import { favoriteService } from "./favoriteService";

const DEFAULT_PAGE_SIZE = 8;

function matchesFilters(candidate: Candidate, filters: CandidateFilters): boolean {
  if (filters.search) {
    const term = filters.search.toLowerCase();
    const haystack = [
      candidate.professionalCategory,
      candidate.city,
      ...(candidate.skills ?? []),
    ]
      .join(" ")
      .toLowerCase();
    if (!haystack.includes(term)) return false;
  }
  if (filters.city && filters.city !== "Todas" && candidate.city !== filters.city) return false;
  if (
    filters.professionalCategory &&
    filters.professionalCategory !== "Todas" &&
    candidate.professionalCategory !== filters.professionalCategory
  )
    return false;
  if (filters.cnh && filters.cnh !== "Todas" && candidate.cnh !== filters.cnh) return false;
  if (filters.availability && filters.availability !== "Qualquer" && candidate.availability !== filters.availability)
    return false;
  if (filters.ageRange && filters.ageRange !== "Todas" && candidate.ageRange !== filters.ageRange) return false;
  if (filters.experience && filters.experience !== "Qualquer") {
    const minYears = Number(filters.experience.replace("+", ""));
    if (!Number.isNaN(minYears) && (candidate.experienceYears ?? 0) < minYears) return false;
  }
  return true;
}

/**
 * Endpoints futuros:
 *   GET /api/candidatos/:page
 *   GET /api/curriculos/:id
 *   GET /api/curriculos/:id/desbloqueio
 */
export const candidateService = {
  async getCandidates(filters: CandidateFilters = {}): Promise<Paginated<Candidate>> {
    await delay(MOCK_LATENCY);
    const page = filters.page ?? 1;
    const pageSize = filters.pageSize ?? DEFAULT_PAGE_SIZE;

    const favoriteIds = filters.favoritesOnly ? new Set(favoriteService.getFavoriteIdsSync()) : null;

    const all = mockDb
      .getCandidates()
      .filter((c) => matchesFilters(c, filters))
      .filter((c) => !favoriteIds || favoriteIds.has(c.id))
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

    const start = (page - 1) * pageSize;
    const items = all.slice(start, start + pageSize);

    return { items, page, pageSize, total: all.length };
  },

  async getCandidateById(id: string): Promise<Candidate> {
    await delay(MOCK_LATENCY);
    const candidate = mockDb.getCandidates().find((c) => c.id === id);
    if (!candidate) {
      throw { status: 404, message: "Currículo não encontrado." };
    }
    return candidate;
  },

  /** RN-3, RN-4, RN-5, RN-6: desbloqueio custa 1 crédito e só ocorre se houver saldo. */
  async unlockCandidate(id: string): Promise<Candidate> {
    await delay(MOCK_LATENCY);
    const candidates = db.getCandidates();
    const candidate = candidates.find((c) => c.id === id);
    if (!candidate) {
      throw { status: 404, message: "Currículo não encontrado." };
    }
    if (candidate.isUnlocked) return candidate;

    const balance = db.getBalance();
    if (balance.available < 1) {
      throw { status: 422, message: "Você não possui créditos suficientes." };
    }

    // Consome o crédito e só então marca como desbloqueado — se qualquer etapa
    // falhasse aqui, o crédito não deveria ter sido debitado (RN-5).
    creditService.debitForUnlock(candidate);

    const updated: Candidate = {
      ...candidate,
      isUnlocked: true,
      name: candidate.name ?? `Currículo ${candidate.id.replace("cand-", "#")}`,
      contact: candidate.contact ?? {
        phone: "(28) 99900-" + candidate.id.slice(-4),
        email: `contato.${candidate.id}@exemplo.com`,
      },
    };
    const next = candidates.map((c) => (c.id === id ? updated : c));
    db.saveCandidates(next);
    return updated;
  },

  getDistinctCities(): string[] {
    const cities = new Set(mockDb.getCandidates().map((c) => c.city));
    return Array.from(cities).sort();
  },

  getDistinctCategories(): string[] {
    const categories = new Set(mockDb.getCandidates().map((c) => c.professionalCategory));
    return Array.from(categories).sort();
  },

  getDistinctAgeRanges(): string[] {
    const ranges = new Set(mockDb.getCandidates().map((c) => c.ageRange).filter((r): r is string => Boolean(r)));
    return Array.from(ranges).sort();
  },
};
