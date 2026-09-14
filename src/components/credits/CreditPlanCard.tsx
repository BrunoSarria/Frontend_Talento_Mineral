import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { formatCurrency } from "../../utils/format";
import type { CreditPlan } from "../../types/credit";

interface CreditPlanCardProps {
  plan: CreditPlan;
  onSelect: (plan: CreditPlan) => void;
  loading?: boolean;
}

export function CreditPlanCard({ plan, onSelect, loading }: CreditPlanCardProps) {
  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-[var(--color-text)]">{plan.name}</h3>
        {plan.highlight && <Badge tone="primary">{plan.highlight}</Badge>}
      </div>
      <div>
        <p className="font-display text-3xl font-semibold text-[var(--color-text)]">{plan.credits}</p>
        <p className="text-sm text-[var(--color-text-secondary)]">créditos</p>
      </div>
      <p className="text-lg font-medium text-[var(--color-text)]">{formatCurrency(plan.price)}</p>
      <Button onClick={() => onSelect(plan)} loading={loading} fullWidth>
        Comprar
      </Button>
    </Card>
  );
}
