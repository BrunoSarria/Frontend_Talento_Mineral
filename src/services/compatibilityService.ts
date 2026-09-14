import type { Candidate } from "../types/candidate";
import type { Job } from "../types/job";
import type { CompatibilityResult, MatchCriterion } from "../types/compatibility";

/**
 * Lógica de compatibilidade determinística (sem IA), usada apenas como
 * apoio visual para o recrutador — nunca como decisão automática de
 * contratação. A arquitetura permite substituir esta implementação por uma
 * chamada de backend/IA no futuro sem alterar quem a consome (ver
 * `JobDetailsPage` e `CandidateComparePage`).
 *
 * Pontuação:
 *   Categoria profissional = 30
 *   Experiência             = 25
 *   CNH                     = 20
 *   Cidade                  = 15
 *   Disponibilidade         = 10
 */
function parseMinYears(experience?: string): number | null {
  if (!experience) return null;
  const match = experience.match(/(\d+(?:[.,]\d+)?)/);
  if (!match) return null;
  return Number(match[1].replace(",", "."));
}

const FAVORABLE_AVAILABILITY = new Set(["Imediata", "15 dias"]);

export function calculateCompatibility(candidate: Candidate, job: Job): CompatibilityResult {
  const criteria: MatchCriterion[] = [];

  const categoryMatch = candidate.professionalCategory === job.professionalCategory;
  criteria.push({ label: "Categoria profissional", matched: categoryMatch, points: 30 });

  const requiredYears = parseMinYears(job.experience);
  const experienceMatch = requiredYears === null ? true : (candidate.experienceYears ?? 0) >= requiredYears;
  criteria.push({ label: "Experiência", matched: experienceMatch, points: 25 });

  const cnhMatch = !job.cnh ? true : Boolean(candidate.cnh && candidate.cnh !== "Nenhuma" && candidate.cnh.includes(job.cnh));
  criteria.push({ label: "CNH", matched: cnhMatch, points: 20 });

  const cityMatch = candidate.city === job.location;
  criteria.push({ label: "Cidade", matched: cityMatch, points: 15 });

  const availabilityMatch = Boolean(candidate.availability && FAVORABLE_AVAILABILITY.has(candidate.availability));
  criteria.push({ label: "Disponibilidade", matched: availabilityMatch, points: 10 });

  const score = criteria.reduce((sum, c) => sum + (c.matched ? c.points : 0), 0);

  return { candidateId: candidate.id, jobId: job.id, score, criteria };
}

export const compatibilityService = {
  calculate: calculateCompatibility,

  /** Um currículo é considerado "compatível" a partir deste percentual. */
  MINIMUM_SCORE: 60,

  isCompatible(candidate: Candidate, job: Job): boolean {
    return calculateCompatibility(candidate, job).score >= compatibilityService.MINIMUM_SCORE;
  },
};
