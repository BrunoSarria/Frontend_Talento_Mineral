import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PageHeader } from "../../components/layout/PageHeader";
import { Breadcrumb } from "../../components/ui/Breadcrumb";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Tabs } from "../../components/ui/Tabs";
import { LoadingState } from "../../components/ui/LoadingState";
import { ErrorState } from "../../components/ui/ErrorState";
import { ConfirmModal } from "../../components/ui/ConfirmModal";
import { JobStatusBadge } from "../../components/jobs/JobStatusBadge";
import { JobCandidateList } from "../../components/jobs/JobCandidateList";
import { jobService } from "../../services/jobService";
import { favoriteService } from "../../services/favoriteService";
import { compatibilityService } from "../../services/compatibilityService";
import { useToast } from "../../hooks/useToast";
import { formatDate } from "../../utils/format";
import type { Job, JobStatus } from "../../types/job";
import type { Candidate } from "../../types/candidate";

type CandidateTab = "all" | "compatible" | "unlocked";

interface StatusAction {
  label: string;
  target: JobStatus;
  variant: "primary" | "secondary" | "danger";
  confirmTitle: string;
  confirmDescription: string;
}

const STATUS_ACTIONS: Record<JobStatus, StatusAction[]> = {
  DRAFT: [
    {
      label: "Publicar vaga",
      target: "OPEN",
      variant: "primary",
      confirmTitle: "Publicar vaga?",
      confirmDescription: "A vaga passará a ficar visível e disponível para associação de currículos.",
    },
  ],
  OPEN: [
    {
      label: "Pausar vaga",
      target: "PAUSED",
      variant: "secondary",
      confirmTitle: "Pausar vaga?",
      confirmDescription: "A vaga deixa de aparecer como disponível até ser retomada, mas os dados são mantidos.",
    },
    {
      label: "Encerrar vaga",
      target: "CLOSED",
      variant: "danger",
      confirmTitle: "Encerrar vaga?",
      confirmDescription: "A vaga deixará de aparecer como disponível para novas associações.",
    },
  ],
  PAUSED: [
    {
      label: "Retomar vaga",
      target: "OPEN",
      variant: "primary",
      confirmTitle: "Retomar vaga?",
      confirmDescription: "A vaga voltará a ficar disponível para associação de currículos.",
    },
    {
      label: "Encerrar vaga",
      target: "CLOSED",
      variant: "danger",
      confirmTitle: "Encerrar vaga?",
      confirmDescription: "A vaga deixará de aparecer como disponível para novas associações.",
    },
  ],
  CLOSED: [
    {
      label: "Reabrir vaga",
      target: "OPEN",
      variant: "primary",
      confirmTitle: "Reabrir vaga?",
      confirmDescription: "A vaga voltará a ficar disponível para associação de currículos.",
    },
  ],
};

export function JobDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();

  const [job, setJob] = useState<Job | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tab, setTab] = useState<CandidateTab>("all");
  const [pendingAction, setPendingAction] = useState<StatusAction | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);

  async function load() {
    if (!id) return;
    setLoading(true);
    setError(false);
    try {
      const [jobData, candidateData, favIds] = await Promise.all([
        jobService.getJobById(id),
        jobService.getJobCandidates(id),
        favoriteService.getFavoriteIds(),
      ]);
      setJob(jobData);
      setCandidates(candidateData);
      setFavoriteIds(new Set(favIds));
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleToggleFavorite(candidateId: string) {
    const nowFavorite = await favoriteService.toggleFavorite(candidateId);
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (nowFavorite) next.add(candidateId);
      else next.delete(candidateId);
      return next;
    });
  }

  async function handleConfirmStatusChange() {
    if (!job || !pendingAction) return;
    setStatusLoading(true);
    try {
      const updated = await jobService.updateJobStatus(job.id, pendingAction.target);
      setJob(updated);
      setPendingAction(null);
      showToast(`Vaga atualizada para "${pendingAction.target === "OPEN" ? "Aberta" : pendingAction.target === "PAUSED" ? "Pausada" : pendingAction.target === "CLOSED" ? "Encerrada" : "Rascunho"}".`, "success");
    } catch {
      showToast("Não foi possível atualizar o status da vaga.", "error");
    } finally {
      setStatusLoading(false);
    }
  }

  const compatibleCandidates = useMemo(() => {
    if (!job) return [];
    return candidates.filter((c) => compatibilityService.isCompatible(c, job));
  }, [candidates, job]);

  if (loading) return <LoadingState label="Carregando vaga..." />;
  if (error || !job) {
    return <ErrorState title="Vaga não encontrada" description="A vaga pode ter sido removida." onRetry={load} />;
  }

  const filteredCandidates = tab === "unlocked" ? candidates.filter((c) => c.isUnlocked) : tab === "compatible" ? compatibleCandidates : candidates;

  return (
    <div>
      <Link to="/vagas" className="mb-3 inline-flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)]">
        ← Voltar para vagas
      </Link>

      <PageHeader
        breadcrumb={<Breadcrumb items={[{ label: "Vagas", to: "/vagas" }, { label: job.title }]} />}
        eyebrow={`Cód. ${job.id.replace("job-", "VAG-")}`}
        eyebrowMeta={job.location}
        title={job.title}
        subtitle={job.description.split("\n")[0]}
        actions={
          <>
            <Link to={`/vagas/${job.id}/editar`}>
              <Button variant="secondary">Editar vaga</Button>
            </Link>
            {STATUS_ACTIONS[job.status].map((action) => (
              <Button key={action.target} variant={action.variant} onClick={() => setPendingAction(action)}>
                {action.label}
              </Button>
            ))}
          </>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-5">
          <Card>
            <div className="mb-3 flex items-center gap-2">
              <JobStatusBadge status={job.status} />
              <span className="text-sm text-[var(--color-text-secondary)]">Publicada em {formatDate(job.createdAt)}</span>
            </div>
            <p className="whitespace-pre-line text-sm text-[var(--color-text)]">{job.description}</p>
          </Card>

          <Card>
            <h2 className="mb-3 text-sm font-semibold text-[var(--color-text)]">Requisitos</h2>
            <ul className="flex flex-col gap-1.5 text-sm text-[var(--color-text)]">
              <li className="flex items-center gap-2">
                <span className="text-[var(--color-success)]" aria-hidden="true">✓</span> {job.professionalCategory}
              </li>
              {job.experience && (
                <li className="flex items-center gap-2">
                  <span className="text-[var(--color-success)]" aria-hidden="true">✓</span> {job.experience} de experiência
                </li>
              )}
              {job.cnh && (
                <li className="flex items-center gap-2">
                  <span className="text-[var(--color-success)]" aria-hidden="true">✓</span> CNH {job.cnh}
                </li>
              )}
              {job.requirements.map((req) => (
                <li key={req} className="flex items-center gap-2">
                  <span className="text-[var(--color-success)]" aria-hidden="true">✓</span> {req}
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card>
            <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--color-text-muted)]">
              Currículos associados
            </p>
            <p className="mt-1 font-display text-[28px] font-extrabold tabular text-[var(--color-text)]">
              {job.candidateCount}
            </p>
          </Card>
          <Card>
            <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--color-text-muted)]">
              Alta compatibilidade
            </p>
            <p className="mt-1 font-display text-[28px] font-extrabold tabular text-[var(--color-success)]">
              {compatibleCandidates.length}
            </p>
            <p className="mt-0.5 text-[12px] text-[var(--color-text-muted)]">Score igual ou acima de 60%</p>
          </Card>
          <Card>
            <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--color-text-muted)]">
              Já desbloqueados
            </p>
            <p className="mt-1 font-display text-[28px] font-extrabold tabular text-[var(--color-accent)]">
              {candidates.filter((c) => c.isUnlocked).length}
            </p>
          </Card>
        </div>
      </div>

      {/* Explicação do algoritmo — "transparência atômica": o recrutador
          sempre sabe como o score foi calculado. */}
      <div className="mt-5 flex gap-3 rounded-[var(--radius-lg)] border border-[var(--color-primary-soft-border)] bg-[var(--color-primary-soft)] p-4">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-surface)] text-[var(--color-primary)]"
          aria-hidden="true"
        >
          ◎
        </span>
        <div>
          <p className="flex flex-wrap items-center gap-2 text-[13px] font-bold text-[var(--color-text)]">
            Compatibilidade determinística (0 a 100%)
            <span className="rounded-full bg-[var(--color-surface)] px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--color-primary)]">
              Algoritmo transparente
            </span>
          </p>
          <p className="mt-1 text-[13px] text-[var(--color-text-secondary)]">
            Calculada pela aderência a: <strong>categoria profissional</strong> (30), <strong>experiência</strong> (25),{" "}
            <strong>CNH</strong> (20), <strong>cidade</strong> (15) e <strong>disponibilidade</strong> (10). Sem pontuações
            arbitrárias nem inferências opacas — é um apoio à decisão, não uma decisão automática.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-lg font-semibold text-[var(--color-text)]">Currículos</h2>
          <span className="text-sm text-[var(--color-text-secondary)]">{candidates.length} encontrados</span>
        </div>
        <div className="mb-4">
          <Tabs
            items={[
              { key: "all", label: "Todos" },
              { key: "compatible", label: "Compatíveis" },
              { key: "unlocked", label: "Desbloqueados" },
            ]}
            activeKey={tab}
            onChange={(key) => setTab(key as CandidateTab)}
          />
        </div>
        <JobCandidateList
          candidates={filteredCandidates}
          job={job}
          favoriteIds={favoriteIds}
          onToggleFavorite={handleToggleFavorite}
        />
      </div>

      <ConfirmModal
        open={Boolean(pendingAction)}
        onClose={() => setPendingAction(null)}
        onConfirm={handleConfirmStatusChange}
        title={pendingAction?.confirmTitle ?? ""}
        confirmLabel={pendingAction?.label ?? "Confirmar"}
        loading={statusLoading}
        danger={pendingAction?.variant === "danger"}
      >
        {pendingAction?.confirmDescription}
      </ConfirmModal>
    </div>
  );
}
