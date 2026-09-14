import { Badge } from "../ui/Badge";
import { EmptyState } from "../ui/EmptyState";
import { formatDateShort } from "../../utils/format";
import type { CreditTransaction } from "../../types/credit";

export function TransactionList({ transactions }: { transactions: CreditTransaction[] }) {
  if (transactions.length === 0) {
    return <EmptyState title="Nenhuma movimentação encontrada." />;
  }

  return (
    <ul className="flex flex-col divide-y divide-[var(--color-border)]">
      {transactions.map((tx) => (
        <li key={tx.id} className="flex items-center justify-between gap-4 py-3">
          <div>
            <p className="text-sm text-[var(--color-text)]">{tx.description}</p>
            <p className="text-xs text-[var(--color-text-muted)]">{formatDateShort(tx.createdAt)}</p>
          </div>
          <Badge tone={tx.amount > 0 ? "success" : "neutral"}>
            {tx.amount > 0 ? "+" : ""}
            {tx.amount} crédito{Math.abs(tx.amount) !== 1 ? "s" : ""}
          </Badge>
        </li>
      ))}
    </ul>
  );
}
