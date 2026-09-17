interface TabItem {
  key: string;
  label: string;
  /** Contagem opcional exibida como pílula ao lado do rótulo. */
  count?: number | string;
}

interface TabsProps {
  items: TabItem[];
  activeKey: string;
  onChange: (key: string) => void;
  /** "underline" (padrão) ou "segmented" — pílulas sobre superfície rebaixada. */
  variant?: "underline" | "segmented";
}

export function Tabs({ items, activeKey, onChange, variant = "underline" }: TabsProps) {
  if (variant === "segmented") {
    return (
      <div role="tablist" className="inline-flex flex-wrap gap-1 rounded-[var(--radius-md)] bg-[var(--color-surface-sunken)] p-1">
        {items.map((item) => {
          const active = item.key === activeKey;
          return (
            <button
              key={item.key}
              role="tab"
              type="button"
              aria-selected={active}
              onClick={() => onChange(item.key)}
              className={`flex items-center gap-2 rounded-[var(--radius-sm)] px-3.5 py-2 text-[13px] font-semibold transition-colors ${
                active
                  ? "bg-[var(--color-surface)] text-[var(--color-text)] shadow-[var(--shadow-soft)]"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
              }`}
            >
              {item.label}
              {item.count !== undefined && (
                <span
                  className={`rounded-full px-1.5 text-[11px] font-bold tabular ${
                    active ? "bg-[var(--color-primary-soft)] text-[var(--color-primary)]" : "text-[var(--color-text-muted)]"
                  }`}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div role="tablist" className="flex flex-wrap gap-1 border-b border-[var(--color-border)]">
      {items.map((item) => {
        const active = item.key === activeKey;
        return (
          <button
            key={item.key}
            role="tab"
            type="button"
            aria-selected={active}
            onClick={() => onChange(item.key)}
            className={`relative flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold transition-colors ${
              active ? "text-[var(--color-primary)]" : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
            }`}
          >
            {item.label}
            {item.count !== undefined && (
              <span
                className={`rounded-full px-1.5 text-[11px] font-bold tabular ${
                  active ? "bg-[var(--color-primary-soft)] text-[var(--color-primary)]" : "bg-[var(--color-surface-sunken)] text-[var(--color-text-muted)]"
                }`}
              >
                {item.count}
              </span>
            )}
            {active && <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-[var(--color-primary)]" aria-hidden="true" />}
          </button>
        );
      })}
    </div>
  );
}
