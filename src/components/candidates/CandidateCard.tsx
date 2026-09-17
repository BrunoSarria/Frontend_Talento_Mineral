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
  /** Score de compatibilidade (0-100), quando exibido no contexto de uma vaga. */
  score?: number;
  onUnlock?: (candidateId: string) => void;
  onAssociate?: (candidateId: string) => void;
}

export function CandidateCard({
  candidate,
  isFavorite,
  onToggleFavorite,
  selectable,
  selected,
  onToggleSelect,
  score,
  onUnlock,
  onAssociate,
}: CandidateCardProps) {
  const immediate = candidate.availability === "Imediata";

  return (
    <article className="flex flex-col gap-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-soft)] transition-colors hover:border-[var(--color-border-strong)] lg:flex-row">
      {selectable && (
        <label className="flex shrink-0 items-start pt-1">
          <span className="sr-only">Selecionar {candidate.professionalCategory} para comparação</span>
          <input
            type="checkbox"
            checked={Boolean(selected)}
            onChange={() => onToggleSelect?.(candidate.id)}
            className="h-4 w-4 rounded border-[var(--color-border-strong)] text-[var(--color-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)]"
          />
        </label>
      )}

      <div className="relative shrink-0">
        <Avatar name={candidate.name} photoUrl={candidate.photoUrl} locked={!candidate.isUnlocked} size="lg" />
        {candidate.isUnlocked && (
          <span
            className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[var(--color-surface)] bg-[var(--color-success)] text-[10px] font-bold text-white"
            aria-hidden="true"
          >
            ✓
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-display text-[15px] font-bold text-[var(--color-primary)]">
            {candidate.isUnlocked && candidate.name ? candidate.name : `Currículo ${candidate.id.replace("cand-", "#")}`}
          </h3>
          {immediate && (
            <Badge tone="success" dot>
              Disponibilidade imediata
            </Badge>
          )}
          {onToggleFavorite && (
            <button
              type="button"
              onClick={() => onToggleFavorite(candidate.id)}
              aria-pressed={isFavorite}
              aria-label={isFavorite ? "Remover dos currículos favoritos" : "Adicionar aos currículos favoritos"}
              className={`ml-auto text-lg leading-none transition-colors ${
                isFavorite ? "text-[var(--color-accent)]" : "text-[var(--color-text-muted)] hover:text-[var(--color-accent)]"
              }`}
            >
              {isFavorite ? "★" : "☆"}
            </button>
          )}
        </div>

        {score !== undefined && (
          <p className="mt-1.5 inline-flex rounded-[var(--radius-sm)] bg-[var(--color-surface-sunken)] px-2 py-0.5 text-[12px] font-bold tabular text-[var(--color-text-secondary)]">
            {score}% de compatibilidade
          </p>
        )}

        <p className="mt-1.5 text-sm font-semibold text-[var(--color-text)]">{candidate.professionalCategory}</p>

        <dl className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5 text-[13px] text-[var(--color-text-secondary)]">
          <div className="flex items-center gap-1.5">
            <dt className="sr-only">Cidade</dt>
            <PinIcon />
            <dd>{candidate.city}</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <dt className="sr-only">Experiência</dt>
            <ClockIcon />
            <dd>{candidate.experience ?? "Experiência não informada"}</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <dt className="sr-only">CNH</dt>
            <CardIcon />
            <dd>{candidate.cnh && candidate.cnh !== "Nenhuma" ? `CNH categoria ${candidate.cnh}` : "Sem CNH"}</dd>
          </div>
          {!immediate && candidate.availability && (
            <div className="flex items-center gap-1.5">
              <dt className="sr-only">Disponibilidade</dt>
              <CalendarIcon />
              <dd>{candidate.availability}</dd>
            </div>
          )}
        </dl>

        {candidate.skills.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {candidate.skills.map((skill) => (
              <li
                key={skill}
                className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface-sunken)] px-2 py-1 text-[12px] font-medium text-[var(--color-text-secondary)]"
              >
                {skill}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Coluna de contato e ações — espelha a hierarquia transacional do design. */}
      <div className="flex shrink-0 flex-col items-stretch gap-2 lg:w-[248px]">
        {candidate.isUnlocked ? (
          <p className="flex items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--color-success)]/25 bg-[var(--color-success-soft)] px-3 py-2 text-[12px] font-semibold text-[var(--color-success)]">
            <span aria-hidden="true">✓</span>
            <span className="min-w-0 break-words">
              {candidate.contact?.phone}
              {candidate.contact?.email ? ` · ${candidate.contact.email}` : ""}
            </span>
          </p>
        ) : (
          <p className="flex items-center gap-1.5 rounded-[var(--radius-sm)] bg-[var(--color-surface-sunken)] px-3 py-2 text-[12px] font-medium text-[var(--color-text-muted)]">
            <LockIcon /> Contato protegido (WhatsApp e e-mail)
          </p>
        )}

        {!candidate.isUnlocked && onUnlock && (
          <Button variant="primary" size="sm" onClick={() => onUnlock(candidate.id)} fullWidth>
            <LockIcon /> Desbloquear contato (1 crédito)
          </Button>
        )}

        <div className="flex gap-2">
          <Link to={`/curriculos/${candidate.id}`} className="flex-1">
            <Button variant="secondary" size="sm" fullWidth>
              Ver currículo
            </Button>
          </Link>
          {onAssociate && (
            <Button variant="ghost" size="sm" onClick={() => onAssociate(candidate.id)} className="flex-1">
              Associar à vaga
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}

function PinIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="shrink-0">
      <path d="M7 12.5C7 12.5 11.5 8.9 11.5 5.9C11.5 3.4 9.5 1.5 7 1.5C4.5 1.5 2.5 3.4 2.5 5.9C2.5 8.9 7 12.5 7 12.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <circle cx="7" cy="5.8" r="1.6" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="shrink-0">
      <circle cx="7" cy="7" r="5.2" stroke="currentColor" strokeWidth="1.2" />
      <path d="M7 4.3V7.2L8.9 8.3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function CardIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="shrink-0">
      <rect x="1.6" y="3.2" width="10.8" height="7.6" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
      <path d="M1.6 5.9H12.4" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
function CalendarIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="shrink-0">
      <rect x="2" y="3" width="10" height="9" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
      <path d="M2 5.8H12M4.8 2V4M9.2 2V4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
function LockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="shrink-0">
      <rect x="3" y="6.2" width="8" height="5.6" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
      <path d="M4.8 6.2V4.8C4.8 3.6 5.8 2.6 7 2.6C8.2 2.6 9.2 3.6 9.2 4.8V6.2" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
