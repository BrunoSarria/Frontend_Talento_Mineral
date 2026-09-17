import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

export function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface)] px-6 py-14 text-center">
      {icon ?? (
        <span
          className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
          aria-hidden="true"
        >
          <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
            <path
              d="M3 15.5V5.8C3 5.35817 3.35817 5 3.8 5H8.4L10 7H16.2C16.6418 7 17 7.35817 17 7.8V15.5C17 15.9418 16.6418 16.3 16.2 16.3H3.8C3.35817 16.3 3 15.9418 3 15.5Z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
        </span>
      )}
      <div>
        <p className="font-display text-[15px] font-bold text-[var(--color-text)]">{title}</p>
        {description && <p className="mt-1 max-w-sm text-sm text-[var(--color-text-secondary)]">{description}</p>}
      </div>
      {action}
    </div>
  );
}
