import { Button } from "../ui/Button";
import { formatCurrency, formatNumber } from "../../utils/format";
import type { CreditPlan } from "../../types/credit";

interface CreditPlanCardProps {
  plan: CreditPlan;
  onSelect: (plan: CreditPlan) => void;
  loading?: boolean;
  /** Benefícios exibidos como checklist. */
  benefits?: string[];
  featured?: boolean;
}

export function CreditPlanCard({ plan, onSelect, loading, benefits = [], featured }: CreditPlanCardProps) {
  const unitPrice = plan.price / plan.credits;

  return (
    <div
      className={`flex flex-col gap-4 rounded-[var(--radius-lg)] border bg-[var(--color-surface)] p-5 ${
        featured
          ? "border-[var(--color-accent)] shadow-[var(--shadow-elevated)]"
          : "border-[var(--color-border)] shadow-[var(--shadow-soft)]"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--color-text-muted)]">{plan.name}</p>
        {plan.highlight && (
          <span className="rounded-full bg-[var(--color-accent-soft)] px-2 py-0.5 text-[11px] font-bold text-[var(--color-accent)]">
            {plan.highlight}
          </span>
        )}
      </div>

      <div>
        <p className="font-display text-[28px] font-extrabold leading-9 tabular text-[var(--color-text)]">
          {formatNumber(plan.credits)} créditos
        </p>
        <p className="mt-2 flex items-baseline gap-1.5">
          <span className="font-display text-[26px] font-extrabold tabular text-[var(--color-text)]">
            {formatCurrency(plan.price)}
          </span>
          <span className="text-[12px] font-semibold text-[var(--color-text-muted)]">único</span>
        </p>
        <p className="mt-1 text-[12px] text-[var(--color-text-secondary)]">
          Equivale a <strong className="tabular">{formatCurrency(unitPrice)}</strong> por crédito
        </p>
      </div>

      {benefits.length > 0 && (
        <ul className="flex flex-col gap-2 border-t border-[var(--color-border)] pt-4">
          {benefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-2 text-[13px] text-[var(--color-text-secondary)]">
              <span className="mt-0.5 text-[var(--color-success)]" aria-hidden="true">
                ✓
              </span>
              {benefit}
            </li>
          ))}
        </ul>
      )}

      <Button variant={featured ? "accent" : "secondary"} onClick={() => onSelect(plan)} loading={loading} fullWidth className="mt-auto">
        {featured ? "Comprar agora" : "Comprar pacote"}
      </Button>
    </div>
  );
}
