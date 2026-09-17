import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { formatNumber } from "../../utils/format";
import { LOW_CREDIT_THRESHOLD, CRITICAL_CREDIT_THRESHOLD } from "../../services/creditService";

interface CreditBalanceCardProps {
  label: string;
  value: number;
  emphasis?: boolean;
  /** Linha auxiliar abaixo da métrica. */
  hint?: string;
}

function healthLabel(value: number): { tone: "success" | "warning" | "error"; text: string } {
  if (value <= CRITICAL_CREDIT_THRESHOLD) return { tone: "error", text: "Saldo crítico" };
  if (value <= LOW_CREDIT_THRESHOLD) return { tone: "warning", text: "Saldo baixo" };
  return { tone: "success", text: "Saldo saudável" };
}

export function CreditBalanceCard({ label, value, emphasis, hint }: CreditBalanceCardProps) {
  if (!emphasis) {
    return (
      <Card>
        <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--color-text-muted)]">{label}</p>
        <p className="mt-1.5 font-display text-[28px] font-extrabold leading-9 text-[var(--color-text)]">
          {formatNumber(value)}
        </p>
        {hint && <p className="mt-1 text-[12px] text-[var(--color-text-muted)]">{hint}</p>}
      </Card>
    );
  }

  const health = healthLabel(value);

  return (
    <Card className="border-[var(--color-accent-border)] bg-[var(--color-accent-soft)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--color-accent)]">{label}</p>
        <Badge tone={health.tone} dot>
          {health.text}
        </Badge>
      </div>
      <p className="mt-2 flex items-baseline gap-2">
        <span className="font-display text-[40px] font-extrabold leading-none tabular text-[var(--color-accent)]">
          {formatNumber(value)}
        </span>
        <span className="text-sm font-semibold text-[var(--color-accent)]">créditos ativos</span>
      </p>
      <p className="mt-2 text-[13px] text-[var(--color-text-secondary)]">
        Equivalência imediata: <strong className="tabular">{formatNumber(value)}</strong> desbloqueios de currículos.
      </p>
      {hint && <p className="mt-1 text-[12px] text-[var(--color-text-muted)]">{hint}</p>}
    </Card>
  );
}
