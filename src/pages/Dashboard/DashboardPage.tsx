import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "../../components/layout/PageHeader";
import { StatCard } from "../../components/dashboard/StatCard";
import { ActivityFeed } from "../../components/dashboard/ActivityFeed";
import { OnboardingCard } from "../../components/dashboard/OnboardingCard";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorState } from "../../components/ui/ErrorState";
import { CreditAlertBanner } from "../../components/credits/CreditAlertBanner";
import { JobStatusBadge } from "../../components/jobs/JobStatusBadge";
import { useAuth } from "../../hooks/useAuth";
import { jobService } from "../../services/jobService";
import { candidateService } from "../../services/candidateService";
import { creditService, LOW_CREDIT_THRESHOLD } from "../../services/creditService";
import { activityService } from "../../services/activityService";
import { compatibilityService } from "../../services/compatibilityService";
import { onboardingService, type OnboardingStatus } from "../../services/onboardingService";
import { formatNumber } from "../../utils/format";
import type { Job } from "../../types/job";
import type { ActivityItem } from "../../types/activity";

interface Stats {
  openJobs: number;
  totalCandidates: number;
  unlockedCandidates: number;
  availableCredits: number;
}

interface JobWithCompatibility extends Job {
  compatibleCount: number;
  daysSinceLastCandidate: number;
}

interface Alert {
  id: string;
  message: string;
}

export function DashboardPage() {
  const { session } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [jobs, setJobs] = useState<JobWithCompatibility[] | null>(null);
  const [activity, setActivity] = useState<ActivityItem[] | null>(null);
  const [onboarding, setOnboarding] = useState<OnboardingStatus | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setError(false);
    try {
      const [rawJobs, candidatesPage, balance, recentActivity, onboardingStatus] = await Promise.all([
        jobService.getJobs(),
        candidateService.getCandidates({ pageSize: 1000 }),
        creditService.getBalance(),
        activityService.getRecentActivity(6),
        onboardingService.getStatus(),
      ]);

      const unlockedCount = candidatesPage.items.filter((c) => c.isUnlocked).length;
      setStats({
        openJobs: rawJobs.filter((j) => j.status === "OPEN").length,
        totalCandidates: candidatesPage.total,
        unlockedCandidates: unlockedCount,
        availableCredits: balance.available,
      });

      const jobsWithCompatibility = await Promise.all(
        rawJobs.slice(0, 5).map(async (job) => {
          const jobCandidates = await jobService.getJobCandidates(job.id);
          const compatibleCount = jobCandidates.filter((c) => compatibilityService.isCompatible(c, job)).length;
          const lastActivity = jobCandidates.length > 0 ? job.createdAt : job.createdAt;
          const daysSinceLastCandidate = Math.floor((Date.now() - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24));
          return { ...job, compatibleCount, daysSinceLastCandidate };
        })
      );
      setJobs(jobsWithCompatibility);
      setActivity(recentActivity);
      setOnboarding(onboardingStatus);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleDismissOnboarding() {
    onboardingService.dismiss();
    setOnboarding((prev) => (prev ? { ...prev, dismissed: true } : prev));
  }

  const firstName = session?.recruiter.name.split(" ")[0] ?? "";

  const alerts: Alert[] =
    stats && jobs
      ? [
          ...(stats.availableCredits <= LOW_CREDIT_THRESHOLD
            ? [{ id: "credits", message: `Você possui apenas ${stats.availableCredits} créditos disponíveis.` }]
            : []),
          ...jobs
            .filter((j) => j.status === "OPEN" && j.daysSinceLastCandidate >= 10)
            .map((j) => ({ id: `stale-${j.id}`, message: `Sua vaga "${j.title}" está sem novos currículos há ${j.daysSinceLastCandidate} dias.` })),
        ]
      : [];

  if (error) {
    return (
      <div>
        <PageHeader title="Dashboard" />
        <ErrorState onRetry={load} />
      </div>
    );
  }

  return (
    <div>
      {/* Faixa institucional de contexto de mercado. */}
      <div className="mb-6 flex flex-col gap-4 rounded-[var(--radius-lg)] bg-[var(--color-primary-deep)] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-white/10 text-white dark:text-[#001d33]"
            aria-hidden="true"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2.5 12.5L6.5 8.2L9.5 10.8L15.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M11.8 4.5H15.5V8.1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <div className="min-w-0">
            <p className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white/15 px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.06em] text-white dark:text-[#001d33]">
                Mercado ativo
              </span>
              <span className="text-[12px] text-white/60 dark:text-[#001d33]/60">Base atualizada continuamente</span>
            </p>
            <p className="mt-1.5 font-display text-[16px] font-bold leading-snug text-white dark:text-[#001d33]">
              Banco de talentos aquecido: novos currículos técnicos de rochas ornamentais e mineração chegam toda semana
              pelo WhatsApp.
            </p>
          </div>
        </div>
        <Link to="/curriculos" className="shrink-0">
          <span className="inline-flex h-10 items-center gap-2 rounded-[var(--radius-sm)] border border-white/25 px-4 text-[13px] font-semibold text-white transition-colors hover:bg-white/10 dark:text-[#001d33] dark:border-[#001d33]/25 dark:hover:bg-[#001d33]/10">
            Explorar currículos agora <span aria-hidden="true">→</span>
          </span>
        </Link>
      </div>

      <PageHeader
        eyebrow={session?.recruiter.companyName}
        title={`Bem-vindo ao Portal do Recrutador, ${firstName}!`}
        subtitle="Veja como está sua operação hoje."
      />

      {onboarding && !onboarding.dismissed && (
        <div className="mb-6">
          <OnboardingCard status={onboarding} onDismiss={handleDismissOnboarding} />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Vagas abertas" value={stats ? formatNumber(stats.openJobs) : undefined} loading={loading} icon={<IconBriefcase />} tone="primary" />
        <StatCard label="Currículos encontrados" value={stats ? formatNumber(stats.totalCandidates) : undefined} loading={loading} icon={<IconUsers />} tone="info" />
        <StatCard
          label="Desbloqueados"
          value={stats ? formatNumber(stats.unlockedCandidates) : undefined}
          loading={loading}
          icon={<IconUnlock />}
          tone="success"
          hint="Contatos acessíveis sem custo adicional"
        />
        <StatCard label="Créditos disponíveis" value={stats ? formatNumber(stats.availableCredits) : undefined} loading={loading} icon={<IconCoin />} tone="accent" />
      </div>

      {!loading && stats && (
        <div className="mt-4">
          <CreditAlertBanner available={stats.availableCredits} />
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <Link to="/vagas/nova">
          <Button variant="primary">+ Nova vaga</Button>
        </Link>
        <Link to="/curriculos">
          <Button variant="secondary">Buscar currículos</Button>
        </Link>
        <Link to="/curriculos?tab=favoritos">
          <Button variant="secondary">★ Favoritos</Button>
        </Link>
        <Link to="/creditos/comprar">
          <Button variant="accent">Comprar créditos</Button>
        </Link>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 font-display text-[18px] font-bold text-[var(--color-text)]">Atividade recente &amp; auditoria</h2>
          <Card padded={false}>
            {loading ? (
              <div className="animate-pulse p-5 text-sm text-[var(--color-text-secondary)]">Carregando...</div>
            ) : (
              <div className="px-5">
                <ActivityFeed items={activity ?? []} />
              </div>
            )}
          </Card>
        </div>

        <div>
          <h2 className="mb-3 font-display text-[18px] font-bold text-[var(--color-text)]">Atenção</h2>
          <Card padded={false}>
            {loading ? (
              <div className="animate-pulse p-5 text-sm text-[var(--color-text-secondary)]">Carregando...</div>
            ) : alerts.length === 0 ? (
              <div className="p-5">
                <EmptyState title="Tudo em ordem por aqui." description="Nenhum alerta no momento." />
              </div>
            ) : (
              <ul className="flex flex-col divide-y divide-[var(--color-border)]">
                {alerts.map((alert) => (
                  <li key={alert.id} className="flex items-start gap-2.5 px-5 py-3 text-sm text-[var(--color-text)]">
                    <span aria-hidden="true">⚠</span> {alert.message}
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>

      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-[18px] font-bold text-[var(--color-text)]">Suas vagas</h2>
          <Link to="/vagas" className="text-sm font-medium text-[var(--color-primary)] hover:underline">
            Ver todas
          </Link>
        </div>
        {loading ? (
          <div className="grid gap-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="h-16 animate-pulse" />
            ))}
          </div>
        ) : jobs && jobs.length > 0 ? (
          <div className="grid gap-3">
            {jobs.map((job) => (
              <Link key={job.id} to={`/vagas/${job.id}`}>
                <Card className="flex flex-col gap-2 transition-colors hover:border-[var(--color-border-strong)] sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="font-display text-[14px] font-bold text-[var(--color-primary)]">{job.title}</p>
                    <p className="text-[13px] text-[var(--color-text-secondary)]">
                      {job.location} · {job.professionalCategory}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-[13px] tabular text-[var(--color-text-secondary)]">
                      {job.candidateCount} currículos
                    </span>
                    <span className="text-[13px] font-semibold tabular text-[var(--color-success)]">
                      {job.compatibleCount} compatíveis
                    </span>
                    <JobStatusBadge status={job.status} />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Você ainda não possui vagas cadastradas."
            action={
              <Link to="/vagas/nova">
                <Button size="sm">Criar primeira vaga</Button>
              </Link>
            }
          />
        )}
      </div>
    </div>
  );
}

function IconBriefcase() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="2.5" y="6.2" width="15" height="10" rx="1.4" stroke="currentColor" strokeWidth="1.4" />
      <path d="M7 6.2V4.8C7 4 7.6 3.4 8.4 3.4H11.6C12.4 3.4 13 4 13 4.8V6.2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M2.5 10.8H17.5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
function IconUsers() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="7.5" cy="6.5" r="2.7" stroke="currentColor" strokeWidth="1.4" />
      <path d="M2.5 16.5C2.5 13.2 4.7 10.8 7.5 10.8C10.3 10.8 12.5 13.2 12.5 16.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M12.8 11C15.1 11.4 16.8 13.5 16.8 16.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M11.3 3.9C12.5 4.1 13.5 5.2 13.5 6.4C13.5 7.6 12.5 8.6 11.3 8.9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
function IconUnlock() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="4.5" y="9" width="11" height="8" rx="1.4" stroke="currentColor" strokeWidth="1.4" />
      <path d="M7 9V6.8C7 4.9 8.3 3.6 10.2 3.9C11.7 4.1 12.7 5.1 13 6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="10" cy="12.8" r="1.1" fill="currentColor" />
    </svg>
  );
}
function IconCoin() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10 6.4V13.6M8 12C8 12.9 8.9 13.5 10 13.5C11.1 13.5 12 12.9 12 12C12 10.1 8 10.8 8 8.9C8 8 8.9 7.4 10 7.4C10.9 7.4 11.7 7.8 11.9 8.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
