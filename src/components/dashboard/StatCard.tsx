import type { ReactNode } from "react";
import { Skeleton } from "../ui/Skeleton";

interface StatCardProps {
  label: string;
  value?: string;
  icon: ReactNode;
  loading?: boolean;
}

export function StatCard({ label, value, icon, loading }: StatCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]" aria-hidden="true">
        {icon}
      </span>
      <div>
        <p className="text-sm text-[var(--color-text-secondary)]">{label}</p>
        {loading ? <Skeleton className="mt-1.5 h-7 w-16" /> : <p className="font-display text-[26px] font-semibold leading-tight text-[var(--color-text)]">{value}</p>}
      </div>
    </div>
  );
}
