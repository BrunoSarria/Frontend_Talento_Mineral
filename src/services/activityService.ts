import type { ActivityItem } from "../types/activity";
import { mockDb } from "../utils/mockDb";
import { delay } from "../utils/delay";
import { authService } from "./authService";

function currentCompanyId(): string {
  return authService.getSession()?.recruiter.companyId ?? "company-001";
}

/**
 * Agrega eventos de diferentes partes do produto (créditos, associações,
 * vagas) em uma única linha do tempo, usada no Dashboard ("Atividade
 * recente") e no Histórico (aba "Vagas" e visão "Todos"). Quando o backend
 * existir, isso provavelmente vira um único endpoint de auditoria/eventos;
 * por ora é derivado dos mesmos dados que já alimentam os outros services.
 */
function buildActivity(): ActivityItem[] {
  const companyId = currentCompanyId();
  const transactions = mockDb.getTransactions().map<ActivityItem>((tx) => ({
    id: `activity-${tx.id}`,
    type: tx.type,
    title: tx.type === "UNLOCK" ? tx.description : tx.description,
    amount: tx.amount,
    createdAt: tx.createdAt,
  }));

  const candidates = mockDb.getCandidates();
  const jobs = mockDb.getJobs().filter((j) => j.companyId === companyId);
  const jobIds = new Set(jobs.map((j) => j.id));

  const associations = mockDb
    .getAssociations()
    .filter((a) => jobIds.has(a.jobId))
    .map<ActivityItem | null>((assoc) => {
      const candidate = candidates.find((c) => c.id === assoc.candidateId);
      const job = jobs.find((j) => j.id === assoc.jobId);
      if (!candidate || !job) return null;
      const label = candidate.isUnlocked && candidate.name ? candidate.name : candidate.professionalCategory;
      return {
        id: `activity-${assoc.id}`,
        type: "ASSOCIATION",
        title: `${label} associado à vaga ${job.title}`,
        createdAt: assoc.createdAt,
      };
    });

  const jobsCreated = jobs.map<ActivityItem>((job) => ({
    id: `activity-job-${job.id}`,
    type: "JOB_CREATED",
    title: `Vaga criada: ${job.title}`,
    description: job.location,
    createdAt: job.createdAt,
  }));

  return [...transactions, ...associations.filter((a): a is ActivityItem => a !== null), ...jobsCreated].sort((a, b) =>
    a.createdAt < b.createdAt ? 1 : -1
  );
}

export const activityService = {
  async getRecentActivity(limit = 8): Promise<ActivityItem[]> {
    await delay(300);
    return buildActivity().slice(0, limit);
  },

  async getActivityByType(types: ActivityItem["type"][]): Promise<ActivityItem[]> {
    await delay(300);
    return buildActivity().filter((a) => types.includes(a.type));
  },
};
