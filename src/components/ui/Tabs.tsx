interface TabItem {
  key: string;
  label: string;
}

interface TabsProps {
  items: TabItem[];
  activeKey: string;
  onChange: (key: string) => void;
}

export function Tabs({ items, activeKey, onChange }: TabsProps) {
  return (
    <div role="tablist" className="flex gap-1 border-b border-[var(--color-border)]">
      {items.map((item) => {
        const active = item.key === activeKey;
        return (
          <button
            key={item.key}
            role="tab"
            type="button"
            aria-selected={active}
            onClick={() => onChange(item.key)}
            className={`relative px-4 py-2.5 text-sm font-medium transition-colors ${
              active ? "text-[var(--color-primary)]" : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
            }`}
          >
            {item.label}
            {active && <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-[var(--color-primary)]" aria-hidden="true" />}
          </button>
        );
      })}
    </div>
  );
}
