import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Skeleton } from "../../components/ui/Skeleton";
import { creditService } from "../../services/creditService";
import { settingsService } from "../../services/settingsService";
import { formatDate } from "../../utils/format";
import type { CreditBalance } from "../../types/credit";
import type { PlanSummary } from "../../types/company";

export function PlanSection() {
  const [plan, setPlan] = useState<PlanSummary | null>(null);
  const [balance, setBalance] = useState<CreditBalance | null>(null);

  useEffect(() => {
    settingsService.getPlanSummary().then(setPlan);
    creditService.getBalance().then(setBalance);
  }, []);

  return (
    <Card>
      <h2 className="mb-4 text-base font-semibold text-[var(--color-text)]">Plano e créditos</h2>

      {!plan || !balance ? (
        <Skeleton className="h-24" />
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-sm)] bg-[var(--color-surface-sunken)] px-4 py-3.5">
            <div>
              <p className="font-medium text-[var(--color-text)]">Plano {plan.name}</p>
              {plan.renewsAt && <p className="text-xs text-[var(--color-text-secondary)]">Renova em {formatDate(plan.renewsAt)}</p>}
              {plan.monthlyJobLimit && <p className="text-xs text-[var(--color-text-secondary)]">Até {plan.monthlyJobLimit} vagas ativas simultâneas</p>}
            </div>
            <Badge tone={plan.status === "ACTIVE" ? "success" : "warning"} dot>
              {plan.status === "ACTIVE" ? "Ativo" : "Em avaliação"}
            </Badge>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="font-display text-2xl font-semibold text-[var(--color-text)]">{balance.available}</p>
              <p className="text-xs text-[var(--color-text-secondary)]">Disponíveis</p>
            </div>
            <div>
              <p className="font-display text-2xl font-semibold text-[var(--color-text)]">{balance.acquired}</p>
              <p className="text-xs text-[var(--color-text-secondary)]">Adquiridos</p>
            </div>
            <div>
              <p className="font-display text-2xl font-semibold text-[var(--color-text)]">{balance.used}</p>
              <p className="text-xs text-[var(--color-text-secondary)]">Utilizados</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <Link to="/creditos/comprar">
              <Button size="sm">Comprar créditos</Button>
            </Link>
            <Link to="/creditos">
              <Button variant="secondary" size="sm">
                Ver planos e histórico
              </Button>
            </Link>
          </div>
        </>
      )}
    </Card>
  );
}
