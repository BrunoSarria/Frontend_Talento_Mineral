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

export function JobCandidateList({ candidates, job, favoriteIds, onToggleFavorite }: JobCandidateListProps) {
  if (candidates.length === 0) {
    return <EmptyState title="Nenhum currículo nesta lista." description="Associe currículos à vaga a partir da tela de currículos." />;
  }

  return (
    <div className="grid gap-3">
      {candidates.map((candidate) => {
        const compatibility = job ? calculateCompatibility(candidate, job) : null;
        return (
          <div key={candidate.id} className="flex flex-col gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:flex-row sm:items-center">
            <Avatar name={candidate.name} photoUrl={candidate.photoUrl} locked={!candidate.isUnlocked} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-[var(--color-text)]">{candidate.isUnlocked && candidate.name ? candidate.name : candidate.professionalCategory}</p>
                {candidate.isUnlocked && (
                  <Badge tone="success" dot>
                    Desbloqueado
                  </Badge>
                )}
                {compatibility && (
                  <Badge tone={scoreTone(compatibility.score)}>{compatibility.score}% compatível</Badge>
                )}
              </div>
              <p className="text-sm text-[var(--color-text-secondary)]">
                {candidate.city} · {candidate.experience ?? "Experiência não informada"}
              </p>
              {compatibility && (
                <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-[var(--color-text-muted)]">
                  {compatibility.criteria.map((criterion) => (
                    <span key={criterion.label} className={criterion.matched ? "text-[var(--color-success)]" : "text-[var(--color-text-muted)] line-through"}>
                      {criterion.matched ? "✓" : "✕"} {criterion.label}
                    </span>
                  ))}
                </div>
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
