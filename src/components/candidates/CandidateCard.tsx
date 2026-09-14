import { Link } from "react-router-dom";
import type { Candidate } from "../../types/candidate";
import { Avatar } from "../ui/Avatar";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

interface CandidateCardProps {
  candidate: Candidate;
  isFavorite?: boolean;
  onToggleFavorite?: (candidateId: string) => void;
  selectable?: boolean;
  selected?: boolean;
  onToggleSelect?: (candidateId: string) => void;
}

export function CandidateCard({ candidate, isFavorite, onToggleFavorite, selectable, selected, onToggleSelect }: CandidateCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:flex-row sm:items-start">
      {selectable && (
        <label className="flex shrink-0 items-center pt-1 sm:pt-0">
          <span className="sr-only">Selecionar {candidate.professionalCategory} para comparação</span>
          <input
            type="checkbox"
            checked={Boolean(selected)}
            onChange={() => onToggleSelect?.(candidate.id)}
            className="h-4 w-4 rounded border-[var(--color-border-strong)] text-[var(--color-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)]"
          />
        </label>
      )}
      <Avatar name={candidate.name} photoUrl={candidate.photoUrl} locked={!candidate.isUnlocked} size="lg" />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-medium text-[var(--color-text)]">{candidate.professionalCategory}</h3>
          {candidate.isUnlocked && (
            <Badge tone="success" dot>
              Desbloqueado
            </Badge>
          )}
          {onToggleFavorite && (
            <button
              type="button"
              onClick={() => onToggleFavorite(candidate.id)}
              aria-pressed={isFavorite}
              aria-label={isFavorite ? "Remover dos currículos favoritos" : "Adicionar aos currículos favoritos"}
              className={`ml-auto text-lg leading-none transition-colors sm:ml-0 ${
                isFavorite ? "text-[var(--color-accent)]" : "text-[var(--color-text-muted)] hover:text-[var(--color-accent)]"
              }`}
            >
              {isFavorite ? "★" : "☆"}
            </button>
          )}
        </div>
        <p className="mt-0.5 text-sm text-[var(--color-text-secondary)]">{candidate.city}</p>

        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-[var(--color-text-muted)]">Experiência</dt>
            <dd className="text-[var(--color-text)]">{candidate.experience ?? "Não informado"}</dd>
          </div>
          <div>
            <dt className="text-[var(--color-text-muted)]">CNH</dt>
            <dd className="text-[var(--color-text)]">{candidate.cnh && candidate.cnh !== "Nenhuma" ? candidate.cnh : "Não possui"}</dd>
          </div>
          <div>
            <dt className="text-[var(--color-text-muted)]">Disponibilidade</dt>
            <dd className="text-[var(--color-text)]">{candidate.availability ?? "Não informado"}</dd>
          </div>
        </dl>

        {candidate.skills.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {candidate.skills.map((skill) => (
              <Badge key={skill} tone="neutral">
                {skill}
              </Badge>
            ))}
          </div>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-3">
          {!candidate.isUnlocked && (
            <span className="inline-flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
              <span aria-hidden="true">🔒</span> Contato protegido
            </span>
          )}
          <span className="text-xs text-[var(--color-text-muted)]">ID {candidate.id.replace("cand-", "#")}</span>
        </div>
      </div>

      <div className="shrink-0 sm:self-center">
        <Link to={`/curriculos/${candidate.id}`}>
          <Button variant="secondary" size="sm" fullWidth>
            Ver currículo
          </Button>
        </Link>
      </div>
    </div>
  );
}
