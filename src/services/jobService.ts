import type { Job, JobFormData, CandidateJobAssociation } from "../types/job";
import type { Candidate } from "../types/candidate";
import { delay } from "../utils/delay";
import { mockDb } from "../utils/mockDb";
import { MOCK_LATENCY } from "./config";
import { authService } from "./authService";

function currentCompanyId(): string {
  const session = authService.getSession();
  return session?.recruiter.companyId ?? "company-001";
}

/**
 * Endpoints futuros:
 *   GET    /api/vagas
 *   POST   /api/vagas
 *   GET    /api/vagas/:id
 *   PUT    /api/vagas/:id
 *   PATCH  /api/vagas/:id/status
 *   GET    /api/vagas/:id/candidatos
 *   POST   /api/vagas/:id/candidatos
 */
export const jobService = {
  async getJobs(): Promise<Job[]> {
    await delay(MOCK_LATENCY);
    const companyId = currentCompanyId();
    return mockDb
      .getJobs()
      .filter((j) => j.companyId === companyId)
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  },

  async getJobById(id: string): Promise<Job> {
    await delay(MOCK_LATENCY);
    const job = mockDb.getJobs().find((j) => j.id === id && j.companyId === currentCompanyId());
    if (!job) throw { status: 404, message: "Vaga não encontrada." };
    return job;
  },

  async createJob(data: JobFormData): Promise<Job> {
    await delay(MOCK_LATENCY);
    const job: Job = {
      id: `job-${Date.now()}`,
      companyId: currentCompanyId(),
      candidateCount: 0,
      createdAt: new Date().toISOString(),
      ...data,
    };
    mockDb.saveJobs([job, ...mockDb.getJobs()]);
    return job;
  },

  async updateJob(id: string, data: JobFormData): Promise<Job> {
    await delay(MOCK_LATENCY);
    const jobs = mockDb.getJobs();
    const existing = jobs.find((j) => j.id === id && j.companyId === currentCompanyId());
    if (!existing) throw { status: 404, message: "Vaga não encontrada." };

    const updated: Job = { ...existing, ...data };
    mockDb.saveJobs(jobs.map((j) => (j.id === id ? updated : j)));
    return updated;
  },

  /** RN-9: alteração de status deve refletir imediatamente na interface. */
  async updateJobStatus(id: string, status: Job["status"]): Promise<Job> {
    await delay(300);
    const jobs = mockDb.getJobs();
    const existing = jobs.find((j) => j.id === id && j.companyId === currentCompanyId());
    if (!existing) throw { status: 404, message: "Vaga não encontrada." };

    const updated: Job = { ...existing, status };
    mockDb.saveJobs(jobs.map((j) => (j.id === id ? updated : j)));
    return updated;
  },

  async getJobCandidates(jobId: string): Promise<Candidate[]> {
    await delay(MOCK_LATENCY);
    const associations = mockDb.getAssociations().filter((a) => a.jobId === jobId && a.status === "ASSOCIATED");
    const candidateIds = new Set(associations.map((a) => a.candidateId));
    return mockDb.getCandidates().filter((c) => candidateIds.has(c.id));
  },

  /** RN-7, RN-8: associação só é permitida com vagas da própria empresa. */
  async associateCandidate(candidateId: string, jobId: string): Promise<CandidateJobAssociation> {
    await delay(MOCK_LATENCY);
    const job = mockDb.getJobs().find((j) => j.id === jobId);
    if (!job || job.companyId !== currentCompanyId()) {
      throw { status: 403, message: "Não é possível associar a uma vaga de outra empresa." };
    }

    const associations = mockDb.getAssociations();
    const already = associations.find(
      (a) => a.candidateId === candidateId && a.jobId === jobId && a.status === "ASSOCIATED"
    );
    if (already) return already;

    const association: CandidateJobAssociation = {
      id: `assoc-${Date.now()}`,
      candidateId,
      jobId,
      status: "ASSOCIATED",
      createdAt: new Date().toISOString(),
    };
    mockDb.saveAssociations([association, ...associations]);

    const jobs = mockDb.getJobs();
    mockDb.saveJobs(jobs.map((j) => (j.id === jobId ? { ...j, candidateCount: j.candidateCount + 1 } : j)));

    const candidates = mockDb.getCandidates();
    mockDb.saveCandidates(
      candidates.map((c) => (c.id === candidateId ? { ...c, jobIds: [...new Set([...c.jobIds, jobId])] } : c))
    );

    return association;
  },

  async getOpenJobs(): Promise<Job[]> {
    const jobs = await jobService.getJobs();
    return jobs.filter((j) => j.status === "OPEN");
  },
};
