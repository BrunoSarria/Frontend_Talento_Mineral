import { mockDb } from "../utils/mockDb";
import { delay } from "../utils/delay";

export interface OnboardingStep {
  key: string;
  label: string;
  done: boolean;
}

export interface OnboardingStatus {
  steps: OnboardingStep[];
  percentComplete: number;
  dismissed: boolean;
}

export const onboardingService = {
  async getStatus(): Promise<OnboardingStatus> {
    await delay(150);
    const jobs = mockDb.getJobs();
    const candidates = mockDb.getCandidates();

    const steps: OnboardingStep[] = [
      { key: "company", label: "Cadastro da empresa", done: true },
      { key: "profile", label: "Perfil do recrutador", done: true },
      { key: "job", label: "Criar sua primeira vaga", done: jobs.length > 0 },
      { key: "unlock", label: "Desbloquear um currículo", done: candidates.some((c) => c.isUnlocked) },
    ];

    const percentComplete = Math.round((steps.filter((s) => s.done).length / steps.length) * 100);

    return { steps, percentComplete, dismissed: mockDb.isOnboardingDismissed() };
  },

  dismiss(): void {
    mockDb.dismissOnboarding();
  },
};
