import { Badge } from "../ui/Badge";
import { EmptyState } from "../ui/EmptyState";
import type { ActivityItem, ActivityType } from "../../types/activity";

const ICON: Record<ActivityType, string> = {
  UNLOCK: "🔓",
  PURCHASE: "💳",
  ASSOCIATION: "👤",
  JOB_CREATED: "💼",
  MATCH: "🔎",
};

function formatTime(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
}

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  if (items.length === 0) {
    return <EmptyState title="Ainda não existem movimentações." />;
  }

  return (
    <ul className="flex flex-col divide-y divide-[var(--color-border)]">
      {items.map((item) => (
        <li key={item.id} className="flex items-start gap-3 py-3">
          <span className="mt-0.5 text-base" aria-hidden="true">
            {ICON[item.type]}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-[var(--color-text)]">{item.title}</p>
            {item.description && <p className="text-xs text-[var(--color-text-secondary)]">{item.description}</p>}
            <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">{formatTime(item.createdAt)}</p>
          </div>
          {typeof item.amount === "number" && (
            <Badge tone={item.amount > 0 ? "success" : "neutral"}>
              {item.amount > 0 ? "+" : ""}
              {item.amount} crédito{Math.abs(item.amount) !== 1 ? "s" : ""}
            </Badge>
          )}
        </li>
      ))}
    </ul>
  );
}
