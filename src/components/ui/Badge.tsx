import type { ReactNode } from "react";

type Tone = "neutral" | "success" | "warning" | "error" | "primary";

interface BadgeProps {
  tone?: Tone;
  children: ReactNode;
  dot?: boolean;
}

const TONE_CLASSES: Record<Tone, string> = {
  neutral: "bg-[var(--color-surface-sunken)] text-[var(--color-text-secondary)]",
  success: "bg-[var(--color-success-soft)] text-[var(--color-success)]",
  warning: "bg-[var(--color-warning-soft)] text-[var(--color-warning)]",
  error: "bg-[var(--color-error-soft)] text-[var(--color-error)]",
  primary: "bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
};

const DOT_CLASSES: Record<Tone, string> = {
  neutral: "bg-[var(--color-text-muted)]",
  success: "bg-[var(--color-success)]",
  warning: "bg-[var(--color-warning)]",
  error: "bg-[var(--color-error)]",
  primary: "bg-[var(--color-primary)]",
};

export function Badge({ tone = "neutral", children, dot }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${TONE_CLASSES[tone]}`}>
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${DOT_CLASSES[tone]}`} aria-hidden="true" />}
      {children}
    </span>
  );
}
