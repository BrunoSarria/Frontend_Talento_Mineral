import type { ReactNode } from "react";

type Tone = "neutral" | "success" | "warning" | "error" | "primary" | "info" | "accent";

interface BadgeProps {
  tone?: Tone;
  children: ReactNode;
  dot?: boolean;
}

const TONE_CLASSES: Record<Tone, string> = {
  neutral: "bg-[var(--color-surface-sunken)] text-[var(--color-text-secondary)] border-[var(--color-border)]",
  success: "bg-[var(--color-success-soft)] text-[var(--color-success)] border-[var(--color-success)]/20",
  warning: "bg-[var(--color-warning-soft)] text-[var(--color-warning)] border-[var(--color-warning)]/20",
  error: "bg-[var(--color-error-soft)] text-[var(--color-error)] border-[var(--color-error)]/20",
  primary: "bg-[var(--color-primary-soft)] text-[var(--color-primary)] border-[var(--color-primary-soft-border)]",
  info: "bg-[var(--color-info-soft)] text-[var(--color-info)] border-[var(--color-info)]/20",
  accent: "bg-[var(--color-accent-soft)] text-[var(--color-accent)] border-[var(--color-accent-border)]",
};

const DOT_CLASSES: Record<Tone, string> = {
  neutral: "bg-[var(--color-text-muted)]",
  success: "bg-[var(--color-success)]",
  warning: "bg-[var(--color-warning)]",
  error: "bg-[var(--color-error)]",
  primary: "bg-[var(--color-primary)]",
  info: "bg-[var(--color-info)]",
  accent: "bg-[var(--color-accent)]",
};

export function Badge({ tone = "neutral", children, dot }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[12px] font-semibold leading-4 ${TONE_CLASSES[tone]}`}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${DOT_CLASSES[tone]}`} aria-hidden="true" />}
      {children}
    </span>
  );
}
