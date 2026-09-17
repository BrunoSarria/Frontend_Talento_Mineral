import { Link } from "react-router-dom";
import type { Candidate } from "../../types/candidate";
import type { Job } from "../../types/job";
import { Avatar } from "../ui/Avatar";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { EmptyState } from "../ui/EmptyState";
import { calculateCompatibility } from "../../services/compatibilityService";

interface JobCandidateListProps {
  candidates: Candidate[];
  job?: Job;
  favoriteIds?: Set<string>;
  onToggleFavorite?: (candidateId: string) => void;
}

function scoreTone(score: number): "success" | "warning" | "neutral" {
  if (score >= 70) return "success";
  if (score >= 40) return "warning";
  return "neutral";
}

function scoreLabel(score: number): string {
  if (score >= 70) return "Alta";
  if (score >= 40) return "Média";
  return "Baixa";
}

const BAR_COLOR: Record<"success" | "warning" | "neutral", string> = {
  success: "bg-[var(--color-success)]",
  warning: "bg-[var(--color-warning)]",
  neutral: "bg-[var(--color-border-strong)]",
};

export function JobCandidateList({ candidates, job, favoriteIds, onToggleFavorite }: JobCandidateListProps) {
  if (candidates.length === 0) {
    return <EmptyState title="Nenhum currículo nesta lista." description="Associe currículos à vaga a partir da tela de currículos." />;
  }

  return (
    <div className="grid gap-3">
      {candidates.map((candidate) => {
        const compatibility = job ? calculateCompatibility(candidate, job) : null;
        return (
          <div key={candidate.id} className="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-soft)] sm:flex-row sm:items-start">
            <Avatar name={candidate.name} photoUrl={candidate.photoUrl} locked={!candidate.isUnlocked} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-display text-[14px] font-bold text-[var(--color-primary)]">
                  {candidate.isUnlocked && candidate.name ? candidate.name : candidate.professionalCategory}
                </p>
                {candidate.isUnlocked && (
                  <Badge tone="success" dot>
                    Desbloqueado
                  </Badge>
                )}
                {compatibility && (
                  <Badge tone={scoreTone(compatibility.score)}>
                    {compatibility.score}% {scoreLabel(compatibility.score)}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-[var(--color-text-secondary)]">
                {candidate.city} · {candidate.experience ?? "Experiência não informada"}
              </p>
              {compatibility && (
                <>
                  <div
                    className="mt-2 h-1.5 w-full max-w-[220px] overflow-hidden rounded-full bg-[var(--color-surface-sunken)]"
                    role="progressbar"
                    aria-valuenow={compatibility.score}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`Compatibilidade ${compatibility.score}%`}
                  >
                    <div
                      className={`h-full rounded-full ${BAR_COLOR[scoreTone(compatibility.score)]}`}
                      style={{ width: `${compatibility.score}%` }}
                    />
                  </div>
                  <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[12px]">
                    {compatibility.criteria.map((criterion) => (
                      <li
                        key={criterion.label}
                        className={criterion.matched ? "font-medium text-[var(--color-success)]" : "text-[var(--color-text-muted)]"}
                      >
                        <span aria-hidden="true">{criterion.matched ? "✓" : "✕"}</span> {criterion.label}
                        <span className="sr-only">{criterion.matched ? " atendido" : " não atendido"}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              {onToggleFavorite && (
                <button
                  type="button"
                  onClick={() => onToggleFavorite(candidate.id)}
                  aria-pressed={favoriteIds?.has(candidate.id)}
                  aria-label={favoriteIds?.has(candidate.id) ? "Remover dos currículos favoritos" : "Adicionar aos currículos favoritos"}
                  className={`text-lg leading-none ${favoriteIds?.has(candidate.id) ? "text-[var(--color-accent)]" : "text-[var(--color-text-muted)] hover:text-[var(--color-accent)]"}`}
                >
                  {favoriteIds?.has(candidate.id) ? "★" : "☆"}
                </button>
              )}
              <Link to={`/curriculos/${candidate.id}`}>
                <Button variant="secondary" size="sm">
                  Ver currículo
                </Button>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
