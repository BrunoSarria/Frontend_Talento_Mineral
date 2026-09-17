import type { InputHTMLAttributes, ReactNode } from "react";

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  /** Ação à direita do campo (ex.: botão "Pesquisar"). */
  action?: ReactNode;
}

export function SearchInput({ label = "Buscar", className = "", action, ...props }: SearchInputProps) {
  return (
    <div className="flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] p-1.5 pl-3.5 shadow-[var(--shadow-soft)] focus-within:border-[var(--color-primary)]">
      <label htmlFor="search-input" className="sr-only">
        {label}
      </label>
      <svg
        className="pointer-events-none shrink-0 text-[var(--color-text-muted)]"
        width="17"
        height="17"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.6" />
        <path d="M14 14L11 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <input
        id="search-input"
        type="search"
        className={`h-9 min-w-0 flex-1 border-0 bg-transparent text-sm font-medium text-[var(--color-text)] placeholder:font-normal placeholder:text-[var(--color-text-muted)] focus:outline-none ${className}`}
        {...props}
      />
      {action}
    </div>
  );
}
