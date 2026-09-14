import { Link } from "react-router-dom";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import type { OnboardingStatus } from "../../services/onboardingService";

interface OnboardingCardProps {
  status: OnboardingStatus;
  onDismiss: () => void;
}

export function OnboardingCard({ status, onDismiss }: OnboardingCardProps) {
  const complete = status.percentComplete === 100;

  return (
    <Card className="relative border-[var(--color-primary-soft-border)] bg-[var(--color-primary-soft)]">
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Fechar"
        className="absolute right-4 top-4 text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M3.5 3.5L12.5 12.5M12.5 3.5L3.5 12.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </button>

      <p className="pr-8 font-display text-lg font-semibold text-[var(--color-text)]">
        {complete ? "Agora você está pronto para encontrar currículos." : "Bem-vindo ao Talento Mineral 👋"}
      </p>
      {!complete && <p className="mt-1 text-sm text-[var(--color-text-secondary)]">Vamos preparar sua conta.</p>}

      <ul className="mt-4 flex flex-col gap-2">
        {status.steps.map((step) => (
          <li key={step.key} className="flex items-center gap-2 text-sm">
            <span className={step.done ? "text-[var(--color-success)]" : "text-[var(--color-text-muted)]"} aria-hidden="true">
              {step.done ? "✓" : "○"}
            </span>
            <span className={step.done ? "text-[var(--color-text)]" : "text-[var(--color-text-secondary)]"}>{step.label}</span>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--color-surface)]">
          <div className="h-full rounded-full bg-[var(--color-primary)]" style={{ width: `${status.percentComplete}%` }} />
        </div>
        <span className="text-xs font-medium text-[var(--color-text-secondary)]">{status.percentComplete}% concluído</span>
      </div>

      <div className="mt-4">
        <Link to="/curriculos">
          <Button size="sm">{complete ? "Buscar currículos" : "Continuar"}</Button>
        </Link>
      </div>
    </Card>
  );
}
