interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

const BTN =
  "h-9 min-w-9 rounded-[var(--radius-sm)] border border-[var(--color-border-strong)] px-3 text-[13px] font-semibold text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface-sunken)] disabled:cursor-not-allowed disabled:text-[var(--color-text-muted)] disabled:hover:bg-transparent";

/** Gera as páginas visíveis com elipses: 1 … 4 [5] 6 … 20 */
function pageWindow(page: number, totalPages: number): (number | "…")[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
  const pages: (number | "…")[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);
  if (start > 2) pages.push("…");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < totalPages - 1) pages.push("…");
  pages.push(totalPages);
  return pages;
}

export function Pagination({ page, pageSize, total, onPageChange }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return null;

  return (
    <nav className="flex flex-wrap items-center justify-between gap-3 pt-2" aria-label="Paginação">
      <p className="text-[13px] text-[var(--color-text-secondary)]">
        Página <span className="font-semibold tabular text-[var(--color-text)]">{page}</span> de{" "}
        <span className="tabular">{totalPages}</span>
      </p>
      <div className="flex items-center gap-1.5">
        <button type="button" onClick={() => onPageChange(page - 1)} disabled={page <= 1} className={BTN}>
          Anterior
        </button>
        {pageWindow(page, totalPages).map((entry, idx) =>
          entry === "…" ? (
            <span key={`gap-${idx}`} className="px-1 text-[13px] text-[var(--color-text-muted)]" aria-hidden="true">
              …
            </span>
          ) : (
            <button
              key={entry}
              type="button"
              onClick={() => onPageChange(entry)}
              aria-current={entry === page ? "page" : undefined}
              className={
                entry === page
                  ? "h-9 min-w-9 rounded-[var(--radius-sm)] bg-[var(--color-primary)] px-3 text-[13px] font-bold tabular text-[var(--color-on-primary)]"
                  : `${BTN} tabular`
              }
            >
              {entry}
            </button>
          )
        )}
        <button type="button" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages} className={BTN}>
          Próxima
        </button>
      </div>
    </nav>
  );
}
