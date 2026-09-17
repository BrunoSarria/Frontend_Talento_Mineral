import type { ReactNode } from "react";
import { Skeleton } from "../ui/Skeleton";

interface StatCardProps {
  label: string;
  value?: string;
  icon: ReactNode;
  loading?: boolean;
  /** Texto auxiliar abaixo da métrica (ex.: "Score acima de 80%"). */
  hint?: string;
  tone?: "primary" | "success" | "accent" | "info";
}

const TONE_CLASSES: Record<NonNullable<StatCardProps["tone"]>, string> = {
  primary: "bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
  success: "bg-[var(--color-success-soft)] text-[var(--color-success)]",
  accent: "bg-[var(--color-accent-soft)] text-[var(--color-accent)]",
  info: "bg-[var(--color-info-soft)] text-[var(--color-info)]",
};

export function StatCard({ label, value, icon, loading, hint, tone = "primary" }: StatCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-soft)]">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--color-text-muted)]">{label}</p>
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-sm)] ${TONE_CLASSES[tone]}`}
          aria-hidden="true"
        >
          {icon}
        </span>
      </div>
      {loading ? (
        <Skeleton className="h-8 w-20" />
      ) : (
        <p className="font-display text-[28px] font-extrabold leading-9 text-[var(--color-text)]">{value}</p>
      )}
      {hint && <p className="text-[12px] text-[var(--color-text-muted)]">{hint}</p>}
    </div>
  );
}
