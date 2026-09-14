interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, pageSize, total, onPageChange }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return null;

  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <nav className="flex items-center justify-between gap-4 pt-2" aria-label="Paginação">
      <p className="text-sm text-[var(--color-text-secondary)]">
        Página {page} de {totalPages}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={!canPrev}
          className="h-9 rounded-[var(--radius-sm)] border border-[var(--color-border-strong)] px-3 text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-surface-sunken)] disabled:cursor-not-allowed disabled:text-[var(--color-text-muted)] disabled:hover:bg-transparent"
        >
          Anterior
        </button>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={!canNext}
          className="h-9 rounded-[var(--radius-sm)] border border-[var(--color-border-strong)] px-3 text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-surface-sunken)] disabled:cursor-not-allowed disabled:text-[var(--color-text-muted)] disabled:hover:bg-transparent"
        >
          Próxima
        </button>
      </div>
    </nav>
  );
}
